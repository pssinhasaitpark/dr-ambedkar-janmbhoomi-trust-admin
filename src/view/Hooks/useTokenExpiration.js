import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/slice/authslice";

const useTokenExpiration = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkTokenExpiry = () => {
      const tokenExpiry = localStorage.getItem("tokenExpiry");
      if (tokenExpiry && Date.now() >= tokenExpiry) {
        dispatch(logoutUser()); // Logout if token expired
      }
    };

    // Check token expiry every 1 minute
    const interval = setInterval(checkTokenExpiry, 10000);
    return () => clearInterval(interval);
  }, [dispatch]);
};

export default useTokenExpiration;
