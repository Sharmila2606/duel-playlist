function MoodButton({ mood, isSelected, onSelect }) {
  return (
    <button
      className={`mood-button ${isSelected ? "selected" : ""}`}
      onClick={() => onSelect(mood)}
    >
      <span className="mood-emoji">{mood.emoji}</span>
      <span>{mood.label}</span>
    </button>
  );
}

export default MoodButton;
