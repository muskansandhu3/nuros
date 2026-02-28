import smtplib
from email.message import EmailMessage
import ssl
import streamlit as st

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
        
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(smtp_server, smtp_port, context=context) as smtp:
            smtp.login(smtp_user, smtp_pass)
            smtp.send_message(msg)
            
        return True, "Access Key email sent successfully"
    except Exception as e:
        return False, str(e)

