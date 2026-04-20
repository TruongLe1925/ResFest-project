import { fetchUniversities, fetchMajors, uploadTranscriptImage, postAdmissionPrediction, fetchCertifications } from './api.js';

export { fetchUniversities, fetchMajors, uploadTranscriptImage, postAdmissionPrediction, fetchCertifications };

export const uploadTranscript = uploadTranscriptImage;

/**
 * @param {{ score: number, targetUniversity: string, major: string, competencyAssessmentScore: number, certificateType: string, certificateScore: number, file?: File | null }} data
 * @param {Array<{ name: string }>} universitiesList
 */
export async function predict(payload, universitiesList, file) {
  const {
    universityName,
    examScore,
    majorName,
    competencyAssessmentScore,
    certificateType,
    certificateScore,
  } = payload;

  const selectedUniversity = universitiesList.find(
    (uni) => uni.name === universityName
  );

  if (!selectedUniversity) {
    throw new Error('Please select a valid university');
  }

  if (!Number.isFinite(examScore) || examScore < 0 || examScore > 30) {
    throw new Error('Invalid exam score');
  }

  if (!majorName || !majorName.trim()) {
    throw new Error('Please select a major');
  }

  if (
    competencyAssessmentScore == null ||
    competencyAssessmentScore < 0 ||
    competencyAssessmentScore > 1200
  ) {
    throw new Error('Invalid competency assessment score');
  }

  if (!certificateType || !certificateType.trim() || certificateType === 'Select...') {
    throw new Error('Please select a valid certificate type');
  }

  if (certificateScore == null || certificateScore < 0) {
    throw new Error('Invalid certificate score');
  }

  const apiResponse = await postAdmissionPrediction(
    {
      universityName,
      examScore,
      majorName,
      competencyAssessmentScore,
      certificateType,
      certificateScore,
    },
    file ?? null
  );

  const probability = Math.round(apiResponse.percentage || 0);

  return {
    probability,
    message: apiResponse.feedback,
    strengths: apiResponse.strengths,
    weaknesses: apiResponse.weaknesses,
    cutoffScore: selectedUniversity.cutoff_score,
    requiredTranscriptScore: selectedUniversity.required_transcript_score,
  };
}

export const advancedPredict = predict;
