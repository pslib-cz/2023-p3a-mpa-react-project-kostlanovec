import React, { PropsWithChildren, createContext, useReducer } from 'react';
import { Role, Field, PlayingPlayer, Player, GameState  } from '../types/type';

    const initialFields: Field[] = [
      { type: "START", money: 200, id: 1 },
      { type: "PROPERTY", city: "Řím", name: "Corso Impero", price: 60, rent: 6, houses: 0, id: 2},
      { type: "CHANCE_CARD", id: 3 },
      { type: "PROPERTY", name: "Via Roma", city: "Řím",   price: 60, rent: 60, houses: 0, id: 4},
      { type: "TAX", percent: 20, money: 100, id:5 },
      { type: "PROPERTY", name: "Letecká doprava", city: "Letecká doprava",  price: 200, rent: 20, houses: 0, id: 6},
      { type: "PROPERTY", name: "Alexanderplatz", city: "Berlín",  price: 100, rent: 20, houses: 0, id: 7},
      { type: "CHANCE_CARD", id: 8 },
      { type: "PROPERTY", city: "Berlin", name: "Kurfürstendamm", price: 100, rent: 10, houses: 0, id: 9},
      { type: "PROPERTY", city: "Berlin", name: "Potsdammer StraSe", price: 120, rent: 12, houses: 0, id: 10},
      { type: "JAIL", id: 11},
      { type: "PROPERTY", name: "Syntagma", city: "Athény", price: 400, rent: 40, houses: 0, id: 40},
      { type: "PROPERTY", name: "Plaza Mayor", city: "Madrid", price: 140, rent: 14, houses: 0, id: 12},
      { type: "PAY", classicmoney: 75, id: 39},
      { type: "PROPERTY", name: "Elektrárna", city: "Elektrárna", price: 100, rent: 20, houses: 0, id: 13},
      { type: "PROPERTY", name: "La Plaka", city: "Athény", price: 350, rent: 35, houses: 0, id: 38},
      { type: "PROPERTY", name: "Gran Via", city: "Madrid", price: 140, rent: 14, houses: 0, id: 14},
      {type: "CHANCE_CARD", id: 37 },
      { type: "PROPERTY", name: "Paseo de la Castellana", city:"Madrid", price: 160, rent: 16, houses: 0, id: 15},
      { type: "PROPERTY", name: "Autobusová doprava", city: "Autobusová doprava", price: 200, rent: 20, houses: 0, id: 36},
      { type: "PROPERTY", name: "Tramvajová doprava", city: "Tramvajová doprava", price: 200, rent: 20, houses: 0, id: 16},
      { type: "PROPERTY", name: "Oxford Street", city: "Londýn", price: 320, rent: 32, houses: 0, id: 35},
      { type: "PROPERTY", name: "Dam", city: "Amsterdam", price: 180, rent: 18, houses: 0, id: 17},
      {type: "CHANCE_CARD", id: 34 },
      {type: "CHANCE_CARD", id: 18 },
      { type: "PROPERTY", name: "Piccadilly", city: "Londýn", price: 300, rent:30, houses: 0, id: 33},
      { type: "PROPERTY", name: "Leidsestraat", city: "Amsterdam", price: 180, rent: 18, houses: 0, id: 19},
      { type: "PROPERTY", name: "Park Lane", city: "Londýn", price: 300, rent:30, houses: 0, id: 32},
      { type: "PROPERTY", name: "Kalverstraat", city: "Amsterdam", price: 200, rent: 20, houses: 0, id: 20},

      { type: "JAIL", id: 31},
      { type: "PROPERTY", name: "Nieuwstraat", city: "Brusel", price: 280, rent: 28, houses: 0, id: 30},
      { type: "PROPERTY", name: "Plynárna", city: "Plynárna", price: 150, rent: 15, houses: 0, id: 29},
      { type: "PROPERTY", name: "Hoogstraat", city: "Brusel", price: 260, rent: 26, houses: 0, id: 28},
      { type: "PROPERTY", name: "Grote Markt", city: "Brusel", price: 260, rent: 26, houses: 0, id: 27},
      { type: "PROPERTY", name: "Železniční doprava", city: "Železniční doprava", price: 240, rent: 24, houses: 0, id: 26},
      { type: "PROPERTY", name: "ChampsElysees", city: "Paříž", price: 240, rent: 24, houses: 0, id: 25},
      { type: "PROPERTY", name: "Rue de la Paix", city: "Paříž", price: 220, rent: 22, houses: 0, id: 24},
      {type: "CHANCE_CARD", id: 23 },
      { type: "PROPERTY", name: "Rue de la Fayette", city: "Paříž", price: 220, rent: 22, houses: 0, id: 22},
      { type: "ANTI_MONOPOLY_OFFICE", id: 21},
    ];

  const initialState: GameState = {
      players: [],
      isPlayingPlayerid: 1,
      fields: initialFields,
      ownership: {},
  };



