enum Role {
    COMPETITOR = "COMPETITOR",
    MONOPOLIST = "MONOPOLIST"
}

type Player = {
    playerid: number;
    money: number;
    role: Role;
}

type Board = {
    properties: Property[];
}

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
    dan: number;
    classicmoney: number;
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

type Field = Property | ChanceCard | Pay | Jail | Start | AntiMonopolyOffice;