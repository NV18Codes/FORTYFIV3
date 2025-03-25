require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Handle form submission
app.post("/submit-form", async (req, res) => {
    const { firstName, lastName, email, contact, role, company, message } = req.body;

    if (!firstName || !lastName || !email || !contact || !role || !company || !message) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    // Setup Nodemailer transporter
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL, // Your Gmail
            pass: process.env.PASSWORD, // App Password (Not your actual Gmail password)
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.RECIPIENT_EMAIL || "yourbusiness@example.com", // Set in .env
        subject: "New Contact Form Submission",
        text: `
            Name: ${firstName} ${lastName}
            Email: ${email}
            Contact: ${contact}
            Role: ${role}
            Company: ${company}
            Message: ${message}
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Form submitted successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Error sending email.", error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