type Action =
  | { type: "MOVE_PLAYER"; playerId: number; newPositionId: number;}
  | { type: "INIT_PLAYERS"; defaultMoney: number; defaultPosition: number; players: Player[] }
  | {type: "BUY_PROPERTY"; playerId: number; fieldId: number, price: number}
  | {type: "PAY_MONEY"; playerId: number; money: number}
  | {type: "PAY_TAX"; playerId: number; money: number}
  | {type: "CHANCE_CARD"; playerId: number;}
  | { type: "SELL_PROPERTY"; playerId: number; fieldId: number; price: number }
  | { type: "DECLARE_BANKRUPTCY"; playerId: number; }

  const playingReducer = (state: GameState, action: Action): GameState => {
    switch (action.type) {
      case "INIT_PLAYERS":
        const playersInit: PlayingPlayer[] = action.players.map(player => ({
          ...player,
          money: action.defaultMoney,
          position: action.defaultPosition,
          isBankrupt: false,
        }));
  
        return {
          ...state,
          players: playersInit,
        };
  
        case "MOVE_PLAYER": {
          const playerMoving = state.players.find(p => p.id === action.playerId);
          if (playerMoving) {
            const newPositionId = action.newPositionId; 
        
            let updatedPlayers = state.players.map(p =>
              p.id === action.playerId
                ? { ...p, position: newPositionId }
                : p
            );
        
            const field = state.fields.find(f => f.id === newPositionId);
            if (field) {
              switch (field.type) {
                case "START":
                  updatedPlayers = updatedPlayers.map(p =>
                    p.id === action.playerId
                      ? { ...p, money: p.money + field.money }
                      : p
                  );
                  break;
                case "PAY":
                  updatedPlayers = updatedPlayers.map(p =>
                    p.id === action.playerId
                      ? { ...p, money: p.money - field.classicmoney }
                      : p
                  );
                  break;
                case "PROPERTY":
                  const propertyOwner = state.ownership[newPositionId];
                  if (propertyOwner && propertyOwner !== action.playerId) {
                    console.log("platba");
                    const rentAmount = field.rent;
                    updatedPlayers = updatedPlayers.map(p => {
                      if (p.id === action.playerId) {
                        return { ...p, money: p.money - rentAmount };
                      } else if (p.id === propertyOwner) {
                        return { ...p, money: p.money + rentAmount };
                      }
                      return p;
                    });
                  }
                  break;
              }
            }
        
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
          if (state.fields[action.fieldId - 1].type === "PROPERTY") {
              return {
                  ...state,
                  ownership: { ...state.ownership, [action.fieldId]: action.playerId },
                  players: state.players.map(p =>
                    p.id === action.playerId
                      ? { ...p, money: p.money - action.price }
                      : p
                  ),
              };
          }
          return state;
      
          case "CHANCE_CARD": {
            const playerIndex = state.players.findIndex(p => p.id === action.playerId);
            if (playerIndex !== -1) {
                const effect = Math.floor(Math.random() * 2);
                switch (effect) {
                    case 0:
                        state.players[playerIndex].money += 5000;
                        break;
                    case 1:
                        state.players[playerIndex].money -= 50;
                        break;
                }
            }
            return { ...state };
        }

          case 'SELL_PROPERTY':

  return state;

  case 'DECLARE_BANKRUPTCY':
    const updatedOwnership = { ...state.ownership };
    Object.keys(updatedOwnership).forEach(y => {
      const keyAsNumber = Number(y);
      if (updatedOwnership[keyAsNumber] === action.playerId) {
          delete updatedOwnership[keyAsNumber];
      }
  });

    return {
        ...state,
        ownership: updatedOwnership,
        players: state.players.map(p => p.id === action.playerId ? { ...p, isBankrupt: true } : p),
    };


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