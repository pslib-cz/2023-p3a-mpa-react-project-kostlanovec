import React from "react";
import styles from './Board.module.css';
const Board = () => {
    const fields: string[] = Array(12).fill(null);

    return (
        <>
        <div className={styles["board"]}>
            {fields.map((_, i) => (
                <div className={styles["field"]} key={i}>
                </div>
            ))}
        </div>
        </>
    );
};

export default Board;