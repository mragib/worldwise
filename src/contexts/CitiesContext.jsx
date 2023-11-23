import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const BASE_URl = "http://localhost:8000";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  loading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, loading: true };
    case "cities/loaded":
      return { ...state, loading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, loading: false, currentCity: action.payload };
    case "city/created":
      return {
        ...state,
        loading: false,
        cities: [...state.cities, action.payload],
      };
    case "city/removed":
      return {
        ...state,
        loading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };
    case "rejected":
      return { ...state, loading: false, error: action.payload };
    default:
      return "Unknown action";
  }
}

function CitiesProvider({ children }) {
  const [{ cities, loading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCity() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URl}/cities`);
        const data = await res.json();

        dispatch({ type: "cities/loaded", payload: data });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: "There is an error while loading cities",
        });
      }
    }
    fetchCity();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URl}/cities/${id}`);
        const data = await res.json();

        dispatch({ type: "city/loaded", payload: data });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: "There is an error while loading a city",
        });
      }
    },
    [currentCity.id]
  );

  async function addCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URl}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There is an error while createing a city",
      });
    }
  }

  async function removeCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URl}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/removed", payload: id });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There is an error while deleting a city",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{ cities, loading, currentCity, getCity, addCity, removeCity }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCity() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("City Context is used outside city provider");
  return context;
}

export { CitiesProvider, useCity };
