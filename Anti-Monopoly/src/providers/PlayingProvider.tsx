import React, { PropsWithChildren, createContext, useReducer } from 'react';
import { Field, PlayingPlayer, Player, GameState, cities, Role, FieldType, Start, Jail, Pay, ChanceCard, Property, Transport, AntiMonopolyOffice, Energy, GoJail} from '../types/type';

// Definování políček. 
const initialFields: Field[] = [
  { type: FieldType.START, money: 200, id: 1 } as Start,
  { type: FieldType.PROPERTY, cityid: 100, name: "Corso Impero", price: 60, rent: 6, houses: 0, id: 2 } as Property,
  { type: FieldType.CHANCE_CARD, id: 3 } as ChanceCard,
  { type: FieldType.PROPERTY, name: "Via Roma", cityid: 100, price: 60, rent: 60, houses: 0, id: 4 } as Property,
  { type: FieldType.PAY, classicMoney: 60, id: 5 }as Pay,
  { type: FieldType.TRANSPORT, name: "Letecká doprava", price: 200, rent: 20, id: 6, image: "Airplane.svg" } as Transport,
  { type: FieldType.PROPERTY, name: "Alexanderplatz", cityid: 101, price: 100, rent: 20, houses: 0, id: 7 } as Property,
  { type: FieldType.CHANCE_CARD, id: 8 } as ChanceCard,
  { type: FieldType.PROPERTY, cityid: 101, name: "Kurfürstendamm", price: 100, rent: 10, houses: 0, id: 9 } as Property,
  { type: FieldType.PROPERTY, cityid: 101, name: "Potsdammer StraSe", price: 120, rent: 12, houses: 0, id: 10 } as Property,
  { type: FieldType.JAIL, id: 11 } as Jail,
  { type: FieldType.PROPERTY, name: "Syntagma", cityid: 102, price: 400, rent: 40, houses: 0, id: 40 } as Property,
  { type: FieldType.PROPERTY, name: "Plaza Mayor", cityid: 103, price: 140, rent: 14, houses: 0, id: 12 } as Property,
  { type: FieldType.PAY, classicMoney: 100, id: 39 } as Pay,
  { type: FieldType.ENERGY, name: "Elektrárna", id: 13, price: 200 } as Energy,
  { type: FieldType.PROPERTY, name: "La Plaka", cityid: 102, price: 350, rent: 35, houses: 0, id: 38 } as Property,
  { type: FieldType.PROPERTY, name: "Gran Via", cityid: 103, price: 140, rent: 14, houses: 0, id: 14 } as Property,
  { type: FieldType.CHANCE_CARD, id: 37 } as ChanceCard,
  { type: FieldType.PROPERTY, name: "Paseo", cityid: 103, price: 160, rent: 16, houses: 0, id: 15 } as Property,
  { type: FieldType.TRANSPORT, name: "Autobusová doprava", price: 200, rent: 20, id: 36, image: "Bus.svg"} as Transport,
  { type: FieldType.TRANSPORT, name: "Tramvajová doprava", price: 200, rent: 20, id: 16, image: "Tramvaj.svg"} as Transport,
  { type: FieldType.PROPERTY, name: "Oxford Street", cityid: 104, price: 320, rent: 32, houses: 0, id: 35 } as Property,
  { type: FieldType.PROPERTY, name: "Dam", cityid: 105, price: 180, rent: 18, houses: 0, id: 17 } as Property,
  { type: FieldType.CHANCE_CARD, id: 34 } as ChanceCard,
  { type: FieldType.CHANCE_CARD, id: 18 } as ChanceCard,
  { type: FieldType.PROPERTY, name: "Piccadilly", cityid: 104, price: 300, rent: 30, houses: 0, id: 33 } as Property,
  { type: FieldType.PROPERTY, name: "Leidsestraat", cityid: 105, price: 180, rent: 18, houses: 0, id: 19 } as Property,
  { type: FieldType.PROPERTY, name: "Park Lane", cityid: 104, price: 300, rent: 30, houses: 0, id: 32 } as Property,
  { type: FieldType.PROPERTY, name: "Kalverstraat", cityid: 105, price: 200, rent: 20, houses: 0, id: 20 } as Property,
  { type: FieldType.GO_JAIL, id: 31 } as GoJail,
  { type: FieldType.PROPERTY, name: "Nieuwstraat", cityid: 106, price: 280, rent: 28, houses: 0, id: 30 } as Property,
  { type: FieldType.ENERGY, name: "Plynárna", id: 29, price: 200 } as Energy,
  { type: FieldType.PROPERTY, name: "Hoogstraat", cityid: 106, price: 260, rent: 26, houses: 0, id: 28 } as Property,
  { type: FieldType.PROPERTY, name: "Grote Markt", cityid: 106, price: 260, rent: 26, houses: 0, id: 27 } as Property,
  { type: FieldType.TRANSPORT, name: "Železniční doprava",  price: 240, rent: 24, id: 26, image: "Train.svg"} as Transport,
  { type: FieldType.PROPERTY, name: "ChampsElysees", cityid: 107, price: 240, rent: 24, houses: 0, id: 25 } as Property,
  { type: FieldType.PROPERTY, name: "Rue de la Paix", cityid: 107, price: 220, rent: 22, houses: 0, id: 24 } as Property,
  { type: FieldType.CHANCE_CARD, id: 23 } as ChanceCard,
  { type: FieldType.PROPERTY, name: "Rue de la Fayette", cityid: 107, price: 220, rent: 22, houses: 0, id: 22 } as Property,
  { type: FieldType.ANTI_MONOPOLY_OFFICE, id: 21 } as AntiMonopolyOffice,
];

