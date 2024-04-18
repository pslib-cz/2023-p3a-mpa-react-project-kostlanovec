import React, { PropsWithChildren, createContext, useReducer } from 'react';
import { Field, PlayingPlayer, Player, GameState, cities, Role } from '../types/type';



// definování pole hráče.
const initialFields: Field[] = [
  { type: "START", money: 200, id: 1 },
  { type: "PROPERTY", cityid: 100, name: "Corso Impero", price: 60, rent: 6, houses: 0, id: 2 },
  { type: "CHANCE_CARD", id: 3 },
  { type: "PROPERTY", name: "Via Roma", cityid: 100, price: 60, rent: 60, houses: 0, id: 4 },
  { type: "TAX", percent: 20, money: 100, id: 5 },
  { type: "TRANSPORT", name: "Letecká doprava", price: 200, rent: 20, id: 6, image: "Airplane.svg" },
  { type: "PROPERTY", name: "Alexanderplatz", cityid: 101, price: 100, rent: 20, houses: 0, id: 7 },
  { type: "CHANCE_CARD", id: 8 },
  { type: "PROPERTY", cityid: 101, name: "Kurfürstendamm", price: 100, rent: 10, houses: 0, id: 9 },
  { type: "PROPERTY", cityid: 101, name: "Potsdammer StraSe", price: 120, rent: 12, houses: 0, id: 10 },
  { type: "JAIL", id: 11 },
  { type: "PROPERTY", name: "Syntagma", cityid: 107, price: 400, rent: 40, houses: 0, id: 40 },
  { type: "PROPERTY", name: "Plaza Mayor", cityid: 103, price: 140, rent: 14, houses: 0, id: 12 },
  { type: "PAY", classicmoney: 75, id: 39 },
  { type: "PROPERTY", name: "Elektrárna", cityid: 103, price: 100, rent: 20, houses: 0, id: 13 },
  { type: "PROPERTY", name: "La Plaka", cityid: 107, price: 350, rent: 35, houses: 0, id: 38 },
  { type: "PROPERTY", name: "Gran Via", cityid: 103, price: 140, rent: 14, houses: 0, id: 14 },
  { type: "CHANCE_CARD", id: 37 },
  { type: "PROPERTY", name: "Paseo de la Castellana", cityid: 103, price: 160, rent: 16, houses: 0, id: 15 },
  { type: "TRANSPORT", name: "Autobusová doprava", price: 200, rent: 20, id: 36, image: "Bus.svg"},
  { type: "TRANSPORT", name: "Tramvajová doprava", price: 200, rent: 20, id: 16, image: "Tramvaj.svg"},
  { type: "PROPERTY", name: "Oxford Street", cityid: 104, price: 320, rent: 32, houses: 0, id: 35 },
  { type: "PROPERTY", name: "Dam", cityid: 105, price: 180, rent: 18, houses: 0, id: 17 },
  { type: "CHANCE_CARD", id: 34 },
  { type: "CHANCE_CARD", id: 18 },
  { type: "PROPERTY", name: "Piccadilly", cityid: 104, price: 300, rent: 30, houses: 0, id: 33 },
  { type: "PROPERTY", name: "Leidsestraat", cityid: 105, price: 180, rent: 18, houses: 0, id: 19 },
  { type: "PROPERTY", name: "Park Lane", cityid: 104, price: 300, rent: 30, houses: 0, id: 32 },
  { type: "PROPERTY", name: "Kalverstraat", cityid: 105, price: 200, rent: 20, houses: 0, id: 20 },
  { type: "JAIL", id: 31 },
  { type: "PROPERTY", name: "Nieuwstraat", cityid: 106, price: 280, rent: 28, houses: 0, id: 30 },
  { type: "PROPERTY", name: "Plynárna", cityid: 107, price: 150, rent: 15, houses: 0, id: 29 },
  { type: "PROPERTY", name: "Hoogstraat", cityid: 106, price: 260, rent: 26, houses: 0, id: 28 },
  { type: "PROPERTY", name: "Grote Markt", cityid: 106, price: 260, rent: 26, houses: 0, id: 27 },
  { type: "TRANSPORT", name: "Železniční doprava",  price: 240, rent: 24, id: 26, image: "Train.svg"},
  { type: "PROPERTY", name: "ChampsElysees", cityid: 107, price: 240, rent: 24, houses: 0, id: 25 },
  { type: "PROPERTY", name: "Rue de la Paix", cityid: 107, price: 220, rent: 22, houses: 0, id: 24 },
  { type: "CHANCE_CARD", id: 23 },
  { type: "PROPERTY", name: "Rue de la Fayette", cityid: 107, price: 220, rent: 22, houses: 0, id: 22 },
  { type: "ANTI_MONOPOLY_OFFICE", id: 21 },
];

type Action =
  | { type: "MOVE_PLAYER"; playerId: number; newPositionId: number; }
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
  | { type: "TOGGLE_ROLE"; payload: number };

