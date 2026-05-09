export interface Clinic {
  id: string;
  clinic_name: string;
  clinic_slug: string;
  clinic_type: string;
  location: string;
  admin_name: string;
  admin_email: string;
  phone: string;
  pilot_status: 'pending' | 'approved' | 'active';
  created_at: string;
}

export interface Patient {
  id: string;
  clinic_id: string;
  display_name: string;
  queue_number: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  reason_for_visit?: string;
  consent_given: boolean;
  created_at: string;
}

export interface VoiceScan {
  id: string;
  clinic_id: string;
  patient_id: string;
  risk_level: 'Low' | 'Moderate' | 'Elevated';
  recording_quality: 'Excellent' | 'Good' | 'Needs Review';
  
  signals: {
     voice_energy: { status: string, confidence: number, contributors: string, explanation: string };
     stress_tension: { status: string, confidence: number, contributors: string, explanation: string };
     breath_stability: { status: string, confidence: number, contributors: string, explanation: string };
     speech_rhythm: { status: string, confidence: number, contributors: string, explanation: string };
     vocal_strain: { status: string, confidence: number, contributors: string, explanation: string };
     pause_frequency: { status: string, confidence: number, contributors: string, explanation: string };
     tremor_pattern: { status: string, confidence: number, contributors: string, explanation: string };
     breathiness: { status: string, confidence: number, contributors: string, explanation: string };
  };
  
  research_signals: {
     neurological: { status: 'Low' | 'Moderate' | 'Elevated', label: string };
     respiratory: { status: 'Low' | 'Moderate' | 'Elevated', label: string };
     emotional: { status: 'Low' | 'Moderate' | 'Elevated', label: string };
     metabolic: { status: 'Low' | 'Moderate' | 'Elevated', label: string };
     pathology: { status: 'Low' | 'Moderate' | 'Elevated', label: string };
  };
  
  agents: {
     summary: string;
     follow_up: 'No follow-up needed' | 'Monitor' | 'Follow-up recommended' | 'Urgent provider review recommended';
     patient_comm: string;
  };
  
  suggested_review_prompts: string[];
  raw_audio_stored: boolean;
  audio_length: string;
  created_at: string;
}

const DEMO_CLINIC: Clinic = {
  id: "clinic_demo_123",
  clinic_name: "Nuros Pilot Clinic",
  clinic_slug: "nuros-pilot",
  clinic_type: "walk-in",
  location: "Toronto, ON",
  admin_name: "Dr. Sarah Jenkins",
  admin_email: "demo@nuroshealth.ca",
  phone: "555-0199",
  pilot_status: "active",
  created_at: new Date().toISOString()
};

const DEMO_PATIENTS: Patient[] = [
  { id: '40192-NR', clinic_id: 'clinic_demo_123', display_name: 'James Morrison', queue_number: 'Q-01', age: 49, gender: 'Male', reason_for_visit: 'Chest pain', consent_given: true, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: '21094-NR', clinic_id: 'clinic_demo_123', display_name: 'Elena Rostova', queue_number: 'Q-02', age: 35, gender: 'Female', reason_for_visit: 'Fatigue and anxiety', consent_given: true, created_at: new Date(Date.now() - 7200000).toISOString() }
];

