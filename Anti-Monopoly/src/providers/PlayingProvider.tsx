import React, { PropsWithChildren, createContext, useReducer } from 'react';
import { Role } from '../types/type';


type PlayingPlayer = {
    id: number;
    money: number;
    role: Role;
    position: number;
    isBankrupt: boolean;
};

type Player = {
    id: number;
    role: Role;
  }

  type GameState = {
    players: PlayingPlayer[];
    isPlayingPlayerid : number;
    fields: Field[];
    ownership: { [key: number]: number };
  };

    const initialFields: Field[] = [
      { type: "START", money: 200 },
      { name: "Property 1", type: "PROPERTY", price: 100, rent: 10, houses: 0 },
      { type: "PAY", classicmoney: 5000 },
      { type: "TAX", percent: 20, money: 100 },
      { type: "CHANCE_CARD"},
      { type: "PROPERTY", name: "Property 2", price: 200, rent: 20, houses: 0 },
      { type: "JAIL"},
      { type: "JAIL"},
      { type: "PROPERTY", name: "Property 3", price: 200, rent: 20, houses: 0 },
    ];

  const initialState: GameState = {
      players: [],
      isPlayingPlayerid: 1,
      fields: initialFields,
      ownership: {},
  };


type Property = {
    name: string;
    type: "PROPERTY";
    price: number;
    rent: number;
    houses: number;
}

type ChanceCard = {
    type: "CHANCE_CARD";
}

type Pay = {
    type: "PAY";
    classicmoney: number;
}

type Tax = {
    type: "TAX";
    percent: number;
    money: number;
}

type Jail = {
    type: "JAIL";
}

type Start = {
    type: "START";
    money: number;
}

type AntiMonopolyOffice = {
    type: "ANTI_MONOPOLY_OFFICE";
}

type Field = Property | ChanceCard | Pay | Jail | Start | AntiMonopolyOffice | Tax;

type Action =
  | { type: "MOVE_PLAYER"; playerId: number; rollValue: number }
  | { type: "INIT_PLAYERS"; defaultMoney: number; defaultPosition: number; players: Player[] }
  | {type: "BUY_PROPERTY"; playerId: number; fieldIndex: number, price: number}
  | {type: "PAY_MONEY"; playerId: number; money: number}
  | {type: "PAY_TAX"; playerId: number; money: number}
  | {type: "CHANCE_CARD"; playerId: number;}
  | { type: "SELL_PROPERTY"; playerId: number; fieldIndex: number; price: number }
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
  
      case "MOVE_PLAYER":
        const playerMoving = state.players.find(p => p.id === action.playerId);
        if (playerMoving) {
          let newPosition = (playerMoving.position + action.rollValue) % state.fields.length;
          let updatedPlayers = state.players.map(p =>
            p.id === action.playerId
              ? { ...p, position: newPosition }
              : p
          );

          
          const field = state.fields[newPosition];
          switch (field.type) {
            case "START":
              playerMoving.money += field.money;
              break;
            case "PAY":
              updatedPlayers = updatedPlayers.map(p =>
                p.id === action.playerId
                  ? { ...p, money: p.money - field.classicmoney }
                  : p
              );
              break;
            case "PROPERTY":
              const propertyOwner = state.ownership[newPosition];
              if (propertyOwner && propertyOwner !== action.playerId) {
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
  
          return {
            ...state,
            players: updatedPlayers,
          };
        }
        return state;
  
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
          if (state.fields[action.fieldIndex].type === "PROPERTY") {
            console.log("kupování")
              return {
                  ...state,
                  ownership: { ...state.ownership, [action.fieldIndex]: action.playerId },
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