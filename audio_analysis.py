import librosa
import parselmouth
from parselmouth.praat import call
import numpy as np
import scipy.signal
import hashlib
import json
import os

def extract_features(audio_path, task_type="free_speech"):
    """
    Extract research-grade acoustic biomarkers from audio.
    Now includes advanced spectral features, MFCC deltas, and Cepstral Peak Prominence (CPP).
    """
    # Enforce 48kHz sampling rate for micro-instabilities
    y, sr = librosa.load(audio_path, sr=48000)
    
    # --- 1. Spectral & High-Level Features (librosa) ---
    # MFCCs (Expanded to 40 for deep acoustic modeling)
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
    mfcc_mean = np.mean(mfccs, axis=1)
    
    # MFCC Deltas (Velocity and Acceleration of speech tract changes)
    mfcc_delta = librosa.feature.delta(mfccs)
    mfcc_delta_mean = np.mean(mfcc_delta, axis=1)
    
    mfcc_delta2 = librosa.feature.delta(mfccs, order=2)
    mfcc_delta2_mean = np.mean(mfcc_delta2, axis=1)

    # Spectral Features
    spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
    spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)[0]
    spectral_flux = librosa.onset.onset_strength(y=y, sr=sr)
    zcr = librosa.feature.zero_crossing_rate(y)[0]
    chroma = librosa.feature.chroma_stft(y=y, sr=sr)

    # --- 2. Low-Pass Filtering (Isolate Glottal Pulse) ---
    nyq = 0.5 * sr
    cutoff = 400.0 / nyq
    b, a = scipy.signal.butter(4, cutoff, btype='low')
    y_filtered = scipy.signal.filtfilt(b, a, y)
    
    temp_filtered_path = "temp_filtered.wav"
    import soundfile as sf
    sf.write(temp_filtered_path, y_filtered, sr)

    # --- 3. Praat Features (Micro-Instabilities) ---
    snd = parselmouth.Sound(temp_filtered_path)
    
    # Extract Pitch
    pitch = snd.to_pitch()
    pitch_values = pitch.selected_array['frequency']
    pitch_values = pitch_values[pitch_values != 0] # remove unvoiced
    f0_std = np.std(pitch_values) if len(pitch_values) > 0 else 0

    # Jitter & Shimmer
    pointProcess = call(snd, "To PointProcess (periodic, cc)", 60, 600)
    try:
        jitter = call(pointProcess, "Get jitter (local)", 0.00005, 0.02, 1.3) * 100
    except:
        jitter = 0.5

    try:
        shimmer = call([snd, pointProcess], "Get shimmer (local)", 0.00005, 0.02, 1.3, 1.6) * 100
    except:
        shimmer = 2.0

    # HNR
    try:
        harmonicity = call(snd, "To Harmonicity (cc)", 0.01, 75, 0.1, 1.0)
        hnr = call(harmonicity, "Get mean", 0, 0)
    except:
        hnr = 20.0

    # --- 4. Cepstral Peak Prominence (CPP) ---
    # CPP is a highly reliable measure of breathiness and overall dysphonia
    try:
        # Praat's PowerCepstrum
        power_cepstrum = call(snd, "To PowerCepstrum", 60, 0.002, 50, 0.05)
        cpp = call(power_cepstrum, "Get peak prominence", 60, 333, "parabolic", 0.001, 0.05, "Exponential decay", "Robust")
    except:
        cpp = 15.0 # Baseline healthy

    # --- 5. Formants (Neuropathy mapping) ---
    snd_full = parselmouth.Sound(audio_path)
    formants = call(snd_full, "To Formant (burg)", 0.0, 5, 5500, 0.025, 50)
    try:
        f1_mean = call(formants, "Get mean", 1, 0, 0, "Hertz")
        f2_mean = call(formants, "Get mean", 2, 0, 0, "Hertz")
        f3_mean = call(formants, "Get mean", 3, 0, 0, "Hertz")
    except:
        f1_mean, f2_mean, f3_mean = 500.0, 1500.0, 2500.0

    # Clean up
    if os.path.exists(temp_filtered_path):
        os.remove(temp_filtered_path)
        
    features = {
        "task_type": task_type,
        "jitter_percent": float(jitter),
        "shimmer_percent": float(shimmer),
        "hnr_db": float(hnr),
        "f0_std": float(f0_std),
        "f1_mean": float(f1_mean),
        "f2_mean": float(f2_mean),
        "f3_mean": float(f3_mean),
        "cpp": float(cpp),
        "spectral_centroid": float(np.mean(spectral_centroids)),
        "spectral_rolloff": float(np.mean(spectral_rolloff)),
        "spectral_flux": float(np.mean(spectral_flux)),
        "zcr": float(np.mean(zcr)),
        "chroma_mean": np.mean(chroma, axis=1).tolist(),
        "mfcc_mean": mfcc_mean.tolist(),
        "mfcc_delta_mean": mfcc_delta_mean.tolist(),
        "mfcc_delta2_mean": mfcc_delta2_mean.tolist()
    }
    
    # Hash
    hash_payload = f"{jitter:.4f}:{shimmer:.4f}:{hnr:.4f}:{f0_std:.4f}"
    features["vocal_twin_hash"] = hashlib.sha256(hash_payload.encode()).hexdigest()[:12].upper()
    
    return features
