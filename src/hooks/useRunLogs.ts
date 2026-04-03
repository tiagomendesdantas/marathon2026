import { useState, useCallback } from 'react';
import type { RunLog, AppState } from '../types';
import { getAppState, saveAppState } from '../utils/storage';

export function useRunLogs() {
  const [state, setState] = useState<AppState>(getAppState);

  const logRun = useCallback((log: RunLog) => {
    setState((prev) => {
      const next = { ...prev, logs: { ...prev.logs, [log.date]: log } };
      saveAppState(next);
      return next;
    });
  }, []);

  const deleteLog = useCallback((date: string) => {
    setState((prev) => {
      const next = { ...prev, logs: { ...prev.logs } };
      delete next.logs[date];
      saveAppState(next);
      return next;
    });
  }, []);

  const importState = useCallback((newState: AppState) => {
    saveAppState(newState);
    setState(newState);
  }, []);

  return { logs: state.logs, logRun, deleteLog, importState };
}
