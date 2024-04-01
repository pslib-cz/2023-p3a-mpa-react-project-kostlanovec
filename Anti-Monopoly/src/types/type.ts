export enum Role {
    CONCURENT = "CONCURENT",
    MONOPOLIST = "MONOPOLIST"
}

export const cities = [
    { id: 100, name: "Řím", color: "light-green", pricehouse: 50 },
    { id: 101, name: "Berlín", color: "brown", pricehouse: 50 },
    { id: 102, name: "Athény", color: "pink", pricehouse: 100 },
    { id: 103, name: "Madrid", color: "dark-green", pricehouse: 100 },
    { id: 104, name: "Londýn", color: "blue", pricehouse: 150 },
    { id: 105, name: "Amsterdam", color: "purple", pricehouse: 150 },
    { id: 106, name: "Brusel", color: "yellow", pricehouse: 200 },
    { id: 107, name: "Paříž", color: "orange", pricehouse: 200 },
]
export type PlayingPlayer = {
    id: number;
    money: number;
    role: Role;
    position: number;
    isBankrupt: boolean;
};


export type Property = {
    name: string;
    cityid: number;
    type: "PROPERTY";
    price: number;
    rent: number;
    houses: number;
    id: number;
}
export type Player = {
    id: number;
    role: Role;
  }

  
  export type GameState = {
    players: PlayingPlayer[];
    isPlayingPlayerid : number;
    fields: Field[];
    ownership: { [key: number]: number };
  };

type ChanceCard = {
    type: "CHANCE_CARD";
    id: number
}

type Pay = {
    type: "PAY";
    classicmoney: number;
    id: number;
}

type Tax = {
    type: "TAX";
    percent: number;
    money: number;
    id: number;
}

type Jail = {
    type: "JAIL";
    id: number;
}

type Start = {
    type: "START";
    money: number;
    id: number;
}

type AntiMonopolyOffice = {
    type: "ANTI_MONOPOLY_OFFICE";
    id: number;
}

type Energy = {
    type: "Energy";
    id: number;
}

type Transport = {
    type: "Transport";
    id: number;
}

export type Field = Property | ChanceCard | Pay | Jail | Start | AntiMonopolyOffice | Tax | Energy | Transport;
