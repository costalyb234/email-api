const nodemailer = require('nodemailer');

module.exports = async function (req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Only POST allowed' });
    return;
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: 'New Contact Message',
      text: message,
    });

    res.status(200).json({ success: true, message: 'Email sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
};
