import smtplib
from email.message import EmailMessage
import ssl
import streamlit as st
import os
import mimetypes
import uuid

def send_encrypted_report(patient_email, pdf_data, pdf_filename):
    """
    Sends the encrypted PDF via email without revealing the password.
    """
    try:
        # Attempt to pull credentials from Streamlit Secrets
        # To use this in production, set Secrets in the Streamlit Cloud Dashboard
        smtp_server = st.secrets.get("SMTP_SERVER", "smtp.gmail.com") if "SMTP_SERVER" in st.secrets else "smtp.gmail.com"
        smtp_port = st.secrets.get("SMTP_PORT", 465) if "SMTP_PORT" in st.secrets else 465
        smtp_user = st.secrets.get("SMTP_USER", "") if "SMTP_USER" in st.secrets else ""
        smtp_pass = st.secrets.get("SMTP_PASS", "") if "SMTP_PASS" in st.secrets else ""

        if not (smtp_user and smtp_pass):
            return False, "⚠️ Email server not configured. Please add `SMTP_USER` and `SMTP_PASS` to `st.secrets`."

        msg = EmailMessage()
        msg['Subject'] = 'Nuros: Your Confidential Acoustic Report'
        msg['From'] = smtp_user
        msg['To'] = patient_email
        
        msg.set_content(
            "Your Nuros Women's Vocal Health Report is attached. "
            "This file is encrypted for your protection. "
            "Use the unique Access Key shown on your Nuros dashboard to unlock it."
        )
        
        logo_path = None
        for name in ['Nuros.png', 'nuros.png', 'logo.png', 'Nuros.jpg', 'nuros.jpg', 'logo.jpg', 'Nuros.jpeg']:
            if os.path.exists(name):
                logo_path = name
                break
                
        logo_cid = f"{uuid.uuid4()}@nuros"
        logo_html = f'<img src="cid:{logo_cid}" alt="NUROS" style="max-height: 80px; margin-bottom: 10px;">' if logo_path else '<h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px;">NUROS</h1>'
        
        html_report_content = f"""
        <html>
            <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; padding: 20px; color: #0A2B4E; margin: 0;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    <div style="background-color: #0A2B4E; padding: 30px; text-align: center; border-bottom: 4px solid #D4AF37;">
                        {logo_html}
                        <p style="color: #54B948; margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Voice of Health AI</p>
                    </div>
                    <div style="padding: 40px 30px;">
                        <h2 style="color: #0A2B4E; margin-top: 0;">Your Secure Report is Ready</h2>
                        <p style="font-size: 16px; line-height: 1.6; color: #4a5568;">
                            Your Nuros Women's Vocal Health Report is securely attached to this email. For your privacy, this document is heavily encrypted.
                        </p>
                        <div style="background-color: #f8fafc; border-left: 4px solid #54B948; padding: 15px 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                            <p style="margin: 0; color: #0A2B4E; font-weight: bold;">Unlock Instructions:</p>
                            <p style="margin: 5px 0 0 0; font-size: 14px; color: #718096; line-height: 1.5;">Please use the 6-character Access Key from your subsequent Nuros security email to unlock the PDF.</p>
                        </div>
                    </div>
                    <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #a0aec0;">
                        <p style="margin: 0;">This is an automated encrypted delivery from the Nuros Clinical Engine.</p>
                        <p style="margin: 5px 0 0 0; letter-spacing: 1px;">CONFIDENTIAL & SECURE</p>
                    </div>
                </div>
            </body>
        </html>
        """
        msg.add_alternative(html_report_content, subtype='html')
        
        if logo_path:
            with open(logo_path, 'rb') as img:
                img_data = img.read()
            maintype, subtype = mimetypes.guess_type(logo_path)[0].split('/')
            msg.get_payload()[1].add_related(img_data, maintype=maintype, subtype=subtype, cid=f"<{logo_cid}>")
        
        msg.add_attachment(pdf_data, maintype='application', subtype='pdf', filename=pdf_filename)
        
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(smtp_server, smtp_port, context=context) as smtp:
            smtp.login(smtp_user, smtp_pass)
            smtp.send_message(msg)
            
        return True, "Email sent successfully"
    except Exception as e:
        return False, str(e)


