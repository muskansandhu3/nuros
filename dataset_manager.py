import csv
import os
import hashlib
from datetime import datetime

DATASET_FILE = "validation_dataset.csv"

def initialize_dataset():
    if not os.path.exists(DATASET_FILE):
        with open(DATASET_FILE, mode='w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([
                "timestamp",
                "vocal_twin_hash",
                "age_normalized",
                "gender",
                "task_type",
                "jitter",
                "shimmer",
                "hnr",
                "f0_std",
                "f1_mean",
                "f2_mean",
                "spectral_centroid",
                "cpp",
                "snr_db",
                "calibrated_score",
                "clinical_label" # To be filled later by researchers
            ])

def store_anonymized_features(features, quality_metrics, ensemble_results, demographic_data):
    """
    Stores strictly anonymized acoustic features to the CSV.
    No raw audio is stored. PII is stripped.
    """
    initialize_dataset()
    
    # Hash demographics to track longitudinal changes without PII
    salt = "nuros_research_2026"
    raw_id = f"{demographic_data.get('email', '')}{demographic_data.get('name', '')}{salt}"
    patient_hash = hashlib.sha256(raw_id.encode()).hexdigest()[:16]
    
    age = demographic_data.get('age', 30)
    # Basic normalization: standardizing age
    age_normalized = (int(age) - 40) / 15.0 

    row = [
        datetime.utcnow().isoformat(),
        patient_hash,
        age_normalized,
        demographic_data.get('gender', 'Unknown'),
        demographic_data.get('task_type', 'Free Speech'),
        features.get("jitter_percent", 0.0),
        features.get("shimmer_percent", 0.0),
        features.get("hnr_db", 0.0),
        features.get("f0_std", 0.0),
        features.get("f1_mean", 0.0),
        features.get("f2_mean", 0.0),
        features.get("spectral_centroid", 0.0),
        features.get("cpp", 0.0),
        quality_metrics.get("snr_db", 0.0) if quality_metrics else 0.0,
        ensemble_results.get("calibrated_score", 0.0) if ensemble_results else 0.0,
        "PENDING_VALIDATION"
    ]
    
    with open(DATASET_FILE, mode='a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(row)
        
    return True
