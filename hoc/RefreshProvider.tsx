import React, { createContext, useContext, useRef } from 'react';

const RefreshContext = createContext<any>(null);

export const RefreshProvider = ({ children }: any) => {
  const isRefreshing = useRef(false);
  const refreshIntervalId = useRef<NodeJS.Timeout | null>(null);

  const startRefresh = (refresh: () => void) => {
    if (!refreshIntervalId.current) {
      refresh(); // Начальный вызов
      refreshIntervalId.current = setInterval(refresh, 40000); // Повторный вызов каждые 40 секунд
    }
  };

  const stopRefresh = () => {
    if (refreshIntervalId.current) {
      clearInterval(refreshIntervalId.current);
      refreshIntervalId.current = null;
    }
  };

  return (
    <RefreshContext.Provider value={{ startRefresh, stopRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = () => useContext(RefreshContext);