import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../redux/axios/axios";  // Import your Axios instance

const login = async (userData) => {
  const response = await api.post("/user/login", userData);  // Use the api instance
  console.log("Response: ", response);
  
  return response.data;
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("Login successful!", data);
      localStorage.setItem("token", data.token);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error("Login failed!", error);
    },
  });
};
