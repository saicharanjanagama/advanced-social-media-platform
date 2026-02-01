import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // --------------------
  // Login
  // --------------------
  const login = async (email, password) => {
    const { data } = await api.post("/api/auth/login", {
      email,
      password
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    window.location.href = "/feed";
  };

  // --------------------
  // Register
  // --------------------
  const register = async (name, email, password) => {
    const { data } = await api.post("/api/auth/register", {
      name,
      email,
      password
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    window.location.href = "/feed";
  };

  // --------------------
  // Avatar update (🔥 NEW)
  // --------------------
  const updateAvatar = (avatar) => {
    const updatedUser = { ...user, avatar };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  // --------------------
  // Logout
  // --------------------
  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateAvatar // ✅ exposed
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
