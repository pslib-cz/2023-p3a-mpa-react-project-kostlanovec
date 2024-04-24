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
    isJailed: boolean;
};

export type Player = {
    id: number;
    role: Role;
  }

  
  export type GameState = {
    players: PlayingPlayer[];
    isPlayingPlayerid : number;
    fields: Field[];
    ownership: { [key: number]: number };
    chanceCardMessage?: string;
  };

  export interface Field {
    id: number;
    type: FieldType;
  }

  export enum FieldType {
    PROPERTY = "PROPERTY",
    CHANCE_CARD = "CHANCE_CARD",
    PAY = "PAY",
    TAX = "TAX",
    JAIL = "JAIL",
    START = "START",
    ANTI_MONOPOLY_OFFICE = "ANTI_MONOPOLY_OFFICE",
    ENERGY = "ENERGY",
    TRANSPORT = "TRANSPORT",
    GO_JAIL = "GO_JAIL"
  }

  export type ChanceCard = Field & {
    type: FieldType.CHANCE_CARD;
};

export type Pay = Field & {
    type: FieldType.PAY;
    classicMoney: number;
}

export type Tax = Field & {
    type: FieldType.TAX;
    percentage: number;
    money: number;
}

export type Jail = Field & {
    type: FieldType.JAIL;
};

export type GoJail = Field & {
    type: FieldType.GO_JAIL;
};

export type Property = Field & {
    type: FieldType.PROPERTY;
    name: string;
    cityid: number;
    price: number;
    rent: number;
    houses: number;

}

export type Start = Field & {
    type: FieldType.START;
    money: number;
}

export type AntiMonopolyOffice = Field & {
    type: FieldType.ANTI_MONOPOLY_OFFICE;
};

export type Energy = Field & {
    type: FieldType.ENERGY;
    name: string;
};

export type Transport = Field & {
    type: FieldType.TRANSPORT;
    name: string;
    price: number;
    rent: number;
    image: string;
};