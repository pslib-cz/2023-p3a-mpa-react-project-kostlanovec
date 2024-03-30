import { useContext, useEffect, useState } from "react";
import styles from './Board.module.css';
import Dice from "react-dice-roll";
import { PlayingContext } from "../../providers/PlayingProvider";
import { SettingsContext } from "../../providers/SettingsProvider";
import { Property } from "../../types/type";

const Board = ({ currentPlayerId, setCurrentPlayerId }: { currentPlayerId: number, setCurrentPlayerId: (id: number) => void }) => {
    
    const [settingsState] = useContext(SettingsContext);
    const [playingState, playingDispatch] = useContext(PlayingContext);
    const [showBuyPropertyDialog, setShowBuyPropertyDialog] = useState(false);
    const [showSellPropertyDialog, setShowSellPropertyDialog] = useState(false);
    const [nextPlayerId, setNextPlayerId] = useState(0);
    const [hoveredFieldId, setHoveredFieldId] = useState<number | null>(null);

    const handleMouseEnter = (fieldId: number) => {
        setHoveredFieldId(fieldId);
    };
    
    const handleMouseLeave = () => {
        setHoveredFieldId(null);
    };

    const renderPropertyDetails = () => {
        if (!hoveredFieldId) return null;
        const hoveredField = fields.find(field => field.id === hoveredFieldId);
        if (!hoveredField || hoveredField.type !== "PROPERTY") return null;

        return (
            <div className={styles["property-details"]} style={{ display: 'block' }}>
                <h3>Detaily nemovitosti</h3>
                <p>Název: {hoveredField.name}</p>
                <p>Cena: {hoveredField.price}</p>
            </div>
        );
    };
    const { fields } = playingState;

    useEffect(() => {
        playingDispatch({ type: 'INIT_PLAYERS', defaultMoney: 2000, defaultPosition: 1, players: [...settingsState.players] });
    }, [playingDispatch, settingsState.players]);


    useEffect(() => {
        const currentPlayer = playingState.players.find(player => player.id === currentPlayerId);
        if (currentPlayer && !currentPlayer.isBankrupt) {
            checkFinancialStatus(currentPlayerId);
        }
    }, [currentPlayerId, playingState.players, playingState.ownership, fields]);

    const handleDiceRoll = (value: number) => {
        movePlayer(currentPlayerId, value);
    };

    const movePlayer = (playerId: number, rollValue: number) => {
        const currentPlayer = playingState.players.find(player => player.id === playerId);
        if (!currentPlayer) return;
    
        const currentPositionId = currentPlayer.position;
        const newPositionId = ((currentPositionId - 1 + rollValue) % fields.length) + 1;

        playingDispatch({ type: 'MOVE_PLAYER', playerId, newPositionId: newPositionId});
    
        const landedField = fields.find(field => field.id === newPositionId);
        if (landedField && landedField.type === "PROPERTY" && playingState.ownership[landedField.id] === undefined) {
            const propertyPrice = landedField.price;
            if ((currentPlayer.money ?? 0) >= propertyPrice) {
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
    
            const newPositionId = playingState.players.find(player => player.id === currentPlayerId)?.position || 0;
            console.log(newPositionId);
            const propertyField = fields.find(field => field.id === newPositionId) as Property;
            console.log(propertyField);
            if (propertyField && propertyField.type === "PROPERTY" && playingState.ownership[newPositionId] === undefined) {
                const propertyPrice = propertyField.price;
                playingDispatch({
                    type: "BUY_PROPERTY",
                    playerId: currentPlayerId,
                    fieldId: newPositionId,
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

    const handleSellProperty = (playerId: number, fieldId: number, price: number) => {
        playingDispatch({ type: 'SELL_PROPERTY', playerId, fieldId, price });
        setShowSellPropertyDialog(false);
    };

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

    return (
        <>
            <div className={styles["playing--zone"]}>
                <div className={styles["board"]}>
                {fields.map((field) => (
        <div className={styles["field"]} key={field.id} id={String(field.id)}
        onMouseEnter={() => field.type === "PROPERTY" && handleMouseEnter(field.id)}
        onMouseLeave={handleMouseLeave}>
            {field.type === "PROPERTY" && (
                <div>
                      <div>{field.name}</div>

                    {playingState.ownership[field.id] !== undefined && (
                        <div
                            className={styles["property-owner"]}
                            style={{ backgroundColor: getPlayerColor(playingState.ownership[field.id]) }}>
                                <div>
                                    {playingState.players.find(player => player.id === playingState.ownership[field.id])?.id
                                        ? `HRÁČ ${playingState.players.find(player => player.id === playingState.ownership[field.id])?.id}`
                                        : ''}
                                </div>
                        </div>
                    )}
                    <div>{field.price}</div>
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
                    <Dice size={100} onRoll={handleDiceRoll} />
                </div>
                {renderPropertyDetails()}
            </div>
        </>
    );
};

function getPlayerColor(playerIndex: number) {
    return playerIndex === 0 ? 'red' : 'blue';
}

export default Board;