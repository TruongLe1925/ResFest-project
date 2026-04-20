import { useCallback, useEffect, useMemo, useState } from 'react';
import { predict, fetchUniversities, fetchMajors, uploadTranscript, fetchCertifications } from '../services/aiService';

export const usePredict = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [universities, setUniversities] = useState([]);
  const [universitiesLoading, setUniversitiesLoading] = useState(true);
  const [universitiesError, setUniversitiesError] = useState('');
  const [majors, setMajors] = useState([]);
  const [majorsLoading, setMajorsLoading] = useState(false);
  const [majorsError, setMajorsError] = useState('');
  const [certificates, setCertificates] = useState([]);
  const [certificatesLoading, setCertificatesLoading] = useState(true);
  const [certificatesError, setCertificatesError] = useState('');

  // Fetch universities and certificates on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setUniversitiesLoading(true);
      setUniversitiesError('');
      try {
        const list = await fetchUniversities();
        if (!cancelled) {
          setUniversities(list);
        }
      } catch (err) {
        if (!cancelled) {
          const msg = err.response?.data?.message || err.message || 'Failed to load universities';
          setUniversitiesError(msg);
          setUniversities([]);
        }
      } finally {
        if (!cancelled) {
          setUniversitiesLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch certificates on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setCertificatesLoading(true);
      setCertificatesError('');
      try {
        const list = await fetchCertifications();
        if (!cancelled) {
          // If no certificates loaded, provide fallback options
          setCertificates(list && list.length > 0 ? list : ['IELTS', 'TOEFL', 'GRE', 'GMAT', 'Other']);
        }
      } catch (err) {
        if (!cancelled) {
          // On error, provide fallback options instead of empty array
          setCertificates(['IELTS', 'TOEFL', 'GRE', 'GMAT', 'Other']);
          // Don't show error to user, just use fallback silently
        }
      } finally {
        if (!cancelled) {
          setCertificatesLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const universitiesMap = useMemo(
    () =>
      universities.reduce((acc, uni) => {
        acc[uni.name] = uni;
        return acc;
      }, {}),
    [universities]
  );

  const makePrediction = useCallback(
    async (payload, file = null) => {
      setLoading(true);
      setError('');

      try {
        const prediction = await predict(payload, universities, file);

        setResult({
          probability: prediction.probability,
          message: prediction.message,
          strengths: prediction.strengths,
          weaknesses: prediction.weaknesses,
          targetUniversity: payload.universityName,
          cutoffScore: prediction.cutoffScore,
          requiredTranscriptScore: prediction.requiredTranscriptScore,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        // Improved error handling for different error types
        let errorMsg = 'Prediction failed';

        if (err.response?.status === 400) {
          // Bad request - validation error from backend
          errorMsg = err.response?.data?.message || 
                     err.response?.data?.error ||
                     'Invalid data submitted. Please check all fields.';
        } else if (err.response?.status === 500) {
          // Server error
          errorMsg = 'Server error. Please try again later.';
        } else if (err.response?.data?.message) {
          // Generic response message
          errorMsg = err.response.data.message;
        } else if (err.response?.data?.error) {
          // Alternative error field
          errorMsg = err.response.data.error;
        } else if (err.message) {
          // Client-side error
          errorMsg = err.message;
        }

        setError(typeof errorMsg === 'string' ? errorMsg : 'Prediction failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [universities]
  );

  const uploadTranscriptFile = async (file) => {
    setUploading(true);
    setError('');
    try {
      return await uploadTranscript(file);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Transcript upload failed';
      setError(msg);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const fetchMajorsForUniversity = useCallback(async (universityName) => {
    if (!universityName) {
      setMajors([]);
      setMajorsError('');
      return;
    }
    setMajorsLoading(true);
    setMajorsError('');
    try {
      const list = await fetchMajors(universityName);
      setMajors(list);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load majors';
      setMajorsError(msg);
      setMajors([]);
    } finally {
      setMajorsLoading(false);
    }
  }, []);

  const clearPrediction = () => {
    setResult(null);
    setError('');
    setUniversitiesError('');
    setMajorsError('');
    setCertificatesError('');
  };

  return {
    result,
    loading,
    uploading,
    error,
    makePrediction,
    uploadTranscriptFile,
    clearPrediction,
    universities,
    universitiesMap,
    universitiesLoading,
    universitiesError,
    majors,
    majorsLoading,
    majorsError,
    fetchMajorsForUniversity,
    certificates,
    certificatesLoading,
    certificatesError,
  };
};
