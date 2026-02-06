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
  votes: Record<string, "JA" | "NEIN">;
  electionTracker: number;
  players: Player[];
  presidentSeat: number;
  chancellorSeat: number | null;
  phase: GamePhase;
  liberalPolicies: number;
  fascistPolicies: number;
  winner: "LIBERAL" | "FASCIST" | null;
};

export function createNewGame(): GameState {
  return {
    gameId: "game-1",
    votes: {},
    electionTracker: 0,
    players: [
      { id: "p1", seat: 0, alive: true },
      { id: "p2", seat: 1, alive: true },
      { id: "p3", seat: 2, alive: true },
      { id: "p4", seat: 3, alive: true },
      { id: "p5", seat: 4, alive: true },
    ],
    presidentSeat: 0,
    chancellorSeat: null,
    phase: GamePhase.NOMINATION,
    liberalPolicies: 0,
    fascistPolicies: 0,
    winner: null,
  };
}

export function nominateChancellor(
  state: GameState,
  presidentSeat: number,
  chancellorSeat: number
): GameState {
  // Rule 1: must be nomination phase
  if (state.phase !== GamePhase.NOMINATION) {
    return state;
  }

  // Rule 2: only current president can nominate
  if (state.presidentSeat !== presidentSeat) {
    return state;
  }

  // Rule 3: president cannot nominate themselves
  if (presidentSeat === chancellorSeat) {
    return state;
  }

  // All rules satisfied → move to voting
  return {
    ...state,
    phase: GamePhase.VOTING,
    chancellorSeat,
  };
}

export function castVote(
  state: GameState,
  playerId: string,
  vote: "JA" | "NEIN"
): GameState {
  // Must be voting phase
  if (state.phase !== GamePhase.VOTING) {
    return state;
  }

  // Player must exist and be alive
  const player = state.players.find(p => p.id === playerId);
  if (!player || !player.alive) {
    return state;
  }

  // Record vote
  return {
    ...state,
    votes: {
      ...state.votes,
      [playerId]: vote,
    },
  };
}

export function resolveVotes(state: GameState): GameState {
  // Must be voting phase
  if (state.phase !== GamePhase.VOTING) {
    return state;
  }

  const votes = Object.values(state.votes);

  // Not all players have voted yet
  if (votes.length < state.players.length) {
    return state;
  }

  const jaCount = votes.filter(v => v === "JA").length;
  const neinCount = votes.filter(v => v === "NEIN").length;

  // Government PASSES
  if (jaCount > neinCount) {
    return {
      ...state,
      phase: GamePhase.LEGISLATIVE_PRESIDENT,
      electionTracker: 0,
      votes: {},
      chancellorSeat: state.chancellorSeat,

    };
  }

  // Government FAILS
  return {
    ...state,
    electionTracker: state.electionTracker + 1,
    chancellorSeat: null,
    votes: {},
    presidentSeat: (state.presidentSeat + 1) % state.players.length,
    phase: GamePhase.NOMINATION,
  };
}
