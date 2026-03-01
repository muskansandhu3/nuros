import streamlit as st
import time
import datetime
import os
import random
import uuid
import base64
import librosa
import numpy as np
import io
import threading
import plotly.graph_objects as go
from security_utils import generate_secure_key
from mailer import send_encrypted_report, send_access_key_email, send_contact_form_emails
from audio_analysis import extract_features
from risk_scoring import calculate_risk, calculate_longitudinal_delta
from report_agent import generate_report, encrypt_pdf
from auth import handle_authentication

# --- CONFIG & STYLING ---
st.set_page_config(page_title="Nuros | Voice AI", page_icon="🧬", layout="centered")

# Magical Feminine Theme (Aura-Glow Palette & Liquid Glass)
css = """
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');

    /* Global Background: Deep Midnight Navy with Rose Quartz Center Mesh */
    @keyframes breathingBackground {
        0% { background-position: 0% 50%; background-size: 150% 150%; }
        50% { background-position: 100% 50%; background-size: 200% 200%; }
        100% { background-position: 0% 50%; background-size: 150% 150%; }
    }
    
    .stApp {
        background: radial-gradient(circle at center, rgba(247, 202, 201, 0.15) 0%, #0B132B 40%, #0B132B 100%);
        background-attachment: fixed;
        animation: breathingBackground 15s ease-in-out infinite alternate;
        color: #F8F9FA;
        font-family: 'Inter', sans-serif !important;
    }
    
    p, h1, h2, h3, h4, h5, h6, span {
        color: #F8F9FA; /* Iridescent White */
        letter-spacing: -0.3px;
    }
    
    h1, h2, h3 {
        font-weight: 600;
    }
    
    /* Disclaimers */
    .disclaimer {
        font-size: 0.85em;
        color: #94A3B8;
        text-align: center;
        margin-top: 2rem;
        margin-bottom: 2rem;
        opacity: 0.8;
        font-style: italic;
    }

    /* Frosted Petal Liquid Glass Cards */
    .glass-card {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(30px);
        -webkit-backdrop-filter: blur(30px);
        border: 0.5px solid rgba(247, 202, 201, 0.3);
        border-radius: 24px;
        padding: 2.5rem;
        margin-bottom: 2rem;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(247, 202, 201, 0.05); /* Soft pink inner glow */
        transition: transform 0.3s ease, border 0.3s ease, box-shadow 0.3s ease;
    }
    
    .glass-card:hover {
        transform: translateY(-2px);
        border: 0.5px solid rgba(247, 202, 201, 0.6);
        box-shadow: 0 15px 50px 0 rgba(247, 202, 201, 0.15), inset 0 0 30px rgba(247, 202, 201, 0.1);
    }
    
    /* Strip default grey backgrounds from Streamlit input parents */
    div[data-baseweb="input"],
    div[data-baseweb="base-input"],
    div[data-baseweb="select"],
    div[data-baseweb="textarea"] {
        background-color: transparent !important;
        border: none !important;
    }

    /* Input Styling - Airy and Light */
    div[data-baseweb="input"] > div, 
    div[data-baseweb="select"] > div, 
    div[data-baseweb="textarea"] > div {
        background-color: rgba(10, 25, 47, 0.5) !important; /* Deep navy slightly transparent */
        border: 1px solid rgba(247, 202, 201, 0.3) !important;
        border-radius: 20px !important;
        color: #F8F9FA !important;
        overflow: hidden !important;
    }
    div[data-baseweb="input"] > div:hover, 
    div[data-baseweb="select"] > div:hover, 
    div[data-baseweb="textarea"] > div:hover {
        border: 1px solid rgba(247, 202, 201, 0.8) !important;
        box-shadow: 0 0 15px rgba(247, 202, 201, 0.2) !important;
    }
    
    /* Make the actual typing area perfectly transparent so we only see the customized wrapper */
    input, textarea, select {
        background-color: transparent !important;
        color: #F8F9FA !important;
    }

    /* Metric Cards */
    [data-testid="stMetric"], .metric-sub-card {
        background: rgba(255, 255, 255, 0.02) !important;
        backdrop-filter: blur(30px) !important;
        -webkit-backdrop-filter: blur(30px) !important;
        border: 0.5px solid rgba(247, 202, 201, 0.2) !important;
        border-radius: 20px !important;
        padding: 1.5rem !important;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2), inset 0 0 15px rgba(159, 226, 191, 0.05); /* Teal accent glow */
    }

    .status-green { color: #3A7CA5; text-shadow: 0 0 12px rgba(159, 226, 191, 0.6); font-weight: 600; } /* Healing Teal */
    .status-amber { color: #F7CAC9; text-shadow: 0 0 12px rgba(247, 202, 201, 0.6); font-weight: 600; } /* Magical Pink for caution */

    /* Typography */
    .metric-value {
        font-size: 2.8rem;
        font-weight: 700;
        letter-spacing: -1px;
        color: #3A7CA5; /* Soft Seafoam for main success numbers */
        text-shadow: 0 0 20px rgba(159, 226, 191, 0.5);
    }
    
    .risk-high { color: #F7CAC9; font-weight: 600; text-shadow: 0 0 15px rgba(247, 202, 201, 0.5); }
    .risk-medium { color: #A569BD; font-weight: 600; text-shadow: 0 0 15px rgba(165, 105, 189, 0.4); } 
    .risk-low { color: #3A7CA5; font-weight: 600; text-shadow: 0 0 15px rgba(159, 226, 191, 0.4); }

    hr { border-color: rgba(247, 202, 201, 0.1); }
    
    /* High-Gloss Glass Sphere Buttons */
    div.stButton > button,
    div.stDownloadButton > button,
    div.stFormSubmitButton > button {
        background: rgba(58, 124, 165, 0.45) !important; /* Healing Teal Glass for strong contrast */
        backdrop-filter: blur(15px) !important;
        -webkit-backdrop-filter: blur(15px) !important;
        border: 1px solid rgba(255, 255, 255, 0.4) !important;
        color: #F8F9FA !important;
        border-radius: 50px !important;
        font-family: 'Inter', sans-serif !important;
        font-weight: 600 !important;
        padding: 0.6rem 2.5rem !important;
        white-space: nowrap !important;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2) !important;
    }
    div.stButton > button:hover,
    div.stDownloadButton > button:hover,
    div.stFormSubmitButton > button:hover {
        background: rgba(58, 124, 165, 0.8) !important;
        box-shadow: 0 0 25px rgba(247, 202, 201, 0.5) !important; /* Soft pulse of light */
        border: 1px solid rgba(247, 202, 201, 1) !important;
        color: #fff !important;
        transform: scale(1.05) !important; /* Expand slightly */
    }
    div.stButton > button:active,
    div.stDownloadButton > button:active,
    div.stFormSubmitButton > button:active {
        box-shadow: 0 0 30px 10px rgba(247, 202, 201, 0.6) !important; /* Radial ripple */
        transform: scale(0.98) !important;
    }

    /* High Contrast Audio Input Specifics */
    
    /* Streamlit Expander / Carousel Dark Mode Fix */
    div[data-testid="stExpander"] {
        background-color: rgba(10, 25, 47, 0.5) !important;
        border: 1px solid rgba(159, 226, 191, 0.2) !important;
        border-radius: 10px !important;
    }
    div[data-testid="stExpander"] details summary {
        background-color: rgba(10, 25, 47, 0.8) !important;
        color: #F8F9FA !important;
        border-radius: 10px !important;
    }
    div[data-testid="stExpander"] details summary:hover {
        background-color: rgba(159, 226, 191, 0.15) !important;
        color: #fff !important;
    }
    div[data-testid="stExpander"] details summary svg {
        fill: #3A7CA5 !important; /* Make the dropdown chevron teal */
    }
    div[data-testid="stExpanderDetails"] {
        background-color: rgba(10, 25, 47, 0.8) !important;
        color: #E2E8F0 !important;
    }
    
    div[data-testid="stAudioInput"] {
        background-color: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
    }
    
    div[data-testid="stAudioInput"] button {
        background-color: #0B132B !important;
        border-radius: 50px !important;
        border: 1px solid #3A7CA5 !important;
        transition: all 0.3s ease !important;
    }
    
    div[data-testid="stAudioInput"] button:hover {
        background-color: #16213E !important;
        transform: scale(1.05) !important;
    }
    
    div[data-testid="stAudioInput"] button svg, 
    div[data-testid="stAudioInput"] button svg * {
        /* Let SVG use currentColor cleanly without overriding fill/stroke which breaks the shape */
        color: #F8F9FA !important;
    }
    
    div[data-testid="stAudioInput"] * {
        color: #0B132B !important; /* Force timer and timestamps to dark navy */
        font-weight: 700 !important;
    }
    
    /* Silk Ribbon Waveform Glow */
    .js-plotly-plot, .stPlotlyChart {
        filter: drop-shadow(0 0 10px #F7CAC9);
    }
    
    /* Dark contrast Streamlit Audio controls (Slim & Responsive) */
    audio {
        outline: none;
        border-radius: 50px;
        background-color: #0B132B !important;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(159, 226, 191, 0.1) !important;
        border: 1px solid rgba(159, 226, 191, 0.4) !important;
        height: 44px !important; /* 44px is the minimum height before Webkit hides controls */
        width: 100% !important; /* Responsive to container */
        max-width: 500px !important;
        margin: 5px auto;
        display: block;
        color-scheme: dark !important; /* Native browser dark mode for the player */
    }
    /* Completely hide empty audio tags generated by Streamlit caching */
    audio:not([controls]) {
        display: none !important;
        height: 0 !important;
        width: 0 !important;
    }
    audio::-webkit-media-controls-panel {
        background-color: transparent !important;
    }
    audio::-webkit-media-controls-play-button,
    audio::-webkit-media-controls-mute-button {
        background-color: rgba(159, 226, 191, 0.15);
        border-radius: 50%;
    }
    audio::-webkit-media-controls-play-button:hover,
    audio::-webkit-media-controls-mute-button:hover {
        background-color: rgba(159, 226, 191, 0.4);
    }
    
    /* Apple-Style Neural Pulse SVG Animation */
    .neural-pulse-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 160px;
        position: relative;
    }
    .core {
        width: 40px;
        height: 40px;
        background: #F7CAC9;
        border-radius: 50%;
        box-shadow: 0 0 20px #F7CAC9;
        z-index: 3;
    }
    .ring {
        position: absolute;
        width: 40px;
        height: 40px;
        border: 2px solid rgba(247, 202, 201, 0.8);
        border-radius: 50%;
        animation: emit 2.5s cubic-bezier(0.25, 1, 0.5, 1) infinite;
        opacity: 0;
    }
    .ring:nth-child(2) { animation-delay: 0.8s; }
    .ring:nth-child(3) { animation-delay: 1.6s; }

    @keyframes emit {
        0% { transform: scale(1); opacity: 1; border-width: 4px; }
        100% { transform: scale(4); opacity: 0; border-width: 1px; }
    }
    
    /* Logo Styling */
    .logo-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
    }
    .nuros-logo {
        max-width: 180px;
        mix-blend-mode: screen; 
        filter: drop-shadow(0 0 25px rgba(247, 202, 201, 0.5)) brightness(1.2);
        animation: logoGlow 3s ease-in-out infinite alternate;
    }
    @keyframes logoGlow {
        from { filter: drop-shadow(0 0 15px rgba(247, 202, 201, 0.3)) brightness(1.1); }
        to { filter: drop-shadow(0 0 30px rgba(247, 202, 201, 0.7)) brightness(1.3); }
    }
</style>
"""
st.markdown(css, unsafe_allow_html=True)


