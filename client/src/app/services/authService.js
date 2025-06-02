import axios from "axios";
import { BACKEND_URL } from "../../utils/url";

export const AUTH_URL = `${BACKEND_URL}/auth`;

// login
const login = async (userData) => {
  try {
    const response = await axios.post(`${AUTH_URL}/login`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("Something went wrong");
  }
};

const signup = async (userData) => {
  try {
    const response = await axios.post(`${AUTH_URL}/signup`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("Something went wrong");
  }
};

const verifyEmail = async (data) => {
  try {
    const response = await axios.post(`${AUTH_URL}/verifyEmail`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("Something went wrong");
  }
};


const sendOTPForgotPassword = async (email) => {
  try {
    const response = await axios.post(`${AUTH_URL}/sendOTPForgotPassword`, email, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("Something went wrong");
  }
};

const resetPassword = async (data) => {
  try {
    const response = await axios.post(`${AUTH_URL}/resetPassword`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("Something went wrong");
  }
};

const changePassword = async (data) => {
  try {
    const response = await axios.post(`${AUTH_URL}/changePassword`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("Something went wrong");
  }
};


// Logout
const logout = async () => {
  try {
    const response = await axios.post(`${AUTH_URL}/logout`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("Something went wrong");
  }
};


// get user
const getUser = async () => {
  try {
    const response = await axios.get(`${AUTH_URL}/get-user`);
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("Something went wrong");
  }
};


const authService = {
  signup,
  verifyEmail,
  login,
  sendOTPForgotPassword,
  resetPassword,
  getUser,
  logout,
  changePassword
};

export default authService;
