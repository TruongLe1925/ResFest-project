import axios from 'axios';

/** Override in `.env`: VITE_API_BASE_URL=http://192.168.100.23:8080/api */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL.replace(/\/$/, ''),
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      if (parsedUser?.token) {
        config.headers.Authorization = `Bearer ${parsedUser.token}`;
      } else if (parsedUser?.id != null) {
        config.headers.Authorization = `Bearer ${parsedUser.id}`;
      }
    } catch {
      localStorage.removeItem('user');
    }
  }
  return config;
});

/**
 * Normalizes one university record from the API into the shape used by the UI.
 * Adjust field names here if your backend uses different JSON keys.
 */
function mapUniversityRecord(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const name = raw.name ?? raw.universityName ?? raw.title ?? '';
  if (!String(name).trim()) return null;

  const cutoff_score = raw.cutoff_score ?? raw.cutoffScore ?? raw.cutOffScore;
  const required_transcript_score =
    raw.required_transcript_score ?? raw.requiredTranscriptScore ?? raw.requiredTranscript;

  return {
    name: String(name).trim(),
    cutoff_score: cutoff_score != null ? Number(cutoff_score) : null,
    required_transcript_score: required_transcript_score != null ? Number(required_transcript_score) : null,
  };
}

function unwrapList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

/**
 * Fetches universities from GET /university.
 * Returns the parsed list from `response.data` (via Axios).
 */
export async function fetchUniversities() {
  const { data } = await api.get('/university');
  const rawList = unwrapList(data);
  return rawList.map(mapUniversityRecord).filter(Boolean);
}

/**
 * Fetches majors for a given university from GET /major?universityDTO={name}.
 * Returns the parsed list of major names.
 */
export async function fetchMajors(universityName) {
  if (!universityName) return [];
  const { data } = await api.get('/major', {
    params: { universityDTO: universityName },
  });
  const rawList = unwrapList(data);
  return rawList
    .map((raw) => raw?.majorName ?? raw?.name ?? raw?.title ?? '')
    .filter(Boolean);
}

/**
 * Fetches certificates from GET /certification.
 * Returns the parsed list of certificate names.
 */
export async function fetchCertifications() {
  const { data } = await api.get('/certification');
  const rawList = unwrapList(data);
  return rawList
    .map((raw) => raw?.name ?? raw?.title ?? '')
    .filter(Boolean);
}

/**
 * Uploads a transcript image for score extraction (POST /transcript/extract).
 * Tweak the path or `FormData` field name to match your backend.
 */
/**
 * POST /admission-predic — multipart: JSON part `data`, optional `file`.
 * Spring @RequestPart("data") expects a JSON part (Blob with application/json).
 *
 * @param {{ universityName: string, examScore: number, majorName: string, competencyAssessmentScore: number, certificateType: string, certificateScore: number }} payload
 * @param {File | null | undefined} file
 * @returns {Promise<{ percentage: number, feedback: string, strengths: string, weaknesses: string }>}
 */
export async function postAdmissionPrediction(payload, file) {
  // Validate payload before sending
  if (!payload.universityName || !payload.majorName || !payload.certificateType) {
    throw new Error('Missing required fields in payload');
  }

  if (!Number.isFinite(payload.examScore) || payload.examScore < 0 || payload.examScore > 30) {
    throw new Error('Invalid exam score in payload');
  }

  if (!Number.isFinite(payload.competencyAssessmentScore) || payload.competencyAssessmentScore < 0 || payload.competencyAssessmentScore > 1200) {
    throw new Error('Invalid competency assessment score in payload');
  }

  if (!Number.isFinite(payload.certificateScore) || payload.certificateScore < 0) {
    throw new Error('Invalid certificate score in payload');
  }

  const formData = new FormData();
  
  // Create JSON Blob with correct structure
  const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
  formData.append('data', jsonBlob);
  
  // Append file only if it's a valid File object
  if (file instanceof File) {
    formData.append('file', file);
  }

  try {
    const { data } = await api.post('/admission-predic', formData);
    const body = data?.data ?? data;
    
    return {
      percentage: Number(body?.percentage ?? 0),
      feedback: String(body?.feedback ?? ''),
      strengths: String(body?.strengths ?? ''),
      weaknesses: String(body?.weaknesses ?? ''),
    };
  } catch (err) {
    // Re-throw with context
    throw err;
  }
}

export async function uploadTranscriptImage(file) {
  if (!file) {
    throw new Error('No transcript image selected');
  }
  const formData = new FormData();
  formData.append('transcript', file);
  const { data } = await api.post('/transcript/extract', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  const transcriptScore =
    data?.transcriptScore ?? data?.transcript_score ?? data?.score ?? data?.gpa ?? data?.data?.transcriptScore;
  if (transcriptScore == null || Number.isNaN(Number(transcriptScore))) {
    throw new Error('Server did not return a transcript score');
  }
  return { transcriptScore: Number(Number(transcriptScore).toFixed(1)) };
}

export default api;
