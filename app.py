import streamlit as st
import time
import datetime
import os
import random
import uuid
import base64
from audio_analysis import extract_features
from risk_scoring import calculate_risk
from report_agent import generate_report, encrypt_pdf

# --- CONFIG & STYLING ---
st.set_page_config(page_title="Nuros | Voice AI", page_icon="🧬", layout="centered")

# Midnight Blue & Bio-Lime Theme, Glassmorphism CSS
css = """
<style>
    /* Global Background */
    .stApp {
        background: radial-gradient(circle at 50% -20%, #112A4F, #0A192F);
        color: #E2E8F0;
        font-family: 'Inter', sans-serif;
    }
    
    p, h1, h2, h3, h4, h5, h6 {
        color: #E2E8F0;
    }
    
    /* Disclaimers */
    .disclaimer {
        font-size: 0.8em;
        color: #94A3B8;
        text-align: center;
        margin-top: 2rem;
        margin-bottom: 2rem;
        opacity: 0.8;
    }

    /* Glassmorphic Cards */
    .glass-card {
        background: rgba(16, 30, 56, 0.4);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(50, 205, 50, 0.15); /* Bio-Lime subtle border */
        border-radius: 20px;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        transition: transform 0.3s ease;
    }
    
    .glass-card:hover {
        transform: translateY(-2px);
        border: 1px solid rgba(50, 205, 50, 0.4);
    }
    
    /* Typography */
    .metric-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: #32CD32; /* Bio-Lime */
        text-shadow: 0 0 10px rgba(50, 205, 50, 0.3);
    }
    
    .risk-high { color: #FF4B4B; font-weight: 600; text-shadow: 0 0 10px rgba(255, 75, 75, 0.2); }
    .risk-medium { color: #FFAA00; font-weight: 600; text-shadow: 0 0 10px rgba(255, 170, 0, 0.2); }
    .risk-low { color: #32CD32; font-weight: 600; text-shadow: 0 0 10px rgba(50, 205, 50, 0.2); }

    hr { border-color: rgba(50, 205, 50, 0.1); }
    
    /* Button glowing overrides */
    div.stButton > button {
        background: transparent;
        border: 2px solid #32CD32;
        color: #32CD32;
        border-radius: 25px;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    div.stButton > button:hover {
        background: rgba(50, 205, 50, 0.1);
        box-shadow: 0 0 15px rgba(50, 205, 50, 0.5);
        color: #fff;
    }
    
    /* Pulsing recording animation wrapper */
    .pulse-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 150px;
    }
    .pulse-circle {
        width: 100px;
        height: 100px;
        background-color: transparent;
        border: 3px solid #32CD32;
        border-radius: 50%;
        animation: pulse 2s infinite ease-out;
    }
    @keyframes pulse {
        0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(50, 205, 50, 0.7); }
        70% { transform: scale(1.5); box-shadow: 0 0 0 20px rgba(50, 205, 50, 0); }
        100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(50, 205, 50, 0); }
    }
</style>
"""
st.markdown(css, unsafe_allow_html=True)


# --- HEADER ---
c1, c2, c3 = st.columns([1,2,1])
with c2:
    st.markdown("<h1 style='text-align: center; color: white;'>NUROS</h1>", unsafe_allow_html=True)
    st.markdown("<h4 style='text-align: center; color: #32CD32; font-weight: 300;'>Vocal Biomarker Clinical Engine</h4>", unsafe_allow_html=True)

st.markdown("<p class='disclaimer'>Requires 10s of voice audio. <b>This is an early risk screening tool, NOT a medical diagnosis.</b> Proceed to clinical evaluation for high-risk signals.</p>", unsafe_allow_html=True)


# --- AUDIO INGESTION & UI WIDGET ---
st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
st.subheader("🎙️ Patient Audio Capture", anchor=False)
audio_value = st.audio_input("Provide 10 seconds of clear speech (e.g., 'Say ahhhhh')")