const initialState: GameState = {
  players: [
    { id: 1, money: 1500, role: Role.MONOPOLIST, position: 1, isBankrupt: false },
    { id: 2, money: 1500, role: Role.CONCURENT, position: 1, isBankrupt: false },
  ],
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

        if (newPositionId < playerMoving.position || newPositionId === 1) {
          updatedPlayers = updatedPlayers.map(p =>
            p.id === action.playerId
              ? { ...p, money: p.money + 200 }
              : p
          );
        }

        const field = state.fields.find(f => f.id === newPositionId);
        if (field) {
          switch (field.type) {
            case "PAY":
              updatedPlayers = updatedPlayers.map(p =>
                p.id === action.playerId
                  ? { ...p, money: p.money - field.classicmoney }
                  : p
              );
              break;
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
              }
              break;
              
              case "PROPERTY": {
                const propertyOwner = state.ownership[newPositionId];
                if (propertyOwner && propertyOwner !== action.playerId && field.type === "PROPERTY") {

                  const propertiesOwnedByOwner = Object.keys(state.ownership)
                    .filter(key => state.ownership[parseInt(key)] === propertyOwner)
                    .map(key => state.fields[parseInt(key) - 1])
                    .filter(field => field.type === "PROPERTY");
              
                  const isMonopoly = propertiesOwnedByOwner
                    .filter(property => property.cityid === field.cityid).length > 1;
              
                  let rentAmount = field.rent;
                  if (isMonopoly) {
                    rentAmount *= 2;
                  }
              
                  updatedPlayers = updatedPlayers.map(p => {
                    if (p.id === action.playerId) {
                      return { ...p, money: p.money - rentAmount };
                    } else if (p.id === propertyOwner) {
                      return { ...p, money: p.money + rentAmount };
                    }
                    return p;
                  });
                }
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
      if (state.fields[action.fieldId - 1].type === "PROPERTY" || state.fields[action.fieldId - 1].type === "TRANSPORT") {
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
      else {
        console.log("není možné koupit");
        console.log(state.fields[action.fieldId - 1].type);
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

    case 'BUY_HOUSE': {
      const fieldIndex = state.fields.findIndex(field => field.id === action.fieldId);
      const playerIndex = state.players.findIndex(player => player.id === action.playerId);
      if (fieldIndex !== -1 && playerIndex !== -1) {
        const field = state.fields[fieldIndex];
        const player = state.players[playerIndex];
        const housePrice = field.type === "PROPERTY" ? cities.find(city => city.id === field.cityid)?.pricehouse : undefined;
    
        const ownsOtherPropertiesInCity = state.fields.filter(f =>
          f.type === "PROPERTY" && f.cityid === field.cityid && state.ownership[f.id] === action.playerId
        ).length > 1;
    
    
        const totalCost = (housePrice || 0) * action.houseCount;
    
        if (field.type === "PROPERTY" && player.money >= totalCost && ownsOtherPropertiesInCity) {
          field.houses += action.houseCount;
          player.money -= totalCost;
    
          return {
            ...state,
            fields: [...state.fields.slice(0, fieldIndex), field, ...state.fields.slice(fieldIndex + 1)],
            players: [...state.players.slice(0, playerIndex), player, ...state.players.slice(playerIndex + 1)],
          };
        }
      }
      return state;
    }

    case 'SELL_PROPERTY': {
      const updatedOwnership = { ...state.ownership };
      delete updatedOwnership[action.fieldId];
      
      return {
      ...state,
      ownership: updatedOwnership,
      players: state.players.map(p =>
        p.id === action.playerId
        ? { ...p, money: p.money + action.price }
        : p
      ),
      };
    }

    case "SELL_HOUSES": {
      const fieldIndex = state.fields.findIndex(field => field.id === action.fieldId);
      const playerIndex = state.players.findIndex(player => player.id === action.playerId);
      if (fieldIndex !== -1 && playerIndex !== -1) {
      const field = state.fields[fieldIndex];
      const player = state.players[playerIndex];
      const housePrice = field.type === "PROPERTY" ? cities.find(city => city.id === field.cityid)?.pricehouse : undefined;
      const totalCost = (housePrice || 0) * action.houseCount;

      if (field.type === "PROPERTY" && field.houses >= action.houseCount) {
        field.houses -= action.houseCount;
        player.money += totalCost;

        return {
        ...state,
        fields: [...state.fields.slice(0, fieldIndex), field, ...state.fields.slice(fieldIndex + 1)],
        players: [...state.players.slice(0, playerIndex), player, ...state.players.slice(playerIndex + 1)],
        };
      }
      }
      return state;
    }

    case "ADD_PLAYER":
      console.log("přidání hráče");
      if (state.players.length < 6) {
        const newPlayer: PlayingPlayer = {
          id: state.players.length + 1,
          role: Role.CONCURENT,
          money: 1500,
          position: 0,
          isBankrupt: false
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
      console.log("změna role")
      return {
        ...state,
        players: state.players.map(player =>
          player.id === action.payload
            ? { ...player, role: player.role === Role.CONCURENT ? Role.MONOPOLIST : Role.CONCURENT }
            : player
        ),
      };


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