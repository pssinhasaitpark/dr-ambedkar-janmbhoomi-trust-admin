export const isTokenExpired = () => {
    const tokenExpiry = localStorage.getItem("tokenExpiry");
  
    if (!tokenExpiry || Date.now() >= Number(tokenExpiry)) {
      return true;
    }
    return false; 
  };
  