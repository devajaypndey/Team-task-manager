import api from "./axios";

export const fetchAllUsers = async () => {
  const { data } = await api.get("/users");
  return data;
};

export const createUser = async (payload) => {
  const { data } = await api.post("/users", payload);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};
