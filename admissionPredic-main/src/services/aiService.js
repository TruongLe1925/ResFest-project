import { fetchUniversities, fetchMajors, uploadTranscriptImage, postAdmissionPrediction } from './api.js';

export { fetchUniversities, fetchMajors, uploadTranscriptImage, postAdmissionPrediction };

export const uploadTranscript = uploadTranscriptImage;

/**
 * @param {{ score: number, targetUniversity: string, major?: string, file?: File | null }} data
 * @param {Array<{ name: string }>} universitiesList
 */
export async function predict(data, universitiesList) {
  const { score, targetUniversity, major, file } = data;

  const selectedUniversity = universitiesList.find((uni) => uni.name === targetUniversity);
  if (!selectedUniversity) {
    throw new Error('Please select a valid university');
  }

  if (Number.isNaN(score)) {
    throw new Error('Please enter a valid exam score');
  }

  if (score < 0 || score > 30) {
    throw new Error('Invalid exam score range');
  }

  const apiResponse = await postAdmissionPrediction(
    {
      universityName: targetUniversity,
      examScore: score,
      majorName: major || '',
    },
    file ?? null
  );

  if (!Number.isFinite(apiResponse.percentage)) {
    throw new Error('Invalid response from admission prediction service');
  }

  const probability = Math.round(apiResponse.percentage);

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
