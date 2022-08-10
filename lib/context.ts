import { createContext } from "react";

export const UserContextData = createContext({
  user: null,
  username: "",
});
