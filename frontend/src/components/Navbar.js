"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            ReviewHub
          </Link>
          <div className="navbar-nav">
            {user ? (
              <>
                <span>Welcome, {user.username}!</span>
                <button onClick={logout} className="btn btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