const mockSignals = (level: 'Low' | 'Moderate' | 'Elevated') => {
  if (level === 'Elevated') {
    return {
      voice_energy: { status: 'High', confidence: 94, contributors: 'F0 Variance, RMS', explanation: 'Acoustic energy indicates potential acute distress.' },
      stress_tension: { status: 'High', confidence: 91, contributors: 'Jitter, Shimmer', explanation: 'Micro-tremor amplitude suggests severe stress.' },
      breath_stability: { status: 'Irregular', confidence: 88, contributors: 'HNR < 10dB', explanation: 'Significant breath instability detected.' },
      speech_rhythm: { status: 'Broken', confidence: 85, contributors: 'Pause duration > 1.5s', explanation: 'Frequent abnormal pauses mapping to respiratory strain.' },
      vocal_strain: { status: 'High', confidence: 89, contributors: 'Spectral Tilt', explanation: 'Heavy glottal effort detected.' },
      pause_frequency: { status: 'High', confidence: 92, contributors: 'Silence vs Speech Ratio', explanation: 'Atypical speech flow.' },
      tremor_pattern: { status: 'Detected', confidence: 82, contributors: 'Modulation Frequency', explanation: 'Neuromuscular instability pattern.' },
      breathiness: { status: 'High', confidence: 88, contributors: 'CPP', explanation: 'Vocal folds lack complete closure.' }
    };
  }
  return {
      voice_energy: { status: 'Balanced', confidence: 95, contributors: 'F0 Variance', explanation: 'Energy is within normal baseline.' },
      stress_tension: { status: 'Moderate', confidence: 85, contributors: 'Jitter', explanation: 'Slight tone variation, normal for medical visits.' },
      breath_stability: { status: 'Stable', confidence: 90, contributors: 'HNR > 15dB', explanation: 'Smooth airflow pattern.' },
      speech_rhythm: { status: 'Smooth', confidence: 88, contributors: 'Pause duration', explanation: 'Normal prosodic rhythm.' },
      vocal_strain: { status: 'Low', confidence: 92, contributors: 'Spectral Tilt', explanation: 'No abnormal muscular tension.' },
      pause_frequency: { status: 'Nominal', confidence: 85, contributors: 'Silence Ratio', explanation: 'Standard pause pattern.' },
      tremor_pattern: { status: 'None', confidence: 95, contributors: 'Modulation', explanation: 'No tremor detected.' },
      breathiness: { status: 'Low', confidence: 91, contributors: 'CPP', explanation: 'Strong phonation.' }
  };
};

const DEMO_SCANS: VoiceScan[] = [
  {
    id: 'scan_1', clinic_id: 'clinic_demo_123', patient_id: '40192-NR', risk_level: 'Elevated', recording_quality: 'Good',
    signals: mockSignals('Elevated'),
    research_signals: {
      neurological: { status: 'Moderate', label: 'Research signal only' },
      respiratory: { status: 'Elevated', label: 'Research signal only' },
      emotional: { status: 'Moderate', label: 'Research signal only' },
      metabolic: { status: 'Low', label: 'Research signal only' },
      pathology: { status: 'Elevated', label: 'Research signal only' }
    },
    agents: {
      summary: "Patient reports chest pain. Voice signal shows severe breath instability and abnormal pause frequency. Consider asking about shortness of breath and pain level.",
      follow_up: 'Urgent provider review recommended',
      patient_comm: "Hi James, your clinic received your Nuros voice intake. Given your symptoms, please contact the clinic immediately or seek urgent care if your pain worsens."
    },
    suggested_review_prompts: ["Ask whether the patient is experiencing shortness of breath.", "Ask about pain level and treatment concerns."],
    raw_audio_stored: false, audio_length: "18s", created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'scan_2', clinic_id: 'clinic_demo_123', patient_id: '21094-NR', risk_level: 'Moderate', recording_quality: 'Excellent',
    signals: mockSignals('Moderate'),
    research_signals: {
      neurological: { status: 'Low', label: 'Research signal only' },
      respiratory: { status: 'Low', label: 'Research signal only' },
      emotional: { status: 'Elevated', label: 'Research signal only' },
      metabolic: { status: 'Moderate', label: 'Research signal only' },
      pathology: { status: 'Low', label: 'Research signal only' }
    },
    agents: {
      summary: "Patient reports fatigue and anxiety. Voice signal shows moderate tension and slightly elevated speech rhythm patterns mapping to emotional stress. Consider asking about sleep, stress triggers, and mood.",
      follow_up: 'Follow-up recommended',
      patient_comm: "Hi Elena, your clinic received your Nuros voice intake. A provider will review your signals shortly. If you are feeling overwhelmed or worse, please call the clinic."
    },
    suggested_review_prompts: ["Ask about sleep, fatigue, stress, or anxiety."],
    raw_audio_stored: false, audio_length: "20s", created_at: new Date(Date.now() - 7200000).toISOString()
  }
];

const getStorage = (key: string, defaultVal: any) => {
  if (typeof window === 'undefined') return defaultVal;
  const val = localStorage.getItem(key);
  return val ? JSON.parse(val) : defaultVal;
};

const setStorage = (key: string, val: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(val));
  }
};

export const initDb = () => {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem('nuros_clinics')) setStorage('nuros_clinics', [DEMO_CLINIC]);
  if (!localStorage.getItem('nuros_patients')) setStorage('nuros_patients', DEMO_PATIENTS);
  if (!localStorage.getItem('nuros_scans')) setStorage('nuros_scans', DEMO_SCANS);
};

