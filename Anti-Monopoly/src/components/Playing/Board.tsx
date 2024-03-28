import { useContext, useEffect, useState } from "react";
import styles from './Board.module.css';
import Dice from "react-dice-roll";
import { PlayingContext } from "../../providers/PlayingProvider";
import { SettingsContext } from "../../providers/SettingsProvider";

const Board = () => {
    const [settingsState] = useContext(SettingsContext);
    const [playingState, playingDispatch] = useContext(PlayingContext);
    const [currentPlayerId, setCurrentPlayerId] = useState(1);
    const [openPropertyDialog, setOpenPropertyDialog] = useState(false);
    const [showChangeCardDialog, setShowChangeCardDialog] = useState(false);
    const [showSellPropertyDialog, setShowSellPropertyDialog] = useState(false);

    const { fields } = playingState;

    useEffect(() => {
        playingDispatch({ type: 'INIT_PLAYERS', defaultMoney: 1500, defaultPosition: 0, players: [...settingsState.players] });
    }, [playingDispatch, settingsState.players]);

    const movePlayer = (playerId: number, rollValue: number) => {
        playingDispatch({ type: 'MOVE_PLAYER', playerId, rollValue });
        const nextPlayerId = (playerId % playingState.players.length) + 1;
        setCurrentPlayerId(nextPlayerId);
    };

    return (
        <>
            <div className={styles["board"]}>
                {fields.map((field, fieldIndex) => (
                    <div className={styles["field"]} key={fieldIndex}>
                        {field.type === "PROPERTY" && playingState.ownership[fieldIndex] !== undefined && (
                            <div className={styles["property-owner"]} style={{ backgroundColor: getPlayerColor(playingState.ownership[fieldIndex]) }}>
                                Owned
                            </div>
                        )}
                        {playingState.players.map((player, playerIndex) => (
                            player.position === fieldIndex && (
                                <div
                                    key={playerIndex}
                                    className={styles["player"]}
                                    style={{ backgroundColor: getPlayerColor(playerIndex) }}
                                ></div>
                            )
                        ))}
                    </div>
                ))}
                <Dice size={100} onRoll={(value) => movePlayer(currentPlayerId, value)} />
            </div>
        </>
    );
};

function getPlayerColor(playerIndex : number) {
    return playerIndex === 0 ? 'red' : 'blue';
}

export default Board;
