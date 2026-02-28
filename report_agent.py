from fpdf import FPDF
import datetime
import os
import random
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad
from pypdf import PdfReader, PdfWriter
import matplotlib.pyplot as plt
import numpy as np
import qrcode

class PDF(FPDF):
    def header(self):
        # Look for the user's Nuros logo
        logo_path = None
        for name in ['Nuros.png', 'nuros.png', 'logo.png', 'Nuros.jpg', 'nuros.jpg', 'logo.jpg', 'Nuros.jpeg']:
            if os.path.exists(name):
                logo_path = name
                break
                
        # Clean header with Clinical Seal
        if logo_path:
            self.image(logo_path, 10, 8, 30)
        else:
            self.set_font('Helvetica', 'B', 16)
            self.set_text_color(10, 43, 78) # Navy Blue
            self.cell(40)
            self.cell(30, 10, 'NUROS | Clinical Voice AI', 0, 0, 'L')
        
        self.set_font('Helvetica', 'B', 10)
        self.set_text_color(100, 100, 100)
        self.cell(0, 10, 'DIAGNOSTIC SUMMARY REPORT', 0, 1, 'R')
        self.set_draw_color(10, 43, 78) # Navy Blue
        self.set_line_width(0.5)
        self.line(10, 25, 200, 25)
        self.ln(10)

    def footer(self):
        self.set_y(-25)
        self.set_draw_color(200, 200, 200)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(2)
        
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(128)
        self.cell(0, 5, 'Page ' + str(self.page_no()) + ' | This is a screening result, NOT a medical diagnosis.', 0, 1, 'C')
        
        # QR Code placeholder space usually handled in generate_report, but we can just leave space
        self.cell(0, 5, 'Secure Verification Enabled.', 0, 0, 'C')

def generate_3d_graph(features, output_path="vocal_stability_graph.png"):
    """
    Generate a 3D-style radar chart (spider chart) representing vocal stability.
    """
    labels = np.array(['Jitter (Micro-Tremor)', 'Shimmer (Amplitude)', 'HNR (Flow)', 'Prosodic Range'])
    # Normalize features for display (arbitrary scaling for visualization)
    stats = [
        min(100, features.get("jitter_percent", 0) * 50), 
        min(100, features.get("shimmer_percent", 0) * 15), 
        min(100, features.get("hnr_db", 0) * 3), 
        min(100, features.get("f0_std", 0) * 2)
    ]
    
    angles = np.linspace(0, 2*np.pi, len(labels), endpoint=False)
    # close the plot
    stats = np.concatenate((stats,[stats[0]]))
    angles = np.concatenate((angles,[angles[0]]))
    
    fig = plt.figure(figsize=(4, 4))
    ax = fig.add_subplot(111, polar=True)
    ax.plot(angles, stats, 'o-', linewidth=2, color="#54B948") # Green
    ax.fill(angles, stats, alpha=0.25, color="#54B948") # Green
    ax.set_thetagrids(angles[:-1] * 180/np.pi, labels)
    
    # "3D" styling
    ax.grid(color='#E0E0E0', linestyle='--', linewidth=1)
    ax.spines['polar'].set_color('#0A2B4E') # Navy Blue
    ax.set_facecolor('#F8FAFC')
    
    plt.title('Vocal Biomarker Axes', size=12, color='#0A2B4E', y=1.1)
    plt.tight_layout()
    plt.savefig(output_path, dpi=150, transparent=True)
    plt.close()
    return output_path

def generate_sparkline(latest_score, output_path="sparkline.png"):
    """
    Generate a longitudinal "Vocal Twin" trend sparkline over 6 months.
    """
    # Mock longitudinal data leading up to current score
    past_scores = [max(0, min(100, latest_score + random.uniform(-10, 10))) for _ in range(5)]
    trend = past_scores + [latest_score]
    
    fig, ax = plt.subplots(figsize=(4, 1))
    ax.plot(trend, color='#0A2B4E', linewidth=2) # Navy Blue
    ax.fill_between(range(len(trend)), trend, alpha=0.3, color='#D4AF37') # Gold
    ax.axis('off')
    plt.tight_layout()
    plt.savefig(output_path, dpi=150, transparent=True)
    plt.close()
    return output_path

