export enum GamePhase {
  LOBBY = "LOBBY",
  ROLE_ASSIGNMENT = "ROLE_ASSIGNMENT",
  NOMINATION = "NOMINATION",
  VOTING = "VOTING",
  LEGISLATIVE_PRESIDENT = "LEGISLATIVE_PRESIDENT",
  LEGISLATIVE_CHANCELLOR = "LEGISLATIVE_CHANCELLOR",
  POWER = "POWER",
  GAME_OVER = "GAME_OVER",
}

export type Player = {
  id: string;
  seat: number;
  alive: boolean;
};

export type GameState = {
  gameId: string;
  players: Player[];
  presidentSeat: number;
  phase: GamePhase;
  liberalPolicies: number;
  fascistPolicies: number;
  winner: "LIBERAL" | "FASCIST" | null;
};

export function createNewGame(): GameState {
  return {
    gameId: "game-1",
    players: [
      { id: "p1", seat: 0, alive: true },
      { id: "p2", seat: 1, alive: true },
      { id: "p3", seat: 2, alive: true },
      { id: "p4", seat: 3, alive: true },
      { id: "p5", seat: 4, alive: true },
    ],
    presidentSeat: 0,
    phase: GamePhase.LOBBY,
    liberalPolicies: 0,
    fascistPolicies: 0,
    winner: null,
  };
}
