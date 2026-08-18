import { useMemo } from 'react';
import { SpacetimeDBProvider, useSpacetimeDB, useTable, useReducer } from 'spacetimedb/react';
import { DbConnection, reducers, tables } from '../module_bindings';

const TOKEN_KEY = 'kahootclone-spacetimedb-token';

function connectionBuilder() {
  let b = DbConnection.builder()
    .withUri(import.meta.env.VITE_SPACETIME_URI)
    .withDatabaseName(import.meta.env.VITE_SPACETIME_DB_NAME)
    .onConnect((conn, _identity, token) => {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      conn.subscriptionBuilder().subscribeToAllTables();
    })
    .onConnectError((_ctx, err) => console.error('SpacetimeDB', err));
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) b = b.withToken(token);
  return b;
}

export function SpacetimeProvider({ children }: { children: React.ReactNode }) {
  const builder = useMemo(() => connectionBuilder(), []);
  return <SpacetimeDBProvider connectionBuilder={builder}>{children}</SpacetimeDBProvider>;
}

export function useConn() {
  return useSpacetimeDB();
}

export function useGames() {
  const [rows, ready] = useTable(tables.game);
  return { rows, ready };
}

export function usePlayers() {
  const [rows, ready] = useTable(tables.player);
  return { rows, ready };
}

export function useQuestions() {
  const [rows, ready] = useTable(tables.questionPublic);
  return { rows, ready };
}

export function useTallies() {
  const [rows, ready] = useTable(tables.tally);
  return { rows, ready };
}

export function useReveals() {
  const [rows, ready] = useTable(tables.reveal);
  return { rows, ready };
}

export function useResults() {
  const [rows, ready] = useTable(tables.result);
  return { rows, ready };
}

export const useHostGame = () => useReducer(reducers.hostGame);
export const useJoinGame = () => useReducer(reducers.joinGame);
export const useStartGame = () => useReducer(reducers.startGame);
export const useAdvance = () => useReducer(reducers.advance);
export const useSubmitAnswer = () => useReducer(reducers.submitAnswer);
export const useFinishGame = () => useReducer(reducers.finishGame);

export function hex(id: { toHexString(): string } | undefined) {
  return id?.toHexString() ?? '';
}
