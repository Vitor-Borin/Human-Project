import './PhaseButton.css';

export default function PhaseButton({ phaseImage, phaseText, className, onClick, isBlocked = false }) {
  const handleClick = () => {
    if (!isBlocked && onClick) {
      onClick();
    }
  };

  return (
    <button 
      className={`phase-button ${className || ''} ${isBlocked ? 'blocked' : ''}`} 
      onClick={handleClick}
      disabled={isBlocked}
    >
      <img 
        src={phaseImage} 
        alt={phaseText} 
        className="phase-image"
      />
      <span className="phase-text">{phaseText}</span>
    </button>
  );
}
