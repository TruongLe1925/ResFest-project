import { useCallback, useEffect, useMemo, useState } from 'react';
import { predict, fetchUniversities, fetchMajors, uploadTranscript } from '../services/aiService';

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

  const universitiesMap = useMemo(
    () =>
      universities.reduce((acc, uni) => {
        acc[uni.name] = uni;
        return acc;
      }, {}),
    [universities]
  );

  const makePrediction = useCallback(
    async (score, targetUniversity, file = null, major = '') => {
      setLoading(true);
      setError('');
      try {
        const prediction = await predict({ score, targetUniversity, major, file }, universities);
        setResult({
          ...prediction,
          score,
          targetUniversity,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        const msg =
          err.response?.data?.message || err.response?.data?.error || err.message || 'Prediction failed';
        setError(typeof msg === 'string' ? msg : 'Prediction failed');
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
  };
};
