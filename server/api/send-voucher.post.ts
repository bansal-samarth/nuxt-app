import { ServerClient } from "postmark";

export default defineEventHandler(async (event) => {
  // 1. Read the data sent from the frontend
  const body = await readBody(event);
  const { recipientEmail, pdfBase64, confirmationNumber } = body;

  // 2. Get your Postmark token securely from environment variables
  const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;

  if (!postmarkToken) {
    throw createError({
      statusCode: 500,
      statusMessage: "Postmark server token is not configured.",
    });
  }
  
  // 3. IMPORTANT: Your "From" email must be a registered Sender Signature in Postmark
  const fromEmail = "no-reply@letsgomakka.com"; // <-- Replace this with your verified Postmark email

  // 4. Initialize the Postmark client
  const client = new ServerClient(postmarkToken);

  try {
    // 5. Send the email
    const response = await client.sendEmail({
      From: fromEmail,
      To: recipientEmail,
      Subject: `Your Booking Confirmation: ${confirmationNumber}`,
      HtmlBody: `
        <p>Dear Guest,</p>
        <p>Thank you for your booking! Your confirmation voucher is attached to this email.</p>
        <p>Please present this voucher upon check-in.</p>
        <p>We wish you a blessed and peaceful journey.</p>
        <p><strong>Let's Go Makkah.</strong></p>
      `,
      Attachments: [
        {
          Content: pdfBase64,
          Name: `BookingVoucher-${confirmationNumber}.pdf`,
          ContentType: "application/pdf",
          // --- THIS IS THE FIX ---
          // Add the required 'ContentID' property with a value of null
          ContentID: "outbound", 
        },
      ],
    });

    // 6. Return a success response
    return {
      success: true,
      message: "Email sent successfully!",
      postmarkResponse: response,
    };

  } catch (error) {
    console.error("Postmark Error:", error);
    // Improve error response to the client
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to send email via Postmark: ${errorMessage}`,
    });
  }
});