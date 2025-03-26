require('dotenv').config();  // Load environment variables from .env
const fetch = require('node-fetch');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Function to verify reCAPTCHA
async function verifyRecaptcha(token) {
    const secretKey = '6Lc2z_8qAAAAAP7hKc0QNZkbdWCoEQezvPs9Lwxh'; // Updated with the actual secret key
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`, {
        method: 'POST',
    });
    const data = await response.json();
    return data.success;
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/submit-form', async (req, res) => {
    const recaptchaToken = req.body['g-recaptcha-response'];    

    try {
        const isVerified = await verifyRecaptcha(recaptchaToken);        
        if (!isVerified) {
            return res.status(400).json({ message: 'reCAPTCHA verification failed.' });
        }

        // Process the form data here
        // e.g., send email, save to database, etc.

        res.status(200).json({ message: 'Form submitted successfully!' });
    } catch (error) {
        console.error("Error processing form:", error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
