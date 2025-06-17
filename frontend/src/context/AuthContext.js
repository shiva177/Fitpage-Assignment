"use client"

import { createContext, useContext, useState, useEffect } from "react"
import api from "../config/api"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const register = async (username, email, password) => {
    try {
      const response = await api.post("/auth/register", {
        username,
        email,
        password,
      })

      const { token, user } = response.data
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      setUser(user)

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Registration failed",
      }
    }
  }

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      })

      const { token, user } = response.data
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      setUser(user)

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
