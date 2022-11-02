import React, { useContext, useState } from "react";

const LoadingContext = React.createContext();

export function useLoadingContext() {
  return useContext(LoadingContext);
}

export function LoadingContextProvider({ children }) {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider
      value={{
        loading,
        setLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}
