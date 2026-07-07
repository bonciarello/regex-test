import { useId, useState, useEffect } from 'react';
import './RegexInput.css';

function RegexInput({ value, onChange, error, flags }) {
  const inputId = useId();
  const errorId = useId();
  const [localValue, setLocalValue] = useState(value);
  const [isDirty, setIsDirty] = useState(false);

  // Sync external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newVal = e.target.value;
    setLocalValue(newVal);
    setIsDirty(true);
    onChange(newVal);
  };

  const handleBlur = () => {
    setIsDirty(true);
  };

  const displayError = isDirty && error;

  return (
    <div className="regex-input">
      <div className="regex-input-header">
        <label htmlFor={inputId} className="regex-input-label">
          Espressione regolare
        </label>
        <span className="regex-input-flags-display">
          /<span className="regex-input-flags-value">{flags || '(nessun flag)'}</span>
        </span>
      </div>

      <div className={`regex-input-wrapper ${displayError ? 'has-error' : ''} ${value && !displayError ? 'has-value' : ''}`}>
        <span className="regex-input-delimiter" aria-hidden="true">/</span>
        <input
          id={inputId}
          type="text"
          className="regex-input-field"
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Es. [a-z]+@[a-z]+\.[a-z]{2,}"
          spellCheck={false}
          autoComplete="off"
          aria-describedby={displayError ? errorId : undefined}
          aria-invalid={displayError ? 'true' : undefined}
        />
        <span className="regex-input-delimiter" aria-hidden="true">/</span>
        <span className="regex-input-flags-suffix">{flags}</span>
      </div>

      {displayError && (
        <div id={errorId} className="regex-input-error" role="alert">
          <svg className="regex-input-error-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 4v3.5M7 10v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>Regex non valida: {error.replace(/^\/|:\s*$/g, '').replace(/^Invalid regular expression:\s*/i, '')}</span>
        </div>
      )}

      {!displayError && !value && (
        <p className="regex-input-hint">
          Inserisci un'espressione regolare. I delimitatori <code>/</code> non sono necessari — li aggiungiamo noi.
        </p>
      )}
    </div>
  );
}

export default RegexInput;
