import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
       return NextResponse.json({ success: false, error: "Missing email" }, { status: 400 });
    }

    const { SMTP_SERVER, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    // Generate a random 6-character access key
    const accessKey = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Email 1: Send the PDF Attachment
    const htmlEmail1 = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #0b1021;">Your Secure Wellness Snapshot</h2>
        <p>Hello,</p>
        <p>Your Voice Wellness Snapshot is securely attached to this email.</p>
        <p>For your privacy, please use the unique 6-character Access Key sent in a separate email to verify your identity. (Note: in this environment, you can open the PDF directly, but please keep the access key for your records as part of the secure workflow).</p>
        <br/>
        <p>Best regards,<br/>Nuros Health AI</p>
      </div>
    `;

    // Email 2: Send the Access Key
    const htmlEmail2 = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #0b1021;">Your Access Key</h2>
        <p>Hello,</p>
        <p>Use the secure key below to verify and access your Clinical Report.</p>
        <div style="margin: 20px 0; padding: 15px; border: 2px solid #14b8a6; display: inline-block; font-size: 24px; font-weight: bold; letter-spacing: 4px;">
           ${accessKey}
        </div>
        <p>Do not share this key with unauthorized individuals.</p>
        <br/>
        <p>Best regards,<br/>Nuros Health AI</p>
      </div>
    `;

    // Mock successful response if SMTP credentials are missing
    if (!SMTP_USER || !SMTP_PASS) {
      console.log("No SMTP credentials found in environment. Mocking successful email sends.");
      console.log(`[MOCK EMAIL 1 to ${email}] Sending Nuros_Snapshot.pdf`);
      console.log(`[MOCK EMAIL 2 to ${email}] Sending Access Key: ${accessKey}`);
      return NextResponse.json({ success: true, mocked: true });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_SERVER || 'smtp.gmail.com',
      port: Number(SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    // Send Email 1 with PDF
    let attachments: any[] = [];
    try {
      const pdfPath = path.join(process.cwd(), 'public', 'Nuros_Clinical_Signal_Snapshot_Fixed.pdf');
      if (fs.existsSync(pdfPath)) {
         attachments.push({
            filename: 'Nuros_Clinical_Signal_Snapshot.pdf',
            content: fs.readFileSync(pdfPath)
         });
      } else {
         console.warn("Could not find the PDF in public folder.");
      }
    } catch (e) {
      console.error("Error reading PDF:", e);
    }

    await transporter.sendMail({
      from: `"Nuros AI" <${SMTP_USER}>`,
      to: email,
      subject: "Nuros: Your Secure Wellness Snapshot (1/2)",
      html: htmlEmail1,
      attachments
    });

    // Send Email 2 with Password
    await transporter.sendMail({
      from: `"Nuros AI" <${SMTP_USER}>`,
      to: email,
      subject: "Nuros: Your Access Key (2/2)",
      html: htmlEmail2,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error sending secure report:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
