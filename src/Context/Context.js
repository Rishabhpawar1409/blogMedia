import React, {
  createContext,
  useContext,
  useReducer,
  useState,
  useEffect
} from "react";
import data from "./data";
import reducer from "./reducer";

const Favroite = createContext();

const Context = ({ children }) => {
  const [blogs] = useState(data);

  const initialReducer = () => {
    return JSON.parse(localStorage.getItem("State(blogs,favBlogs)" || "[]"));
  };
  const [state, dispatch] = useReducer(
    reducer,
    {
      blogs: blogs,
      Favourite: []
    },
    initialReducer
  );

  useEffect(() => {
    localStorage.setItem("State(blogs,favBlogs)", JSON.stringify(state));
  }, [state]);

  return (
    <Favroite.Provider value={{ state, dispatch }}>
      {children}
    </Favroite.Provider>
  );
};
export default Context;

export const FavroiteState = () => {
  return useContext(Favroite);
};
