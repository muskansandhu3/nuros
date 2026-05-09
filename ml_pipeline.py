import numpy as np
from sklearn.ensemble import VotingClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neural_network import MLPClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.preprocessing import StandardScaler
import joblib
import os

class NurosEnsemblePipeline:
    def __init__(self):
        self.scaler = StandardScaler()
        
        # 1. Gradient Boosting (Robust non-linear)
        self.xgb = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42)
        
        # 2. Logistic Regression (Linear baseline, stable)
        self.lr = LogisticRegression(max_iter=1000, random_state=42)
        
        # 3. Neural Network (Captures complex feature interactions)
        self.nn = MLPClassifier(hidden_layer_sizes=(64, 32), max_iter=500, alpha=0.01, random_state=42)
        
        # Voting Ensemble
        self.ensemble = VotingClassifier(
            estimators=[('xgb', self.xgb), ('lr', self.lr), ('nn', self.nn)],
            voting='soft'
        )
        
        # Calibration Layer (Isotonic or Sigmoid/Platt Scaling)
        # Using sigmoid for smoother probability distributions across confidence bands
        self.calibrated_model = CalibratedClassifierCV(self.ensemble, method='sigmoid', cv=3)
        
        self.is_trained = False
        
        # Mapping for mock deep learning embeddings
        self.dl_mock_enabled = True

    def get_wav2vec_embeddings(self, audio_path):
        """
        Extracts deep learning embeddings.
        Currently MOCKED to prevent downloading heavy multi-GB HuggingFace models locally.
        In production, this would use: `transformers.Wav2Vec2Processor` and `Wav2Vec2Model`.
        """
        # Returns a mock 128-dimensional embedding vector representing the pooled hidden states
        np.random.seed(hash(audio_path) % 2**32)
        return np.random.normal(loc=0.0, scale=0.1, size=(128,))

    def combine_features(self, acoustic_features, dl_embeddings):
        """
        Fuses handcrafted acoustic features (jitter, shimmer, MFCCs) with DL embeddings.
        """
        # Extract numerical values from the acoustic features dict
        core_features = [
            acoustic_features.get("jitter_percent", 0.5),
            acoustic_features.get("shimmer_percent", 2.0),
            acoustic_features.get("hnr_db", 20.0),
            acoustic_features.get("f0_std", 15.0),
            acoustic_features.get("f1_mean", 500.0),
            acoustic_features.get("f2_mean", 1500.0),
            acoustic_features.get("spectral_centroid", 1000.0),
            acoustic_features.get("zcr", 0.05),
            acoustic_features.get("cpp", 15.0)
        ]
        
        # Add MFCC mean array if available
        mfccs = acoustic_features.get("mfcc_mean", np.zeros(13).tolist())
        core_features.extend(mfccs)
        
        # Concatenate with DL embeddings
        fused_vector = np.concatenate([core_features, dl_embeddings])
        return fused_vector

    def train_mock_model(self):
        """
        Trains the ensemble on a mock dataset so it can be used for predictions.
        """
        print("Training Nuros Ensemble Pipeline...")
        # Generate dummy dataset with 150 features (22 acoustic + 128 embedding)
        X_train = np.random.rand(100, 150)
        # Binary target: 0 = Healthy/Normal, 1 = Elevated Risk Signal
        y_train = np.random.randint(0, 2, 100)
        
        X_scaled = self.scaler.fit_transform(X_train)
        self.calibrated_model.fit(X_scaled, y_train)
        self.is_trained = True
        print("Ensemble calibrated and ready.")

    def predict_signal(self, acoustic_features, audio_path):
        """
        Returns a calibrated score (0-100), uncertainty interval, and top features.
        """
        if not self.is_trained:
            self.train_mock_model()

        dl_embeddings = self.get_wav2vec_embeddings(audio_path)
        fused_vector = self.combine_features(acoustic_features, dl_embeddings)
        
        # Reshape for prediction
        X = fused_vector.reshape(1, -1)
        X_scaled = self.scaler.transform(X)
        
        # Calibrated Probability
        prob = self.calibrated_model.predict_proba(X_scaled)[0][1]
        calibrated_score = prob * 100
        
        # Uncertainty Estimation (variance across the ensemble estimators)
        # We access the underlying fitted ensemble to get individual predictions
        ensemble_model = self.calibrated_model.calibrated_classifiers_[0].estimator
        preds = []
        for name, estimator in ensemble_model.named_estimators_.items():
            # Using predict_proba if available
            preds.append(estimator.predict_proba(X_scaled)[0][1])
            
        variance = np.var(preds)
        
        if variance < 0.01:
            confidence = "High Confidence"
        elif variance < 0.05:
            confidence = "Medium Confidence"
        else:
            confidence = "Low Confidence (High Uncertainty)"

        # Mock SHAP explainability
        top_features = ["Jitter (Micro-Tremor)", "F0 Variance (Prosody)", "MFCC_2 (Vocal Tract Shape)"]
        
        return {
            "calibrated_score": float(calibrated_score),
            "uncertainty_variance": float(variance),
            "confidence_band": confidence,
            "top_contributing_features": top_features
        }

# Singleton instance
pipeline = NurosEnsemblePipeline()
