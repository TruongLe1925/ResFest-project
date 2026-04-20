import React from 'react';
import Input from './Input';
import Select from './Select';

const ScoreForm = ({
  data,
  onChange,
  universities,
  selectedUniversityData,
  onTranscriptImageChange,
  transcriptPreview,
  uploading,
  majors,
  majorsLoading,
  universityLocked,
  onUniversityLockChange,
  certificates,
  certificatesLoading,
}) => {
  const handleUniversityChange = (e) => {
    // Call onChange with new university, major will be reset in Prediction.jsx when unlocked
    onChange(e);
  };

  const handleLockToggle = () => {
    if (!data.targetUniversity) return;
    onUniversityLockChange(!universityLocked);
  };

  return (
    <div className="score-form">
      <div className="university-select-row">
        <Select
          name="targetUniversity"
          value={data.targetUniversity}
          onChange={handleUniversityChange}
          options={(universities || []).map((uni) => uni.name)}
          disabled={universityLocked}
          required
        />
        <button
          type="button"
          onClick={handleLockToggle}
          disabled={!data.targetUniversity}
          className={`lock-btn ${universityLocked ? 'locked' : ''}`}
        >
          {universityLocked ? 'Change' : 'Confirm'}
        </button>
      </div>

      {selectedUniversityData?.cutoff_score != null && selectedUniversityData?.required_transcript_score != null ? (
        <p className="cutoff-info">
          Cutoff score: {selectedUniversityData.cutoff_score} | Required transcript: {selectedUniversityData.required_transcript_score}
        </p>
      ) : (
        <p className="cutoff-info">Select a university to view cutoff score.</p>
      )}

      {universityLocked && (
        <div className="major-section">
          {majorsLoading ? (
            <p className="loading-note">Loading majors...</p>
          ) : (
            <Select
              name="major"
              value={data.major || ''}
              onChange={onChange}
              options={majors || []}
              required
            />
          )}
        </div>
      )}

      <Input
        type="number"
        name="score"
        placeholder="Exam score (0-30)"
        value={data.score}
        onChange={onChange}
        min="0"
        max="30"
        step="0.1"
        required
      />

      <Input
        type="number"
        name="competencyAssessmentScore"
        placeholder="Competency assessment score (0-1200)"
        value={data.competencyAssessmentScore}
        onChange={onChange}
        min="0"
        max="1200"
        step="1"
        required
      />

      <div className="certificate-section">
        {certificatesLoading ? (
          <p className="loading-note">Loading certificate types...</p>
        ) : certificates && certificates.length > 0 ? (
          <Select
            name="certificateType"
            value={data.certificateType || ''}
            onChange={onChange}
            options={certificates}
            required
          />
        ) : (
          <p className="error-note">No certificate types available. Please try again later.</p>
        )}
      </div>

      <Input
        type="number"
        name="certificateScore"
        placeholder="Certificate score"
        value={data.certificateScore}
        onChange={onChange}
        min="0"
        step="0.1"
        required
      />

      <div className="upload-section">
        <label htmlFor="transcriptImage">Upload transcript image</label>
        <Input
          id="transcriptImage"
          type="file"
          name="transcriptImage"
          accept="image/*"
          onChange={onTranscriptImageChange}
        />
        {uploading && <p className="uploading-note">Extracting transcript score...</p>}
        {transcriptPreview && (
          <img src={transcriptPreview} alt="Transcript preview" className="transcript-preview" />
        )}
      </div>
    </div>
  );
};

export default ScoreForm;