def send_access_key_email(patient_email, access_key):
    """
    Sends the access key via email.
    """
    try:
        smtp_server = st.secrets.get("SMTP_SERVER", "smtp.gmail.com") if "SMTP_SERVER" in st.secrets else "smtp.gmail.com"
        smtp_port = st.secrets.get("SMTP_PORT", 465) if "SMTP_PORT" in st.secrets else 465
        smtp_user = st.secrets.get("SMTP_USER", "") if "SMTP_USER" in st.secrets else ""
        smtp_pass = st.secrets.get("SMTP_PASS", "") if "SMTP_PASS" in st.secrets else ""

        if not (smtp_user and smtp_pass):
            return False, "⚠️ Email server not configured."

        msg = EmailMessage()
        msg['Subject'] = 'Nuros: Your Access Key'
        msg['From'] = smtp_user
        msg['To'] = patient_email
        
        msg.set_content(
            "Here is your unique Access Key to unlock your encrypted Nuros Report.\n\n"
            f"Access Key: {access_key}\n\n"
            "Keep this key secure. Do not share it with unauthorized individuals."
        )
        
        logo_path = None
        for name in ['Nuros.png', 'nuros.png', 'logo.png', 'Nuros.jpg', 'nuros.jpg', 'logo.jpg', 'Nuros.jpeg']:
            if os.path.exists(name):
                logo_path = name
                break
                
        logo_cid = f"{uuid.uuid4()}@nuros"
        logo_html = f'<img src="cid:{logo_cid}" alt="NUROS" style="max-height: 80px; margin-bottom: 10px;">' if logo_path else '<h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px;">NUROS</h1>'
        
        html_key_content = f"""
        <html>
            <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; padding: 20px; color: #0A2B4E; margin: 0;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    <div style="background-color: #0A2B4E; padding: 30px; text-align: center; border-bottom: 4px solid #54B948;">
                        {logo_html}
                        <p style="color: #D4AF37; margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Security & Privacy</p>
                    </div>
                    <div style="padding: 40px 30px; text-align: center;">
                        <h2 style="color: #0A2B4E; margin-top: 0;">Your Two-Factor Access Key</h2>
                        <p style="font-size: 16px; line-height: 1.6; color: #4a5568;">
                            Use the secure key below to decrypt and open your attached Clinical Report.
                        </p>
                        <div style="background-color: #0A2B4E; display: inline-block; padding: 15px 30px; margin: 25px 0; border-radius: 8px; border: 2px solid #54B948; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
                            <span style="font-family: monospace; font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #ffffff;">{access_key}</span>
                        </div>
                        <p style="font-size: 14px; color: #e53e3e; margin: 0; margin-top: 10px;">
                            <strong>Do not share this key with unauthorized individuals.</strong>
                        </p>
                    </div>
                    <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #a0aec0;">
                        <p style="margin: 0;">This key is valid for single-use extraction of your encrypted file.</p>
                    </div>
                </div>
            </body>
        </html>
        """
        msg.add_alternative(html_key_content, subtype='html')
        
        if logo_path:
            with open(logo_path, 'rb') as img:
                img_data = img.read()
            maintype, subtype = mimetypes.guess_type(logo_path)[0].split('/')
            msg.get_payload()[1].add_related(img_data, maintype=maintype, subtype=subtype, cid=f"<{logo_cid}>")
            
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(smtp_server, smtp_port, context=context) as smtp:
            smtp.login(smtp_user, smtp_pass)
            smtp.send_message(msg)
            
        return True, "Access Key email sent successfully"
    except Exception as e:
        return False, str(e)


def send_contact_form_emails(name, phone, sender_email, message_txt):
    """
    Sends the contact form data to the admin and an auto-reply to the user.
    """
    try:
        smtp_server = st.secrets.get("SMTP_SERVER", "smtp.gmail.com") if "SMTP_SERVER" in st.secrets else "smtp.gmail.com"
        smtp_port = st.secrets.get("SMTP_PORT", 465) if "SMTP_PORT" in st.secrets else 465
        smtp_user = st.secrets.get("SMTP_USER", "") if "SMTP_USER" in st.secrets else ""
        smtp_pass = st.secrets.get("SMTP_PASS", "") if "SMTP_PASS" in st.secrets else ""

        if not (smtp_user and smtp_pass):
            return False, "⚠️ Email server not configured."

        admin_email = "intellidoraaiinnovation@gmail.com"

        logo_path = None
        for name_file in ['Nuros.png', 'nuros.png', 'logo.png', 'Nuros.jpg', 'nuros.jpg', 'logo.jpg', 'Nuros.jpeg']:
            if os.path.exists(name_file):
                logo_path = name_file
                break
                
        logo_cid = f"{uuid.uuid4()}@nuros"
        logo_html = f'<img src="cid:{logo_cid}" alt="NUROS" style="max-height: 80px; margin-bottom: 10px;">' if logo_path else '<h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px;">NUROS</h1>'
        
        # 1. Email to Admin
        msg_admin = EmailMessage()
        msg_admin['Subject'] = f'Nuros Contact Form: {name}'
        msg_admin['From'] = smtp_user
        msg_admin['To'] = admin_email
        msg_admin.set_content(f"New contact submission:\nName: {name}\nPhone: {phone}\nEmail: {sender_email}\nMessage: {message_txt}")
        
        # 2. Auto-reply to User
        msg_user = EmailMessage()
        msg_user['Subject'] = 'Thank you for contacting Nuros Health AI'
        msg_user['From'] = smtp_user
        msg_user['To'] = sender_email
        msg_user.set_content(f"Thank you for contacting Nuros Health AI.\nWe will get back to you in 48 hours.")
        
        html_user_content = f"""
        <html>
            <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; padding: 20px; color: #0A2B4E; margin: 0;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    <div style="background-color: #0A2B4E; padding: 30px; text-align: center; border-bottom: 4px solid #54B948;">
                        {logo_html}
                        <p style="color: #D4AF37; margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Inquiry Received</p>
                    </div>
                    <div style="padding: 40px 30px; text-align: center;">
                        <h2 style="color: #0A2B4E; margin-top: 0;">Thank you for contacting Nuros Health AI</h2>
                        <p style="font-size: 16px; line-height: 1.6; color: #4a5568;">
                            Hello {name}, <br><br>
                            We have successfully received your message and our clinical innovation team is reviewing your inquiry. We will get back to you within 48 hours.
                        </p>
                    </div>
                    <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #a0aec0;">
                        <p style="margin: 0;">You can simply reply to this email if you have any additional information to add.</p>
                    </div>
                </div>
            </body>
        </html>
        """
        msg_user.add_alternative(html_user_content, subtype='html')
        
        if logo_path:
            with open(logo_path, 'rb') as img:
                img_data = img.read()
            maintype, subtype = mimetypes.guess_type(logo_path)[0].split('/')
            msg_user.get_payload()[1].add_related(img_data, maintype=maintype, subtype=subtype, cid=f"<{logo_cid}>")

        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(smtp_server, smtp_port, context=context) as smtp:
            smtp.login(smtp_user, smtp_pass)
            smtp.send_message(msg_admin)
            smtp.send_message(msg_user)
            
        return True, "Contact messages sent successfully"
    except Exception as e:
        return False, str(e)

