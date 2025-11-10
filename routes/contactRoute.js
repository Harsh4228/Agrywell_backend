// In routes/contactRoute.js
const express = require("express");
const router = express.Router();
const { Resend } = require("resend");

// Load API key from .env
const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/send", async (req, res) => {
  // Get data from the frontend
  const { name, email, phone, subject, message } = req.body;

  // Simple validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  try {
    const { data, error } = await resend.emails.send({
      // IMPORTANT: This 'from' email MUST be a verified domain or email in Resend
      from: "Contact Form <onboarding@resend.dev>", // Example: "Agriwell <contact@yourdomain.com>"

      // This is the email address you want to RECEIVE the messages at
      to: ["Agriwellresearchandbiotech2024@gmail.com"], // Your email

      subject: subject || "New Contact Form Inquiry",

      // This is the email content
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Subject:</strong> ${subject || "Not provided"}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,

      // This sets the "Reply-To" button in your email client to the user's email
      reply_to: email, 
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({ error: "Failed to send email." });
    }

    // Success
    res.status(200).json({ success: true, data });

  } catch (e) {
    console.error("Server error:", e);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

module.exports = router;