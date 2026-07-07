import { useState } from 'react';
import './PatternLibrary.css';

function PatternLibrary({ patterns, onSelect, compact = false }) {
  const [expandedCategories, setExpandedCategories] = useState(() => {
    // In non-compact mode, expand all by default
    if (!compact) return new Set(patterns.map((c) => c.category));
    return new Set();
  });

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const handleCopy = (item, e) => {
    e.stopPropagation();
    onSelect(item.pattern, item.flags);
  };

  const handleUseExample = (item, e) => {
    e.stopPropagation();
    onSelect(item.pattern, item.flags);
  };

  if (compact) {
    return (
      <div className="pattern-library pattern-library-compact">
        {patterns.map((category) => (
          <div key={category.category} className="pattern-category">
            <button
              className="pattern-category-header"
              onClick={() => toggleCategory(category.category)}
              aria-expanded={expandedCategories.has(category.category)}
            >
              <span className="pattern-category-title">{category.category}</span>
              <svg
                className={`pattern-category-chevron ${expandedCategories.has(category.category) ? 'open' : ''}`}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {expandedCategories.has(category.category) && (
              <div className="pattern-category-items">
                {category.items.map((item) => (
                  <button
                    key={item.name}
                    className="pattern-item"
                    onClick={() => onSelect(item.pattern, item.flags)}
                    title={item.description}
                  >
                    <span className="pattern-item-name">{item.name}</span>
                    <code className="pattern-item-pattern">{item.pattern.length > 40 ? item.pattern.slice(0, 40) + '…' : item.pattern}</code>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Full sidebar mode
  return (
    <div className="pattern-library">
      <div className="pattern-library-header">
        <h2 className="pattern-library-title">Libreria pattern</h2>
        <p className="pattern-library-subtitle">Clicca su un pattern per copiarlo nell'editor</p>
      </div>

      {patterns.map((category) => (
        <div key={category.category} className="pattern-category">
          <button
            className="pattern-category-header"
            onClick={() => toggleCategory(category.category)}
            aria-expanded={expandedCategories.has(category.category)}
          >
            <span className="pattern-category-title">{category.category}</span>
            <svg
              className={`pattern-category-chevron ${expandedCategories.has(category.category) ? 'open' : ''}`}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {expandedCategories.has(category.category) && (
            <div className="pattern-category-items">
              {category.items.map((item) => (
                <div key={item.name} className="pattern-item-full">
                  <div className="pattern-item-info">
                    <span className="pattern-item-name">{item.name}</span>
                    <span className="pattern-item-flags">{item.flags}</span>
                  </div>
                  <code className="pattern-item-pattern">{item.pattern}</code>
                  <p className="pattern-item-desc">{item.description}</p>
                  <button
                    className="pattern-item-action"
                    onClick={(e) => handleCopy(item, e)}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <rect x="3" y="3" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M2 10V2h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    Copia nell'editor
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default PatternLibrary;
