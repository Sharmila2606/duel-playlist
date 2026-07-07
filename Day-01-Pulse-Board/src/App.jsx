import { useState } from "react";
import "./App.css";
import MoodButton from "./components/MoodButton";

const moods = [
  {
    id: "happy",
    emoji: "\u{1F60A}",
    label: "Happy",
    quote: "Your energy is bright today. Share one small win with someone.",
    className: "happy",
  },
  {
    id: "focused",
    emoji: "\u{1F3AF}",
    label: "Focused",
    quote: "Pick one important task and give it your best 25 minutes.",
    className: "focused",
  },
  {
    id: "calm",
    emoji: "\u{1F33F}",
    label: "Calm",
    quote: "Stay steady. A quiet mind can still make strong progress.",
    className: "calm",
  },
  {
    id: "tired",
    emoji: "\u{1F634}",
    label: "Tired",
    quote: "Move gently today. A small step still counts.",
    className: "tired",
  },
  {
    id: "stressed",
    emoji: "\u{1F635}",
    label: "Stressed",
    quote: "Pause, breathe, and choose the next tiny action.",
    className: "stressed",
  },
];

function App() {
  const [selectedMood, setSelectedMood] = useState(null);
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  function handleMoodSelect(mood) {
    setSelectedMood(mood);
  }

  return (
    <main
      className={`app app-${selectedMood ? selectedMood.className : "default"}`}
    >
      <section
        className={`pulse-board ${
          selectedMood ? selectedMood.className : "default"
        }`}
      >
        <nav className="top-nav">
          <div className="brand">
            <span className="logo-mark">P</span>
            <span>Pulse</span>
          </div>
          <p className="today">{today}</p>
        </nav>

        <div className="header">
          <p className="eyebrow">Daily check-in</p>
          <h1>Daily Pulse Board</h1>
          <p className="subtitle">
            Choose your mood and get a quick message for your day.
          </p>
        </div>

        <div className="mood-grid">
          {moods.map((mood) => (
            <MoodButton
              key={mood.id}
              mood={mood}
              isSelected={selectedMood?.id === mood.id}
              onSelect={handleMoodSelect}
            />
          ))}
        </div>

        <div className="message-panel">
          {selectedMood ? (
            <>
              <div className="big-emoji">{selectedMood.emoji}</div>
              <h2>{selectedMood.label} pulse</h2>
              <p>{selectedMood.quote}</p>
            </>
          ) : (
            <>
              <div className="big-emoji">{"\u2728"}</div>
              <h2>No mood selected yet</h2>
              <p>Tap one mood button to update this board instantly.</p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
