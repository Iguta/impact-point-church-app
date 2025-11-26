const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");
const nodemailer = require("nodemailer");

// Define secrets
const emailUser = defineSecret("email_user");
const emailPass = defineSecret("email_pass");

exports.sendContactEmail = onDocumentCreated(
  {
    document: "contactMessages/{docId}",
    region: "us-central1",
    secrets: ["email_user", "email_pass"],   // <-- REQUIRED
  },
  async (event) => {
    const data = event.data.data();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser.value(),
        pass: emailPass.value(),
      },
    });

    await transporter.sendMail({
      from: emailUser.value(),
      to: emailUser.value(),
      replyTo: data.email,
      subject: `New Contact Form Message from ${data.name}`,
      text: `
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}
Message:
${data.message}
      `,
    });

    console.log("Email sent successfully");
    return null;
  }
);