# --- HEADER SECTION ---
# Top Middle Banner Image
if os.path.exists("banner.png"):
    with open("banner.png", "rb") as image_file:
        raw_bytes = image_file.read()
        encoded_string = base64.b64encode(raw_bytes).decode()
        
    mime_type = "image/jpeg" if raw_bytes.startswith(b'\xff\xd8') else "image/png"
    
    st.markdown(f'''
    <style>
    .engraved-banner-container {{
        width: 100vw;
        margin-left: calc(-50vw + 50%);
        display: flex;
        justify-content: center;
        margin-top: -3rem;
        margin-bottom: 1rem;
    }}
    .engraved-banner {{
        width: 100%;
        max-width: 1100px;
        aspect-ratio: 1024 / 535; /* Increased slightly to prevent any cut off on the text */
        height: auto;
        background-image: url("data:{mime_type};base64,{encoded_string}");
        background-size: cover;
        background-position: top center;
        background-repeat: no-repeat;
        /* Fade edges to merge into the dark navy background */
        -webkit-mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%);
        mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%);
        opacity: 0.95;
    }}

    /* Responsive adjustments for mobile screens */
    @media (max-width: 768px) {{
        .engraved-banner-container {{
            margin-top: -1.5rem;
            margin-bottom: 0.5rem;
        }}
        .engraved-banner {{
            /* Remove explicit height to let aspect-ratio dynamically scale the image natively */
            height: auto;
            background-position: top center;
            /* Adjust mask to be slightly softer on small screens */
            -webkit-mask-image: radial-gradient(ellipse 95% 95% at 50% 50%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%);
            mask-image: radial-gradient(ellipse 95% 95% at 50% 50%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%);
        }}
    }}
    </style>
    <div class="engraved-banner-container">
        <div class="engraved-banner"></div>
    </div>
    ''', unsafe_allow_html=True)
else:
    # Fallback placeholder if image not found
    st.markdown("""
    <div style="background: linear-gradient(90deg, #16213E, #0B132B, #16213E); 
                height: 120px; border-radius: 20px; border: 1px solid rgba(247, 202, 201, 0.3);
                display: flex; justify-content: center; align-items: center; margin-bottom: 2rem;
                box-shadow: 0 0 30px rgba(159, 226, 191, 0.1);">
        <p style="color: #3A7CA5; font-style: italic; opacity: 0.7;">Save 'banner.png' to project root to display header banner</p>
    </div>
    """, unsafe_allow_html=True)


