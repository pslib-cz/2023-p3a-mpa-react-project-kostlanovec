export enum Role {
    CONCURENT = "CONCURENT",
    MONOPOLIST = "MONOPOLIST"
}

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
