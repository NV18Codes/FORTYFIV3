const nodemailer = require("nodemailer");

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { name, email, subject, message } = req.body;

    // Create a transporter using SMTP (Gmail, Outlook, etc.)
    let transporter = nodemailer.createTransport({
        service: "gmail", // Change this based on your email provider
        auth: {
            user: "your-email@gmail.com", // Replace with your email
            pass: "your-email-password", // Replace with your email password (or use App Passwords)
        },
    });

    try {
        await transporter.sendMail({
            from: `"${name}" <${email}>`,
            to: "contact@fortyfiv3.com",
            subject: subject,
            text: `You have a new message from ${name} (${email}):\n\n${message}`,
        });

        return res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Email sending error:", error);
        return res.status(500).json({ message: "Email sending failed" });
    }
}
