import { useContext } from "react";
import { PlayingContext } from "../../providers/PlayingProvider";
import styles from './WindowStats.module.css';
import {Role} from "../../types/type";

const WindowsStats = ({ currentPlayerId }: { currentPlayerId: number }) => {
    const [state, ] = useContext(PlayingContext);
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

    const sortedPlayers = [...players]
    .filter(player => !player.isBankrupt)
    .sort((a, b) => {
        if (a.id > currentPlayerId && b.id > currentPlayerId) return a.id - b.id;
        if (a.id < currentPlayerId && b.id < currentPlayerId) return a.id - b.id;
        return a.id > currentPlayerId ? -1 : 1;
    });

    console.log(sortedPlayers);

    return (
        <div className="Windows-stats">
            <div className={styles["current-player"]}>
                {currentPlayer && (
                    <div className={styles["current-player--stats"]} >
                        <img className={styles["imground"]} src={getImageForRole(currentPlayer.role)} alt={currentPlayer.role} />
                        <h2>Hráč <span style={{ color: currentPlayer.color }}>{currentPlayer.id}</span></h2>
                        <h3>Finance</h3>
                        <p>{currentPlayer.money}</p>
                        <h3>Pozice</h3>
                        <p>{currentPlayer.position}</p>
                    </div>
                )}
                {sortedPlayers.filter(player => player.id !== currentPlayerId).map(player => (
                    <div key={player.id} className={styles["player--stats"]}>
                        <img className={styles["imground"]} src={getImageForRole(player.role)} alt={player.role} />
                        <h2>Hráč <span style={{ color: player.color }}>{player.id}</span></h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WindowsStats;
