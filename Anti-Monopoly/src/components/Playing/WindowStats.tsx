import { useContext } from "react";
import { PlayingContext } from "../../providers/PlayingProvider";
import styles from './WindowStats.module.css';

const WindowsStats = ({ currentPlayerId }: { currentPlayerId: number }) => {
    const [state] = useContext(PlayingContext);
    const { players } = state; 
    const currentPlayer = players.find(player => player.id === currentPlayerId);
    
    return (
        <div>
            <div className={styles["current-player"]}>
                <h2>Current Player: {currentPlayer ? `Player ${currentPlayer.id}` : 'Loading...'}</h2>
                {currentPlayer && (
                    <ul>
                        <li>Money: ${currentPlayer.money}</li>
                        <li>Position: {currentPlayer.position}</li>
                        <li>Role: {currentPlayer.role}</li>
                    </ul>
                )}
            </div>
        </div>
    );
};

export default WindowsStats;