export const registerClinic = (clinic: Omit<Clinic, 'id' | 'created_at' | 'clinic_slug' | 'pilot_status'>) => {
  const clinics = getStorage('nuros_clinics', []);
  const slug = clinic.clinic_name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const newClinic: Clinic = {
    ...clinic,
    id: `clinic_${Date.now()}`,
    clinic_slug: slug,
    pilot_status: 'pending',
    created_at: new Date().toISOString()
  };
  clinics.push(newClinic);
  setStorage('nuros_clinics', clinics);
  return newClinic;
};

export const getClinicBySlug = (slug: string): Clinic | null => {
  const clinics = getStorage('nuros_clinics', []);
  return clinics.find((c: Clinic) => c.clinic_slug === slug) || null;
};

export const getClinicByCode = (code: string): Clinic | null => {
  const clinics = getStorage('nuros_clinics', []);
  return clinics.find((c: Clinic) => c.id.includes(code)) || null;
};

export const addPatientIntake = (clinicId: string, patientData: Omit<Patient, 'id' | 'clinic_id' | 'created_at' | 'queue_number'>, voiceData: any) => {
  const patients = getStorage('nuros_patients', []);
  const scans = getStorage('nuros_scans', []);
  
  const patientId = `PT-${Math.floor(Math.random()*90000)+10000}`;
  
  const newPatient: Patient = {
    ...patientData,
    id: patientId,
    clinic_id: clinicId,
    queue_number: `Q-${patients.filter((p:Patient) => p.clinic_id === clinicId).length + 1}`,
    created_at: new Date().toISOString()
  };
  
  // Randomize a scan result for the demo
  const levels: ('Low'|'Moderate'|'Elevated')[] = ['Low', 'Moderate', 'Elevated'];
  const riskLevel = levels[Math.floor(Math.random() * levels.length)];
  
  const newScan: VoiceScan = {
    id: `scan_${Date.now()}`,
    clinic_id: clinicId,
    patient_id: patientId,
    risk_level: riskLevel,
    recording_quality: 'Good',
    signals: mockSignals(riskLevel),
    research_signals: {
      neurological: { status: 'Low', label: 'Research signal only' },
      respiratory: { status: 'Low', label: 'Research signal only' },
      emotional: { status: 'Moderate', label: 'Research signal only' },
      metabolic: { status: 'Low', label: 'Research signal only' },
      pathology: { status: 'Low', label: 'Research signal only' }
    },
    agents: {
      summary: `Patient intake processed. Signal level: ${riskLevel}. Provider review suggested based on baseline acoustic mapping.`,
      follow_up: riskLevel === 'Elevated' ? 'Urgent provider review recommended' : 'Monitor',
      patient_comm: `Hi ${newPatient.display_name}, your clinic has received your voice intake successfully.`
    },
    suggested_review_prompts: ["Review standard vitals.", "Ask about general wellness."],
    raw_audio_stored: false,
    audio_length: "20s",
    created_at: new Date().toISOString()
  };

  patients.unshift(newPatient); 
  scans.unshift(newScan);
  
  setStorage('nuros_patients', patients);
  setStorage('nuros_scans', scans);
  
  return { newPatient, newScan };
};

export const getClinicDashboardData = (clinicId: string) => {
  const clinic = getStorage('nuros_clinics', []).find((c:Clinic) => c.id === clinicId);
  const patients = getStorage('nuros_patients', []).filter((p:Patient) => p.clinic_id === clinicId);
  const scans = getStorage('nuros_scans', []).filter((s:VoiceScan) => s.clinic_id === clinicId);
  
  const combined = patients.map((p: Patient) => {
    const scan = scans.find((s: VoiceScan) => s.patient_id === p.id);
    return { ...p, scan };
  });

  return { clinic, patients: combined };
};

export const loginClinic = (email: string) => {
  const clinics = getStorage('nuros_clinics', []);
  const clinic = clinics.find((c: Clinic) => c.admin_email === email);
  if (clinic) {
    setStorage('active_clinic_id', clinic.id);
    return clinic;
  }
  return null;
};

export const getActiveClinicId = () => {
  return getStorage('active_clinic_id', null);
};

export const logoutClinic = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('active_clinic_id');
  }
};