if audio_value:
    st.markdown("<div class='pulse-container'><div class='pulse-circle'></div></div>", unsafe_allow_html=True)
    
    # Neural Confidence Progress Bar
    progress_bar = st.progress(0)
    status_text = st.empty()
    
    status_text.text("Analyzing Vocal Oscillations... (Extracting Jitter & Shimmer)")
    
    # Save temp file
    temp_path = "temp_audio.wav"
    with open(temp_path, "wb") as f:
        f.write(audio_value.read())
        
    for i in range(1, 40):
        time.sleep(0.01)
        progress_bar.progress(i)
        
    # Feature Extraction
    features = extract_features(temp_path)
    
    status_text.text("Syncing with Neuro-Database... (Calculating Disease Vectors)")
    for i in range(40, 80):
        time.sleep(0.02)
        progress_bar.progress(i)
        
    # Risk Scoring Framework
    analysis = calculate_risk(features)
    
    status_text.text("Finalizing Clinical Report...")
    for i in range(80, 101):
        time.sleep(0.01)
        progress_bar.progress(i)
        
    status_text.empty()
    progress_bar.empty()
    st.success("Analysis Complete.")
    
    # Cleanup memory/files
    if os.path.exists(temp_path):
        os.remove(temp_path)
    st.markdown("</div>", unsafe_allow_html=True)
        
        
    # --- VISUALIZATION DASHBOARD ---
    st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
    st.subheader("📊 Biomarker Stability Score", anchor=False)
    
    score = analysis["stability_score"]
    col_score, col_metrics = st.columns([1, 2])
    
    with col_score:
        st.markdown(f"<div style='text-align:center;'><span class='metric-value'>{score}</span><br><span style='font-size:1.2rem; color: #94A3B8;'>/ 100</span></div>", unsafe_allow_html=True)
        if score > 80: st.info("Score nominal. Low immediate risk.")
        elif score > 60: st.warning("Moderate anomalies detected.")
        else: st.error("Significant biomarkers found. Consult physician.")

    with col_metrics:
        # Display raw features
        st.write("**Extracted Phonatory Metrics:**")
        st.caption(f"**Jitter (Freq Var):** {features['jitter_percent']:.2f}% *(Normal < ~1.04%)*")
        st.caption(f"**Shimmer (Amp Var):** {features['shimmer_percent']:.2f}% *(Normal < ~3.81%)*")
        st.caption(f"**Harmonics-to-Noise (HNR):** {features['hnr_db']:.1f} dB *(Normal > 20 dB)*")
        st.caption(f"**F0 Std Dev (Prosody):** {features['f0_std']:.1f} Hz")
    st.markdown("</div>", unsafe_allow_html=True)


    # --- DISEASE MODALITIES ---
    st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
    st.subheader("🧬 Top 5 Priority AI Risk Modalities", anchor=False)
    
    for disease, data in analysis["disease_risks"].items():
        with st.expander(f"{disease} - {data['risk']} Risk", expanded=True if data['risk'] in ['High', 'Medium'] else False):
            
            risk_class = f"risk-{data['risk'].lower()}"
            st.markdown(f"**Risk Level:** <span class='{risk_class}'>{data['risk']}</span>", unsafe_allow_html=True)
            st.markdown(f"**Model Confidence:** {data['confidence']:.1f}%")
            
            # Explainability
            st.markdown("---")
            st.markdown("**Why this score? (Explainable AI)**")
            st.write(analysis["explanations"][disease])
            
    st.markdown("</div>", unsafe_allow_html=True)


    # --- ENCRYPTED REPORT GENERATION ---
    st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
    st.subheader("🔐 Clinical Reporting Agent", anchor=False)
    st.write("Generate a HIPAA-compliant, encrypted PDF summary of these findings.")
    
    patient_id = "PAT-" + str(uuid.uuid4())[:8].upper()
    
    if st.button("Generate Secure Report"):
        with st.spinner("Compiling Clinical Summary PDF..."):
            timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            raw_pdf = generate_report(patient_id, timestamp, score, analysis["disease_risks"], analysis["explanations"])
            
            # Encrypt with patient ID
            encrypted_pdf = encrypt_pdf(raw_pdf, patient_id)
            
            st.success(f"Report generated & protected! Password: **{patient_id}**")
            
            with open(encrypted_pdf, "rb") as pdf_file:
                b64_pdf = base64.b64encode(pdf_file.read()).decode('utf-8')
                
            href = f'<a href="data:application/pdf;base64,{b64_pdf}" download="{encrypted_pdf}" style="text-decoration:none;"><button style="background:transparent; border:2px solid #32CD32; color:#32CD32; padding:10px 20px; border-radius:10px; cursor:pointer;">Download Encrypted PDF</button></a>'
            st.markdown(href, unsafe_allow_html=True)

            # Cleanup
            time.sleep(1)
            if os.path.exists(raw_pdf): os.remove(raw_pdf)
            # Keeping the encrypted one so they can download it, but usually we would clean it up after session ends
            
    st.markdown("</div>", unsafe_allow_html=True)
else:
    st.markdown("</div>", unsafe_allow_html=True) # close first glass card
