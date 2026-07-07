import { useState, useCallback, useMemo } from 'react';
import { compileRegex, findAllMatches, buildHighlightedSegments } from './utils/regexUtils';
import { patterns } from './data/patterns';
import RegexInput from './components/RegexInput';
import FlagSelector from './components/FlagSelector';
import TestArea from './components/TestArea';
import PatternLibrary from './components/PatternLibrary';
import MatchDetails from './components/MatchDetails';
import './App.css';

const AVAILABLE_FLAGS = ['g', 'i', 'm', 's', 'u'];

function App() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState('');
  const [activeTab, setActiveTab] = useState('library'); // 'library' | 'details'

  const { valid, regex, error } = useMemo(
    () => compileRegex(pattern, flags),
    [pattern, flags]
  );

  const matches = useMemo(() => {
    if (!valid || !regex || !testText) return [];
    return findAllMatches(regex, testText);
  }, [valid, regex, testText]);

  const highlightedSegments = useMemo(() => {
    if (!testText) return [{ text: '', isMatch: false }];
    return buildHighlightedSegments(testText, matches);
  }, [testText, matches]);

  const handlePatternSelect = useCallback((newPattern, newFlags) => {
    setPattern(newPattern);
    if (newFlags) setFlags(newFlags);
  }, []);

  const handleFlagToggle = useCallback((flag) => {
    setFlags((prev) => {
      if (prev.includes(flag)) {
        return prev.replace(flag, '');
      }
      return (prev + flag).split('').sort().join('');
    });
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-logo">
            <svg className="app-logo-icon" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="24" height="24" rx="6" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M8 14h4M16 14h4M14 8v4M14 16v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="14" cy="14" r="2" fill="currentColor" />
            </svg>
            <h1 className="app-title">PatternForge</h1>
          </div>
          <p className="app-subtitle">Scrivi, testa e affina le tue espressioni regolari in tempo reale</p>
        </div>
      </header>

      <main className="app-main">
        <aside className="app-sidebar">
          <PatternLibrary
            patterns={patterns}
            onSelect={handlePatternSelect}
          />
        </aside>

        <section className="app-workspace">
          <div className="workspace-card">
            <RegexInput
              value={pattern}
              onChange={setPattern}
              error={error}
              flags={flags}
            />

            <FlagSelector
              flags={flags}
              availableFlags={AVAILABLE_FLAGS}
              onToggle={handleFlagToggle}
            />

            <TestArea
              text={testText}
              onChange={setTestText}
              highlightedSegments={highlightedSegments}
              hasMatches={matches.length > 0}
            />
          </div>

          <div className="workspace-results">
            <div className="results-tabs" role="tablist">
              <button
                role="tab"
                aria-selected={activeTab === 'library'}
                className={`results-tab ${activeTab === 'library' ? 'active' : ''}`}
                onClick={() => setActiveTab('library')}
              >
                Libreria pattern
              </button>
              <button
                role="tab"
                aria-selected={activeTab === 'details'}
                className={`results-tab ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                Dettaglio match
                {matches.length > 0 && (
                  <span className="results-tab-badge">{matches.length}</span>
                )}
              </button>
            </div>

            {activeTab === 'details' && (
              <MatchDetails
                matches={matches}
                text={testText}
                hasValidRegex={valid && pattern.trim() !== ''}
              />
            )}

            {activeTab === 'library' && (
              <PatternLibrary
                patterns={patterns}
                onSelect={handlePatternSelect}
                compact
              />
            )}
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>PatternForge &mdash; tool gratuito per sviluppatori. Nessun dato viene inviato o memorizzato.</p>
      </footer>
    </div>
  );
}

export default App;
