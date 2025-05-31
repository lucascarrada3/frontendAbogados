import React, { useState, useEffect, useRef } from 'react';
import '../../css/navbar.css';
import logo from '../../assets/logonavbar.jpg';
import usuario from '../../assets/usuario.png';
import menu from '../../assets/menu.jpg';

// ¡Agregamos íconos! (puede ser FontAwesome, lucide-react, o imágenes tuyas)
import { FaTachometerAlt, FaFolderOpen, FaGavel, FaLandmark } from 'react-icons/fa';

interface NavbarProps {
    username: string;
}

const Navbar: React.FC<NavbarProps> = ({ username }) => {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const userDropdownRef = useRef<HTMLDivElement>(null);

    const handleUserButtonClick = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
        if (isUserDropdownOpen) {
            setIsUserDropdownOpen(false);
        }
    };

    const handleMenuButtonClick = () => {
        setIsSidebarOpen(!isSidebarOpen);
        if (isSidebarOpen) {
            setIsExpedientesDropdownOpen(false);
        }
    };
    
    const handleLogout = () => {
        console.log("Cerrar sesión");
        window.location.href = '/';
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
                setIsUserDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const [isExpedientesDropdownOpen, setIsExpedientesDropdownOpen] = useState(false);

    return (
        <>
            <nav className="navbar">
                <div className="navbar-left">
                    <img src={logo} alt="Logo Estudio Romano" className="navbar-logo" />
                </div>
                <div className="navbar-right" ref={userDropdownRef}>
                    
                    <button className="user-button" onClick={handleUserButtonClick}>
                        <img src={usuario} alt="Usuario" className="usuario-logo" />
                    </button>
                    <div className={`user-dropdown ${isUserDropdownOpen ? 'open' : ''}`}>
                        <p><strong>Usuario: </strong> {username}</p>
                        <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
                    </div>
                    <button className="menu-button" onClick={handleMenuButtonClick}>
                        <img src={menu} alt="Menú" className="menu-logo" />
                    </button>
                </div>
            </nav>

            {/* Sidebar del Menú */}
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <ul>
                    <li>
                    <FaTachometerAlt className="sidebar-icon" />
                    {isSidebarOpen && <span className="dropdown-title" onClick={() => window.location.href = '/dashboard'} style={{ cursor: 'pointer' }}>Dashboard</span>}
                    </li>
                    <li>
                    <div 
                        className="dropdown-container"
                        onClick={() => setIsExpedientesDropdownOpen(!isExpedientesDropdownOpen)}
                    >
                        <FaFolderOpen className="sidebar-icon" />
                        {isSidebarOpen && (
                        <>
                            <span className="dropdown-title">Expedientes</span>
                            <span className={`dropdown-arrow ${isExpedientesDropdownOpen ? 'open' : ''}`}>
                            {isExpedientesDropdownOpen ? '▼' : '▶'}
                            </span>
                        </>
                        )}
                    </div>

                    {isExpedientesDropdownOpen && isSidebarOpen && (
                        <ul className="submenu">
                        <li>
                          <FaGavel className="sidebar-icon" /> 
                          <span onClick={() => window.location.href = '/expedientes'} style={{ cursor: 'pointer' }}>Federales</span>
                        </li>
                        <li>
                          <FaLandmark className="sidebar-icon" /> 
                          <span onClick={() => window.location.href = '/expedientes'} style={{ cursor: 'pointer' }}>Provinciales</span>
                        </li>
                      </ul>
                    )}
                    </li>
                </ul>
                </div>

            {/* Sombra de fondo */}
            {isSidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => {
                    setIsSidebarOpen(false);
                    setIsExpedientesDropdownOpen(false); // Cerramos también el dropdown
                    }}
                />
            )}
        </>
    );
};

export default Navbar;
