import "./HowToPlayModal.css";

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowToPlayModal({ isOpen, onClose }: HowToPlayModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="how-to-play-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h2 className="modal-title">How To Play</h2>

        <div className="how-to-play-rules">
          <p className="main-rule">Guess the Wordle in 6 tries.</p>
          
          <ul className="rules-list">
            <li>Each guess must be a valid 5-letter word.</li>
            <li>The color of the tiles will change to show how close your guess was to the word.</li>
          </ul>
        </div>

        <div className="examples-section">
          <h3 className="examples-title">Examples</h3>

          <div className="example">
            <div className="example-row">
              <div className="example-tile tile-correct">W</div>
              <div className="example-tile">O</div>
              <div className="example-tile">R</div>
              <div className="example-tile">D</div>
              <div className="example-tile">Y</div>
            </div>
            <p className="example-text">
              <strong>W</strong> is in the word and in the correct spot.
            </p>
          </div>

          <div className="example">
            <div className="example-row">
              <div className="example-tile">L</div>
              <div className="example-tile tile-present">I</div>
              <div className="example-tile">G</div>
              <div className="example-tile">H</div>
              <div className="example-tile">T</div>
            </div>
            <p className="example-text">
              <strong>I</strong> is in the word but in the wrong spot.
            </p>
          </div>

          <div className="example">
            <div className="example-row">
              <div className="example-tile">R</div>
              <div className="example-tile">O</div>
              <div className="example-tile">G</div>
              <div className="example-tile tile-absent">U</div>
              <div className="example-tile">E</div>
            </div>
            <p className="example-text">
              <strong>U</strong> is not in the word in any spot.
            </p>
          </div>
        </div>

        <div className="how-to-play-footer">
          <p>A new puzzle is released each day!</p>
        </div>
      </div>
    </div>
  );
}

