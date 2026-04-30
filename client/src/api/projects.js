import api from "./axios";

export const fetchProjects = async () => {
  const { data } = await api.get("/projects");
  return data;
};

export const fetchProject = async (id) => {
  const { data } = await api.get(`/projects/${id}`);
  return data;
};

export const createProject = async (payload) => {
  const { data } = await api.post("/projects", payload);
  return data;
};

export const updateProject = async (id, payload) => {
  const { data } = await api.put(`/projects/${id}`, payload);
  return data;
};

export const deleteProject = async (id) => {
  const { data } = await api.delete(`/projects/${id}`);
  return data;
};

export const addMember = async (projectId, email, role) => {
  const { data } = await api.post(`/projects/${projectId}/members`, { email, role });
  return data;
};

export const removeMember = async (projectId, userId) => {
  const { data } = await api.delete(`/projects/${projectId}/members/${userId}`);
  return data;
};
