interface SendEmailOptions {
  to: string;
  toName?: string;
  subject: string;
  htmlContent: string;
}

export async function sendEmailViaBrevo({ to, toName, subject, htmlContent }: SendEmailOptions): Promise<boolean> {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.SENDER_EMAIL || 'ICMHS@intellsys.tech';
    const senderName = process.env.SENDER_NAME || 'ICMHS Alumni Portal';
    const replyToEmail = process.env.REPLY_TO_EMAIL || 'ICMHS@intellsys.tech';
    const replyToName = process.env.REPLY_TO_NAME || 'icmhs';

    if (!apiKey) {
      console.error('Brevo API key not configured');
      return false;
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'API-key': apiKey,
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail,
        },
        to: [
          {
            email: to,
            name: toName || to,
          },
        ],
        htmlContent,
        subject,
        replyTo: {
          email: replyToEmail,
          name: replyToName,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Brevo API error:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending email via Brevo:', error);
    return false;
  }
}

export async function sendOTPEmail(email: string, otp: string, name?: string): Promise<boolean> {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .header {
          background-color: #4F46E5;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: white;
          padding: 30px;
          border-radius: 0 0 5px 5px;
        }
        .otp-box {
          background-color: #F3F4F6;
          border: 2px dashed #4F46E5;
          padding: 20px;
          text-align: center;
          margin: 20px 0;
          border-radius: 5px;
        }
        .otp-code {
          font-size: 32px;
          font-weight: bold;
          color: #4F46E5;
          letter-spacing: 5px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>ICMHS Alumni Portal</h1>
        </div>
        <div class="content">
          <h2>OTP Verification</h2>
          <p>Hello${name ? ` ${name}` : ''},</p>
          <p>Your One-Time Password (OTP) for login is:</p>
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>
          <p>This OTP is valid for 10 minutes. Please do not share this code with anyone.</p>
          <p>If you didn't request this OTP, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>This is an automated email from ICMHS Alumni Portal. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmailViaBrevo({
    to: email,
    toName: name,
    subject: 'OTP Verification - ICMHS Alumni Portal',
    htmlContent,
  });
}

