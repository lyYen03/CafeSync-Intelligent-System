import axiosClient from "../services/axiosClient";

export const getCategories = async () => {
  const res = await axiosClient.get("/categories");
  return res.data;
};

export const createCategory = async (data) => {
  const res = await axiosClient.post("/categories", data);
  return res.data;
};

export const updateCategory = async (id, data) => {
  const res = await axiosClient.put(`/categories/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await axiosClient.delete(`/categories/${id}`);
  return res.data;
};