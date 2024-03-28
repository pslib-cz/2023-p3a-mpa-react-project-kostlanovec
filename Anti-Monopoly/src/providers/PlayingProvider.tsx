import React, { PropsWithChildren, createContext, useReducer } from 'react';
import { Role } from '../types/type';


type PlayingPlayer = {
    id: number;
    money: number;
    role: Role;
    position: number;
};

type Player = {
    id: number;
    role: Role;
  }

  type GameState = {
    players: PlayingPlayer[];
    fields: Field[];
    ownership: { [key: number]: number };
  };

    const initialFields: Field[] = [
      { type: "START", money: 200 },
      { name: "Property 1", type: "PROPERTY", price: 100, rent: 10, houses: 0 },
      { type: "PAY", classicmoney: 500 },
      { type: "TAX", percent: 20, money: 100 },
    ];

  const initialState: GameState = {
      players: [],
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
  | { type: 'MOVE_PLAYER'; playerId: number; rollValue: number }
  | { type: 'INIT_PLAYERS'; defaultMoney: number; defaultPosition: number; players: Player[] }
  | {type: "BUY_PROPERTY"; playerId: number; fieldIndex: number, price: number}
  | {type: "PAY_MONEY"; playerId: number; money: number}
  | {type: "PAY_TAX"; playerId: number; money: number};

  const playingReducer = (state: GameState, action: Action): GameState => {
    switch (action.type) {
      case 'INIT_PLAYERS':
        const playersInit = action.players.map(player => ({
          ...player,
          money: action.defaultMoney,
          position: action.defaultPosition,
        }));
  
        return {
          ...state,
          players: playersInit,
        };
  
      case 'MOVE_PLAYER':
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