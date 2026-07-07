const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const crypto = require("crypto");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "listing_manager",
  password: "123456",
  port: 5432,
});

const sessions = new Map();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");

  return `${salt}:${hash}`;
}

function checkPassword(password, savedPasswordHash) {
  const [salt, savedHash] = savedPasswordHash.split(":");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");

  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(savedHash));
}

function createSession(user) {
  const token = crypto.randomBytes(32).toString("hex");

  sessions.set(token, {
    id: user.id,
    name: user.name,
    email: user.email,
  });

  return token;
}

function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return "";
  }

  return authHeader.slice(7);
}

function requireAuth(req, res, next) {
  const token = getTokenFromRequest(req);
  const user = sessions.get(token);

  if (!user) {
    return res.status(401).json({ error: "Please login first" });
  }

  req.user = user;
  next();
}

function validateListing(body) {
  const { title, location, price } = body;

  if (!title || !title.trim()) {
    return "Title is required";
  }

  if (!location || !location.trim()) {
    return "Location is required";
  }

  if (!price || Number(price) <= 0) {
    return "Price must be greater than 0";
  }

  return "";
}

function validateAuthBody(body) {
  const { name, email, password } = body;

  if (name !== undefined && !name.trim()) {
    return "Name is required";
  }

  if (!email || !email.trim()) {
    return "Email is required";
  }

  if (!password || password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return "";
}

function listingValues(body) {
  return [
    body.title,
    body.location,
    body.price,
    body.description || "",
    body.status || "available",
  ];
}

function validateInquiry(body) {
  const { listingId, message } = body;

  if (!listingId) {
    return "Listing id is required";
  }

  if (!message || !message.trim()) {
    return "Message is required";
  }

  return "";
}

async function findInquiryById(id) {
  const result = await pool.query("SELECT * FROM inquiries WHERE id = $1", [
    id,
  ]);

  return result.rows[0];
}

app.post("/api/signup", async (req, res) => {
  const validationError = validateAuthBody(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { name, email, password } = req.body;

  try {
    const passwordHash = hashPassword(password);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [name.trim(), email.trim().toLowerCase(), passwordHash],
    );

    const user = result.rows[0];
    const token = createSession(user);

    res.status(201).json({
      message: "Signup successful",
      token,
      user,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "Email already exists" });
    }

    res.status(500).json({ error: "Failed to create account" });
  }
});

app.post("/api/login", async (req, res) => {
  const validationError = validateAuthBody({ ...req.body, name: "login" });

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT id, name, email, password_hash FROM users WHERE email = $1",
      [email.trim().toLowerCase()],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];
    const passwordIsCorrect = checkPassword(password, user.password_hash);

    if (!passwordIsCorrect) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = createSession(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
  }
});

app.get("/api/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

app.get("/api/saved-listings", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT listings.*
       FROM saved_listings
       JOIN listings ON listings.id = saved_listings.listing_id
       WHERE saved_listings.user_id = $1
       ORDER BY saved_listings.created_at DESC`,
      [req.user.id],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Saved listings fetch error:", error.message);
    if (error.code === "42P01") {
      return res.status(500).json({ error: "Run schema.sql to create saved_listings table" });
    }

    res.status(500).json({ error: "Failed to fetch saved listings" });
  }
});

app.post("/api/saved-listings", requireAuth, async (req, res) => {
  const { listingId } = req.body;

  if (!listingId) {
    return res.status(400).json({ error: "Listing id is required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO saved_listings (user_id, listing_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, listing_id) DO NOTHING
       RETURNING *`,
      [req.user.id, listingId],
    );

    if (result.rows.length === 0) {
      return res.status(409).json({ error: "Listing already saved" });
    }

    res.status(201).json({
      message: "Listing saved",
      savedListing: result.rows[0],
    });
  } catch (error) {
    console.error("Save listing error:", error.message);
    if (error.code === "42P01") {
      return res.status(500).json({ error: "Run schema.sql to create saved_listings table" });
    }

    if (error.code === "23503") {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.status(500).json({ error: "Failed to save listing" });
  }
});

