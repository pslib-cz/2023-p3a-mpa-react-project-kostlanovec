export enum Role {
    CONCURENT = "CONCURENT",
    MONOPOLIST = "MONOPOLIST"
}

type Player = {
    id: number;
    money: number;
    role: Role;
    position: number;
}

type Property = {
    name: string;
    type: "PROPERTY";
    price: number;
    rent: number;
    houses: number;
    id: number;
}

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

export type Field = Property | ChanceCard | Pay | Jail | Start | AntiMonopolyOffice | Tax;
