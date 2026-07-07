import express from "express";
import cors from "cors";
import { rentals } from "./data/rentals.js";

const app = express();
const PORT = 4000;
const inquiries = [];

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Rental Scout API is running",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.get("/api/rentals", (req, res) => {
  res.json(rentals);
});

app.get("/api/rentals/:id", (req, res) => {
  const rentalId = req.params.id;
  const rental = rentals.find((item) => item.id === rentalId);

  if (!rental) {
    return res.status(404).json({
      message: "Rental not found",
    });
  }

  res.json(rental);
});

app.post("/api/inquiries", (req, res) => {
  const { rentalId, name, email, phone, moveInTimeline, preferredVisitTime, message } = req.body;
  const errors = {};
  const rental = rentals.find((item) => item.id === rentalId);

  if (!rental) {
    errors.rentalId = "Choose a valid rental.";
  }

  if (!name || name.trim().length < 2) {
    errors.name = "Enter at least 2 characters.";
  }

  if (!email || !email.includes("@") || !email.includes(".")) {
    errors.email = "Enter a valid email address.";
  }

  if (!phone || phone.trim().length < 10) {
    errors.phone = "Enter a valid contact number.";
  } else if (!phone.trim().startsWith("+91")) {
    errors.phone = "Phone number must start with +91.";
  }

  if (!moveInTimeline) {
    errors.moveInTimeline = "Choose your move-in timeline.";
  }

  if (!preferredVisitTime) {
    errors.preferredVisitTime = "Choose your preferred visit time.";
  }

  if (!message || message.trim().length < 10) {
    errors.message = "Write at least 10 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Please fix the form errors.",
      errors,
    });
  }

  const newInquiry = {
    id: inquiries.length + 1,
    rentalId,
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    moveInTimeline,
    preferredVisitTime,
    message: message.trim(),
  };

  inquiries.push(newInquiry);

  res.status(201).json({
    message: "Inquiry submitted successfully.",
    inquiry: newInquiry,
  });
});

app.listen(PORT, () => {
  console.log(`Rental Scout API is running on http://localhost:${PORT}`);
});
