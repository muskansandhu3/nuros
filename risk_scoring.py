import random
from womens_health import analyze_womens_health
from ml_pipeline import pipeline

def calculate_risk(features, audio_path="mock.wav", mode="public"):
    """
    Evaluates acoustic biomarkers using the Deep Learning Ensemble.
    Outputs safe 'Wellness Signals' for public, or 'Clinical Categories' for research mode.
    Strictly forbids disease probability percentages.
    """
    # 1. Run through the ML Ensemble Pipeline
    ensemble_results = pipeline.predict_signal(features, audio_path)
    calibrated_score = ensemble_results["calibrated_score"]
    confidence = ensemble_results["confidence_band"]
    top_features = ensemble_results["top_contributing_features"]
    
    # Extract core features for heuristic mapping to signal categories
    jitter = features.get("jitter_percent", 0.0)
    shimmer = features.get("shimmer_percent", 0.0)
    hnr = features.get("hnr_db", 0.0)
    f0_std = features.get("f0_std", 0.0)
    cpp = features.get("cpp", 15.0)

    # 2. Build Safe Output System
    results = {}
    explanations = {}
    
    if mode == "public":
        # Public Mode: Show Wellness Signals Only
        results["Voice Energy"] = "Low" if f0_std < 10 else ("Elevated" if f0_std > 30 else "Balanced")
        explanations["Voice Energy"] = "Indicates overall vocal energy level."
        
        results["Stress & Tension"] = "High" if jitter > 1.5 else ("Moderate" if jitter > 1.0 else "Low")
        explanations["Stress & Tension"] = "Based on tone variation and vocal tightness."
        
        results["Breath Stability"] = "Irregular" if hnr < 12 else ("Mild Variation" if hnr < 15 else "Stable")
        explanations["Breath Stability"] = "Reflects breathing consistency in speech."
        
        results["Speech Rhythm"] = "Frequent Pauses" if cpp < 12 else "Smooth"
        explanations["Speech Rhythm"] = "Measures flow and pause patterns."
        
        results["Vocal Strain"] = "High" if shimmer > 4.0 else ("Moderate" if shimmer > 3.0 else "Low")
        explanations["Vocal Strain"] = "Indicates vocal effort or tension."
        
    else:
        # Clinical Research Mode: Signal Categories (Not Diagnoses)
        results["Neuromotor Signal"] = "Flagged" if jitter > 1.04 or shimmer > 3.81 else "Nominal"
        explanations["Neuromotor Signal"] = f"Micro-tremor instability detected via Jitter/Shimmer."
        
        results["Respiratory Flow Signal"] = "Flagged" if hnr < 12.0 else "Nominal"
        explanations["Respiratory Flow Signal"] = f"Airflow efficiency and glottal closure patterns."
        
        results["Affective/Prosodic Signal"] = "Flagged" if f0_std < 10.0 or f0_std > 40.0 else "Nominal"
        explanations["Affective/Prosodic Signal"] = f"Pitch variance indicates flat or hyper-aroused states."
        
        results["Metabolic/Formant Signal"] = "Flagged" if features.get("f1_mean", 500) < 400 else "Nominal"
        explanations["Metabolic/Formant Signal"] = f"Vocal tract resonance shape mapping to muscular tonality."
    
    # 3. Explainability Layer
    explainability = {
        "score_interpretation": f"Calibrated Signal Score: {calibrated_score:.1f}/100",
        "confidence": confidence,
        "primary_drivers": top_features,
        "disclaimer": "This system provides voice-based signals for research and wellness purposes. It does not diagnose or treat medical conditions."
    }

    return {
        "stability_score": round(100 - calibrated_score, 1), # Inverse for UI (100 = stable)
        "disease_risks": results, # Keeping key name for backward compatibility, but holds safe signals
        "explanations": explanations,
        "explainability_metrics": explainability
    }

def calculate_longitudinal_delta(current_features, baseline_features):
    """
    Longitudinal tracking and change detection over time.
    """
    if not baseline_features:
        return {"alert": False, "message": "Baseline established. Insufficient longitudinal data for delta comparison."}
        
    curr_jitter = current_features.get("jitter_percent", 0.0)
    base_jitter = baseline_features.get("jitter_percent", 0.0)
    
    jitter_delta = (curr_jitter - base_jitter) / base_jitter if base_jitter > 0 else 0
    
    if jitter_delta > 0.15: 
        return {
            "alert": True, 
            "message": f"Longitudinal Tracking: Detects >15% degradation in glottal stability (Jitter Delta: +{jitter_delta*100:.1f}%)."
        }
        
    return {"alert": False, "message": "Longitudinal Tracking: Micro-fluctuations within nominal limits."}
