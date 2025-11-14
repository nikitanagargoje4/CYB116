import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// Configure your SMTP credentials using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.yourprovider.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, country, company, service, message, sourcePage, selectedPlan } = req.body;

  // Email to company (receives submissions)
  const mailToInfo = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
    subject: 'New Contact Form Submission',
    html: `
      <h2>New Contact Form Submission</h2>
      <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr>
          <td style="background-color: #f0f0f0; font-weight: bold;">Full Name</td>
          <td>${name}</td>
        </tr>
        <tr>
          <td style="background-color: #f0f0f0; font-weight: bold;">Email Address</td>
          <td>${email}</td>
        </tr>
        <tr>
          <td style="background-color: #f0f0f0; font-weight: bold;">Phone Number</td>
          <td>${phone}</td>
        </tr>
        <tr>
          <td style="background-color: #f0f0f0; font-weight: bold;">Country</td>
          <td>${country || 'Not provided'}</td>
        </tr>
        ${selectedPlan ? `
        <tr>
          <td style="background-color: #e3f2fd; font-weight: bold;">Selected Plan</td>
          <td style="background-color: #e3f2fd; font-weight: bold; color: #0066cc;">${selectedPlan}</td>
        </tr>` : ''}
        <tr>
          <td style="background-color: #f0f0f0; font-weight: bold;">Company</td>
          <td>${company || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="background-color: #f0f0f0; font-weight: bold;">Service</td>
          <td>${service || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="background-color: #f0f0f0; font-weight: bold;">Project Details / Message</td>
          <td>${message || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="background-color: #f0f0f0; font-weight: bold;">Source Page</td>
          <td>${sourcePage || 'Not provided'}</td>
        </tr>
      </table>
    `,
    text: `
New Contact Form Submission

Full Name: ${name}
Email Address: ${email}
Phone Number: ${phone}
Country: ${country || 'Not provided'}
${selectedPlan ? `Selected Plan: ${selectedPlan}\n` : ''}Company: ${company || 'Not provided'}
Service: ${service || 'Not provided'}
Project Details / Message: ${message || 'Not provided'}
Source Page: ${sourcePage || 'Not provided'}
    `
  };

  // Thank you email to user
  const mailToUser = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'Thank you for contacting Cybaem Tech!',
    text: `Dear ${name},\n\nThank you for reaching out to Cybaem Tech. We have received your message and will get back to you soon!\n\nBest regards,\nCybaem Tech Team`
  };

  try {
    await transporter.sendMail(mailToInfo);
    await transporter.sendMail(mailToUser);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, 'localhost', () => {
  console.log(`Server running on localhost:${PORT}`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});
