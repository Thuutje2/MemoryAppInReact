import React from "react";
import Data from "./Data";
import Card from "./Card";
import styles from "../styles/GameBoard.module.css";

function GameBoard() {
    const [cardsArray, setCardsArray] = React.useState([]);
    const [moves, setMoves] = React.useState(0);
    const [firstCard, setFirstCard] = React.useState(null);
    const [secondCard, setSecondCard] = React.useState(null);
    const [stopFlip, setStopFlip] = React.useState(false);
    const [won, setWon] = React.useState(0);
    const [winsHistory, setWinsHistory] = React.useState([]);  // History of each win (moves)

    // Load leaderboard data from localStorage
    React.useEffect(() => {
        const savedWinsHistory = JSON.parse(localStorage.getItem("winsHistory")) || [];
        setWinsHistory(savedWinsHistory);
    }, []);

    function NewGame() {
        setTimeout(() => {
            const randomOrderArray = Data.sort(() => 0.5 - Math.random());
            setCardsArray(randomOrderArray);
            setMoves(0);
            setFirstCard(null);
            setSecondCard(null);
            setWon(0);
        }, 1200);
    }

    // Function to handle selected cards
    function handleSelectedCards(item) {
        if (firstCard !== null && firstCard.id !== item.id) {
            setSecondCard(item);
        } else {
            setFirstCard(item);
        }
    }

    // Check if the selected cards match and update game state
    React.useEffect(() => {
        if (firstCard && secondCard) {
            setStopFlip(true);

            if (firstCard.name === secondCard.name) {
                setCardsArray((prevArray) => {
                    return prevArray.map((unit) => {
                        if (unit.name === firstCard.name) {
                            return { ...unit, matched: true };
                        } else {
                            return unit;
                        }
                    });
                });
                setWon((preVal) => preVal + 1);
                removeSelection();
            } else {
                setTimeout(() => {
                    removeSelection();
                }, 1000);
            }
        }
    }, [firstCard, secondCard]);

    // Remove selection after checking for match
    function removeSelection() {
        setFirstCard(null);
        setSecondCard(null);
        setStopFlip(false);
        setMoves((prevValue) => prevValue + 1);
    }

    function addWin() {
        if (won === 6) {  // Only add win when all cards are matched
            const newWin = { moves, date: new Date() };
            const updatedWinsHistory = [...winsHistory, newWin];
            setWinsHistory(updatedWinsHistory);

            // Save the updated history to localStorage
            localStorage.setItem("winsHistory", JSON.stringify(updatedWinsHistory));
        }
    }

    React.useEffect(() => {
        NewGame();
    }, []);

    const sortedWins = [...winsHistory].sort((a, b) => a.moves - b.moves);

    React.useEffect(() => {
        if (won === 6) {
            addWin();
        }
    }, [won]);

    return (
        <div className={styles.container}>
            <div className={styles.gameAndLeaderboard}>
                {/* Game section */}
                <div className={styles.gameBoard}>
                    {/* Game board and current win status */}
                    <div className={styles.header}>
                        {won === 6 ? (
                            <h2>You Won in {moves} moves</h2>
                        ) : (
                            <h1>Memory Game</h1>
                        )}
                    </div>

                    {/* Game board */}
                    <div className={styles.board}>
                        {
                            cardsArray.map((item) => (
                                <Card
                                    item={item}
                                    key={item.id}
                                    handleSelectedCards={handleSelectedCards}
                                    toggled={item === firstCard || item === secondCard || item.matched === true}
                                    stopflip={stopFlip}
                                />
                            ))
                        }
                    </div>

                    {/* Display moves and New Game button */}
                    {won !== 6 ? (
                        <div className={styles.comments}>Moves: {moves}</div>
                    ) : (
                        <div className={styles.comments}>You Won in {moves} moves</div>
                    )}

                    <button className={styles.button} onClick={NewGame}>
                        New Game
                    </button>
                </div>

                {/* Leaderboard section */}
                <div className={styles.leaderboard}>
                    <h3>Leaderboard</h3>
                    <ul>
                        {sortedWins.map((win, index) => (
                            <li key={index}>
                                Round {index + 1}: {win.moves} moves ({win.date.toLocaleString()})
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default GameBoard;



