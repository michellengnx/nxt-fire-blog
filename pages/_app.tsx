import NavBar from "../components/NavBar";
import { UserContextData } from "../lib/context";
import { useUserData } from "../lib/hooks";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const userData = useUserData();
  return (
    <>
      <UserContextData.Provider value={userData}>
        <Component {...pageProps} />
        <NavBar></NavBar>
      </UserContextData.Provider>
    </>
  );
}

export default MyApp;
