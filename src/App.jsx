import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import Dice from "./components/Dice";
import Confetti from "react-confetti";

import "./App.css";

function App() {
  const [allDice, setAllDice] = useState(generateDice());
  const [tenzies, setTenzies] = useState(false);
  const { width, height } = getWindowDimensions();

  const diceElements = allDice.map((dice) => (
    <Dice
      key={dice.id}
      value={dice.value}
      isHeld={dice.isHeld}
      id={dice.id}
      holdDice={() => holdDice(dice.id)}
    />
  ));


  useEffect(() => {
    const allHeld = allDice.every((dice) => dice.isHeld);
    const allEqual = new Set(allDice.map((dice) => dice.value)).size === 1;
    if (allHeld && allEqual) {
      setTenzies(true);
      console.log("Winner");
    }
  }, [allDice]);

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }

  function generateSingle() {
    return {
      id: nanoid(),
      value: Math.floor(Math.random() * 6) + 1,
      isHeld: false,
    };
  }

  function generateDice() {
    let all_dice = [];
    for (let i = 0; i < 10; i++) {
      all_dice.push(generateSingle());
    }
    return all_dice;
  }

  function rollDice() {
    let newAllDice = [];
    if (!tenzies) {
      allDice.forEach((dice) => {
        if (!dice.isHeld) {
          newAllDice.push(generateSingle());
        } else {
          newAllDice.push(dice);
        }
      });
    } else {
      setTenzies(false);
      newAllDice = generateDice();
    }

    setAllDice(newAllDice);
  }

  function holdDice(id) {
    const newAllDice = allDice.map((dice) => {
      if (dice.id == id) {
        dice.isHeld = !dice.isHeld;
      }
      return dice;
    });

    setAllDice(newAllDice);
  }

  function renderGame() {
    return (
      <>
        <h1 className="title">TENZIES</h1>
        <p className="description">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
      </>
    );
  }

  function renderGameWin() {
    return (
      <>
        <h1 className="title">You Won!</h1>
        <p className="description">Thank you for playing this little game!</p>
      </>
    );
  }

  return (
    <main>
      {tenzies && (
        <Confetti recycle={false} width={width - 10} height={height - 10} />
      )}
      <div className="tenzies-container">
        {tenzies ? renderGameWin() : renderGame()}
        <div className="dice-container">{diceElements}</div>
        <button className="btn-roll" onClick={rollDice}>
          {tenzies ? "New Game" : "Roll"}
        </button>
      </div>
    </main>
  );
}

export default App;
