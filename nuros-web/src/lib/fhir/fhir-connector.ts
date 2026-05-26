/**
 * Nuros FHIR Connector
 * Maps Nuros Vocal Biomarker data to HL7 FHIR standard resources
 * Facilitates seamless EMR interoperability (Epic, Cerner, Telus Health)
 */

export interface NurosVocalData {
  patientId: string;
  clinicianId: string;
  encounterId: string;
  date: string;
  overallRisk: 'Low' | 'Moderate' | 'Elevated';
  metrics: {
    jitter: number; // Frequency variation
    shimmer: number; // Amplitude variation
    hnr: number; // Harmonic-to-Noise Ratio
  };
}

/**
 * Transforms a Nuros voice score into a standard FHIR Observation resource
 */
export function mapToFHIRObservation(data: NurosVocalData): any {
  return {
    resourceType: "Observation",
    status: "final",
    category: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/observation-category",
            code: "laboratory",
            display: "Laboratory"
          }
        ]
      }
    ],
    code: {
      coding: [
        {
          system: "http://nuroshealth.com/fhir/CodeSystem/vocal-biomarkers",
          code: "vocal-risk-score",
          display: "Nuros Vocal Biomarker Risk Score"
        }
      ],
      text: "Nuros Vocal Biomarker Risk Analysis"
    },
    subject: {
      reference: `Patient/${data.patientId}`
    },
    encounter: {
      reference: `Encounter/${data.encounterId}`
    },
    effectiveDateTime: data.date,
    performer: [
      {
        reference: `Practitioner/${data.clinicianId}`
      }
    ],
    valueString: data.overallRisk,
    component: [
      {
        code: {
          coding: [{ code: "jitter", display: "Vocal Jitter (%)" }]
        },
        valueQuantity: { value: data.metrics.jitter, unit: "%" }
      },
      {
        code: {
          coding: [{ code: "shimmer", display: "Vocal Shimmer (%)" }]
        },
        valueQuantity: { value: data.metrics.shimmer, unit: "%" }
      },
      {
        code: {
          coding: [{ code: "hnr", display: "Harmonic-to-Noise Ratio (dB)" }]
        },
        valueQuantity: { value: data.metrics.hnr, unit: "dB" }
      }
    ]
  };
}

/**
 * Creates a FHIR DiagnosticReport encapsulating the Observations
 */
export function createDiagnosticReport(data: NurosVocalData, observationId: string): any {
  return {
    resourceType: "DiagnosticReport",
    status: "final",
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "11502-2",
          display: "Laboratory report"
        }
      ]
    },
    subject: {
      reference: `Patient/${data.patientId}`
    },
    effectiveDateTime: data.date,
    result: [
      {
        reference: `Observation/${observationId}`
      }
    ],
    conclusion: `Patient exhibits a ${data.overallRisk} risk level based on Nuros vocal acoustic analysis.`
  };
}
