import { useContext, useEffect, useState } from "react";
import styles from './Board.module.css';
import Dice from "react-dice-roll";
import { PlayingContext } from "../../providers/PlayingProvider";
import { SettingsContext } from "../../providers/SettingsProvider";
import { Field } from "../../types/type";

type Property = {
    id: number;
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
        playingDispatch({ type: 'INIT_PLAYERS', defaultMoney: 100, defaultPosition: 0, players: [...settingsState.players] });
    }, [playingDispatch, settingsState.players]);


    useEffect(() => {
        const currentPlayer = playingState.players.find(player => player.id === currentPlayerId);
        if (currentPlayer && !currentPlayer.isBankrupt) {
            checkFinancialStatus(currentPlayerId);
        }
    }, [currentPlayerId, playingState.players, playingState.ownership, fields]);

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
    
       
        const currentPlayer = playingState.players.find(player => player.id === playerId);

        if (!currentPlayer) {
            return;
        }

        const newFieldId = calculateNewFieldId(currentPlayer.position, rollValue, fields);
        if (currentPlayer.isBankrupt) {
            setCurrentPlayerId((playerId % playingState.players.length) + 1);
            return;
        }
        const landedField = fields.find(field => field.id === newFieldId);
        console.log(landedField)

        if (landedField && landedField.type === "PROPERTY" && playingState.ownership[newFieldId] === undefined) {
            const propertyPrice = landedField.price;
            if ((currentPlayer?.money ?? 0) >= propertyPrice) {
                setShowBuyPropertyDialog(true);
            } else {
                setCurrentPlayerId((playerId % playingState.players.length) + 1);
            }
        } else {
            setCurrentPlayerId((playerId % playingState.players.length) + 1);
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
            setCurrentPlayerId((currentPlayerId % playingState.players.length) + 1);
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

    const checkFinancialStatus = (playerId: number) => {
        const currentPlayer = playingState.players.find(player => player.id === playerId);
        if (currentPlayer && currentPlayer.money < 0) {
            const propertiesOwned = findPropertiesOwnedByPlayer(playerId);
            if (propertiesOwned.length > 0) {
                const totalValueOfProperties = propertiesOwned.reduce((acc, property) => {
                    if (property.type === "PROPERTY") {
                        return acc + property.price;
                    }
                    return acc;
                }, 0);
                if (totalValueOfProperties + currentPlayer.money >= 0) {
                    setShowSellPropertyDialog(true);
                } else {
                    handleBankruptcy(playerId);
                }
            } else {
                handleBankruptcy(playerId);
            }
        }
    };
    
    const handleBankruptcy = (playerId: number) => {
        playingDispatch({ type: "DECLARE_BANKRUPTCY", playerId });
        alert(`Hráč: ${playerId} je v bankrotu a to znamená konec hry pro něj`);
        setCurrentPlayerId((playerId % playingState.players.length) + 1);
    };

    function getFieldIndex(fieldIndex: number) {
        const firstRowEnd = 10;
        const thirdRangeEnd = 30;
    
        if (fieldIndex <= firstRowEnd) {
            return fieldIndex;
        }
        else    {
            const firstRangeStart = 31;
            const firstRangeEnd = 39;
            const secondRangeStart = 11;
            const secondRangeEnd = 28;
        
            if (fieldIndex > secondRangeEnd) {
                const specialrange =  fieldIndex - 29;
                return thirdRangeEnd - specialrange;
            }
            else if (fieldIndex >= firstRangeStart && fieldIndex <= firstRangeEnd) {
                let indexWithinRange = fieldIndex - firstRangeStart;
                return indexWithinRange % 2 === 0 ? 
                       secondRangeStart + (indexWithinRange / 2) : 
                       firstRangeEnd - ((indexWithinRange - 1) / 2);
            } else if (fieldIndex >= secondRangeStart && fieldIndex <= secondRangeEnd) {
                let indexWithinRange = fieldIndex - secondRangeStart;
                return indexWithinRange % 2 === 0 ? 
                       firstRangeEnd - (indexWithinRange / 2) : 
                       secondRangeStart + ((indexWithinRange + 1) / 2) - 1;
            }
    }
}
    return (
        <>
            <div className={styles["playing--zone"]}>
                <div className={styles["board"]}>
                {fields.map((field) => (
    <div className={styles["field"]} key={field.id} id={String(field.id)}>
        {field.type === "PROPERTY" && playingState.ownership[field.id] !== undefined && (
            <div
                className={styles["property-owner"]}
                style={{ backgroundColor: getPlayerColor(playingState.ownership[field.id]) }}>
                {playingState.players.find(player => player.id === playingState.ownership[field.id])?.id || 'Owned'}
            </div>
        )}
        {playingState.players.map((player, playerIndex) => (
            player.position === field.id && (
                <div
                    key={playerIndex}
                    className={styles["player"]}
                    style={{ backgroundColor: getPlayerColor(playerIndex + 1) }}
                ></div>
            )
        ))}
    </div>
))}

                    <div className={styles["blank_field"]}></div>
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

function calculateNewFieldId(currentPositionId: number, rollValue: number, fields: Field[]) {
    const currentField = fields.find(field => field.id === currentPositionId);
    if (!currentField) return currentPositionId; 

    let targetPosition = (fields.indexOf(currentField) + rollValue) % fields.length;
    return fields[targetPosition].id;
}

function getPlayerColor(playerIndex: number) {
    return playerIndex === 0 ? 'red' : 'blue';
}

export default Board;