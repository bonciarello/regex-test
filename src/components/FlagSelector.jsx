import { useId } from 'react';
import './FlagSelector.css';

const FLAG_INFO = {
  g: { label: 'Globale', desc: 'Trova tutti i match, non solo il primo' },
  i: { label: 'Case-insensitive', desc: 'Ignora maiuscole/minuscole' },
  m: { label: 'Multilinea', desc: '^ e $ si ancorano a ogni riga' },
  s: { label: 'Dotall', desc: 'Il punto . include i newline (\\n)' },
  u: { label: 'Unicode', desc: 'Abilita il supporto Unicode completo' },
};

function FlagSelector({ flags, availableFlags, onToggle }) {
  const groupLabelId = useId();

  return (
    <fieldset className="flag-selector" aria-labelledby={groupLabelId}>
      <legend id={groupLabelId} className="flag-selector-legend">
        Flag
      </legend>
      <div className="flag-selector-options">
        {availableFlags.map((flag) => {
          const isActive = flags.includes(flag);
          const info = FLAG_INFO[flag] || { label: flag, desc: '' };
          const flagId = `flag-${flag}`;

          return (
            <label
              key={flag}
              htmlFor={flagId}
              className={`flag-option ${isActive ? 'active' : ''}`}
            >
              <input
                id={flagId}
                type="checkbox"
                className="flag-checkbox sr-only"
                checked={isActive}
                onChange={() => onToggle(flag)}
              />
              <span className="flag-visual">
                <code className="flag-key">{flag}</code>
                <span className="flag-label">{info.label}</span>
              </span>
              <span className="flag-tooltip">{info.desc}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default FlagSelector;
