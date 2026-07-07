import './MatchDetails.css';

const MATCH_COLORS = [
  'detail-c1', 'detail-c2', 'detail-c3', 'detail-c4', 'detail-c5',
];

function MatchDetails({ matches, text, hasValidRegex }) {
  if (!hasValidRegex) {
    return (
      <div className="match-details">
        <div className="match-details-empty">
          <svg className="match-details-empty-icon" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
            <path d="M16 10v7M16 21v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p>Inserisci una regex valida e un testo di prova per visualizzare i match.</p>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="match-details">
        <div className="match-details-empty">
          <svg className="match-details-empty-icon" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11l10 10M21 11l-10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p>Nessun match trovato. Prova a modificare la regex, i flag o il testo di prova.</p>
        </div>
      </div>
    );
  }

  const totalGroups = matches.reduce((sum, m) => sum + m.groups.length, 0);

  return (
    <div className="match-details">
      <div className="match-details-summary">
        <div className="match-summary-stat">
          <span className="match-summary-value">{matches.length}</span>
          <span className="match-summary-label">Match trov{matches.length === 1 ? 'ato' : 'ati'}</span>
        </div>
        {totalGroups > 0 && (
          <div className="match-summary-stat">
            <span className="match-summary-value">{totalGroups}</span>
            <span className="match-summary-label">Gruppi catturati</span>
          </div>
        )}
        <div className="match-summary-stat">
          <span className="match-summary-value">{text.length}</span>
          <span className="match-summary-label">Caratteri analizzati</span>
        </div>
      </div>

      <div className="match-details-table-wrapper">
        <table className="match-details-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Match</th>
              <th>Posizione</th>
              <th>Lunghezza</th>
              <th>Gruppi</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match, i) => {
              const colorClass = MATCH_COLORS[i % MATCH_COLORS.length];
              return (
                <tr key={i} className="match-detail-row">
                  <td className="match-detail-num">
                    <span className={`match-num-badge ${colorClass}`}>{i + 1}</span>
                  </td>
                  <td className="match-detail-text">
                    <code>{match.fullMatch}</code>
                  </td>
                  <td className="match-detail-pos">{match.index}</td>
                  <td className="match-detail-len">{match.length}</td>
                  <td className="match-detail-groups">
                    {match.groups.length > 0 ? (
                      <div className="match-groups-list">
                        {match.groups.map((g, gi) => (
                          <span key={gi} className="match-group-tag">
                            <span className="match-group-name">{g.name}</span>
                            <code className="match-group-value">{g.value}</code>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="match-no-groups">&mdash;</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Visual bar */}
      <div className="match-details-bar" aria-hidden="true">
        <div className="match-bar-track">
          {(() => {
            const segments = [];
            let cursor = 0;
            const sorted = [...matches].sort((a, b) => a.index - b.index);
            for (const match of sorted) {
              if (match.index > cursor) {
                const pct = ((match.index - cursor) / text.length) * 100;
                segments.push(
                  <div key={`gap-${cursor}`} className="match-bar-segment match-bar-gap" style={{ width: `${pct}%` }} />
                );
              }
              const pct = (match.length / text.length) * 100;
              segments.push(
                <div key={`m-${match.index}`} className="match-bar-segment match-bar-match" style={{ width: `${Math.max(pct, 0.5)}%` }} />
              );
              cursor = match.index + match.length;
            }
            if (cursor < text.length) {
              const pct = ((text.length - cursor) / text.length) * 100;
              segments.push(
                <div key={`gap-end`} className="match-bar-segment match-bar-gap" style={{ width: `${pct}%` }} />
              );
            }
            return segments;
          })()}
        </div>
        <div className="match-bar-labels">
          <span>0</span>
          <span>{text.length}</span>
        </div>
      </div>
    </div>
  );
}

export default MatchDetails;
