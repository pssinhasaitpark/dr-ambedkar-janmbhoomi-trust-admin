import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const login = async (userData) => {
  const response = await axios.post(
    "http://192.168.0.127:8080/api/user/login",
    userData
  );
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
