const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

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

function listingValues(body) {
  return [
    body.title,
    body.location,
    body.price,
    body.description || "",
    body.status || "available",
  ];
}

app.get("/api/listings", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM listings ORDER BY id");
    res.json(result.rows);
  } catch (error) {
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
      listingValues(req.body)
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
      [...listingValues(req.body), id]
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
      [id]
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