type Action =
  | { type: "MOVE_PLAYER"; playerId: number; newPositionId: number; diceRoll: number}
  | { type: "MOVE_TO_JAIL"; playerId: number }
  | { type: "INIT_PLAYERS"; defaultMoney: number; defaultPosition: number; players: Player[] }
  | { type: "BUY_PROPERTY"; playerId: number; fieldId: number, price: number }
  | { type: "BUY_HOUSE"; playerId: number; fieldId: number; houseCount: number }
  | { type: "PAY_MONEY"; playerId: number; money: number }
  | { type: "PAY_TAX"; playerId: number; money: number }
  | { type: "CHANCE_CARD"; playerId: number; }
  | { type: "SELL_PROPERTY"; playerId: number; fieldId: number; price: number }
  | { type: "DECLARE_BANKRUPTCY"; playerId: number; }
  | { type: "SELL_HOUSES"; playerId: number; fieldId: number; houseCount: number }
  | { type: "ADD_PLAYER" }
  | { type: "REMOVE_PLAYER"; payload: number }
  | { type: "TOGGLE_ROLE"; payload: number }
  | { type: "LEAVE_JAIL"; playerId: number }
  | { type: "PAY_JAIL_FEE"; playerId: number }
  | { type: "INCREASE_JAIL_ATTEMPTS"; playerId: number };

const initialState: GameState = {
  players: [
    { id: 1, money: 2500, role: Role.MONOPOLIST, position: 1, isBankrupt: false, isJailed: false, color: "red", isJailedNumberOfAttempts: 0},
    { id: 2, money: 2500, role: Role.CONCURENT, position: 1, isBankrupt: false, isJailed: false, color: "blue", isJailedNumberOfAttempts: 0},  ],
  isPlayingPlayerid: 1,
  fields: initialFields,
  ownership: {},
};

const playingReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case "INIT_PLAYERS":
      const playersInit: PlayingPlayer[] = action.players.map(player => ({
        ...player,
        money: action.defaultMoney,
        position: action.defaultPosition,
        isBankrupt: false,
        isJailed: false,
        color: "red",
        isJailedNumberOfAttempts: 0
      }));

      return {
        ...state,
        players: playersInit,
      };
      
      
    case "MOVE_PLAYER": {
      const playerMoving = state.players.find(p => p.id === action.playerId);
      if (playerMoving) {
      const newPositionId = action.newPositionId;

      if (newPositionId === 31) {
          return {
              ...state,
              players: state.players.map(p =>
                  p.id === action.playerId ? { ...p, position: 11, isJailed: true } : p
              ),
          };
      }

      if (playerMoving.isJailed) {
        if (action.diceRoll !== 6) {
          playerMoving.isJailedNumberOfAttempts += 3;
        } else {
          playerMoving.isJailed = false;
          playerMoving.isJailedNumberOfAttempts = 0;
        }
    
        return {
          ...state,
          players: state.players.map(p =>
            p.id === playerMoving.id ? { ...p, ...playerMoving } : p
          ),
        };
      }

      let updatedPlayers = state.players.map(p =>
        p.id === action.playerId
        ? { ...p, position: newPositionId }
        : p
      );

      // na pevno definovaný start
      if (newPositionId < playerMoving.position || newPositionId === 1) {
        updatedPlayers = updatedPlayers.map(p =>
        p.id === action.playerId
          ? { ...p, money: p.money + 200 }
          : p
        );
      }

      const field = state.fields.find(f => f.id === newPositionId);
      if (field) {
        if (playerMoving.role === Role.MONOPOLIST && playerMoving.isJailed) {
          return {
              ...state,
              players: updatedPlayers,
          };
      }
        switch (field.type) {
        case "PAY":
          const payField = field as Pay;
          updatedPlayers = updatedPlayers.map(p =>
          p.id === action.playerId
            ? { ...p, money: p.money - payField.classicMoney }
            : p
          );
          break;

          case "ENERGY": {
            const energyOwner = state.ownership[newPositionId];
            if (energyOwner && energyOwner !== action.playerId) {
              const diceRoll = action.diceRoll;
              let rentAmount = 4;
  
              if (diceRoll === 5) {
                rentAmount = 20;
              }
  
              rentAmount = Math.min(rentAmount, 320);
              updatedPlayers = updatedPlayers.map(p => {
                if (p.id === action.playerId) {
                  return { ...p, money: p.money - rentAmount };
                } else if (p.id === energyOwner) {
                  return { ...p, money: p.money + rentAmount };
                }
                return p;
              });
            }
            break;
          }

        case "TRANSPORT": {
          const transportOwner = state.ownership[newPositionId];
          if (transportOwner && transportOwner !== action.playerId) {
          const transportPropertiesOwned = Object.keys(state.ownership).filter(
            key => state.ownership[parseInt(key)] === transportOwner && state.fields[parseInt(key) - 1].type === "TRANSPORT"
          ).length;

          let rentAmount = 20;

          if (transportPropertiesOwned > 1) {
            rentAmount = 40 * Math.pow(2, transportPropertiesOwned - 1);
          }
          rentAmount = Math.min(rentAmount, 320);
          updatedPlayers = updatedPlayers.map(p => {
            if (p.id === action.playerId) {
            return { ...p, money: p.money - rentAmount };
            } else if (p.id === transportOwner) {
            return { ...p, money: p.money + rentAmount };
            }
            return p;
          });
          }
          break;
        }

        case "PROPERTY": {
          const propertyOwner = state.ownership[newPositionId];
          if (propertyOwner && propertyOwner !== action.playerId && field.type === "PROPERTY") {

          const propertiesOwnedByOwner = Object.keys(state.ownership)
            .filter(key => state.ownership[parseInt(key)] === propertyOwner)
            .map(key => state.fields[parseInt(key) - 1])
            .filter(field => field.type === "PROPERTY");

          const isMonopoly = propertiesOwnedByOwner
            .filter(property => property.type === "PROPERTY" && (property as Property).cityid === (field as Property).cityid).length > 1;

          let rentAmount = (field as Property).rent;
          if (isMonopoly) {
            rentAmount *= 2;
          }

          updatedPlayers = updatedPlayers.map(p => {
            if (p.id === action.playerId) {
            return { ...p, money: p.money - 200 };
            }
            return p;
          });
          }
          break;
        }

        case "ANTI_MONOPOLY_OFFICE": {
          const player = state.players.find(p => p.id === action.playerId);
          if (player) {
          if (player.role === Role.MONOPOLIST) {
            updatedPlayers = updatedPlayers.map(p =>
            p.id === action.playerId
              ? { ...p, money: p.money - 100 }
              : p
            );
          } else if (player.role === Role.CONCURENT) {
            const diceRoll = Math.floor(Math.random() * 6) + 1;
            const moneyToAdd = diceRoll === 6 ? 50 : 25;
            updatedPlayers = updatedPlayers.map(p =>
            p.id === action.playerId
              ? { ...p, money: p.money + moneyToAdd }
              : p
            );
          }
          }
          break;
        }

      case "JAIL": {
        if (playerMoving.role === Role.MONOPOLIST) {
        updatedPlayers = updatedPlayers.map(p =>
          p.id === action.playerId
          ? { ...p, money: p.money - 100 }
          : p
        );
      }
    }}}

      return {
        ...state,
        players: updatedPlayers,
      };
      }
      return state;
    }

    case 'PAY_MONEY':
      const payPlayer = state.players.find(p => p.id === action.playerId);
      if (payPlayer) {
        payPlayer.money -= action.money;
        return {
          ...state,
          players: state.players.map(p =>
            p.id === action.playerId
              ? { ...p, money: payPlayer.money }
              : p
          ),
        };
      }
      return state;

    case "PAY_TAX":
      const taxPlayer = state.players.find(p => p.id === action.playerId);
      if (taxPlayer) {
        taxPlayer.money -= action.money;
        return {
          ...state,
          players: state.players.map(p =>
            p.id === action.playerId
              ? { ...p, money: taxPlayer.money }
              : p
          ),
        };
      }
      return state;

    case 'BUY_PROPERTY':
        return {
          ...state,
          ownership: { ...state.ownership, [action.fieldId]: action.playerId },
          players: state.players.map(p =>
            p.id === action.playerId
              ? { ...p, money: p.money - action.price }
              : p
          ),
        };

      case "CHANCE_CARD": {
        const playerIndex = state.players.findIndex(p => p.id === action.playerId);
        if (playerIndex !== -1) {
        const effect = Math.floor(Math.random() * 3);
        let message = '';
        switch (effect) {
            case 0:
            state.players[playerIndex].money += 50;
            message = "Získal jsi $50";
            break;
            case 1:
            state.players[playerIndex].money -= 50;
            message = "Ztratil jsi $50!";
            break;
            case 2:
          state.players[playerIndex].position = 1;
          message = "Jdeš na start!";
          state.players[playerIndex].money += 200;
          break;
            case 3:
          state.players[playerIndex].position = 11;
          state.players[playerIndex].isJailed = true;
          message = "Jdeš do vězení!";
          break;
        }
        return { ...state, chanceCardMessage: message };
        }
        return { ...state };
        }

        case 'BUY_HOUSE': {
          const field = state.fields.find(field => field.id === action.fieldId);
          const payPlayer = state.players.find(player => player.id === action.playerId);
          if (field && payPlayer) {
  
            const propertyField = field as Property;
            const housePrice = cities.find(city => city.id === propertyField.cityid)?.pricehouse;

            const ownsOtherPropertiesInCity = state.fields.filter(f =>
              f.type === "PROPERTY" && (f as Property).cityid === propertyField.cityid && state.ownership[f.id] === action.playerId
            ).length > 1;

            const totalCost = (housePrice || 0) * action.houseCount;

            const maxHouses = payPlayer.role === "CONCURENT" ? 5 : payPlayer.role === "MONOPOLIST" ? 4 : 0;

            if (propertyField.type === "PROPERTY" && payPlayer.money >= totalCost && ((propertyField.houses + action.houseCount) <= maxHouses) && (payPlayer.role === "CONCURENT" || ownsOtherPropertiesInCity)) {
              propertyField.houses += action.houseCount;
              payPlayer.money -= totalCost;

              return {
                ...state,
                fields: [
                  ...state.fields.slice(0, state.fields.findIndex(f => f.id === action.fieldId)),
                  propertyField,
                  ...state.fields.slice(state.fields.findIndex(f => f.id === action.fieldId) + 1)
                ],
                players: state.players
                  .filter(p => p !== undefined)
                  .map(p => p as PlayingPlayer), 
              };
            }
          }
          return state;
        }

    case 'SELL_PROPERTY': {
      const updatedOwnership = { ...state.ownership };
      delete updatedOwnership[action.fieldId];
    
      const fieldIndex = state.fields.findIndex(field => field.id === action.fieldId);
      if (fieldIndex !== -1) {
        const field = state.fields[fieldIndex] as Property;
        field.houses = 0; 
    
        return {
            ...state,
            ownership: updatedOwnership,
            fields: [
              ...state.fields.slice(0, fieldIndex),
              field,
              ...state.fields.slice(fieldIndex + 1)
            ],
            players: state.players.map(p =>
                p.id === action.playerId
                ? { ...p, money: p.money + action.price }
                : p
            ),
        };
      }
      return state;
    }

    case "ADD_PLAYER":
      if (state.players.length < 6) {
        const availableColors = ["light-green", "brown", "pink", "dark-green", "purple", "yellow", "orange"];
        const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];    
        const newPlayer: PlayingPlayer = {
          id: state.players.length + 1,
          role: Role.CONCURENT,
          money: 2000,
          position: 1,
          isBankrupt: false,
          isJailed: false,
          color: randomColor,
          isJailedNumberOfAttempts: 0
        };
        return { ...state, players: [...state.players, newPlayer] };
      }
      return state;

    case "REMOVE_PLAYER":
      if (state.players.length > 2) {
        return { ...state, players: state.players.filter(player => player.id !== action.payload) };
      }
      return state;

    case "TOGGLE_ROLE":
      return {
        ...state,
        players: state.players.map(player =>
          player.id === action.payload
            ? { ...player, role: player.role === Role.CONCURENT ? Role.MONOPOLIST : Role.CONCURENT }
            : player
        ),
      };


      case "LEAVE_JAIL":
        const updatedPlayers = state.players.map(player => {
          if (player.id === action.playerId) {
            return { ...player, isJailed: false, isJailedNumberOfAttempts: 0 };
          }
          return player;
        });
      
        return { ...state, players: updatedPlayers };


    case "PAY_JAIL_FEE":
      const player = state.players.find(p => p.id === (action as { playerId: number }).playerId);
      if (player) {
        player.money -= 50;
        return {
          ...state,
          players: state.players.map(p =>
            p.id === (action as { playerId: number }).playerId
              ? { ...p, money: player.money }
              : p
          ),
        };
      }
      return state;


    case "INCREASE_JAIL_ATTEMPTS":
      const playerJailed = state.players.find(p => p.id === action.playerId);
      if (playerJailed) {
        playerJailed.isJailedNumberOfAttempts += 1;
        return {
          ...state,
          players: state.players.map(p =>
            p.id === action.playerId
              ? { ...p, isJailedNumberOfAttempts: playerJailed.isJailedNumberOfAttempts }
              : p
          ),
        };
      }
      return state;

    default:
      return state;
  }
};

export const PlayingContext = createContext<[GameState, React.Dispatch<Action>]>([initialState, () => null]);

export const PlayingProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [state, dispatch] = useReducer(playingReducer, initialState);

  return (
    <PlayingContext.Provider value={[state, dispatch]}>
      {children}
    </PlayingContext.Provider>
  );
};

export default PlayingProvider;