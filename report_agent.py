from fpdf import FPDF
import datetime
import os
from cryptography.fernet import Fernet
from PyPDF2 import PdfReader, PdfWriter

class PDF(FPDF):
    def header(self):
        # We will assume a logo file exists or just use a text placeholder if not found
        if os.path.exists("logo.png"):
            self.image("logo.png", 10, 8, 33)
        else:
            self.set_font('Arial', 'B', 15)
            self.cell(80)
            self.set_text_color(10, 25, 47) # Midnight Blue
            self.cell(30, 10, 'NUROS: Voice of Health AI', 0, 0, 'C')
        self.ln(20)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.set_text_color(128)
        self.cell(0, 10, 'Page ' + str(self.page_no()) + ' | This is a screening result, NOT a medical diagnosis.', 0, 0, 'C')

def generate_report(patient_id, date, stability_score, risk_data, explanations, output_filename="nuros_report.pdf"):
    pdf = PDF()
    pdf.add_page()
    
    # Title
    pdf.set_font('Arial', 'B', 16)
    pdf.set_text_color(10, 25, 47)
    pdf.cell(0, 10, 'Clinical Vocal Biomarker Summary', 0, 1, 'C')
    pdf.ln(5)
    
    # Patient Info & Disclaimer
    pdf.set_font('Arial', '', 11)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 8, f'Patient ID: {patient_id}', 0, 1)
    pdf.cell(0, 8, f'Date: {date}', 0, 1)
    
    pdf.set_font('Arial', 'B', 11)
    pdf.set_text_color(200, 50, 50)
    pdf.cell(0, 10, 'DISCLAIMER: This is an early risk screening tool, NOT a medical diagnosis.', 0, 1)
    pdf.ln(5)

    # Score
    pdf.set_font('Arial', 'B', 24)
    pdf.set_text_color(50, 205, 50) # Bio-lime
    pdf.cell(0, 15, f'Vocal Stability Score: {stability_score}/100', 0, 1, 'C')
    pdf.ln(10)
    
    # Two Column Layout
    y_start = pdf.get_y()
    
    # Left Column: Diseases
    pdf.set_font('Arial', 'B', 12)
    pdf.set_text_color(10, 25, 47)
    pdf.cell(90, 8, 'Top 5 Disease Modalities:', 0, 0)
    
    # Right Column: Explanations
    pdf.cell(90, 8, 'Why this score?', 0, 1)
    pdf.set_draw_color(200, 200, 200)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(2)

    pdf.set_font('Arial', '', 10)
    pdf.set_text_color(0, 0, 0)

    for disease, details in risk_data.items():
        # Left
        risk_level = details['risk']
        conf = details['confidence']
        
        # Save x, y
        y_loc = pdf.get_y()
        
        if risk_level == "High":
            pdf.set_text_color(220, 20, 60)
        elif risk_level == "Medium":
            pdf.set_text_color(255, 140, 0)
        else:
            pdf.set_text_color(50, 205, 50)
            
        pdf.cell(90, 8, f"{disease}: {risk_level} Risk (Conf: {conf:.1f}%)", 0, 0)
        
        # Right (Multi-cell for text wrapping)
        pdf.set_text_color(50, 50, 50)
        explanation = explanations.get(disease, "Analysis complete.")
        
        # We need to save the position, print multicell on right, then set y below the multicell
        x_right = 100
        pdf.set_xy(x_right, y_loc)
        pdf.multi_cell(90, 6, explanation, 0, 'L')
        
        # Move down
        pdf.ln(2)

    pdf.output(output_filename)
    return output_filename

def encrypt_pdf(input_pdf, password):
    """
    Encrypt the PDF with a password for HIPAA compliance mock.
    """
    reader = PdfReader(input_pdf)
    writer = PdfWriter()

    for page in reader.pages:
        writer.add_page(page)

    writer.encrypt(password)
    encrypted_filename = input_pdf.replace(".pdf", "_encrypted.pdf")
    
    with open(encrypted_filename, "wb") as f:
        writer.write(f)
        
    return encrypted_filename

def simulate_aes256_storage(data_string):
    """
    Simulates encrypting the raw patient data before memory discard.
    """
    key = Fernet.generate_key()
    f = Fernet(key)
    encrypted_data = f.encrypt(data_string.encode())
    return encrypted_data, key
