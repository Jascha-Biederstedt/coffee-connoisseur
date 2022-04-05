import { createContext, useReducer } from 'react';
import '../styles/globals.css';

const StoreContext = createContext();

const ACTION_TYPES = {
  SET_LATITUDE: 'SET_LATITUDE',
  SET_LONGITUDE: 'SET_LONGITUDE',
  SET_COFFEE_STORES: 'SET_COFFEE_STORES',
};

const storeReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LATITUDE:
      return { ...state, latitude: action.payload.latitude };
    case ACTION_TYPES.SET_LONGITUDE:
      return { ...state, latitude: action.payload.longitude };
    case ACTION_TYPES.SET_COFFEE_STORES:
      return { ...state, coffeeStores: action.payload.coffeeStores };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const StoreProvider = ({ children }) => {
  const initialState = {
    latitude: '',
    longitude: '',
    coffeeStores: [],
  };

  const [state, dispatch] = useReducer(storeReducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <Component {...pageProps} />;
    </StoreProvider>
  );
}

export default MyApp;
