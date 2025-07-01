import { useState } from 'react'
import './App.css'

const EMOJIS = ['🐶','🐱','🦊','🐻','🐼','🐸','🦁','🐵'];
function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createShuffledDeck() {
  const deck = shuffle([...EMOJIS, ...EMOJIS]).map((emoji, idx) => ({
    id: idx,
    emoji,
    flipped: false,
    matched: false
  }));
  return deck;
}

function App() {
  const [cards, setCards] = useState(createShuffledDeck());
  const [flipped, setFlipped] = useState([]); // store indices of flipped cards
  const [matchedCount, setMatchedCount] = useState(0);
  const [lock, setLock] = useState(false);

  const handleFlip = (idx) => {
    if (lock || cards[idx].flipped || cards[idx].matched) return;
    const newFlipped = [...flipped, idx];
    const newCards = cards.map((card, i) => i === idx ? { ...card, flipped: true } : card);
    setCards(newCards);
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setLock(true);
      setTimeout(() => {
        const [i1, i2] = newFlipped;
        if (newCards[i1].emoji === newCards[i2].emoji) {
          const updated = newCards.map((card, i) =>
            i === i1 || i === i2 ? { ...card, matched: true } : card
          );
          setCards(updated);
          setMatchedCount(matchedCount + 1);
        } else {
          const updated = newCards.map((card, i) =>
            i === i1 || i === i2 ? { ...card, flipped: false } : card
          );
          setCards(updated);
        }
        setFlipped([]);
        setLock(false);
      }, 1000);
    }
  };

  const handleReset = () => {
    setCards(createShuffledDeck());
    setFlipped([]);
    setMatchedCount(0);
    setLock(false);
  };

  const allMatched = matchedCount === EMOJIS.length;

  return (
    <div className="memory-game">
      <h1>Memory Card Flip Game</h1>
      <button onClick={handleReset}>Reset Game</button>
      {allMatched && <div className="congrats">🎉 Congratulations! You matched all pairs! 🎉</div>}
      <div className="card-grid">
        {cards.map((card, idx) => (
          <div
            key={card.id}
            className={`card${card.flipped || card.matched ? ' flipped' : ''}`}
            onClick={() => handleFlip(idx)}
          >
            <div className="card-inner">
              <div className="card-front">❓</div>
              <div className="card-back">{card.emoji}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App
