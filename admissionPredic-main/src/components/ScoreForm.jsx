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
}) => {
  const cutoffText = selectedUniversityData
    ? `Cutoff score: ${selectedUniversityData.cutoff_score} | Required transcript: ${selectedUniversityData.required_transcript_score}`
    : 'Select a university to view cutoff score.';

  const handleUniversityChange = (e) => {
    // Gọi onChange với university mới, major sẽ được reset ở Prediction.jsx khi unlock
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
      <p className="cutoff-info">{cutoffText}</p>

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

