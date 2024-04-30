import { useContext, useEffect, useState } from "react";
import styles from './Board.module.css';
import Dice from "react-dice-roll";
import { PlayingContext } from "../../providers/PlayingProvider";
import { Property, Start, Transport, cities, Tax, Pay, Energy } from "../../types/type";
import WindowsStats from "./WindowStats";
const Board = ({ currentPlayerId, setCurrentPlayerId }: { currentPlayerId: number, setCurrentPlayerId: (id: number) => void }) => {
    const [playingState, playingDispatch] = useContext(PlayingContext);
    const [showBuyPropertyDialog, setShowBuyPropertyDialog] = useState<boolean>(false);
    const [showSellPropertyDialog, setShowSellPropertyDialog] = useState<boolean>(false);
    const [nextPlayerId, setNextPlayerId] = useState<number>(0);
    const [hoveredFieldId, setHoveredFieldId] = useState<number | null>(null);
    const [showBuyHouseDialog, setShowBuyHouseDialog] = useState<boolean>(false);
    const [selectedPropertyForHouse] = useState<Number>(0);
    const [, setChanceCardMessage] = useState<string>('');

    const handleMouseEnter = (fieldId: number) => {
        setHoveredFieldId(fieldId);
    };

    const handleMouseLeave = () => {
        setHoveredFieldId(null);
    };
    
    const renderDetails = () => {
        const hoveredField = fields.find((field) => field.id === hoveredFieldId);
        if (!hoveredField) return null;

        if (hoveredField.type === "PROPERTY") {
            const propertyCity = cities.find(c => c.id === (hoveredField as Property).cityid);
            const nevim123 = hoveredField as Property;

            return (
                <div className={styles["property-details"]}>
                    <div className={styles[(propertyCity?.color ?? '')]}>
                        <h2>{propertyCity?.name}</h2>
                        <h2>{nevim123.name}</h2>
                    </div>
                    <div className={styles["grid-info"]}>
                        <h3>Konkurent</h3>
                        <p></p>
                        <h3>Monopolista</h3>
                        <p>{nevim123.price}</p>
                        <p>cena pozemku</p>
                        <p>{nevim123.price}</p>
                        <p>{propertyCity?.pricehouse}</p>
                        <p>cena domu</p>
                        <p>{propertyCity?.pricehouse}</p>
                        <div></div>
                        <h2>Nájemné</h2>
                        <div></div>
                        <div>{nevim123.price / 10}</div>
                        <p>za pozemek</p>
                        <div>{nevim123.price / 10}</div>
                        <div></div>
                        <div>{nevim123.price / 5} pokud hráč vlastní 2 ulice</div>
                        <div></div>
                        <p>{nevim123.price / 10 + (propertyCity?.pricehouse  ?? 0) / 10} </p>
                        <p>s 1 domem</p>
                        <p>{nevim123.price / 5 + (propertyCity?.pricehouse  ?? 0) / 5}</p>
                        <p>{nevim123.price / 10 + (propertyCity?.pricehouse ?? 0) / 5}</p>
                        <p>se 2 domy</p>
                        <p>{nevim123.price / 5 + (propertyCity?.pricehouse  ?? 0) / 2.5}</p>
                        <p>{nevim123.price / 10 + ((propertyCity?.pricehouse ?? 0) / 5) + ((propertyCity?.pricehouse ?? 0) / 10)}</p>
                        <p>se 3 domy</p>
                        <p>{nevim123.price / 5 + ((propertyCity?.pricehouse  ?? 0) / 2.5 ) +  ((propertyCity?.pricehouse ?? 0) / 5)}</p>
                        <p>{nevim123.price / 10 + ((propertyCity?.pricehouse ?? 0) / 5) + ((propertyCity?.pricehouse ?? 0) / 5)}</p>
                        <p>se 4 domy</p>
                        <p>{nevim123.price / 5 + ((propertyCity?.pricehouse  ?? 0) / 2.5 ) +  ((propertyCity?.pricehouse ?? 0) / 2.5)}</p>
                        <div></div>
                        <div></div>
                        <p>s 1 hotelem</p>
                        <p>{nevim123.price / 10 + ((propertyCity?.pricehouse ?? 0) / 5) + ( 3 * (propertyCity?.pricehouse ?? 0) / 10)}</p>
                        <p>s 5 domy</p>
                        <div></div>
                        <p>s 1 hotelem</p>
                    </div>
                </div>
            );

        } else if (hoveredField.type === "TRANSPORT") {
            const transport = fields.find(field => field.id === hoveredField.id) as Transport;
            return (
                <div className={styles["property-details"]}>
                    <div className={styles["transport-details"]}>
                        <h2>{transport.name}</h2>
                    </div>
                    <div className={styles["grid-info"]}>
                        <h3>Konkurent</h3>
                        <p></p>
                        <h3>Monopolista</h3>
                        <p>{transport.price}</p>
                        <p>kupní cena</p>
                        <p>{transport.price}</p>
                        <div></div>
                        <h2>Poplatky</h2>
                        <div></div>
                        <div>{transport.price / 10}</div>
                        <p>hráč má 1 společnost</p>
                        <div>{transport.price / 5}</div>
                        <div>{transport.price / 10}</div>
                        <p>hráč má 2 společnosti</p>
                        <p>{transport.price / 2.5}</p>
                        <p>{transport.price / 10}</p>
                        <p>hráč má 3 společnosti</p>
                        <p>{transport.price / 1.25}</p>
                        <p>{transport.price / 10}</p>
                        <p>hráč má 4 společnosti</p>
                        <p>{transport.price / 0.625}</p>
                    </div>
                </div>
            );
        }

        return null;
    };

    const { fields } = playingState;
    useEffect(() => {
        const currentPlayer = playingState.players.find(player => player.id === currentPlayerId);
        if (currentPlayer && !currentPlayer.isBankrupt) {
            checkFinancialStatus(currentPlayerId);
        }
    }, [currentPlayerId, playingState.players, playingState.ownership, fields]);

    useEffect(() => {
        if (playingState.chanceCardMessage) {
            alert(playingState.chanceCardMessage);
            setChanceCardMessage('');
        }
    }, [playingState.chanceCardMessage]);

    const handleDiceRoll = (value: number) => {
        movePlayer(currentPlayerId, value);
    };

    const movePlayer = (playerId: number, rollValue: number) => {
        const currentPlayer = playingState.players.find(player => player.id === playerId);
        if (!currentPlayer) return;
    
        const currentPositionId = currentPlayer.position;
        const newPositionId = ((currentPositionId - 1 + rollValue) % fields.length) + 1;

    
        const landedField = fields.find(field => field.id === newPositionId);
        playingDispatch({ type: 'MOVE_PLAYER', playerId, newPositionId: newPositionId, diceRoll: rollValue });
        if (landedField && (landedField.type === "PROPERTY" || landedField.type === "TRANSPORT" || landedField.type === "ENERGY")) {
            if (playingState.ownership[landedField.id] === undefined) {
                const propertyPrice = (landedField as Property).price;
                if ((currentPlayer.money ?? 0) >= propertyPrice) {
                    setShowBuyPropertyDialog(true);
                } else {
                    setCurrentPlayerId((playerId % playingState.players.length) + 1);
                }
            } else {
                setCurrentPlayerId((playerId % playingState.players.length) + 1);
            }
        } else if (landedField && landedField.type === "CHANCE_CARD") {
            playingDispatch({ type: 'CHANCE_CARD', playerId });
        } else {
            setCurrentPlayerId((playerId % playingState.players.length) + 1);
        }
    };

    const handleDialogResponse = (response: boolean) => {
        if (response) {

            const newPositionId = playingState.players.find(player => player.id === currentPlayerId)?.position || 0;
            const propertyField = fields.find(field => field.id === newPositionId) as Property;
            if (propertyField && (propertyField.type === "PROPERTY" || propertyField.type === "TRANSPORT" || propertyField.type === "ENERGY") && playingState.ownership[newPositionId] === undefined) {
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
        else{
            setCurrentPlayerId((currentPlayerId % playingState.players.length) + 1);
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
                    if (property.type === "PROPERTY" || property.type === "TRANSPORT" || property.type === "ENERGY") {
                        const propertyPrice = (property as Property).price;
                        return acc + propertyPrice;
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
            const propertyField = field as Property;
            const housePrice = cities.find(c => c.id === propertyField.cityid)?.pricehouse;
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
                            className={`${styles["field"]}`}
                            key={field.id}
                            id={String(field.id)}
                            onMouseEnter={() => (field.type === "PROPERTY" || field.type === "TRANSPORT") && handleMouseEnter(field.id)}
                            onMouseLeave={handleMouseLeave}
                        >
                            {field.type === "PROPERTY" && (
                                <div>
                                    {field.type === "PROPERTY" && <div>{(field as Property).name}</div>}

                                    {playingState.ownership[field.id] !== undefined && (
                                        <div
                                            className={styles["property-owner"]}
                                            style={{ backgroundColor: "red" }}
                                        >
                                            <div>
                                                {`HRÁČ ${playingState.players.find(player => player.id === playingState.ownership[field.id])?.id}`}
                                            </div>
                                        </div>
                                    )}
                                    {field.type === "PROPERTY" && <div>{(field as Property).price}</div>}
                                </div>
                            )}

                            {field.type === "TRANSPORT" && (
                                <div>
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
                                </div>
                            )}
                            {field.type === "TRANSPORT" && (
                                <img src={`img/${(field as Transport).image}`} />
                            )}
                            {field.type === "CHANCE_CARD" && (
                                <img src="img/changecard.svg"></img>)}
                            {field.type === "PAY" && (
                                <p>Zaplať {(field as Pay).classicMoney}</p>
                            )}
                            {field.type === "TAX" && (
                                <p>Daně {(field as Tax).money}</p>
                            )}
                            {field.type === "JAIL" && (
                                <img src="img/jail.svg"></img>
                            )}
                            {field.type === "START" && (
                                <>
                                    <p>Start</p>
                                    <p>Dostaneš {(field as Start).money}</p>
                                </>
                            )}

                            {field.type === "ENERGY" && (
                                <div>
                                    <span>{(field as Energy).name}</span>
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
                                    <img src={`img/${(field as Energy).name}.svg`} alt={(field as Energy).name} />
                                </div>
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
                                        style={{ backgroundColor: "blue", position: "absolute", top: `${playerIndex * 20}px` }}
                                    ></div>
                                )
                            ))}
                        </div>
                    ))}

                    <div className={styles["blank_field"]}>
                        <WindowsStats currentPlayerId={currentPlayerId} />
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
                                                <p>{(property as Property).name} - Sell for {(property as Property).price}</p>
                                                <button onClick={() => handleSellProperty(currentPlayerId, index, (property as Property).price)}>Sell</button>
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
                {renderDetails()}
            </div>
        </>
    );
};

export default Board;