import { useId } from 'react';
import './TestArea.css';

const MATCH_COLORS = [
  'match-c1', 'match-c2', 'match-c3', 'match-c4', 'match-c5',
];

function TestArea({ text, onChange, highlightedSegments, hasMatches }) {
  const textareaId = useId();

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="test-area">
      <label htmlFor={textareaId} className="test-area-label">
        Testo di prova
      </label>

      <div className={`test-area-container ${hasMatches ? 'has-matches' : ''}`}>
        {/* Highlight layer (behind) */}
        <div className="test-area-highlight" aria-hidden="true">
          {highlightedSegments.map((seg, i) => {
            if (!seg.isMatch) {
              return <span key={i}>{seg.text}</span>;
            }
            const colorClass = MATCH_COLORS[i % MATCH_COLORS.length];
            return (
              <mark key={i} className={`test-area-match ${colorClass}`}>
                {seg.text}
              </mark>
            );
          })}
        </div>

        {/* Textarea (on top, transparent text) */}
        <textarea
          id={textareaId}
          className="test-area-field"
          value={text}
          onChange={handleChange}
          placeholder="Incolla o scrivi il testo su cui testare l'espressione regolare..."
          spellCheck={false}
          rows={8}
        />
      </div>
    </div>
  );
}

export default TestArea;
