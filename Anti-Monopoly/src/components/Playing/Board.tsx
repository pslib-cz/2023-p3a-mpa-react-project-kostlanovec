import { useContext, useEffect, useState } from "react";
import styles from './Board.module.css';
import Dice from "react-dice-roll";
import { useNavigate } from "react-router-dom";
import { PlayingContext } from "../../providers/PlayingProvider";
import { Property, Start, Transport, cities, Pay, Energy, PlayingPlayer } from "../../types/type";
import WindowsStats from "./WindowStats";

const Board = ({ currentPlayerId, setCurrentPlayerId }: { currentPlayerId: number, setCurrentPlayerId: (id: number) => void }) => {
    const [playingState, playingDispatch] = useContext(PlayingContext);
    const [showBuyPropertyDialog, setShowBuyPropertyDialog] = useState<boolean>(false);
    const [showSellPropertyDialog, setShowSellPropertyDialog] = useState<boolean>(false);
    const [hoveredFieldId, setHoveredFieldId] = useState<number | null>(null);
    const [showBuyHouseDialog, setShowBuyHouseDialog] = useState<boolean>(false);
    const [selectedPropertyForHouse] = useState<number>(0);
    const [,setChanceCardMessage] = useState<string>('');
    const [showJailDialog, setShowJailDialog] = useState<boolean>(false);
    const [selectedPropertiesForSale, setSelectedPropertiesForSale] = useState<{ [key: number]: boolean }>({});
    const [totalNeeded, setTotalNeeded] = useState<number>(0);
    const navigate = useNavigate();

    const handleToggleProperty = (fieldId: number) => {
        setSelectedPropertiesForSale(prev => ({
            ...prev,
            [fieldId]: !prev[fieldId]
        }));
    };

    const handleJailDialog = () => {
        const currentPlayer = playingState.players.find(player => player.id === currentPlayerId);
        if (currentPlayer && currentPlayer.isJailed && currentPlayer.isJailedNumberOfAttempts < 3) {
            return (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <h2>Jsi ve vězení</h2>
                        <p>Možnosti:</p>
                        <p>Zaplatit 100 a okamžitě odejít, nebo pokusit se hodit 6 a zůstat bez platby. Máš {3 - currentPlayer.isJailedNumberOfAttempts} pokusy.</p>
                        <button onClick={() => handleJailDecision(true)}>Zaplatit 100</button>
                        <button onClick={() => handleJailDecision(false)}>Hodit kostkou</button>
                    </div>
                </div>
            );
        } else if (currentPlayer && currentPlayer.isJailedNumberOfAttempts >= 3) {
            return (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <h2>Konec pokusů</h2>
                        <p>Odseděl sis své a zaplatíš 100.</p>
                        <button onClick={() => handleJailDecision(true)}>Pokračovat ve hře</button>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    };
    
    useEffect(() => {
        const audio = new Audio("mainmusic.mp3");
        audio.loop = true;
        audio.play();
    
        return () => {
          audio.pause();
          audio.currentTime = 0;
        };
      }, []);

      useEffect(() => {
        if (playingState.chanceCardMessage) {
            alert(playingState.chanceCardMessage);
            setChanceCardMessage('');
            moveNextNonBankruptPlayer(currentPlayerId);
        }
    }, [playingState.chanceCardMessage]);


    
    const handleSellSelectedProperties = () => {
        const currentPlayer = playingState.players.find(player => player.id === currentPlayerId);
        if (!currentPlayer) return;
    
        let accumulated = 0;
        findPropertiesOwnedByPlayer(currentPlayerId).forEach((property) => {
            if (selectedPropertiesForSale[property.id]) {
                accumulated += (property as Property).price / 2;
                handleSellProperty(currentPlayerId, property.id, (property as Property).price);
            }
        });
    
        const newTotalNeeded = totalNeeded - accumulated;
        setTotalNeeded(newTotalNeeded);
        if (newTotalNeeded <= 0) {
            setShowSellPropertyDialog(false);
            if (newTotalNeeded <= 0) {
                moveNextNonBankruptPlayer(currentPlayerId);
            }
        }
    };
    

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

    const handleDiceRoll = (value: number) => {
        const currentPlayer = playingState.players.find(player => player.id === currentPlayerId);
        if (currentPlayer && (currentPlayer.isJailed === true || currentPlayer.isJailedNumberOfAttempts >= 3)) {
            if (value === 6) {
                playingDispatch({ type: 'LEAVE_JAIL', playerId: currentPlayerId });
            }
            else{
                playingDispatch({ type: 'INCREASE_JAIL_ATTEMPTS', playerId: currentPlayerId });
                moveNextNonBankruptPlayer(currentPlayerId);
                setShowJailDialog(true);
            
            }
        } else {;
            movePlayer(currentPlayerId, value);
        }
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
                    checkFinancialStatus(currentPlayer);
                }
            } else if (playingState.ownership[landedField.id] === playerId) {
                const propertyCity = cities.find(c => c.id === (landedField as Property).cityid);
                const propertiesInCity = fields.filter(f => f.type === "PROPERTY" && (f as Property).cityid === propertyCity?.id);
                const ownedPropertiesInCity = propertiesInCity.filter(p => playingState.ownership[p.id] === playerId);
                if (ownedPropertiesInCity.length === propertiesInCity.length) {
                    if ((landedField as Property).houses < 6) {
                        setShowBuyHouseDialog(true);
                    }
                } else {
                    checkFinancialStatus(currentPlayer);
                }
            } else {
                checkFinancialStatus(currentPlayer);
            }
        }
        else if (landedField && landedField.type === "CHANCE_CARD") {
            playingDispatch({ type: 'CHANCE_CARD', playerId });
            checkFinancialStatus(currentPlayer);
            moveNextNonBankruptPlayer(currentPlayer.id);
        }
        else{
            checkFinancialStatus(currentPlayer);
        }
    };
    
    
    const moveNextNonBankruptPlayer = (currentPlayerId: number) => {
        let nextPlayerIndex = (currentPlayerId % playingState.players.length) + 1;
        let nextPlayer = null;
        
        while (!nextPlayer) {
            const candidatePlayer = playingState.players[nextPlayerIndex - 1];
            if (!candidatePlayer.isBankrupt) {
                nextPlayer = candidatePlayer;
                setCurrentPlayerId(nextPlayer.id);
                if (nextPlayer.isJailed) {
                    if (nextPlayer.isJailedNumberOfAttempts < 3) {
                        setShowJailDialog(true);
                    } else {
                        playingDispatch({ type: 'LEAVE_JAIL', playerId: nextPlayer.id });
                    }
                }
            } else {
                nextPlayerIndex = (nextPlayerIndex % playingState.players.length) + 1;
            }
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
        }
        moveNextNonBankruptPlayer(currentPlayerId);
        setShowBuyPropertyDialog(false);
    };

    const findPropertiesOwnedByPlayer = (playerId: number) => {
        return fields.filter(field => playingState.ownership[field.id] === playerId && (field.type === "PROPERTY" || field.type === "ENERGY" || field.type === "TRANSPORT"));
    };

    const handleSellProperty = (playerId: number, fieldId: number, price: number) => {
        const currentPlayer = playingState.players.find(player => player.id === playerId);
        if (!currentPlayer) return;
    
        playingDispatch({
            type: 'SELL_PROPERTY',
            playerId: playerId,
            fieldId: fieldId,
            price: price / 2
        });
    
        checkFinancialStatus(currentPlayer);
    };

    const checkFinancialStatus = (currentPlayer: PlayingPlayer) => {
        if (!currentPlayer) return;
    
        const debt = currentPlayer.money < 0 ? -currentPlayer.money : 0;
    
        if (debt > 0) {
            const propertiesOwned = findPropertiesOwnedByPlayer(currentPlayer.id);
            const totalValueOfProperties = propertiesOwned.reduce((acc, property) => {
                return acc + (property as Property).price / 2;
            }, 0);
    
            if (totalValueOfProperties >= debt) {
                setTotalNeeded(debt);
                setShowSellPropertyDialog(true);
            } else {
                currentPlayer.isBankrupt = true;
                alert(`Hráč: ${currentPlayer.id} je v bankrotu a to znamená konec hry pro něj`);
                    const nonBankruptPlayers = playingState.players.filter(player => !player.isBankrupt);
                    if (nonBankruptPlayers.length === 1) {
                        navigate('/winning', { state: { PlayingPlayer: nonBankruptPlayers[0] } });
                    }
                    else{
                        moveNextNonBankruptPlayer(currentPlayer.id);
                    }
            }
        } else {
            setShowSellPropertyDialog(false);
            moveNextNonBankruptPlayer(currentPlayer.id);
        }
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
                    houseCount: (field as Property).houses + 1,
                });
            }
        }
        setShowBuyHouseDialog(false);
        setCurrentPlayerId((currentPlayerId % playingState.players.length) + 1);
    };

    const handleJailDecision = (pay: boolean) => {
        if (pay) {
            playingDispatch({
                type: 'PAY_JAIL_FEE',
                playerId: currentPlayerId
            });
            playingDispatch({ type: 'LEAVE_JAIL', playerId: currentPlayerId });
            setShowJailDialog(false);

        } else {
            setShowJailDialog(false);
        }
    };
    
    const PropertyComponent = ({ field }: { field: Property }) => {
        field as Property;
        const getColor = (cityId: number) => {
            const city = cities.find(city => city.id === cityId);
            return city ? city.color : 'default';
        };
    
        const colorClass = getColor(field.cityid);
    
        return (
            <>
            <p className={`${styles["Property--city"]} ${styles[colorClass.toLowerCase()]}`}>
                {field.name}
            </p>
            <p>{field.price}</p>
            {field.houses > 0 && (
                <div className={styles["house--number"]}>
                    Počet domů: {field.houses}
                </div>
            )}
            </>
        );
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
                                    <PropertyComponent field={field as Property} />
                                    {playingState.ownership[field.id] === undefined ? (
                                        <p className={styles["property-owner"]}>Nikdo</p>
                                    ) : (
                                        <div
                                            className={styles["property-owner"]}
                                            style={{ backgroundColor: playingState.players.find(player => player.id === playingState.ownership[field.id])?.color }}
                                        >
                                            <p>{`HRÁČ ${playingState.players.find(player => player.id === playingState.ownership[field.id])?.id}`}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {field.type === "CHANCE_CARD" && (
                                <img className={styles["fieldimage"]} src="img/changecard.svg"></img>)}
                                

                            {field.type === "PAY" && (
                                <>
                                <p>Zaplať {(field as Pay).classicMoney}</p>
                                <img className={styles["fieldimage"]} src="img/taxes.svg"></img>
                                </>
                            )}

                            {field.type === "JAIL" && (
                                <img className={styles["fieldimage"]} src="img/jail.svg"></img>
                            )}

                            {field.type === "START" && (
                                <>
                                    <p>Start</p>
                                    <p>Dostaneš {(field as Start).money}</p>
                                </>
                            )}

                            {field.type === "TRANSPORT" && (
                                <>
                                    <img className={styles["fieldimage"]} src={`img/${(field as Transport).image}`} />
                                    {playingState.ownership[field.id] !== undefined && (
                                        <div
                                            className={styles["property-owner"]}
                                            style={{ backgroundColor: playingState.players.find(player => player.id === playingState.ownership[field.id])?.color }}
                                        >
                                            <div>
                                                {playingState.players.find(player => player.id === playingState.ownership[field.id])?.id
                                                    ? `HRÁČ ${playingState.players.find(player => player.id === playingState.ownership[field.id])?.id}`
                                                    : ''}
                                            </div>
                                        </div>
                                    )}
                                    {playingState.ownership[field.id] === undefined && (
                                        <div className={styles["property-owner"]}>Nikdo</div>
                                    )}
                                </>
                            )}
                            {field.type === "ENERGY" && (
                                <>
                                <img className={styles["fieldimage"]} src={`img/${(field as Energy).name}.svg`} alt={(field as Energy).name}/>
                                    {playingState.ownership[field.id] === undefined ? (
                                        <p className={styles["property-owner"]}>Nikdo</p>
                                    ) : (
                                        <div
                                            className={styles["property-owner"]}
                                            style={{ backgroundColor: playingState.players.find(player => player.id === playingState.ownership[field.id])?.color }}
                                        >
                                            <p>
                                                {`HRÁČ ${playingState.players.find(player => player.id === playingState.ownership[field.id])?.id}`}
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}

                            {field.type === "ANTI_MONOPOLY_OFFICE" && (
                                <>
                                    <p>Anti-monopolní úřad</p>
                                    <img className={styles["fieldimage"]} src="img/antimonopol.svg"></img>
                                </>
                            )}
                            <div className={styles["gridplayers"]}>
                            {playingState.players
                                .filter(player => !player.isBankrupt)
                                .map((player, playerIndex) => (
                                    player.position === field.id && (
                                    <div
                                        key={playerIndex}
                                        className={`${styles["player"]} ${styles[player.color.toLowerCase()]}`}
                                    ></div>
                                    )
                                ))}
                            </div>
                            {field.type === "GO_JAIL" && (
                                <>
                                  <p>Jdi do vězení</p>
                                  <img className={styles["fieldimage"]} src="img/pouta.svg"></img>
                              </>
                            )}
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
                            {findPropertiesOwnedByPlayer(currentPlayerId).map((field, index) => (
                                <div key={index}>
                                    <input
                                        type="checkbox"
                                        checked={selectedPropertiesForSale[field.id] || false}
                                        onChange={() => handleToggleProperty(field.id)}
                                    />
                                    <p>{(field as Property).name} - Sell for {Math.floor((field as Property).price / 2)}</p>
                                </div>
                            ))}
                            <p>Potřebuješ prodat v hodnotě: {Math.abs(playingState.players.find(player => player.id === currentPlayerId)?.money ?? 0)}</p>
                            <button 
                                onClick={handleSellSelectedProperties}
                                disabled={!Object.keys(selectedPropertiesForSale).some(id => selectedPropertiesForSale[Number(id)])}
                            >
                                Prodat vybrané nemovitosti
                            </button>
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
                    {showJailDialog && handleJailDialog()}
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