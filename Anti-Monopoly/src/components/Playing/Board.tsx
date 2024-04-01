import { useContext, useEffect, useState } from "react";
import styles from './Board.module.css';
import Dice from "react-dice-roll";
import { PlayingContext } from "../../providers/PlayingProvider";
import { SettingsContext } from "../../providers/SettingsProvider";
import { Property, cities } from "../../types/type";

const Board = ({ currentPlayerId, setCurrentPlayerId }: { currentPlayerId: number, setCurrentPlayerId: (id: number) => void }) => {
    const [settingsState] = useContext(SettingsContext);
    const [playingState, playingDispatch] = useContext(PlayingContext);
    const [showBuyPropertyDialog, setShowBuyPropertyDialog] = useState<boolean>(false);
    const [showSellPropertyDialog, setShowSellPropertyDialog] = useState(false);
    const [nextPlayerId, setNextPlayerId] = useState(0);
    const [hoveredFieldId, setHoveredFieldId] = useState<number | null>(null);
    const [showBuyHouseDialog, setShowBuyHouseDialog] = useState(false);
    const [selectedPropertyForHouse, setSelectedPropertyForHouse] = useState<Number>(0);

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
        const propertyCity = cities.find(c => c.id === hoveredField.cityid) || null;

        return (
            <div className={styles["property-details"]} style={{ display: 'block' }}>
                <div style={{ backgroundColor: propertyCity?.color }}>
                    <h2>{propertyCity?.name}</h2>
                    <h2>{hoveredField.name}</h2>
                </div>
                <div className={styles["grid-info"]}>
                    <h3>Konkurent</h3>
                    <p></p>
                    <h3>Monopolista</h3>
                    <p>{hoveredField.price}</p>
                    <p>cena pozemku</p>
                    <p>{hoveredField.price}</p>
                    <p>{propertyCity?.pricehouse}</p>
                    <p>cena domu</p>
                    <p>{propertyCity?.pricehouse}</p>
                    <div></div>
                    <h2>Nájemné</h2>
                    <div></div>
                    <div>{hoveredField.price / 10}</div>
                    <p>za pozemek</p>
                    <div>{hoveredField.price / 10}</div>
                    <div></div>
                    <div>{hoveredField.price / 5} pokud hráč vlastní 2 ulice</div>
                    <div></div>
                    <p>{hoveredField.price / 10 + (propertyCity?.pricehouse  ?? 0) / 10} </p>
                    <p>s 1 domem</p>
                    <p>{hoveredField.price / 5 + (propertyCity?.pricehouse  ?? 0) / 5}</p>
                    <p>{hoveredField.price / 10 + (propertyCity?.pricehouse ?? 0) / 5}</p>
                    <p>se 2 domy</p>
                    <p>{hoveredField.price / 5 + (propertyCity?.pricehouse  ?? 0) / 2.5}</p>
                    <p>{hoveredField.price / 10 + ((propertyCity?.pricehouse ?? 0) / 5) + ((propertyCity?.pricehouse ?? 0) / 10)}</p>
                    <p>se 3 domy</p>
                    <p>{hoveredField.price / 5 + ((propertyCity?.pricehouse  ?? 0) / 2.5 ) +  ((propertyCity?.pricehouse ?? 0) / 5)}</p>
                    <p>{hoveredField.price / 10 + ((propertyCity?.pricehouse ?? 0) / 5) + ((propertyCity?.pricehouse ?? 0) / 5)}</p>
                    <p>se 4 domy</p>
                    <p>{hoveredField.price / 5 + ((propertyCity?.pricehouse  ?? 0) / 2.5 ) +  ((propertyCity?.pricehouse ?? 0) / 2.5)}</p>
                    <div></div>
                    <div></div>
                    <p>s 1 hotelem</p>
                    <p>{hoveredField.price / 10 + ((propertyCity?.pricehouse ?? 0) / 5) + ( 3 * (propertyCity?.pricehouse ?? 0) / 10)}</p>
                    <p>s 5 domy</p>
                    <div></div>
                    <p>s 1 hotelem</p>
                </div>
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

        playingDispatch({ type: 'MOVE_PLAYER', playerId, newPositionId: newPositionId });

        const landedField = fields.find(field => field.id === newPositionId);
        if (landedField && landedField.type === "PROPERTY"&& playingState.ownership[landedField.id] === undefined) {
            const propertyPrice = landedField.price;
            if ((currentPlayer.money ?? 0) >= propertyPrice) {
                setShowBuyPropertyDialog(true);
            } else {
                setCurrentPlayerId((playerId % playingState.players.length) + 1);
            }
        }
        else if (landedField && landedField.type === "PROPERTY" && playingState.ownership[landedField.id] === currentPlayerId) {
            setShowBuyHouseDialog(true);
            setSelectedPropertyForHouse(landedField.id);
        }
        else {
            setCurrentPlayerId((playerId % playingState.players.length) + 1);
        }
    };

    const handleDialogResponse = (response: boolean) => {
        if (response) {

            const newPositionId = playingState.players.find(player => player.id === currentPlayerId)?.position || 0;
            const propertyField = fields.find(field => field.id === newPositionId) as Property;
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

    const handleBuyHouse = (fieldId: number) => {
        const field = fields[fieldId - 1];
        if (field.type === "PROPERTY") {
            const housePrice = cities.find(c => c.id === field.cityid)?.pricehouse;
            if (housePrice) {
                playingDispatch({
                    type: "BUY_HOUSE",
                    playerId: currentPlayerId,
                    fieldId: fieldId,
                    houseCount: 1,
                });
            }
        }
        setShowBuyHouseDialog(false);
        setCurrentPlayerId((currentPlayerId % playingState.players.length) + 1);
    };

    return (
        <>
            <div className={styles["playing--zone"]}>
                <div className={styles["board"]}>
                    {fields.map((field) => (
                        <div
                            className={`${styles["field"]} ${getFieldClass(field.id)}`}
                            key={field.id}
                            id={String(field.id)}
                            onMouseEnter={() => field.type === "PROPERTY" && handleMouseEnter(field.id)}
                            onMouseLeave={handleMouseLeave}
                        >
                            {field.type === "PROPERTY" && (
                                <div>
                                    <div>{field.name}</div>

                                    {playingState.ownership[field.id] !== undefined && (
                                        <div
                                            className={styles["property-owner"]}
                                            style={{ backgroundColor: "red" }}
                                        >
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

                            {field.type === "CHANCE_CARD" && (
                                <img src="img/changecard.svg"></img>)}
                            {field.type === "PAY" && (
                                <p>Zaplať {field.classicmoney}</p>
                            )}
                            {field.type === "TAX" && (
                                <p>Daně {field.money}</p>
                            )}
                            {field.type === "JAIL" && (
                                <img src="img/jail.svg"></img>
                            )}
                            {field.type === "START" && (
                                <>
                                    <p>Start</p>
                                    <p>Dostaneš {field.money}</p>
                                </>
                            )}

                            {field.type === "ANTI_MONOPOLY_OFFICE" && (
                                <>
                                    <p>Anti-monopolní úřad</p>
                                </>
                            )}
                            {playingState.players.map((player, playerIndex) => (
                                player.position === field.id && (
                                    <div
                                        key={playerIndex}
                                        className={styles["player"]}
                                        style={{ backgroundColor: "blue" }}
                                    ></div>
                                )
                            ))}
                        </div>
                    ))}

                    <div className={styles["blank_field"]}>
                        {/* obrázky na pro prázdné políčko na hrací desce/*}            
                        {/* <img src="img/city.png" alt="Obrázek vlevo" className={styles["img-left"]} />
                        <img src="img/city.png" alt="Obrázek vpravo" className={styles["img-right"]} />
                        <img src="img/city.png" alt="Obrázek nahoře" className={styles["img-top"]} />
                        <img src="img/city.png" alt="Obrázek dole" className={styles["img-bottom"]} /> */}
                    </div>
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
                    {showBuyHouseDialog && (
                        <div className={styles.overlay}>
                            <div className={styles.modal}>
                                <p>Koupit dům za {cities.find(c => c.id === fields[selectedPropertyForHouse as number - 1]?.id)?.pricehouse}?</p>
                                <button onClick={() => handleBuyHouse(selectedPropertyForHouse as number)}>Koupit</button>
                                <button onClick={() => setShowBuyHouseDialog(false)}>Zrušit</button>
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

function getFieldClass(fieldId: number) {
    if (fieldId >= 2 && fieldId <= 10) {
        return styles["field--top"];
    } else if (fieldId >= 12 && fieldId <= 20) {
        return styles["field--right"];
    }
    else if (fieldId >= 22 && fieldId <= 30) {
        return styles["field--bottom"];
    } else if (fieldId >= 32 && fieldId <= 40) {
        return styles["field--left"];
    }
    else if (fieldId == 1 || fieldId == 11 || fieldId == 21 || fieldId == 31) {
        return styles["field--bigger"];
    }
    else {
        return "";
    }
}

export default Board;