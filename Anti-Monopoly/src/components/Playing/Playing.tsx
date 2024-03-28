import React, { useState } from 'react';
import Board from "./Board";
import WindowsStats from "./WindowStats";
import styles from './Playing.module.css';

const Playing = () => {
    const [currentPlayerId, setCurrentPlayerId] = useState(1);

    return (
        <>
            <div className={styles["playing--layout"]}>
                <Board currentPlayerId={currentPlayerId} setCurrentPlayerId={setCurrentPlayerId} />
                <WindowsStats currentPlayerId={currentPlayerId} />
            </div>
        </>
    );
};

export default Playing;
