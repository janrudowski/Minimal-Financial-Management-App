import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';

const APIContext = createContext();

export function useAPI() {
  return useContext(APIContext);
}

export const ACTIONS = {
  SET_DATA: 'set-data', //get data from db and update state
};

function reducer(state, { type, payload }) {}

export function APIContextProvider({ children }) {
  const [loading, setLoading] = useState();
  const [apiData, dispatch] = useReducer(reducer, {});

  useEffect(() => {
    //TODO: api call
  }, []);

  return (
    <APIContext.Provider value={{ apiData, loading, dispatch }}>
      {children}
    </APIContext.Provider>
  );
}