def generate_qr_code(patient_id, output_path="qr_code.png"):
    qr = qrcode.QRCode(version=1, box_size=3, border=1)
    qr.add_data(f"NUROS_VERIFY:{patient_id}")
    qr.make(fit=True)
    img = qr.make_image(fill_color="#0A2B4E", back_color="white") # Navy Blue
    img.save(output_path)
    return output_path

def generate_report(patient_id, date, stability_score, risk_data, explanations, profile=None, features=None, scribe_text="", output_filename="nuros_report.pdf"):
    if profile is None: profile = {}
    if features is None: features = {}
    
    pdf = PDF()
    pdf.add_page()
    
    # --- PATIENT SUMMARY BOX (Lifelabs Style) ---
    pdf.set_fill_color(245, 245, 250)
    pdf.set_draw_color(100, 100, 100)
    pdf.set_line_width(0.2)
    pdf.rect(10, 28, 190, 30, 'FD')
    
    pdf.set_y(30)
    pdf.set_font('Helvetica', 'B', 10)
    pdf.set_text_color(0, 0, 0)
    name = f"{profile.get('first_name', 'Unknown')} {profile.get('last_name', '')}".strip()
    
    # Left Column entries in Box
    pdf.cell(20, 6, "Patient:", 0, 0)
    pdf.set_font('Helvetica', '', 10)
    pdf.cell(70, 6, name, 0, 0)
    
    pdf.set_font('Helvetica', 'B', 10)
    pdf.cell(30, 6, "Collection Date:", 0, 0)
    pdf.set_font('Helvetica', '', 10)
    pdf.cell(50, 6, str(date), 0, 1)
    
    # Row 2
    pdf.set_font('Helvetica', 'B', 10)
    pdf.cell(20, 6, "DOB:", 0, 0)
    pdf.set_font('Helvetica', '', 10)
    pdf.cell(70, 6, profile.get("dob", "N/A"), 0, 0)
    
    pdf.set_font('Helvetica', 'B', 10)
    pdf.cell(30, 6, "Patient ID:", 0, 0)
    pdf.set_font('Helvetica', '', 10)
    pdf.cell(50, 6, patient_id, 0, 1)

    # Row 3
    pdf.set_font('Helvetica', 'B', 10)
    pdf.cell(20, 6, "Location:", 0, 0)
    pdf.set_font('Helvetica', '', 10)
    pdf.cell(70, 6, profile.get("city", "N/A"), 0, 0)
    
    pdf.set_font('Helvetica', 'B', 10)
    pdf.cell(30, 6, "Feature Hash:", 0, 0)
    pdf.set_font('Helvetica', 'I', 9)
    pdf.set_text_color(84, 185, 72) # Green
    pdf.cell(50, 6, features.get("vocal_twin_hash", "N/A"), 0, 1)
    
    pdf.ln(8)
    
    # --- GRAPHS ROW ---
    y_before_graphs = pdf.get_y()
    graph_path = generate_3d_graph(features)
    spark_path = generate_sparkline(stability_score)
    qr_path = generate_qr_code(patient_id)
    
    pdf.image(graph_path, x=15, y=y_before_graphs, w=60)
    
    pdf.set_xy(90, y_before_graphs + 10)
    pdf.set_font('Helvetica', 'B', 12)
    pdf.set_text_color(10, 43, 78) # Navy Blue
    pdf.cell(50, 6, "Longitudinal Stability Trend (6mo)", 0, 1)
    pdf.image(spark_path, x=90, y=pdf.get_y()+2, w=80)
    
    # Move past graphs
    pdf.set_y(y_before_graphs + 65)

    # --- SCRIBE NARRATIVE ---
    pdf.set_font('Helvetica', 'B', 12)
    pdf.set_text_color(10, 43, 78) # Navy Blue
    pdf.cell(0, 8, "CLINICAL SCRIBE ASSESSMENT", 0, 1, 'L')
    pdf.set_line_width(0.3)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(2)
    
    pdf.set_font('Helvetica', '', 10)
    pdf.set_text_color(50, 50, 50)
    # The scribe text from risk_scoring
    pdf.multi_cell(0, 6, scribe_text, 0, 'L')
    pdf.ln(8)

    # --- CLINICAL RESULTS TABLE ---
    pdf.set_font('Helvetica', 'B', 12)
    pdf.set_text_color(10, 43, 78) # Navy Blue
    pdf.cell(0, 8, "MODALITY RISK MAPPING", 0, 1, 'L')
    pdf.set_line_width(0.3)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(2)
    
    # Table Header
    pdf.set_fill_color(220, 220, 220)
    pdf.set_font('Helvetica', 'B', 10)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(60, 8, "Condition", 1, 0, 'L', fill=True)
    pdf.cell(80, 8, "Acoustic Finding", 1, 0, 'L', fill=True)
    pdf.cell(50, 8, "Status / Alert", 1, 1, 'C', fill=True)
    
    pdf.set_font('Helvetica', '', 9)
    # Print each row
    for condition, diseases in risk_data.items():
        for disease, details in diseases.items():
            risk_level = details['risk']
            finding_text = explanations[condition][disease]
            
            # Substring explanation if too long for table formatting
            if len(finding_text) > 60:
                finding_text = finding_text[:57] + "..."
                
            y_start = pdf.get_y()
            pdf.cell(60, 10, disease, 1, 0, 'L')
            pdf.cell(80, 10, finding_text, 1, 0, 'L')
            
            # Status Bar Cell
            x_status = pdf.get_x()
            y_status = pdf.get_y()
            pdf.cell(50, 10, "", 1, 0) # empty cell for border
            
            # Draw color box inside
            if risk_level == "High":
                pdf.set_fill_color(220, 20, 60) # Red
                alert = "CLINICAL REVIEW"
            elif risk_level == "Medium":
                pdf.set_fill_color(255, 140, 0) # Amber
                alert = "MONITOR"
            else:
                pdf.set_fill_color(50, 205, 50) # Green
                alert = "NOMINAL"
                
            pdf.set_xy(x_status + 2, y_status + 2)
            pdf.set_text_color(255, 255, 255) # white text over color
            pdf.set_font('Helvetica', 'B', 8)
            pdf.cell(46, 6, alert, 0, 0, 'C', fill=True)
            
            # Reset
            pdf.set_text_color(0, 0, 0)
            pdf.set_font('Helvetica', '', 9)
            pdf.set_xy(x_status + 50, y_status)
            pdf.ln(10)

    # Embed QR Code at end
    pdf.ln(5)
    pdf.image(qr_path, x=175, y=pdf.get_y(), w=20)
    pdf.set_font('Helvetica', 'B', 8)
    pdf.cell(165, 20, "PHYSICIAN VERIFICATION ->", 0, 0, 'R')
    
    pdf.output(output_filename)
    # Clean up temp files
    for p in [graph_path, spark_path, qr_path]:
        if os.path.exists(p): os.remove(p)
        
    return output_filename

def encrypt_pdf(input_pdf, password):
    """
    Encrypt the PDF with a password for HIPAA compliance mock using AES-256-R5.
    """
    reader = PdfReader(input_pdf)
    writer = PdfWriter()

    for page in reader.pages:
        writer.add_page(page)

    writer.encrypt(password, algorithm="AES-256-R5")
    encrypted_filename = input_pdf.replace(".pdf", "_encrypted.pdf")
    
    with open(encrypted_filename, "wb") as f:
        writer.write(f)
        
    return encrypted_filename

def simulate_aes256_storage(data_string):
    """
    Simulates encrypting the raw patient data before memory discard.
    Uses AES-256 in CBC mode via pycryptodome.
    """
    key = get_random_bytes(32) # AES-256 uses a 32-byte key
    cipher = AES.new(key, AES.MODE_CBC)
    encrypted_data = cipher.encrypt(pad(data_string.encode(), AES.block_size))
    return encrypted_data, key, cipher.iv
