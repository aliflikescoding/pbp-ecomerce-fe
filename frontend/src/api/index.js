import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const getProducts = async (page, search, sort, category) => {
  try {
    const response = await api.get(
      `/product?page=${page}&limit=6&search=${search}&sortBy=${sort}&category=${category}`
    );
    return response.data;
  } catch (error) {
    console.error("Get faq error:", error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get("/category");
    return response.data;
  } catch (error) {
    console.error("Get categories error:", error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/product/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get product by id error:", error);
    throw error;
  }
};

export const checkUserAuth = async () => {
  try {
    const response = await api.get("/user/me");
    return response.data;
  } catch (error) {
    console.error("Check user auth error:", error);
    throw error;
  }
};