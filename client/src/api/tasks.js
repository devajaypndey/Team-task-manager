import api from "./axios";

export const fetchProjectTasks = async (projectId) => {
  const { data } = await api.get(`/tasks/project/${projectId}`);
  return data;
};

export const createTask = async (payload) => {
  const { data } = await api.post("/tasks", payload);
  return data;
};

export const updateTask = async (id, payload) => {
  const { data } = await api.put(`/tasks/${id}`, payload);
  return data;
};

export const deleteTask = async (id) => {
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
};
