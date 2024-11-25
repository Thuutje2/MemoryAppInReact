import React from "react";
import Data from "./Data";
import Card from "./Card";
import styles from "../styles/GameBoard.module.css";

function GameBoard() {
    const [cardsArray, setCardsArray] = React.useState([]);
    const [moves, setMoves] = React.useState(0);
    const [firstCard, setFirstCard] = React.useState(null);
    const [secondCard, setSecondCard] = React.useState(null);
    // const [stopFlip, setStopFlip] = React.useState(false);
    const [won, setWon] = React.useState(0);
    const [winsHistory, setWinsHistory] = React.useState([]);  // History of each win (moves)


    React.useEffect(() => {
        const savedWins = JSON.parse(localStorage.getItem("winsHistory")) || [];
        setWinsHistory(savedWins);
        startNewGame();
    }, []);

    function startNewGame() {
        const shuffledArray = [...Data].sort(() => Math.random() - 0.5);
        setCardsArray(shuffledArray);
        setMoves(0);
        setFirstCard(null);
        setSecondCard(null);
        setWon(0);
    }

    function handleCardSelect(card) {
        firstCard ? setSecondCard(card) : setFirstCard(card);
    }

    React.useEffect(() => {
        if (firstCard && secondCard) {
            if (firstCard.name === secondCard.name) {
                setCardsArray((prev) =>
                    prev.map((card) =>
                        card.name === firstCard.name ? { ...card, matched: true } : card
                    )
                );
                setWon((prev) => prev + 1);
            }
            setTimeout(() => resetSelection(), 1000);
        }
    }, [firstCard, secondCard])

    function resetSelection() {
        setFirstCard(null);
        setSecondCard(null);
        setMoves((prev) => prev + 1);
    }

    React.useEffect(() => {
        if (won === Data.length / 2){
            const newWin = { moves, date: new Date().toLocaleString()};
            const updatedHistory = [...winsHistory, newWin].sort((a, b) => a.moves - b.moves);
            setWinsHistory(updatedHistory);
            localStorage.setItem("winsHistory", JSON.stringify(updatedHistory));
        }
    }, [won])

    return (
        <div className={styles.container}>
            <div className={styles.gameAndLeaderboard}>
                <div className={styles.gameBoard}>
                    <h2>{won === Data.length / 2 ? `You Won in ${moves} moves!` : "Memory Game"}</h2>

                    <div className={styles.board}>
                        {cardsArray.map((card) => (
                            <Card
                                key={card.id}
                                item={card}
                                handleSelectedCards={handleCardSelect}
                                toggled={card === firstCard || card === secondCard || card.matched}
                            />
                        ))}
                    </div>

                    <div className={styles.comments}>Moves: {moves}</div>
                    <button className={styles.button} onClick={startNewGame}>
                        New Game
                    </button>
                </div>

                <div className={styles.leaderboard}>
                    <h3>Leaderboard</h3>
                    <ul>
                        {winsHistory.map((win, index) => (
                            <li key={index}>
                                Round {index + 1}: {win.moves} moves ({win.date})
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default GameBoard;



