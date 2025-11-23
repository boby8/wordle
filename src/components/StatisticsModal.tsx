import { useEffect, useState } from "react";
import type { Statistics } from "../types/game";
import "./StatisticsModal.css";

interface StatisticsModalProps {
  statistics: Statistics;
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  todayGuesses?: number;
  wonToday?: boolean;
  onShare?: () => void;
}

export function StatisticsModal({
  statistics,
  isOpen,
  onClose,
  onReset,
  wonToday,
  onShare,
}: StatisticsModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && document.body) {
      document.body.style.overflow = "hidden";
    } else if (document.body) {
      document.body.style.overflow = "";
    }
    return () => {
      if (document.body) {
        document.body.style.overflow = "";
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const winPercentage =
    statistics.gamesPlayed > 0
      ? Math.round((statistics.gamesWon / statistics.gamesPlayed) * 100)
      : 0;

  const maxDistribution = Math.max(...statistics.guessDistribution, 1);

  const handleShare = async () => {
    if (onShare) {
      onShare();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h2 className="modal-title">Statistics</h2>

        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{statistics.gamesPlayed}</div>
            <div className="stat-label">Played</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{winPercentage}</div>
            <div className="stat-label">Win %</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{statistics.currentStreak}</div>
            <div className="stat-label">Current Streak</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{statistics.maxStreak}</div>
            <div className="stat-label">Max Streak</div>
          </div>
        </div>

        <div className="guess-distribution">
          <h3 className="distribution-title">Guess Distribution</h3>
          {[1, 2, 3, 4, 5, 6].map((guessNum, index) => {
            const count = statistics.guessDistribution[index] || 0;
            const percentage =
              maxDistribution > 0 ? (count / maxDistribution) * 100 : 0;

            return (
              <div key={guessNum} className="distribution-row">
                <div className="distribution-number">{guessNum}</div>
                <div className="distribution-bar-container">
                  <div
                    className="distribution-bar"
                    style={{ width: `${percentage}%` }}
                  >
                    {count > 0 && (
                      <span className="distribution-count">{count}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {wonToday !== undefined && onShare && (
          <div className="modal-actions">
            <button
              className="share-button"
              onClick={handleShare}
              disabled={copied}
            >
              {copied ? "✓ Copied!" : "📤 Share"}
            </button>
          </div>
        )}

        <button className="reset-button" onClick={onReset}>
          Reset Statistics
        </button>
      </div>
    </div>
  );
}
