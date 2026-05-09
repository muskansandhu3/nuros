import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { formData, results } = await request.json();

    const { SMTP_SERVER, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    // Construct the HTML Email
    const tableRowsHtml = results.map((row: any) => {
      // Mapping the exact colors from the frontend to hex for the email
      let badgeBg = '#0b1021';
      let badgeText = '#ffffff';
      let dotColor = '#ffffff';
      
      if (row.color.includes('teal')) {
        badgeText = '#14b8a6';
        dotColor = '#14b8a6';
      } else if (row.color.includes('amber')) {
        badgeText = '#f59e0b';
        dotColor = '#f59e0b';
      } else if (row.color.includes('cyan')) {
        badgeText = '#06b6d4';
        dotColor = '#06b6d4';
      } else if (row.color.includes('#4c8f18')) {
        badgeText = '#4c8f18';
        dotColor = '#4c8f18';
      }

      return `
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 16px; font-weight: 600; color: #ffffff; font-size: 14px; width: 30%;">${row.category}</td>
          <td style="padding: 16px; width: 30%;">
            <span style="display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: bold; background-color: #0b1021; border: 1px solid #1e293b; color: ${badgeText};">
              <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: ${dotColor}; margin-right: 6px;"></span>
              ${row.status}
            </span>
          </td>
          <td style="padding: 16px; color: #94a3b8; font-size: 12px; width: 40%;">${row.interpretation}</td>
        </tr>
      `;
    }).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: 'Inter', 'Helvetica Neue', sans-serif; background-color: #020617; color: #f8fafc; margin: 0; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #0b1021; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
          
          <!-- Header -->
          <div style="background: linear-gradient(to right, #020617, #081329); padding: 30px; text-align: center; border-bottom: 1px solid #1e293b;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 1px;">NUROS</h1>
            <p style="color: #14b8a6; margin: 5px 0 0 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">Voice of Health AI</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <div style="margin-bottom: 30px;">
              <h2 style="color: #ffffff; margin: 0 0 5px 0; font-size: 22px;">Your Voice Wellness Snapshot</h2>
              <p style="color: #94a3b8; margin: 0; font-size: 14px;">Generated: ${new Date().toLocaleDateString()}</p>
            </div>

            <div style="background-color: #0f172a; padding: 15px; border-radius: 8px; margin-bottom: 30px; display: flex; justify-content: space-between; border: 1px solid #1e293b;">
              <p style="margin: 0; color: #f8fafc; font-weight: 600;">${formData.name}</p>
              <p style="margin: 0; color: #94a3b8; font-size: 14px;">${formData.age} yrs ${formData.gender ? `• ${formData.gender}` : ''}</p>
            </div>

            <!-- Table -->
            <div style="background-color: #0f172a; border-radius: 12px; border: 1px solid #1e293b; overflow: hidden; margin-bottom: 30px;">
              <table style="width: 100%; border-collapse: collapse; text-align: left;">
                <thead>
                  <tr style="background-color: #0b1021; border-bottom: 1px solid #1e293b;">
                    <th style="padding: 12px 16px; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Signal Category</th>
                    <th style="padding: 12px 16px; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Status</th>
                    <th style="padding: 12px 16px; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Interpretation</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableRowsHtml}
                </tbody>
              </table>
            </div>

            <!-- Insight Card -->
            <div style="background: linear-gradient(to right, #0f172a, #0b1021); border-left: 4px solid #f59e0b; padding: 20px; border-radius: 0 12px 12px 0; margin-bottom: 20px;">
              <h4 style="color: #ffffff; margin: 0 0 10px 0; font-size: 16px;">What this means for you</h4>
              <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">
                Your voice snapshot shows moderate stress/tension signals. If you are feeling fatigued, anxious, or unwell, consider discussing with a healthcare professional.
              </p>
              <span style="display: inline-block; padding: 4px 8px; background-color: #0b1021; color: #f59e0b; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-radius: 4px; border: 1px solid rgba(245, 158, 11, 0.2);">
                This is not a diagnosis.
              </span>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #020617; padding: 20px; text-align: center; border-top: 1px solid #1e293b;">
            <p style="color: #64748b; font-size: 12px; margin: 0;">Nuros provides voice-based wellness signals. It does not diagnose or treat medical conditions.</p>
          </div>
          
        </div>
      </body>
      </html>
    `;

    // Mock successful response if SMTP credentials are missing
    if (!SMTP_USER || !SMTP_PASS) {
      console.log("No SMTP credentials found in environment. Mocking successful email send.");
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

    await transporter.sendMail({
      from: `"Nuros AI" <${SMTP_USER}>`,
      to: formData.email,
      subject: "Nuros: Your Voice Wellness Snapshot",
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error sending snapshot email:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
