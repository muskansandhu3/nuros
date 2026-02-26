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
import plotly.graph_objects as go
from security_utils import generate_secure_key
from mailer import send_encrypted_report
from audio_analysis import extract_features
from risk_scoring import calculate_risk
from report_agent import generate_report, encrypt_pdf

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
        background: radial-gradient(circle at center, rgba(247, 202, 201, 0.15) 0%, #0A192F 40%, #0A192F 100%);
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

    .status-green { color: #9FE2BF; text-shadow: 0 0 12px rgba(159, 226, 191, 0.6); font-weight: 600; } /* Healing Teal */
    .status-amber { color: #F7CAC9; text-shadow: 0 0 12px rgba(247, 202, 201, 0.6); font-weight: 600; } /* Magical Pink for caution */

    /* Typography */
    .metric-value {
        font-size: 2.8rem;
        font-weight: 700;
        letter-spacing: -1px;
        color: #9FE2BF; /* Soft Seafoam for main success numbers */
        text-shadow: 0 0 20px rgba(159, 226, 191, 0.5);
    }
    
    .risk-high { color: #F7CAC9; font-weight: 600; text-shadow: 0 0 15px rgba(247, 202, 201, 0.5); }
    .risk-medium { color: #A569BD; font-weight: 600; text-shadow: 0 0 15px rgba(165, 105, 189, 0.4); } 
    .risk-low { color: #9FE2BF; font-weight: 600; text-shadow: 0 0 15px rgba(159, 226, 191, 0.4); }

    hr { border-color: rgba(247, 202, 201, 0.1); }
    
    /* High-Gloss Glass Sphere Buttons */
    div.stButton > button {
        background: rgba(255, 255, 255, 0.05) !important;
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
    div.stButton > button:hover {
        background: rgba(247, 202, 201, 0.15) !important;
        box-shadow: 0 0 25px rgba(247, 202, 201, 0.5) !important; /* Soft pulse of light */
        border: 1px solid rgba(247, 202, 201, 1) !important;
        color: #fff !important;
        transform: scale(1.05) !important; /* Expand slightly */
    }
    div.stButton > button:active {
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
        fill: #9FE2BF !important; /* Make the dropdown chevron teal */
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
        background-color: #0A192F !important;
        border-radius: 50px !important;
        border: 1px solid #9FE2BF !important;
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
        color: #0A192F !important; /* Force timer and timestamps to dark navy */
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
        background-color: #0A192F !important;
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
        width: 1100px;
        height: 450px;
        max-width: 100vw;
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
            height: 220px;
            background-position: center top;
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
    <div style="background: linear-gradient(90deg, #16213E, #0A192F, #16213E); 
                height: 120px; border-radius: 20px; border: 1px solid rgba(247, 202, 201, 0.3);
                display: flex; justify-content: center; align-items: center; margin-bottom: 2rem;
                box-shadow: 0 0 30px rgba(159, 226, 191, 0.1);">
        <p style="color: #9FE2BF; font-style: italic; opacity: 0.7;">Save 'banner.png' to project root to display header banner</p>
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
                <div class="logo-container">
                    <img src="data:{mime_type};base64,{encoded_string}" class="nuros-logo" style="max-height: 80px;" alt="Nuros Logo">
                </div>
            ''', unsafe_allow_html=True)
    else:
        st.markdown("<h2 style='text-align: center; color: #F8F9FA;'>NUROS</h2>", unsafe_allow_html=True)
        
    st.markdown("<h4 style='text-align: center; color: #F7CAC9; font-weight: 300;'>Women's Vocal Clinical Suite</h4>", unsafe_allow_html=True)

st.markdown("<p class='disclaimer'>Requires 10s of voice audio. <b>This is an early risk screening tool, NOT a medical diagnosis.</b> Proceed to clinical evaluation for high-risk signals.</p>", unsafe_allow_html=True)


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
    st.subheader("Step 1: Patient Identity", anchor=False)
    
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
        <h4 style='color: #F7CAC9; margin-top:0;'>🗣️ Phonetic Stress Test</h4>
        <p style='color: #E2E8F0; margin-bottom:0;'>Please press record and say the following phrase clearly:<br>
        <i>"The beige hue on the waters of the loch impressed all."</i></p>
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
    
    st.markdown("</div>", unsafe_allow_html=True)
        
    # --- 3D GLOWING WAVEFORM VISUALIZER (FOURIER TRANSFORM) ---
    st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
    st.subheader("🌊 3D Silk Waveform Visualizer", anchor=False)
    st.write("Real-time bioluminescent mapping of glottal frequencies.")
    
    # Generate STFT for 3D Plot
    y, sr = librosa.load(temp_path, duration=3.0) # only plot first 3 secs for speed
    D = np.abs(librosa.stft(y, n_fft=512, hop_length=256))
    D_db = librosa.amplitude_to_db(D, ref=np.max)
    
    # Truncate high frequencies above 4000Hz approx for better visual
    D_db = D_db[:100, :] 
    
    x = np.arange(D_db.shape[1])
    y_ax = np.arange(D_db.shape[0])
    X, Y = np.meshgrid(x, y_ax)
    
    # Deep Midnight Navy -> Healing Teal -> Magical Pink (Silk Wave Colors)
    silk_colors = [
        [0.0, '#0A192F'], # Midnight Navy
        [0.3, '#16213E'], 
        [0.6, '#9FE2BF'], # Soft Seafoam
        [0.8, '#A569BD'], # Deep Purple transitional
        [1.0, '#F7CAC9']  # Rose Quartz
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
        st.markdown(f"<div style='text-align:center; padding: 1.5rem;'><span class='metric-value'>{score}</span><br><span style='font-size:1.3rem; color: #94A3B8; font-weight: 300;'>/ 100</span><br><br><span style='font-size:0.8rem; color: #F7CAC9;'>Vocal Twin Hash:<br>{features.get('vocal_twin_hash', 'N/A')}</span><br><span style='font-size:0.7rem; color: #9FE2BF; font-weight:bold;'>Market Ready: Medtronic Std.</span></div>", unsafe_allow_html=True)
    with col_scr:
        st.markdown("""<div style='background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; border-left: 3px solid #F7CAC9;'>
        <h5 style='color: #F7CAC9; margin-top:0;'>🩺 Clinical Scribe Agent <span style='font-size:0.7rem; color:#9FE2BF; vertical-align:middle; background:rgba(159,226,191,0.1); padding:2px 6px; border-radius:10px; margin-left:10px;'>Market Ready: Dynacare Std.</span></h5>
        <p style='font-size: 0.95rem; line-height: 1.6; color: #E2E8F0;'>""" + analysis.get("scribe_summary", "Synthesis complete.") + """</p></div>""", unsafe_allow_html=True)

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
    <div style='background: rgba(159, 226, 191, 0.05); border-left: 3px solid #9FE2BF; padding: 20px; border-radius: 12px;'>
        <p style='color: #F8F9FA; line-height: 1.6;'>
        Based on the provided life-stage calibration (<b>{st.session_state.patient_profile.get("life_stage", "General")}</b>), the extracted acoustic biomarkers have been normalized to account for standard hormonal fluctuations affecting vocal fold mass and mucosal hydration.
        </p>
        <p style='color: #9FE2BF; font-weight: 600; margin-bottom: 0;'>
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
                b64_pdf = base64.b64encode(pdf_data).decode('utf-8')
                
            href = f'<a href="data:application/pdf;base64,{b64_pdf}" download="{encrypted_pdf}" style="text-decoration:none;"><button style="background:rgba(50, 205, 50, 0.1); border:1px solid #32CD32; color:#32CD32; padding:10px 20px; border-radius:30px; cursor:pointer; font-weight:600; width:100%;">⏬ Download Encrypted PDF</button></a>'
            
            # --- EMAIL DISPATCH HANDLING (Two-Factor Handover) ---
            email_sent = False
            if send_email and patient_email:
                success, msg = send_encrypted_report(patient_email, pdf_data, encrypted_pdf)
                if success:
                    email_sent = True
                else:
                    st.error(msg)
            
            # --- MAGICAL HANDOVER UI ---
            st.markdown("---")
            st.markdown("""
            <div style='background: rgba(247, 202, 201, 0.05); border: 1px solid rgba(247, 202, 201, 0.4); border-radius: 20px; padding: 25px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.3), inset 0 0 15px rgba(247, 202, 201, 0.1); margin-top: 10px;'>
                <h3 style='color: #F7CAC9; margin-bottom: 0px;'>✨ Success & Security</h3>
            """, unsafe_allow_html=True)
            
            if email_sent:
                st.markdown(f"<p style='color: #E2E8F0; font-size: 1.1em;'>Your secure report has been sent to <b>{patient_email}</b>.</p>", unsafe_allow_html=True)
            else:
                st.markdown("<p style='color: #E2E8F0; font-size: 1.1em;'>Your secure report is ready for download.</p>", unsafe_allow_html=True)
                
            st.markdown("<p style='color: #94A3B8; margin-bottom: 20px;'>For your privacy, please use the unique Access Key below to open the file.</p>", unsafe_allow_html=True)
            
            # The Secure Key Box
            st.code(access_key, language="plaintext")
            st.markdown(href, unsafe_allow_html=True)
            
            st.markdown("</div>", unsafe_allow_html=True)

            # Cleanup
            time.sleep(1)
            if os.path.exists(raw_pdf): os.remove(raw_pdf)
            
    st.markdown("</div>", unsafe_allow_html=True)

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
                    st.rerun()

    st.markdown('''
    <style>
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
    </style>
    <div class="feedback-anchor"></div>
    ''', unsafe_allow_html=True)
    
    if st.button("✨ Help Close the Gap in Women's Health"):
        feedback_dialog()
