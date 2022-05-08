import { isJwtExpired } from "jwt-check-expiration";
import Cookies from "js-cookie";

const useIsLoggedIn = () => {
  let token = localStorage.getItem("token");
  return !token ? false : !isJwtExpired(token);
};

export default useIsLoggedIn;
