import numpy as np
import librosa

def validate_audio_quality(audio_path):
    """
    Validates audio recording quality before processing.
    Checks SNR, clipping, and Voice Activity (VAD).
    """
    try:
        y, sr = librosa.load(audio_path, sr=48000)
    except Exception as e:
        return {"is_valid": False, "error": "Could not load audio file."}

    # 1. Check for silence / Voice Activity (VAD proxy)
    # If the root mean square energy is extremely low, it's silence.
    rms = librosa.feature.rms(y=y)[0]
    mean_rms = np.mean(rms)
    if mean_rms < 0.001:
        return {"is_valid": False, "error": "Audio is too quiet or mostly silence. Please speak closer to the microphone."}

    # 2. Clipping Detection
    # If amplitude reaches maximum digital limit (close to 1.0 or -1.0) consistently
    clipping_threshold = 0.99
    clipped_samples = np.sum(np.abs(y) >= clipping_threshold)
    clip_percentage = clipped_samples / len(y)
    if clip_percentage > 0.05:
        return {"is_valid": False, "error": "Audio is distorted/clipped. Please move slightly further from the microphone."}

    # 3. SNR (Signal-to-Noise Ratio) Estimation
    # Very basic estimation: 95th percentile energy vs 5th percentile energy
    signal_energy = np.percentile(rms, 95)
    noise_energy = np.percentile(rms, 5)
    
    # Avoid division by zero
    if noise_energy < 1e-6:
        noise_energy = 1e-6
        
    snr_estimated = 20 * np.log10(signal_energy / noise_energy)
    
    if snr_estimated < 10.0:
        return {"is_valid": False, "error": "Background noise is too high. Please record in a quieter environment."}

    return {
        "is_valid": True,
        "metrics": {
            "mean_rms": float(mean_rms),
            "clip_percentage": float(clip_percentage),
            "snr_db": float(snr_estimated),
            "duration_sec": float(len(y) / sr)
        }
    }
