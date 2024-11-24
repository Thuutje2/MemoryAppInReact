// Card.js
import React from "react";
import styles from "../styles/Card.module.css";  // Import Card.module.css

function Card({ item, handleSelectedCards, toggled, stopflip }) {
    return (
        <div className={styles.item}>
            <div className={toggled ? styles.toggled : ""}>
                <img className={styles.face} src={item.img} alt="face" />
                <div
                    className={styles.back}
                    onClick={() => !stopflip && handleSelectedCards(item)}
                >
                </div>
            </div>
        </div>
    );
}

export default Card;
