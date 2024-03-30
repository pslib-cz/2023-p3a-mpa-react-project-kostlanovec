import { useContext } from "react";
import { PlayingContext } from "../../providers/PlayingProvider";
import styles from './WindowStats.module.css';

enum Role {
    CONCURENT = "CONCURENT",
    MONOPOLIST = "MONOPOLIST"
}

const WindowsStats = ({ currentPlayerId }: { currentPlayerId: number }) => {
        const [state] = useContext(PlayingContext);
        const { players } = state; 
        const currentPlayer = players.find(player => player.id === currentPlayerId);
        
        const getImageForRole = (role: Role) => {
            switch(role) {
                case Role.MONOPOLIST:
                    return "img/monopolista.jpg";
                default:
                    return "img/konkurent.jpg";
            }
        };

        return (
            <>
                <div className={styles["current-player"]}>

                    {currentPlayer && (
                        <div className={styles["current-player--stats"]} >
                            <img src={getImageForRole(currentPlayer.role)} alt={currentPlayer.role} />
                            <h2>Hráč {currentPlayer.id}</h2>
                            <h3>Finance</h3>
                            <p>{currentPlayer.money}</p>
                            <h3>Pozice</h3>
                            <p>{currentPlayer.position}</p>
                        </div>
                    )}
                </div>
            </>
        );
    };

export default WindowsStats;