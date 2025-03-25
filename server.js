require('dotenv').config();  // Load environment variables from .env
const fetch = require('node-fetch');

async function verifyRecaptcha(token) {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY; // Securely stored secret key

    try {
        const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `secret=${secretKey}&response=${token}`
        });

        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error("reCAPTCHA verification failed:", error);
        return false;
    }
}

module.exports = verifyRecaptcha;
