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

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/user/register", userData);
    return response.data;
  } catch (error) {
    console.error("Register user error:", error);
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await api.post("/user/login", userData);
    return response.data;
  } catch (error) {
    console.error("Login user error:", error);
    throw error;
  }
};

export const loginAdmin = async (userData) => {
  try {
    const response = await api.post("/admin/login", userData);
    return response.data;
  } catch (error) {
    console.error("Login admin error:", error);
    throw error;
  }
};

export const verifyUser = async () => {
  try {
    const response = await api.get("/user/me");
    return response.data;
  } catch (error) {
    console.error("Verify user error:", error);
    throw error;
  }
};

export const verifyAdmin = async () => {
  try {
    const response = await api.get("/admin/me");
    return response.data;
  } catch (error) {
    console.error("Verify admin error:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post("/user/logout");
    return response.data;
  } catch (error) {
    console.error("Logout user error:", error);
    throw error;
  }
};

export const logoutAdmin = async () => {
  try {
    const response = await api.post("/admin/logout");
    return response.data;
  } catch (error) {
    console.error("Logout admin error:", error);
    throw error;
  }
};

export const getUserCart = async () => {
  try {
    const response = await api.get("/cart");
    return response.data;
  } catch (error) {
    console.error("Get user cart error:", error);
    throw error;
  }
};

export const addToCart = async (productId, qty) => {
  try {
    const response = await api.post("/cart", { productId, qty });
    return response.data;
  } catch (error) {
    console.error("Add to Cart error:", error);
    throw error;
  }
};

export const deleteCartItem = async (cartItemId) => {
  try {
    const response = await api.delete(`/cart/${cartItemId}`);
    return response.data;
  } catch (error) {
    console.error("Delete Cart Item error:", error);
    throw error;
  }
};

export const updateCartQty = async (id, qty) => {
  try {
    const response = await api.put(`/cart/${id}`, { qty });
    return response.data;
  } catch (error) {
    console.error("Update Cart Qty error:", error);
    throw error;
  }
};