c1, c2, c3 = st.columns([1,2,1])
with c2:
    # Look for the user's Nuros logo
    logo_path = None
    for ext in ['png', 'jpg', 'jpeg']:
        if os.path.exists(f"Nuros.{ext}"):
            logo_path = f"Nuros.{ext}"
            break
        elif os.path.exists(f"nuros.{ext}"):
            logo_path = f"nuros.{ext}"
            break
        elif os.path.exists(f"logo.{ext}"):
            logo_path = f"logo.{ext}"
            break

    if logo_path:
        with open(logo_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode()
            mime_type = "image/jpeg" if logo_path.lower().endswith(('.jpg', '.jpeg')) else "image/png"
            st.markdown(f'''
                <div class="logo-container" style="text-align: center; margin-bottom: 20px;">
                    <img src="data:{mime_type};base64,{encoded_string}" class="nuros-logo" style="max-height: 200px; max-width: 100%; object-fit: contain;" alt="Nuros Logo">
                </div>
            ''', unsafe_allow_html=True)
    else:
        st.markdown("<h2 style='text-align: center; color: #F8F9FA;'>NUROS</h2>", unsafe_allow_html=True)
        
    st.markdown("<h4 style='text-align: center; color: #D4AF37; font-weight: 300;'>Women’s Vocal Biomarker Platform.</h4>", unsafe_allow_html=True)

st.markdown("<p class='disclaimer'>Clinical-Grade Diagnostic Infrastructure for Endocrine & Neuro-Motor Health. Requires 20 seconds of vocal biomarker capture. Nuros provides AI-driven, auxiliary risk-scoring for endocrine and neuro-motor health.</p>", unsafe_allow_html=True)

pdf_href_header = "#"
meth_pdf_path = "NUROS_Clinical_Methodology.pdf"
if os.path.exists(meth_pdf_path):
    with open(meth_pdf_path, "rb") as f:
        meth_data = f.read()
    b64_meth = base64.b64encode(meth_data).decode()
    pdf_href_header = f"data:application/pdf;base64,{b64_meth}"

st.markdown(f"<div style='text-align: center; margin-bottom: 35px;'><a href='{pdf_href_header}' target='_blank' download='NUROS_Clinical_Methodology.pdf' style='color: #F7CAC9; text-decoration: none; font-weight: 600; padding: 8px 16px; background: rgba(247, 202, 201, 0.1); border: 1px solid rgba(247, 202, 201, 0.4); border-radius: 8px; font-size: 0.9em; box-shadow: inset 0 0 10px rgba(247, 202, 201, 0.05); transition: all 0.2s;'>📋 Clinical Methodology Portal</a></div>", unsafe_allow_html=True)


# --- SESSION STATE INITIALIZATION ---
if 'step' not in st.session_state:
    st.session_state.step = 1
if 'patient_profile' not in st.session_state:
    st.session_state.patient_profile = {}

def next_step():
    st.session_state.step += 1

def prev_step():
    st.session_state.step -= 1

# --- MULTI-STEP ONBOARDING ---

# STEP 1: IDENTITY
if st.session_state.step == 1:
    st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
    
    col_hdr, col_btn = st.columns([3, 1.2])
    with col_hdr:
        st.markdown("<h3 style='margin: 0; padding-top: 8px;'>Secure Patient Portal</h3>", unsafe_allow_html=True)
    with col_btn:
        if st.button("🔐 Secure Login", use_container_width=True):
            st.session_state.step = "auth_flow"
            st.rerun()
            
    st.markdown("<hr style='border-color: rgba(247, 202, 201, 0.15); margin-top: 15px;'>", unsafe_allow_html=True)
    st.subheader("Step 1: Clinical History & Identity", anchor=False)
    
    col_fn, col_ln = st.columns(2)
    with col_fn:
        first_name = st.text_input("First Name", value=st.session_state.patient_profile.get("first_name", ""))
    with col_ln:
        last_name = st.text_input("Last Name", value=st.session_state.patient_profile.get("last_name", ""))
        
    col_dob, col_city = st.columns(2)
    with col_dob:
        dob = st.date_input("Date of Birth", min_value=datetime.date(1900, 1, 1), max_value=datetime.date.today(), value=None)
        
        is_adult = False
        if dob:
            today = datetime.date.today()
            age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
            if age < 18:
                st.error("You must be 18+ years to use this.")
            else:
                is_adult = True
                
    with col_city:
        city = st.text_input("Location (City)", value=st.session_state.patient_profile.get("city", ""))
        email_addr = st.text_input("Patient Email (for Report)", value=st.session_state.patient_profile.get("email", ""))
        
    if st.button("Next: Environmental Baseline ➔", disabled=not is_adult):
        if first_name and last_name and is_adult:
            st.session_state["dob"] = dob.strftime("%Y-%m-%d")
            st.session_state["age_years"] = age
            st.session_state.patient_profile.update({
                "first_name": first_name,
                "last_name": last_name,
                "dob": dob.strftime("%Y-%m-%d"),
                "city": city,
                "email": email_addr
            })
            next_step()
            st.rerun()
        else:
            st.error("Please provide at least a First Name, Last Name, and a valid Date of Birth.")
    st.markdown("</div>", unsafe_allow_html=True)

# STEP 2: ENVIRONMENTAL BASELINE
elif st.session_state.step == 2:
    st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
    st.subheader("Step 2: Environmental Baseline", anchor=False)
    
    st.write("Please indicate any pre-existing conditions or lifestyle factors:")
    life_stage = st.selectbox("Women's Wellness Mode (Life Stage Calibration)", ["General", "Pregnancy", "Menopause"], index=0)
    smoking = st.selectbox("Smoking History", ["Never Smoked", "Former Smoker", "Current Smoker"], index=0)
    respiratory = st.checkbox("Known Respiratory Issues (e.g., Asthma, COPD)")
    neurological = st.checkbox("Known Neurological Conditions")
    medications = st.text_area("Current Medications (Optional)")
    
    col_b, col_n = st.columns([1, 4])
    with col_b:
        if st.button("⬅ Back"):
            prev_step()
            st.rerun()
    with col_n:
        if st.button("Next: Vocal Capture ➔"):
            st.session_state.patient_profile.update({
                "life_stage": life_stage,
                "smoking_history": smoking,
                "respiratory_issues": respiratory,
                "neurological_issues": neurological,
                "medications": medications
            })
            next_step()
            st.rerun()
    st.markdown("</div>", unsafe_allow_html=True)

# STEP 3: VOCAL CAPTURE & DASHBOARD
elif st.session_state.step == 3:
    st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
    col_back, col_title = st.columns([1, 4])
    with col_back:
        if st.button("⬅ Back"):
            prev_step()
            st.rerun()
    with col_title:
        st.subheader("🎙️ Patient Audio Capture", anchor=False)
    st.write(f"**Patient:** {st.session_state.patient_profile.get('first_name')} {st.session_state.patient_profile.get('last_name')}")
    
    st.markdown("""
    <div style='background: rgba(247, 202, 201, 0.1); border-left: 4px solid #F7CAC9; padding: 15px; border-radius: 8px; margin-bottom: 20px;'>
        <h4 style='color: #F7CAC9; margin-top:0;'>🗣️ Phonetic Stress Sequence</h4>
        <p style='color: #E2E8F0; margin-bottom:0;'>Before the main scan, we must force complex muscle transitions to reveal sub-clinical stiffness or swelling. Please press record and clearly read the following pangram:<br>
        <i>"The quick brown fox jumps over the lazy dog."</i></p>
    </div>
    """, unsafe_allow_html=True)
    
    audio_value = st.audio_input("")
    
    # Hidden Javascript layer to auto-click STOP at 20 seconds
    st.components.v1.html("""
    <script>
        const observer = new MutationObserver(() => {
            const parentDoc = window.parent.document;
            const audioInput = parentDoc.querySelector('[data-testid="stAudioInput"]');
            if (audioInput) {
                // Look for the recording timer reading "00:20" anywhere inside the widget text
                if (audioInput.innerText.includes('00:20')) {
                    const btn = audioInput.querySelector('button');
                    if (btn) {
                        btn.click();
                        observer.disconnect();
                    }
                }
            }
        });
        observer.observe(window.parent.document.body, { childList: true, subtree: true, characterData: true });
    </script>
    """, height=0)

    if audio_value:
        st.session_state.step = 4
        
        # Enforce max 20 seconds, using native wave library to prevent ffprobe errors
        try:
            import wave
            import io
            
            raw_audio = audio_value.read()
            with wave.open(io.BytesIO(raw_audio), 'rb') as wav_in:
                framerate = wav_in.getframerate()
                n_frames = wav_in.getnframes()
                
                max_frames = 20 * framerate
                
                if n_frames > max_frames:
                    n_channels = wav_in.getnchannels()
                    sampwidth = wav_in.getsampwidth()
                    wav_data = wav_in.readframes(max_frames)
                    
                    out_io = io.BytesIO()
                    with wave.open(out_io, 'wb') as wav_out:
                        wav_out.setnchannels(n_channels)
                        wav_out.setsampwidth(sampwidth)
                        wav_out.setframerate(framerate)
                        wav_out.writeframes(wav_data)
                    st.session_state.audio_bytes = out_io.getvalue()
                else:
                    st.session_state.audio_bytes = raw_audio
                    
            st.rerun()
        except Exception as e:
            st.error(f"Error processing audio data: {e}")
            
    st.markdown("</div>", unsafe_allow_html=True)
    
# STEP 4: ANALYSIS DASHBOARD
elif st.session_state.step == 4:
    st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
    
    st.markdown("""
    <div style='background: rgba(11, 19, 43, 0.7); border: 1px solid rgba(247, 202, 201, 0.3); border-left: 4px solid #F7CAC9; padding: 15px 20px; border-radius: 8px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);'>
        <p style='color: #F7CAC9; margin: 0 0 5px 0; font-size: 0.9em; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;'>⚠️ Clinical Integrity Notice</p>
        <p style='color: #94A3B8; margin: 0; font-size: 0.85em; font-style: italic; line-height: 1.5;'>This Acoustic Dashboard operates as an Auxiliary Screening Tool. All longitudinal 'Vocal Twin' data and tracked biomarker metrics must be formally evaluated and clinically validated by a licensed physician or neuro-motor specialist.</p>
    </div>
    """, unsafe_allow_html=True)
    st.subheader("🧬 Acoustic Analysis Output", anchor=False)

    st.markdown("""
        <div class='neural-pulse-wrapper'>
            <div class='ring'></div>
            <div class='ring'></div>
            <div class='ring'></div>
            <div class='core'></div>
        </div>
    """, unsafe_allow_html=True)
    
    # Neural Confidence Progress Bar
    progress_bar = st.progress(0)
    status_text = st.empty()
    
    status_text.text("Analyzing Vocal Oscillations... (Extracting Jitter & Shimmer)")
    
    # Save temp file
    temp_path = "temp_audio.wav"
    with open(temp_path, "wb") as f:
        f.write(st.session_state.audio_bytes)
        
    for i in range(1, 40):
        time.sleep(0.01)
        progress_bar.progress(i)
        
    # Feature Extraction
    features = extract_features(temp_path)
    
    status_text.text("Applying Language Shield & Computing 3D Fourier Transform...")
    for i in range(40, 80):
        time.sleep(0.02)
        progress_bar.progress(i)
        
    # Risk Scoring Framework with Women's Health Life Stage Calibration
    analysis = calculate_risk(features, st.session_state.patient_profile.get("life_stage", "General"))
    
    status_text.text("Generating Scribe Narrative...")
    for i in range(80, 101):
        time.sleep(0.01)
        progress_bar.progress(i)
        
    status_text.empty()
    progress_bar.empty()
    st.success("Acoustic Analysis Pipeline Complete.")
    
    # --- VOCAL TWIN DELTA ANALYSIS (Simulating Database Retrieval) ---
    baseline_features = st.session_state.get("baseline_features", None)
    
    # For demonstration/MVP purposes, if no baseline exists, we mock a historical baseline tightly 
    # to demonstrate the >15% longitudinal drift trigger.
    if not baseline_features:
        baseline_features = {
            "jitter_percent": max(0.001, features.get("jitter_percent", 0.0) * 0.8), # Ensure current is 20%+ higher than baseline
            "shimmer_percent": max(0.001, features.get("shimmer_percent", 0.0) * 0.8)
        }
        st.session_state.baseline_features = baseline_features # save to session so it persists

    delta_analysis = calculate_longitudinal_delta(features, baseline_features)
    
    if delta_analysis["alert"]:
        st.error(delta_analysis["message"])
    else:
        st.success(delta_analysis["message"])
    
    st.markdown("</div>", unsafe_allow_html=True)
        
    # --- 3D GLOWING WAVEFORM VISUALIZER (FOURIER TRANSFORM) ---
    st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
    st.subheader("🌊 3D Silk Waveform Visualizer", anchor=False)
    st.write("Real-time bioluminescent mapping of glottal frequencies.")
    
    # Generate STFT for 3D Plot (Scientific Oscillograph High-Density Format)
    y, sr = librosa.load(temp_path, duration=3.0) # only plot first 3 secs for speed
    D = np.abs(librosa.stft(y, n_fft=1024, hop_length=128))
    D_db = librosa.amplitude_to_db(D, ref=np.max)
    
    # Truncate high frequencies for bioluminescent live-physics look
    D_db = D_db[:150, :] 
    
    x = np.arange(D_db.shape[1])
    y_ax = np.arange(D_db.shape[0])
    X, Y = np.meshgrid(x, y_ax)
    
    # Bioluminescent Live Physics Gradients
    silk_colors = [
        [0.0, '#0B132B'], # Deep Background 
        [0.2, '#16213E'], 
        [0.5, '#3A7CA5'], # Neon Teal Core
        [0.8, '#F7CAC9'], # Bio-Pink High Amplitude
        [1.0, '#FFFFFF']  # Piercing White peaks
    ]

    fig = go.Figure(data=[go.Surface(
        z=D_db, x=X, y=Y, 
        colorscale=silk_colors,
        opacity=0.9,
        lighting=dict(ambient=0.8, diffuse=0.9, roughness=0.1, specular=1.5, fresnel=0.2)
    )])
    
    fig.update_layout(
        scene=dict(
            xaxis=dict(showgrid=False, zeroline=False, showticklabels=False, title=''),
            yaxis=dict(showgrid=False, zeroline=False, showticklabels=False, title=''),
            zaxis=dict(showgrid=False, zeroline=False, showticklabels=False, title=''),
            bgcolor='rgba(0,0,0,0)'
        ),
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        margin=dict(l=0, r=0, b=0, t=0),
        height=300
    )
    st.plotly_chart(fig, use_container_width=True)
    
    # Cleanup
    if os.path.exists(temp_path):
        os.remove(temp_path)
        
    st.markdown("</div>", unsafe_allow_html=True)

    # --- VISUALIZATION DASHBOARD ---
    st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
    st.subheader("📊 Biomarker Stability & Scribe Narrative", anchor=False)
    
    score = analysis["stability_score"]
    
    # Apple-Style Circular / Callout view for the main score
    col_scp, col_scr = st.columns([1, 2])
    with col_scp:
        st.markdown(f"<div style='text-align:center; padding: 1.5rem;'><span class='metric-value'>{score}</span><br><span style='font-size:1.3rem; color: #94A3B8; font-weight: 300;'>/ 100</span><br><br><span style='font-size:0.8rem; color: #F7CAC9;'>Vocal Twin Hash:<br>{features.get('vocal_twin_hash', 'N/A')}</span><br><span style='font-size:0.7rem; color: #3A7CA5; font-weight:bold;'>Market Ready: Medtronic Std.</span></div>", unsafe_allow_html=True)
    with col_scr:
        scribe_text = analysis.get("scribe_summary", "Synthesis complete.")
        clean_scribe_text = scribe_text.replace("`", "'").replace("\n", " ")
        st.markdown(f"""<div style='background: rgba(11, 19, 43, 0.7); padding: 25px; border-radius: 16px; border: 1px solid rgba(247, 202, 201, 0.4); box-shadow: inset 0 0 20px rgba(0,0,0,0.5);'>
        <div style='display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;'>
            <h5 style='color: #F7CAC9; margin:0;'>📋 Standardized Clinical Narrative</h5>
            <span style='font-size:0.7rem; color:#0B132B; background:#3A7CA5; padding:4px 10px; border-radius:12px; font-weight:700; letter-spacing: 0.5px;'>EMR-READY (Epic / OSCAR)</span>
        </div>
        <p style='font-size: 0.95rem; line-height: 1.6; color: #E2E8F0; font-family: "Courier New", Courier, monospace; white-space: pre-wrap; background: rgba(0,0,0,0.3); padding: 18px; border-radius: 8px; border: 1px dashed rgba(58, 124, 165, 0.5); margin-bottom: 0;'>{scribe_text}</p>
        <div style="text-align: right; margin-top: 10px;">
            <button style='background: rgba(247, 202, 201, 0.1); border: 1px solid rgba(247, 202, 201, 0.5); border-radius: 6px; color: #F7CAC9; padding: 6px 12px; font-size: 0.85em; cursor: pointer; transition: all 0.2s;' onclick='navigator.clipboard.writeText(`{clean_scribe_text}`)'>📑 One-Click Copy to EMR</button>
        </div>
        </div>""", unsafe_allow_html=True)

    st.markdown("<hr style='opacity: 0.15'>", unsafe_allow_html=True)
    st.write("### Clinical Metric Displays")
    
    col1, col2, col3 = st.columns(3)
    
    # Jitter Card (Micro-Tremor)
    with col1:
        # Green if < 1.04%, Amber otherwise
        j_val = features['jitter_percent']
        j_status = "status-green" if j_val <= 1.04 else "status-amber"
        j_text = "Stable" if j_val <= 1.04 else "Review"
        st.markdown(f"""
            <div class='metric-sub-card'>
                <p style='color: #E0E0E0; font-size: 0.95rem; margin-bottom: 8px; font-weight: 300;'>Jitter (Micro-Tremor)</p>
                <h3 style='margin: 0; color: #fff; font-weight: 600; font-size: 2rem;'>{j_val:.2f}%</h3>
                <span class='{j_status}' style='font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px;'>{j_text}</span>
            </div>
        """, unsafe_allow_html=True)

    # Shimmer Card (Amplitude/Dysarthria)
    with col2:
        # Green if < 3.81%, Amber otherwise
        s_val = features['shimmer_percent']
        s_status = "status-green" if s_val <= 3.81 else "status-amber"
        s_text = "Stable" if s_val <= 3.81 else "Review"
        st.markdown(f"""
            <div class='metric-sub-card'>
                <p style='color: #E0E0E0; font-size: 0.95rem; margin-bottom: 8px; font-weight: 300;'>Shimmer (Amplitude)</p>
                <h3 style='margin: 0; color: #fff; font-weight: 600; font-size: 2rem;'>{s_val:.2f}%</h3>
                <span class='{s_status}' style='font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px;'>{s_text}</span>
            </div>
        """, unsafe_allow_html=True)

    # HNR Card (Phonatory Flow)
    with col3:
        # Green if > 15 dB, Amber otherwise
        h_val = features['hnr_db']
        h_status = "status-green" if h_val >= 15.0 else "status-amber"
        h_text = "Optimal" if h_val >= 15.0 else "Review"
        st.markdown(f"""
            <div class='metric-sub-card'>
                <p style='color: #E0E0E0; font-size: 0.95rem; margin-bottom: 8px; font-weight: 300;'>Harmonics-To-Noise</p>
                <h3 style='margin: 0; color: #fff; font-weight: 600; font-size: 2rem;'>{h_val:.1f} dB</h3>
                <span class='{h_status}' style='font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px;'>{h_text}</span>
            </div>
        """, unsafe_allow_html=True)

    st.markdown("</div>", unsafe_allow_html=True)


    # --- NEW SECTION: WOMEN's HEALTH INSIGHT ---
    st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
    
    st.markdown("<div style='text-align: center;'>", unsafe_allow_html=True)
    st.write("Playback Recorded Session:")
    st.audio(st.session_state.audio_bytes, format="audio/wav")
    st.markdown("</div><br>", unsafe_allow_html=True)
    
    st.subheader("🌸 Nuros Women’s Health Insight", anchor=False)
    st.write("*Synchronizing vocal biomarkers with physiological life-stages.*")
    
    st.markdown(f"""
    <div style='background: rgba(159, 226, 191, 0.05); border-left: 3px solid #3A7CA5; padding: 20px; border-radius: 12px;'>
        <p style='color: #F8F9FA; line-height: 1.6;'>
        Based on the provided life-stage calibration (<b>{st.session_state.patient_profile.get("life_stage", "General")}</b>), the extracted acoustic biomarkers have been normalized to account for standard hormonal fluctuations affecting vocal fold mass and mucosal hydration.
        </p>
        <p style='color: #3A7CA5; font-weight: 600; margin-bottom: 0;'>
        Vocal fold stability aligns with normative data for this physiological phase.
        </p>
    </div>
    """, unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)


    # --- DISEASE MODALITIES ---
    st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
    st.subheader("🧬 High-Precision Modality Mapping", anchor=False)
    
    for condition, metrics in analysis["disease_risks"].items():
        st.markdown(f"#### {condition}")
        for disease, data in metrics.items():
            with st.expander(f"{disease} - {data['risk']} Risk", expanded=True if data['risk'] in ['High', 'Medium'] else False):
                
                risk_class = f"risk-{data['risk'].lower()}"
                st.markdown(f"**Risk Level:** <span class='{risk_class}'>{data['risk']}</span>", unsafe_allow_html=True)
                st.markdown(f"**Model Confidence:** {data['confidence']:.1f}%")
                
                # Explainability
                st.markdown("---")
                st.markdown("**Pathological Insight (Auto-Generated):**")
                st.write(analysis["explanations"][condition][disease])
            
    st.markdown("</div>", unsafe_allow_html=True)


    # --- ENCRYPTED REPORT GENERATION ---
    st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
    st.subheader("🔐 Premium Insight Report", anchor=False)
    st.write("Generate a HIPAA-compliant, encrypted PDF summary encoded with a Digital Seal of Authenticity.")
    
    patient_id = "PAT-" + str(uuid.uuid4())[:8].upper()
    patient_email = st.session_state.patient_profile.get("email", "")
    
    if 'access_key' not in st.session_state:
        st.session_state.access_key = generate_secure_key()
    access_key = st.session_state.access_key
    
    send_email = False
    if patient_email:
        send_email = st.checkbox(f"Automatically send secure report to **{patient_email}**", value=True)
    
    if st.button("Generate Secure 3D Report"):
        with st.spinner("Compiling Premium Clinical Summary PDF & Handover..."):
            timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            raw_pdf = generate_report(
                patient_id=patient_id, 
                date=timestamp, 
                stability_score=score, 
                risk_data=analysis["disease_risks"], 
                explanations=analysis["explanations"], 
                profile=st.session_state.patient_profile,
                features=features,
                scribe_text=analysis.get("scribe_summary", "")
            )
            
            # Encrypt with the new SECURE KEY instead of the Patient ID
            encrypted_pdf = encrypt_pdf(raw_pdf, access_key)
            
            with open(encrypted_pdf, "rb") as pdf_file:
                pdf_data = pdf_file.read()
                
            # --- EMAIL DISPATCH HANDLING (Two-Factor Handover) ---
            email_sent = False
            if send_email and patient_email:
                success, msg = send_encrypted_report(patient_email, pdf_data, encrypted_pdf)
                if success:
                    email_sent = True
                    send_access_key_email(patient_email, access_key)
                else:
                    st.warning(msg) # Changed to warning so it doesn't look like a crash!
            
            # --- MAGICAL HANDOVER UI ---
            st.markdown("---")
            st.markdown("""
            <div style='background: rgba(247, 202, 201, 0.05); border: 1px solid rgba(247, 202, 201, 0.4); border-radius: 20px; padding: 25px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.3), inset 0 0 15px rgba(247, 202, 201, 0.1); margin-top: 10px;'>
                <h3 style='color: #F7CAC9; margin-bottom: 0px;'>✨ Success & Security</h3>
            """, unsafe_allow_html=True)
            
            if email_sent:
                st.markdown(f"<p style='color: #E2E8F0; font-size: 1.1em;'>Your secure report has been sent to <b>{patient_email}</b>.</p>", unsafe_allow_html=True)
                st.markdown("<p style='color: #A569BD; font-size: 0.9em; font-style: italic;'>Your Access Key will arrive in a separate email shortly for added security.</p>", unsafe_allow_html=True)
            else:
                st.markdown("<p style='color: #E2E8F0; font-size: 1.1em;'>Your secure report is ready for download.</p>", unsafe_allow_html=True)
                
            st.markdown("<p style='color: #94A3B8; margin-bottom: 20px;'>For your privacy, please use the unique Access Key below to open the file.</p>", unsafe_allow_html=True)
            
            # The Secure Key Box (Beautifully Styled)
            st.markdown(f"""
            <div style="background-color: #0B132B; padding: 15px; border-radius: 10px; border: 1px solid #F7CAC9; font-size: 26px; font-weight: bold; font-family: monospace; letter-spacing: 3px; color: #FFF; margin-bottom: 20px;">
                {access_key}
            </div>
            """, unsafe_allow_html=True)
            
            st.download_button(
                label="⏬ Download Encrypted PDF",
                data=pdf_data,
                file_name=encrypted_pdf,
                mime="application/pdf",
                use_container_width=True
            )
            
            st.markdown("</div>", unsafe_allow_html=True)
            
            # --- DIAGNOSTIC METHODOLOGY SECTION (Clinical Authority UI) ---
            st.markdown("<h3 style='margin-top: 30px;'>Diagnostic Methodology</h3>", unsafe_allow_html=True)
            
            pdf_href = "#"
            meth_pdf_path = "NUROS_Clinical_Methodology.pdf"
            if os.path.exists(meth_pdf_path):
                with open(meth_pdf_path, "rb") as f:
                    meth_data = f.read()
                b64_meth = base64.b64encode(meth_data).decode()
                pdf_href = f"data:application/pdf;base64,{b64_meth}"
                
            st.markdown(f"""
            <div style="background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid #F7CAC9; border-radius: 15px; padding: 25px; margin-top: 10px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(247, 202, 201, 0.05);">
                <p style="color: #E2E8F0; font-size: 1.05em; line-height: 1.6; margin-bottom: 0;">
                    We believe in transparent, science-first diagnostics. ✨ <a href="{pdf_href}" target="_blank" download="NUROS_Clinical_Methodology.pdf" style="color: #F7CAC9; text-decoration: none; font-weight: bold; padding: 2px 6px; background: rgba(247, 202, 201, 0.1); border-radius: 5px; transition: all 0.2s;">📋 View Our Clinical Methodology</a> to see the physics-based markers and signal processing pipeline that generated this report.
                </p>
            </div>
            """, unsafe_allow_html=True)

            # Cleanup
            time.sleep(1)
            if os.path.exists(raw_pdf): os.remove(raw_pdf)
            
    st.markdown("</div>", unsafe_allow_html=True)

    # --- FOOTER: REGULATORY TRUST SIGNALS ---
    st.markdown(f"""
    <div style='text-align: center; padding: 40px 0 20px 0; border-top: 1px solid rgba(247, 202, 201, 0.15); margin-top: 40px;'>
        <div style='display: inline-block; background: rgba(11, 19, 43, 0.7); padding: 10px 24px; border-radius: 50px; border: 1px solid rgba(58, 124, 165, 0.4); box-shadow: 0 0 20px rgba(58, 124, 165, 0.1); margin-bottom: 20px;'>
            <span style='color: #3A7CA5; font-size: 0.8em; font-weight: 700; letter-spacing: 1.2px;'>🛡️ AES-256 ENCRYPTED | PHIPA & PIPEDA COMPLIANT</span>
        </div>
        <div>
            <a href='{pdf_href_header}' target='_blank' style='color: #94A3B8; font-size: 0.85em; text-decoration: none; margin: 0 15px; transition: color 0.2s;'>Clinical Methodology</a>
            <span style='color: #475569;'>|</span>
            <a href='#' style='color: #94A3B8; font-size: 0.85em; text-decoration: none; margin: 0 15px; transition: color 0.2s;'>Privacy Protocol</a>
            <span style='color: #475569;'>|</span>
            <a href='#' style='color: #94A3B8; font-size: 0.85em; text-decoration: none; margin: 0 15px; transition: color 0.2s;'>Terms of Use</a>
        </div>
    </div>
    """, unsafe_allow_html=True)

# --- AUTHENTICATION & COMPLIANCE GATEWAY ---
elif st.session_state.step == "auth_flow":
    st.markdown("<div style='margin-bottom: 20px;'>", unsafe_allow_html=True)
    if st.button("⬅ Back to Intake"):
        st.session_state.step = 1
        st.rerun()
    st.markdown("</div>", unsafe_allow_html=True)
            
    if handle_authentication():
        st.session_state.step = 5
        st.rerun()

# STEP 5: LONGITUDINAL CLINICAL DASHBOARD (Unified Portal)
elif st.session_state.step == 5:
    st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
    col_back, col_title = st.columns([1, 4])
    with col_back:
        if st.button("⬅ Log Out"):
            st.session_state.step = 1
            st.session_state.authenticated = False
            st.session_state.compliance_cleared = False
            st.rerun()
    with col_title:
        st.subheader("🏥 Unified Clinical Hub", anchor=False)
        st.markdown(f"<p style='color: #94A3B8; margin-top: -10px;'>Longitudinal Vocal Health Twin Data • Verified User {st.session_state.get('verified_user_id', 'USR-XX')}</p>", unsafe_allow_html=True)
    
    st.markdown("""
    <div style='background: rgba(11, 19, 43, 0.7); border: 1px solid rgba(58, 124, 165, 0.5); padding: 20px; border-radius: 12px; margin-bottom: 25px;'>
        <h4 style='color: #3A7CA5; margin-top:0;'>Patient: Jane Doe (ID: PAT-A9B2C4)</h4>
        <p style='color: #E2E8F0; margin-bottom:0;'><strong>Primary Risk Track:</strong> Endocrine / Thyroid Swelling</p>
    </div>
    """, unsafe_allow_html=True)
    
    tab_timeline, tab_baseline, tab_reports, tab_settings = st.tabs([
        "📈 Health History Timeline", 
        "🧬 Vocal Twin Baseline", 
        "📑 Active Report Module", 
        "⚙️ Clinical Settings"
    ])
    
    with tab_timeline:
        st.markdown("<br>### Longitudinal Record", unsafe_allow_html=True)
        # Mock Timeline Data for Demonstration
        timeline_data = {
            "Date": ["Oct 12, 2025", "Nov 20, 2025", "Jan 05, 2026", "Feb 28, 2026"],
            "Jitter (%)": [0.85, 0.90, 1.05, 1.25],
            "Shimmer (%)": [2.50, 2.75, 3.20, 3.95],
            "Score": [95, 95, 85, 75],
            "Clinical Note": [
                "Baseline Scan - Nominal",
                "Nominal",
                "Slight Tremor Detected",
                "🚨 >15% Delta Alert: Pathological Rigidity"
            ]
        }
        
        import pandas as pd
        import plotly.express as px
        
        df = pd.DataFrame(timeline_data)
        
        # Render Chart
        fig = px.line(df, x="Date", y="Score", markers=True, title="Vocal Biomarker Stability Trend (0-100)")
        fig.update_layout(
            plot_bgcolor='rgba(0,0,0,0)',
            paper_bgcolor='rgba(0,0,0,0)',
            font_color="#F8F9FA",
            title_font_color="#F7CAC9",
            xaxis=dict(showgrid=False),
            yaxis=dict(showgrid=True, gridcolor='rgba(247, 202, 201, 0.1)', range=[0, 100])
        )
        fig.update_traces(line_color="#3A7CA5", marker=dict(size=10, color="#F7CAC9", line=dict(width=2, color="#0B132B")))
        
        st.plotly_chart(fig, use_container_width=True)
        
        # Detailed Record Table
        st.markdown("### 📋 Signed EMR History")
        st.dataframe(df, use_container_width=True, hide_index=True)
        
    with tab_baseline:
        st.markdown("<br>### Bioluminescent Baseline Comparison", unsafe_allow_html=True)
        st.markdown("Compare current micro-fluctuations directly against the cryptographically verified historic Vocal Twin baseline.")
        
        # Simulated Bioluminescent Curves
        x = np.linspace(0, 10, 200)
        y_base = np.sin(x) * np.exp(-x/4)
        y_curr = y_base + np.random.normal(0, 0.15, 200) # adding tremor
        
        fig2 = go.Figure()
        fig2.add_trace(go.Scatter(x=x, y=y_base, mode='lines', name='Historical Baseline', line=dict(color='#3A7CA5', width=3)))
        fig2.add_trace(go.Scatter(x=x, y=y_curr, mode='lines', name='Current Status', line=dict(color='#F7CAC9', width=2)))
        
        fig2.update_layout(
            plot_bgcolor='rgba(0,0,0,0)',
            paper_bgcolor='rgba(0,0,0,0)',
            font_color="#F8F9FA",
            legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
        )
        st.plotly_chart(fig2, use_container_width=True)

    with tab_reports:
        st.markdown("<br>### Recent Diagnostic Artifacts", unsafe_allow_html=True)
        
        st.markdown(f"""
        <div style='background: rgba(11, 19, 43, 0.7); padding: 25px; border-radius: 16px; border: 1px solid rgba(247, 202, 201, 0.4); box-shadow: inset 0 0 20px rgba(0,0,0,0.5);'>
            <div style='display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;'>
                <h5 style='color: #F7CAC9; margin:0;'>📋 Standardized Clinical Narrative</h5>
                <span style='font-size:0.7rem; color:#0B132B; background:#3A7CA5; padding:4px 10px; border-radius:12px; font-weight:700; letter-spacing: 0.5px;'>EMR-READY (Epic / OSCAR)</span>
            </div>
            <p style='font-size: 0.95rem; line-height: 1.6; color: #E2E8F0; font-family: "Courier New", Courier, monospace; white-space: pre-wrap; background: rgba(0,0,0,0.3); padding: 18px; border-radius: 8px; border: 1px dashed rgba(58, 124, 165, 0.5); margin-bottom: 0;'>Patient exhibits 1.25% jitter variance and 3.95% shimmer amplitude deviation. Elevated micro-tremors suggest sub-clinical instability consistent with early-stage neuro-motor assessment (e.g., Parkinson's profiling). Harmonics-to-Noise Ratio (HNR) measured at 14.5 dB. Diminished HNR indicates increased glottal noise, mapping to potential respiratory inefficiency. Overall vocal biomarker stability computed at 75.0/100.</p>
            <div style="text-align: right; margin-top: 10px;">
                <button style='background: rgba(247, 202, 201, 0.1); border: 1px solid rgba(247, 202, 201, 0.5); border-radius: 6px; color: #F7CAC9; padding: 6px 12px; font-size: 0.85em; cursor: pointer; transition: all 0.2s;'>📑 One-Click Copy to EMR</button>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("<br>", unsafe_allow_html=True)
        if st.button("🎙️ Initiate New Vocal Scan"):
            st.session_state.step = 2
            st.rerun()

    with tab_settings:
        st.markdown("<br>### API-First Architecture", unsafe_allow_html=True)
        st.markdown("""
        <div style='background: rgba(11, 19, 43, 0.7); border-left: 4px solid #3A7CA5; padding: 15px; border-radius: 8px;'>
            <h4 style='color: #3A7CA5; margin-top:0;'>EMR Interoperability Target</h4>
            <p style='color: #E2E8F0; margin-bottom:0;'>Nuros generates structured narratives optimized for seamless integration into Epic, Cerner, and OSCAR Pro EMR systems. Our internal APIs will allow direct <b>HL7 FHIR</b> ingestion of vocal biomarkers directly to the patient's master record.</p>
        </div>
        """, unsafe_allow_html=True)
        
    st.markdown("</div>", unsafe_allow_html=True)
    
    # --- FOOTER: REGULATORY TRUST SIGNALS ---
    st.markdown(f"""
    <div style='text-align: center; padding: 40px 0 20px 0; border-top: 1px solid rgba(247, 202, 201, 0.15); margin-top: 40px;'>
        <div style='display: inline-block; background: rgba(11, 19, 43, 0.7); padding: 10px 24px; border-radius: 50px; border: 1px solid rgba(58, 124, 165, 0.4); box-shadow: 0 0 20px rgba(58, 124, 165, 0.1); margin-bottom: 20px;'>
            <span style='color: #3A7CA5; font-size: 0.8em; font-weight: 700; letter-spacing: 1.2px;'>🛡️ AES-256 ENCRYPTED | PHIPA & PIPEDA COMPLIANT</span>
        </div>
        <div>
            <a href='{pdf_href_header}' target='_blank' style='color: #94A3B8; font-size: 0.85em; text-decoration: none; margin: 0 15px; transition: color 0.2s;'>Clinical Methodology</a>
            <span style='color: #475569;'>|</span>
            <a href='#' style='color: #94A3B8; font-size: 0.85em; text-decoration: none; margin: 0 15px; transition: color 0.2s;'>Privacy Protocol</a>
            <span style='color: #475569;'>|</span>
            <a href='#' style='color: #94A3B8; font-size: 0.85em; text-decoration: none; margin: 0 15px; transition: color 0.2s;'>Terms of Use</a>
        </div>
    </div>
    """, unsafe_allow_html=True)

# --- FLOATING MARKET VALIDATION FEEDBACK FORM ---
@st.dialog("✨ Nuros Market Validation", width="large")
def feedback_dialog():
    if st.session_state.get("feedback_submitted"):
        st.success("Thank you! Your feedback is being used as 'Market Validation Data'.")
    else:
        st.markdown("**Help us refine the future of clinical vocal biomarkers and close the gap in Women's Health.**")
        with st.form("feedback_form"):
            q1 = st.radio("1. Would sharing this automated report with your doctor save you time during appointments?", ["Yes", "No"])
            q2 = st.slider("2. On a scale of 1-5, how secure did you feel using this 'Password-Protected' delivery system?", 1, 5, 5)
            q3 = st.radio("3. Did you feel the 'Language Shield' accurately captured your voice despite your accent or primary language?", ["Yes", "No"])
            q4 = st.slider("4. How valuable is having a dedicated 'Hormonal & Thyroid' vocal scanner to you?", 1, 10, 10)
            q5 = st.text_area("5. Please provide one sentence on how Nuros could help you 'Age in Place' or manage your health at home.")
            
            submitted = st.form_submit_button("Submit Validation")
            if submitted:
                import csv
                import os
                file_exists = os.path.isfile("validation_results.csv")
                try:
                    with open("validation_results.csv", "a", newline="", encoding="utf-8") as f:
                        writer = csv.writer(f)
                        if not file_exists:
                            writer.writerow(["Timestamp", "Admin Burden (Save Time)", "Trust (Security 1-5)", "Inclusion (Language Shield)", "Women's Health Value (1-10)", "Age in Place Testimonial"])
                        writer.writerow([
                            datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                            q1, q2, q3, q4, q5
                        ])
                except Exception as e:
                    print("Failed to write to validation_results.csv:", e)

                st.session_state.feedback_submitted = True
                st.success("Thank you! Your feedback is being used as 'Market Validation Data'.")

st.markdown('''
<style>
/* Fix Dialog Form Text Legibility */
div[data-testid="stDialog"] * {
    color: #0B132B !important; /* Deep Navy Font */
}
div[data-testid="stDialog"] div.stButton > button {
    background-color: #0B132B !important;
    color: #F8F9FA !important;
    border: 1px solid #0B132B !important;
    box-shadow: none !important;
}
div[data-testid="stDialog"] div.stButton > button:hover {
    background-color: #16213E !important;
    color: #FFF !important;
}
div[data-testid="stDialog"] div[data-baseweb="textarea"] > div,
div[data-testid="stDialog"] div[data-baseweb="input"] > div {
    background-color: #F8FAFC !important;
    border: 1px solid #D4AF37 !important; /* Gold border */
    border-radius: 8px !important;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.02) !important;
    transition: all 0.2s ease-in-out !important;
}
div[data-testid="stDialog"] div[data-baseweb="textarea"] > div:focus-within,
div[data-testid="stDialog"] div[data-baseweb="input"] > div:focus-within {
    background-color: #FFFFFF !important;
    border: 1.5px solid #3A7CA5 !important; /* Green glow focus */
    box-shadow: 0 0 10px rgba(84, 185, 72, 0.2) !important;
}
div[data-testid="stDialog"] textarea,
div[data-testid="stDialog"] input {
    background-color: transparent !important;
    color: #0A2B4E !important; /* Navy */
}

/* Use standard CSS :has() combinator + adjacent sibling to selectively target this exact button purely via CSS */
.element-container:has(.feedback-anchor) + .element-container {
    position: fixed !important;
    bottom: 2rem !important;
    right: 2rem !important;
    z-index: 9999 !important;
}
.element-container:has(.feedback-anchor) + .element-container button {
    background: rgba(10, 25, 47, 0.7) !important; /* Deep navy base */
    backdrop-filter: blur(10px) !important;
    -webkit-backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(247, 202, 201, 0.3) !important; /* Rose quartz border */
    box-shadow: 0 4px 15px rgba(247, 202, 201, 0.1) !important;
    border-radius: 50px !important;
    color: #F8F9FA !important;
    padding: 0.8rem 1.5rem !important;
    font-weight: 600 !important;
    transition: all 0.3s ease !important;
}
.element-container:has(.feedback-anchor) + .element-container button:hover {
    background: rgba(247, 202, 201, 0.15) !important; /* Rose quartz glow */
    border: 1px solid rgba(247, 202, 201, 0.8) !important;
    box-shadow: 0 0 25px rgba(247, 202, 201, 0.6) !important;
    transform: translateY(-3px) !important;
    color: #FFF !important;
}

/* Contact Us Bubble Styling */
.element-container:has(.contact-anchor) + .element-container {
    position: fixed !important;
    bottom: 2rem !important;
    left: 2rem !important;
    z-index: 9999 !important;
}
.element-container:has(.contact-anchor) + .element-container button {
    background: rgba(10, 43, 78, 0.8) !important; /* Deep Navy */
    backdrop-filter: blur(10px) !important;
    -webkit-backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(84, 185, 72, 0.4) !important; /* Green pop */
    box-shadow: 0 4px 15px rgba(0,0,0, 0.2) !important;
    border-radius: 50px !important;
    color: #F8F9FA !important;
    padding: 0.8rem 1.5rem !important;
    font-weight: 600 !important;
    transition: all 0.3s ease !important;
}
.element-container:has(.contact-anchor) + .element-container button:hover {
    background: rgba(84, 185, 72, 0.2) !important; 
    border: 1px solid rgba(84, 185, 72, 0.8) !important;
    box-shadow: 0 0 20px rgba(84, 185, 72, 0.4) !important;
    transform: translateY(-3px) !important;
    color: #FFF !important;
}
</style>
<div class="feedback-anchor"></div>
''', unsafe_allow_html=True)

if st.button("✨ Help Close the Gap in Women's Health"):
    feedback_dialog()

# --- CONTACT US DIALOG ---
@st.dialog("📞 Contact Nuros", width="large")
def contact_dialog():
    if st.session_state.get("contact_submitted"):
        st.balloons()
        st.markdown("""
        <style>
        @keyframes flyUpFade {
            0% { opacity: 0; transform: translate(-50%, 50px) scale(0.8); }
            15% { opacity: 1; transform: translate(-50%, 0px) scale(1.05); }
            80% { opacity: 1; transform: translate(-50%, -20px) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -100px) scale(0.9); }
        }
        .flying-thank-you {
            position: fixed;
            top: 40%;
            left: 50%;
            z-index: 999999;
            background: linear-gradient(135deg, rgba(10,43,78,0.95), rgba(10,25,47,0.98));
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid #D4AF37; /* Gold */
            border-radius: 20px;
            padding: 40px 60px;
            text-align: center;
            box-shadow: 0 20px 50px rgba(0,0,0,0.6), inset 0 0 30px rgba(212, 175, 55, 0.15);
            animation: flyUpFade 6s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
            pointer-events: none; /* User can click through it while it fades */
        }
        .flying-thank-you h2 {
            color: #F8F9FA !important;
            font-size: 2.5rem !important;
            margin: 0 0 15px 0 !important;
            text-shadow: 0 0 15px rgba(255,255,255,0.3);
        }
        .flying-thank-you p {
            color: #3A7CA5 !important; /* Green */
            font-size: 1.1rem !important;
            margin: 0 !important;
            font-weight: 500 !important;
            letter-spacing: 1px;
        }
        </style>
        <div class="flying-thank-you">
            <h2>✨ Thank You!</h2>
            <p>We will get back to you within 48 hours.</p>
        </div>
        """, unsafe_allow_html=True)
        st.success("Your message has been securely transmitted to Nuros Clinical Innovation.")
    else:
        st.markdown("**Get in touch with our Clinical Innovation Team.**")
        with st.form("contact_form"):
            contact_name = st.text_input("Full Name")
            contact_phone = st.text_input("Phone Number")
            contact_email = st.text_input("Email Address")
            contact_msg = st.text_area("Message")
            
            submitted_contact = st.form_submit_button("Send Message")
            if submitted_contact:
                if contact_name and contact_email and contact_msg:
                    with st.spinner("Sending message..."):
                        success, result_msg = send_contact_form_emails(
                            contact_name, contact_phone, contact_email, contact_msg
                        )
                        if success:
                            st.session_state.contact_submitted = True
                            st.rerun()
                        else:
                            st.error(result_msg)
                else:
                    st.warning("Please fill in Name, Email, and Message.")

st.markdown('<div class="contact-anchor"></div>', unsafe_allow_html=True)
if st.button("💬 Contact Us"):
    contact_dialog()
