import { useContext, useEffect, useState } from "react";
import styles from './Board.module.css';
import Dice from "react-dice-roll";
import { PlayingContext } from "../../providers/PlayingProvider";
import { SettingsContext } from "../../providers/SettingsProvider";

type Property = {
    name: string;
    type: "PROPERTY";
    price: number;
    rent: number;
    houses: number;
}

const Board = ({ currentPlayerId, setCurrentPlayerId }: { currentPlayerId: number, setCurrentPlayerId: (id: number) => void }) => {
    const [settingsState] = useContext(SettingsContext);
    const [playingState, playingDispatch] = useContext(PlayingContext);
    const [showBuyPropertyDialog, setShowBuyPropertyDialog] = useState(false);
    const [showSellPropertyDialog, setShowSellPropertyDialog] = useState(false);
    const [nextPlayerId, setNextPlayerId] = useState(0);
    const [diceResults, setDiceResults] = useState({ dice1: null, dice2: null });

    const { fields } = playingState;

    useEffect(() => {
        playingDispatch({ type: 'INIT_PLAYERS', defaultMoney: 1500, defaultPosition: 0, players: [...settingsState.players] });
    }, [playingDispatch, settingsState.players]);

    const handleDiceRoll = (diceNumber: string, value: number) => {
        setDiceResults(prevResults => ({
            ...prevResults,
            [diceNumber]: value
        }));

        if ((diceNumber === 'dice1' && diceResults.dice2 !== null) || (diceNumber === 'dice2' && diceResults.dice1 !== null)) {
            const totalRoll = (diceResults.dice1 || 0) + (diceResults.dice2 || 0) + value;
            movePlayer(currentPlayerId, totalRoll);

            setDiceResults({ dice1: null, dice2: null });
        }
    };

    const movePlayer = (playerId: number, rollValue: number) => {
        playingDispatch({ type: 'MOVE_PLAYER', playerId, rollValue });
        const nextPlayerIdTemp = (playerId % playingState.players.length) + 1;

        const currentPlayer = playingState.players.find(player => player.id === playerId);
        const newPosition = currentPlayer ? (currentPlayer.position + rollValue) % fields.length : 0;
        const landedField = fields[newPosition];

        if (landedField.type === "PROPERTY" && playingState.ownership[newPosition] === undefined) {
            setShowBuyPropertyDialog(true);
            setNextPlayerId(nextPlayerIdTemp);
        } else {
            setCurrentPlayerId(nextPlayerIdTemp);
        }
    };

    const handleDialogResponse = (response: boolean) => {
        if (response) {
            const newPosition = playingState.players.find(player => player.id === currentPlayerId)?.position || 0;
            if (fields[newPosition].type === "PROPERTY" && playingState.ownership[newPosition] === undefined) {
                const propertyField = fields[newPosition] as Property;
                const propertyPrice = propertyField.price;

                playingDispatch({
                    type: "BUY_PROPERTY",
                    playerId: currentPlayerId,
                    fieldIndex: newPosition,
                    price: propertyPrice
                });
            }
        }
        setShowBuyPropertyDialog(false);
        if (nextPlayerId) {
            setCurrentPlayerId(nextPlayerId);
            setNextPlayerId(0);
        }
    };


    const findPropertiesOwnedByPlayer = (playerId: number) => {
        return fields.filter((_, index) => playingState.ownership[index] === playerId);
    };

    const handleSellProperty = (playerId: number, fieldIndex: number, price: number) => {
        playingDispatch({ type: 'SELL_PROPERTY', playerId, fieldIndex, price });
        setShowSellPropertyDialog(false);
    }


    return (
        <>
            <div className={styles["playing--zone"]}>
                <div className={styles["board"]}>
                    {fields.map((field, fieldIndex) => (
                        <div className={styles["field"]} key={fieldIndex}>
                            {field.type === "PROPERTY" && playingState.ownership[fieldIndex] !== undefined && (
                                <div
                                    className={styles["property-owner"]}
                                    style={{ backgroundColor: getPlayerColor(playingState.ownership[fieldIndex]) }}>
                                    {playingState.players.find(player => player.id === playingState.ownership[fieldIndex])?.id || 'Owned'}
                                </div>
                            )}
                            {playingState.players.map((player, playerIndex) => (
                                player.position === fieldIndex && (
                                    <div
                                        key={playerIndex}
                                        className={styles["player"]}
                                        style={{ backgroundColor: getPlayerColor(playerIndex + 1) }}
                                    ></div>
                                )
                            ))}
                        </div>
                    ))}

                    {showBuyPropertyDialog && (
                        <div className={styles.overlay}>
                            <div className={styles.modal}>
                                <h2>Koupit nemovitost?</h2>
                                <p>Chcete koupit tuto nemovitost za 100?</p>
                                <button onClick={() => handleDialogResponse(true)}>Koupit</button>
                                <button onClick={() => handleDialogResponse(false)}>Zrušit</button>
                            </div>
                        </div>
                    )}

                    {showSellPropertyDialog && (
                        <div className={styles.overlay}>
                            <div className={styles.modal}>
                                <h2>Sell Property</h2>
                                {findPropertiesOwnedByPlayer(currentPlayerId).map((property, index) => (
                                    <div key={index}>
                                        {property.type === "PROPERTY" && (
                                            <>
                                                <p>{property.name} - Sell for {property.price}</p>
                                                <button onClick={() => handleSellProperty(currentPlayerId, index, property.price)}>Sell</button>
                                            </>
                                        )}
                                    </div>
                                ))}
                                <button onClick={() => setShowSellPropertyDialog(false)}>Cancel</button>
                            </div>
                        </div>
                    )}

                </div>
                <div className={styles["dices"]}>
                    <Dice
                        size={100} onRoll={(value: number) => handleDiceRoll('dice1', value)} />
                    <Dice size={100} onRoll={(value: number) => handleDiceRoll('dice2', value)} />
                </div>
            </div>
        </>
    );
};

function getPlayerColor(playerIndex: number) {
    return playerIndex === 0 ? 'red' : 'blue';
}

export default Board;