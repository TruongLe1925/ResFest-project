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
  const [formData, setFormData] = useState({
    score: '',
    targetUniversity: '',
    major: '',
    competencyAssessmentScore: '',
    certificateType: '',
    certificateScore: '',
  });
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
    certificates,
    certificatesLoading,
    certificatesError,
  } = usePredict();

  const selectedUniversityData = universitiesMap[formData.targetUniversity];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      window.alert('Please login to use prediction');
      navigate('/login');
      return;
    }

    // Validate university
    const universityName = formData.targetUniversity?.trim();
    if (!universityName) {
      window.alert('Please select a university');
      return;
    }

    // Validate and parse exam score
    const examScore = parseFloat(formData.score);
    if (isNaN(examScore) || examScore < 0 || examScore > 30) {
      window.alert('Please enter a valid exam score (0-30)');
      return;
    }

    // Validate major
    const majorName = formData.major?.trim();
    if (!majorName) {
      window.alert('Please select a major');
      return;
    }

    // Validate and parse competency assessment score
    const competencyAssessmentScore = parseInt(formData.competencyAssessmentScore, 10);
    if (isNaN(competencyAssessmentScore) || competencyAssessmentScore < 0 || competencyAssessmentScore > 1200) {
      window.alert('Please enter a valid competency assessment score (0-1200)');
      return;
    }

    // Validate certificate type (strict: not empty and not "Select...")
    const certificateType = formData.certificateType?.trim();
    if (!certificateType || certificateType === 'Select...' || certificateType === '') {
      window.alert('Please select a valid certificate type');
      return;
    }

    // Validate and parse certificate score
    const certificateScore = parseFloat(formData.certificateScore);
    if (isNaN(certificateScore) || certificateScore < 0) {
      window.alert('Please enter a valid certificate score');
      return;
    }

    // All validations passed, create payload
    const payload = {
      universityName,
      examScore,
      majorName,
      competencyAssessmentScore,
      certificateType,
      certificateScore,
    };

    makePrediction(payload, transcriptFile);
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

  const isFormValid = () => {
    // Check university
    if (!formData.targetUniversity?.trim()) return false;

    // Check exam score is valid number
    const examScore = parseFloat(formData.score);
    if (isNaN(examScore) || examScore < 0 || examScore > 30) return false;

    // Check major
    if (!formData.major?.trim()) return false;

    // Check competency assessment score is valid number
    const competencyScore = parseInt(formData.competencyAssessmentScore, 10);
    if (isNaN(competencyScore) || competencyScore < 0 || competencyScore > 1200) return false;

    // Check certificate type (must not be empty or "Select...")
    const certType = formData.certificateType?.trim();
    if (!certType || certType === 'Select...' || certType === '') return false;

    // Check certificate score is valid number
    const certScore = parseFloat(formData.certificateScore);
    if (isNaN(certScore) || certScore < 0) return false;

    return true;
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
          <ErrorMessage message={error || universitiesError || majorsError || certificatesError} onClose={() => clearPrediction()} />
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
              certificates={certificates}
              certificatesLoading={certificatesLoading}
            />
            <button
              type="submit"
              disabled={!isFormValid() || loading || uploading || universitiesLoading || certificatesLoading || !user}
              className="predict-btn"
              title={!user ? 'Login required' : !isFormValid() ? 'Please fill all fields correctly' : 'Predict admission probability'}
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
                  setFormData((prev) => ({
                    ...prev,
                    targetUniversity: '',
                    major: '',
                    competencyAssessmentScore: '',
                    certificateType: '',
                    certificateScore: '',
                  }));
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