import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePredict } from '../hooks/usePredict.jsx';
import { useAuth } from '../hooks/useAuth.jsx';

import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import Card from '../components/Card';
import ScoreForm from '../components/ScoreForm';
import ResultCard from '../components/ResultCard';
import ProbabilityBar from '../components/ProbabilityBar';
import ResultStatus from '../components/ResultStatus';
import '../pages/Prediction.css';

const Prediction = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({ score: '', targetUniversity: '', major: '' });
  const [universityLocked, setUniversityLocked] = useState(false);
  const [transcriptPreview, setTranscriptPreview] = useState('');
  const [transcriptFile, setTranscriptFile] = useState(null);
  const {
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
  } = usePredict();

  const selectedUniversityData = universitiesMap[formData.targetUniversity];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      window.alert('Please login to use prediction');
      navigate('/login');
      return;
    }

    makePrediction(
      parseFloat(formData.score),
      formData.targetUniversity,
      transcriptFile,
      formData.major
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUniversityLockChange = (locked) => {
    setUniversityLocked(locked);
    if (locked) {
      fetchMajorsForUniversity(formData.targetUniversity);
    } else {
      setFormData((prev) => ({ ...prev, major: '' }));
    }
  };

  const handleTranscriptImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setTranscriptFile(null);
      return;
    }

    if (transcriptPreview) {
      URL.revokeObjectURL(transcriptPreview);
    }
    setTranscriptPreview(URL.createObjectURL(file));
    setTranscriptFile(file);
    await uploadTranscriptFile(file);
  };

  const statusLabel = result
    ? result.probability >= 70
      ? 'High'
      : result.probability >= 40
        ? 'Medium'
        : 'Low'
    : '';

  useEffect(() => {
    return () => {
      if (transcriptPreview) {
        URL.revokeObjectURL(transcriptPreview);
      }
    };
  }, [transcriptPreview]);

  return (
    <div className="prediction-page">
      <div className="page-header">
        <h1>The Clarified <span>Path</span></h1>
        <p>
          Transform admissions anxiety into data-driven confidence. Enter your metrics
          to estimate acceptance probability.
        </p>
      </div>
      
      <div className="prediction-content">
        <Card className="form-card">
          <h3 className="panel-title">Academic Metrics</h3>
          <ErrorMessage message={error || universitiesError || majorsError} onClose={() => clearPrediction()} />
          {universitiesLoading && <p className="uploading-note">Loading universities from server…</p>}
          <form onSubmit={handleSubmit}>
            <ScoreForm
              data={formData}
              onChange={handleChange}
              universities={universities}
              selectedUniversityData={selectedUniversityData}
              onTranscriptImageChange={handleTranscriptImageChange}
              transcriptPreview={transcriptPreview}
              uploading={uploading}
              majors={majors}
              majorsLoading={majorsLoading}
              universityLocked={universityLocked}
              onUniversityLockChange={handleUniversityLockChange}
            />
            <button
              type="submit"
              disabled={loading || uploading || universitiesLoading || universities.length === 0}
              className="predict-btn"
              title={!user ? 'Login required' : 'Predict admission probability'}
            >
              {loading ? <Loader message="Predicting..." /> : 'Predict Admission'}
            </button>
            {!user && <p className="uploading-note">Login required to run prediction.</p>}
            {result && (
              <button
                type="button"
                onClick={() => {
                  clearPrediction();
                  setTranscriptPreview('');
                  setTranscriptFile(null);
                  setUniversityLocked(false);
                  setFormData((prev) => ({ ...prev, targetUniversity: '', major: '' }));
                }}
                className="clear-btn"
              >
                New Prediction
              </button>
            )}
          </form>
          <div className="predict-info-box">
            <strong>Data precision:</strong> results come from the admission prediction API; university list and cutoffs
            are loaded separately for context.
          </div>
        </Card>

        <div className="result-section">
          {result ? (
            <ResultCard
              probability={result.probability}
              statusLabel={statusLabel}
              message={result.message}
              strengths={result.strengths}
              weaknesses={result.weaknesses}
            >
              <ProbabilityBar probability={result.probability} />
              <ResultStatus probability={result.probability} />
              <p className="result-detail">
                Target: {result.targetUniversity}
                {result.cutoffScore != null && ` | Cutoff: ${result.cutoffScore}`}
                {result.requiredTranscriptScore != null &&
                  ` | Required transcript: ${result.requiredTranscriptScore}`}
              </p>
            </ResultCard>
          ) : (
            <Card className="result-placeholder">
              <p className="result-placeholder-title">Prediction Result</p>
              <h3>Admission Probability</h3>
              <p>Fill the form and run prediction to see your probability and guidance.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prediction;