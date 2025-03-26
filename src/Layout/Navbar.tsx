import React from "react";
import { useNavigate } from "react-router-dom"; // Para redirigir al usuario
import "./Navbar.css"; // Archivo CSS para los estilos

const Header = ({ usuario }: any) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header__logo">
        <h1>Usuarios</h1>
      </div>
      <div className="header__user">
        <span className="header__username">{usuario}</span>
        <button className="header__logout-btn" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
};

export default Header;