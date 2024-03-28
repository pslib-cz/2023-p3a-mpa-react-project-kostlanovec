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
