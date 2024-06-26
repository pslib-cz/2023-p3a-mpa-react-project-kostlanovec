import { useState } from 'react';
import Board from "./Board";
import styles from './Playing.module.css';

const Playing = () => {
    const [currentPlayerId, setCurrentPlayerId] = useState(1);

    return (
        <>
            <div className={styles["playing--layout"]}>
                <Board currentPlayerId={currentPlayerId} setCurrentPlayerId={setCurrentPlayerId} />
            
            </div>
        </>
    );
};

export default Playing;