import React from "react";
import styles from './Board.module.css';


const Board = () => {
    const fields: string[] = Array(169).fill(null);

    return (
        <>
        <div className={styles["board"]}>
            {fields.map((_, i) => {
                const row = Math.floor(i / 13);
                const col = i % 10;
                let className = styles["field"];
                if (row === 0 && col === 0) { // První řádek a první sloupec
                    className = `${styles["field"]} ${styles["double-height"]} ${styles["double-width"]}`;
                } else if (row === 12 && col === 12) { // Poslední řádek a poslední sloupec
                    className = `${styles["field"]} ${styles["double-height"]} ${styles["double-width"]}`;
                } else if (row === 0 || col === 0) { // První řádek nebo první sloupec
                    className = `${styles["field"]} ${styles["double-height"]}`;
                } else if (row === 12 || col === 12) { // Poslední řádek nebo poslední sloupec
                    className = `${styles["field"]} ${styles["double-width"]}`;
                }
                return <div className={className} key={i}></div>;
            })}
        </div>
        </>
    );
};

export default Board;
