# Nuros: Vocal Biomarker Clinical AI Engine

## 1. Executive Summary & Product Vision
**Nuros** is an agentic AI voice-analysis platform designed to capture 10 seconds of a patient's voice and provide early risk signals for major neurological and systemic diseases using vocal biomarkers. 

It functions both as a standalone web application and an easily embeddable widget for third-party telehealth platforms, clinic portals, and hospital websites. Nuros aims to deliver Apple-level polish, FDA-grade seriousness, and enterprise trust.

**Disclosures / Legal:** Nuros provides *early risk screening*. It is explicitly *not a medical diagnosis tool*.

---

## 2. System Architecture

### 2.1 Frontend Architecture
*   **Stand-alone App:** Streamlit-based web application with a glassmorphic aesthetic, custom CSS injections for a premium Midnight Blue (`#0A192F`) and Bio-Lime (`#32CD32`) design, and responsive layout.
*   **Embeddable Widget:** A lightweight, vanilla JavaScript file (`nuros_embed.js`) that creates a floating portal (iframe) on any HTML site.
*   **Patient Interface:** Clear, accessible, one-button 10-second audio capture with a dynamic pulsing waveform (Visual Feedback Loop).
*   **Clinical Dashboard:** A visualization panel translating complex phonetic data into simple "Vocal Stability Scores."

### 2.2 Backend Architecture & Audio Pipeline
*   **Audio Ingestion:** RESTful/Streamlit native ingestion handling `WAV`/`MP3` in-memory processing.
*   **Preprocessing:** Background noise reduction and normalization using `librosa`.
*   **Feature Extraction Processing:**
    *   **Jitter (Frequency Variation):** Utilizing Praat (`parselmouth`).
    *   **Shimmer (Amplitude Variation):** Utilizing Praat.
    *   **Harmonic-to-Noise Ratio (HNR):** Utilizing Praat.
    *   **MFCCs (Mel-frequency cepstral coefficients):** Utilizing `librosa`.
    *   **Prosodic Range (F0 standard deviation):** Calculating pitch variability.

### 2.3 AI & Multi-Model Inference Layer (Mock / Future Design)
*   The current v1 prototype uses precision-based clinical heuristics. The final architecture requires an Ensemble Architecture:
    *   **Random Forest / XGBoost:** For tabular phonetic features (Jitter, Shimmer, HNR).
    *   **CNN/Transformers:** For spectrogram/MFCC analysis.
*   **Confidence Calibration Layer:** Models output not just a prediction but a confidence probability distribution (e.g., "85% confidence based on lack of background noise").

### 2.4 Agentic Behavior
*   **Reporting Agent:** Automatically collates feature data and AI outputs to generate a highly formatted, simple English PDF.
*   **Explainable AI Engine:** Translates standard deviations and percentages into human-readable insights (e.g., "Elevated pitch variability combined with micro-instability suggests potential respiratory strain").
*   **Quality Control (Planned):** An agent evaluating the SNR (Signal-to-Noise Ratio) and requesting a re-record if the audio is poor.

### 2.5 Security & Infrastructure
*   **In-Memory Processing:** Audio is processed in RAM and explicitly deleted post-inference.
*   **HIPAA / PIPEDA Architecture:** Patient identifiers are completely decoupled from biomarker data.
*   **AES-256 Storage:** Any persisted text data (like PDF logs) are encrypted with symmetric keys via `cryptography.fernet`.

---

## 3. Disease Specificity Matrix

| Disease Target | Primary Biomarker Focus | Threshold / Indicator | Explainable Output |
| :--- | :--- | :--- | :--- |
| **Parkinson's Disease** | Micro-Tremor Index (Jitter) | > 1.04% | "Micro-Tremor Index indicates subtle vocal fold instability." |
| **Alzheimer's / MCI** | Phonatory Flow (HNR) | < 15.0 dB | "Increased noise in speech signal often associated with cognitive pausing." |
| **Depression** | Prosodic Range (F0 Std Dev) | < 10.0 Hz | "Restricted dynamic range ('Flat' prosody) detected." |
| **Huntington's Disease** | Dysarthria (Shimmer) | > 3.81% | "Vocal intensity variation suggesting potential dysarthria." |
| **Chronic Anxiety** | Neuromuscular Tension | High F0 + High Jitter | "Elevated pitch variability with micro-instability suggests strain." |

---

## 4. Multi-Phase Roadmap

### Phase 1: MVP & Prototyping (Current Status)
*   **Goal:** Establish baseline functionality and UX.
*   **Features:** Streamlit local app, basic Jitter/Shimmer extraction, rule-based inference, PDF generation, basic iframe widget script.
*   **Tech Stack:** Python, Streamlit, Librosa, Parselmouth, FPDF2.
*   **Outcome:** A demonstrable working concept for angel investors or grant judges.

### Phase 2: Clinical-Grade Beta
*   **Goal:** Replace rule-based logic with actual ML models trained on clinical datasets.
*   **Features:** Integration of UCI Parkinson’s Dataset models. Cloud API deployment (AWS/GCP). Audio quality detection agent.
*   **Tech Stack:** FastAPI, PyTorch/Scikit-Learn, Docker.
*   **Compliance:** Initial HIPAA gap assessment. Start SOC2 prep.

### Phase 3: Enterprise Rollout
*   **Goal:** Scalable B2B SaaS architecture.
*   **Features:** White-labeled widget styling, multi-tenant clinic dashboards, EHR/FHIR integration (Epic/Cerner smart-on-FHIR apps), long-term patient trend tracking graphs.
*   **Tech Stack:** Next.js Frontend, Node/Python microservices, scalable Postgres DB, Kubernetes.
*   **Compliance:** Full HIPAA/GDPR compliance. Security audits.

### Phase 4: AI Optimization & Regulatory Readiness
*   **Goal:** FDA Software as a Medical Device (SaMD) pre-submission.
*   **Features:** Ensemble deep learning models, bias/fairness auditing tools, federated learning capabilities for hospital partners.
*   **Regulatory:** Submit data for FDA De Novo or 510(k) pathway (for specific diagnostic claims).

### Phase 5: Marketplace + API ecosystem
*   **Goal:** Become the "Plaid for Voice Health."
*   **Features:** Public developer API. SDKs for iOS/Android. Integration into smartwatch apps or smart home devices.

---

## 5. Business & Monetization Model (B2B SaaS)

Nuros utilizes a multi-tiered B2B SaaS model targeting healthcare providers, telehealth startups, and research institutions.

### 5.1 Clinic "Widget" Licensing (SMB)
*   Target: Independent therapists, dentists, boutique clinics.
*   Pricing: **$199 / month** / clinic.
*   Includes: Easy `nuros_embed.js` installation, 500 scans/month, standard Nuros branding, PDF reports.

### 5.2 Enterprise Telehealth API
*   Target: Large telehealth networks (e.g., Teladoc, BetterHelp).
*   Pricing: **Volume-based / API calls** (e.g., $0.15 per inference).
*   Includes: Direct REST API access, raw data streams, SLA guarantees, white-labeling capable.

### 5.3 White-Label / Hospital Contracts
*   Target: Major Hospital Networks.
*   Pricing: **$50,000+ Annual Contract Value (ACV)**.
*   Includes: Full Epic/Cerner EHR integration, dedicated HIPAA-compliant tenant servers, custom model fine-tuning based on their patient demographics, on-premise installation options.
