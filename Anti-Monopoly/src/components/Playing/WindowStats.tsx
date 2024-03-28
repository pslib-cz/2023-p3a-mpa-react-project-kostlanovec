import { useContext } from "react";
import { PlayingContext } from "../../providers/PlayingProvider";

const WindowsStats = () => {

        const [state] = useContext(PlayingContext);
        const { players } = state; 
        
        return (
                <div>
                <h2>Players</h2>
                <ul>
                {players.map(player => (
                    <li key={player.id}>
                        ID: {player.id}, Role: {player.role}, money: {player.money}, position: {player.position},
                    </li>
                ))}
            </ul>
                </div>
        );
};

export default WindowsStats;