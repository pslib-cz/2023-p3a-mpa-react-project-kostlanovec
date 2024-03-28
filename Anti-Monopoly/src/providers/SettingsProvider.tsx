import React, { createContext, useReducer } from "react";
import { Role } from "../types/type";

type Player = {
  id: number;
  role: Role;
}

type StateType = {
  players: Player[];
};

const initialState: StateType = {
  players: [
    { id: 1, role: Role.CONCURENT},
    { id: 2, role: Role.MONOPOLIST},
  ],
};

type Action =
  | { type: "ADD_PLAYER" }
  | { type: "REMOVE_PLAYER"; payload: number }
  | { type: "TOGGLE_ROLE"; payload: number };

function reducer(state: StateType, action: Action): StateType {
  switch (action.type) {
    case "ADD_PLAYER":
      if (state.players.length < 6) {
        const newPlayer: Player = {
          id: state.players.length + 1,
          role: Role.CONCURENT
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

    default:
      return state;
  }
}

export const SettingsContext = createContext<[StateType, React.Dispatch<Action>]>([initialState, () => null]);

export const SettingsProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <SettingsContext.Provider value={[state, dispatch]}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