app.delete("/api/saved-listings/:listingId", requireAuth, async (req, res) => {
  const { listingId } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM saved_listings
       WHERE user_id = $1 AND listing_id = $2
       RETURNING *`,
      [req.user.id, listingId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Saved listing not found" });
    }

    res.json({ message: "Saved listing removed" });
  } catch (error) {
    console.error("Remove saved listing error:", error.message);
    if (error.code === "42P01") {
      return res.status(500).json({ error: "Run schema.sql to create saved_listings table" });
    }

    res.status(500).json({ error: "Failed to remove saved listing" });
  }
});

app.get("/api/inquiries", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT inquiries.*, listings.title AS listing_title
       FROM inquiries
       JOIN listings ON listings.id = inquiries.listing_id
       WHERE inquiries.user_id = $1
       ORDER BY inquiries.created_at DESC`,
      [req.user.id],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Inquiries fetch error:", error.message);
    if (error.code === "42P01") {
      return res.status(500).json({ error: "Run schema.sql to create inquiries table" });
    }

    res.status(500).json({ error: "Failed to fetch inquiries" });
  }
});

app.post("/api/inquiries", requireAuth, async (req, res) => {
  const validationError = validateInquiry(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { listingId, message } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO inquiries (user_id, listing_id, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.user.id, listingId, message.trim()],
    );

    res.status(201).json({
      message: "Inquiry created",
      inquiry: result.rows[0],
    });
  } catch (error) {
    console.error("Inquiry create error:", error.message);
    if (error.code === "42P01") {
      return res.status(500).json({ error: "Run schema.sql to create inquiries table" });
    }

    if (error.code === "23503") {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.status(500).json({ error: "Failed to create inquiry" });
  }
});

app.put("/api/inquiries/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { message, status } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const inquiry = await findInquiryById(id);

    if (!inquiry) {
      return res.status(404).json({ error: "Inquiry not found" });
    }

    if (inquiry.user_id !== req.user.id) {
      return res.status(403).json({ error: "You cannot edit another user's inquiry" });
    }

    const result = await pool.query(
      `UPDATE inquiries
       SET message = $1, status = $2
       WHERE id = $3
       RETURNING *`,
      [message.trim(), status || inquiry.status, id],
    );

    res.json({
      message: "Inquiry updated",
      inquiry: result.rows[0],
    });
  } catch (error) {
    console.error("Inquiry update error:", error.message);
    if (error.code === "42P01") {
      return res.status(500).json({ error: "Run schema.sql to create inquiries table" });
    }

    res.status(500).json({ error: "Failed to update inquiry" });
  }
});

app.delete("/api/inquiries/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const inquiry = await findInquiryById(id);

    if (!inquiry) {
      return res.status(404).json({ error: "Inquiry not found" });
    }

    if (inquiry.user_id !== req.user.id) {
      return res.status(403).json({ error: "You cannot delete another user's inquiry" });
    }

    await pool.query("DELETE FROM inquiries WHERE id = $1", [id]);

    res.json({ message: "Inquiry deleted" });
  } catch (error) {
    console.error("Inquiry delete error:", error.message);
    if (error.code === "42P01") {
      return res.status(500).json({ error: "Run schema.sql to create inquiries table" });
    }

    res.status(500).json({ error: "Failed to delete inquiry" });
  }
});

app.get("/api/listings", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM listings ORDER BY id");
    res.json(result.rows);
  } catch (error) {
    console.error("Listings fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

app.post("/api/listings", async (req, res) => {
  const validationError = validateListing(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const result = await pool.query(
      `INSERT INTO listings (title, location, price, description, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      listingValues(req.body),
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to create listing" });
  }
});

app.put("/api/listings/:id", async (req, res) => {
  const { id } = req.params;
  const validationError = validateListing(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const result = await pool.query(
      `UPDATE listings
       SET title = $1, location = $2, price = $3, description = $4, status = $5
       WHERE id = $6
       RETURNING *`,
      [...listingValues(req.body), id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update listing" });
  }
});

app.delete("/api/listings/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM listings WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.json({ message: "Listing deleted", listing: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete listing" });
  }
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
