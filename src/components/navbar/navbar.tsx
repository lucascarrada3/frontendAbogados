import React, { useState, useEffect, useRef } from 'react';
import '../../css/navbar.css';
import logo from '../../assets/logonavbar.jpg';
import usuario from '../../assets/usuario.png';
import menu from '../../assets/menu.jpg';

//iconos para los expedientes  FaGavel, FaLandmark cuando se necesiten


import { FaTachometerAlt, FaFolderOpen } from 'react-icons/fa';

interface NavbarProps {
    username: string;
}

const Navbar: React.FC<NavbarProps> = ({ username }) => {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const userDropdownRef = useRef<HTMLDivElement>(null);
    const [isSidebarInteractive, setIsSidebarInteractive] = useState(false);


    const handleUserButtonClick = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
        if (isUserDropdownOpen) {
            setIsUserDropdownOpen(false);
        }
    };

    const handleMenuButtonClick = () => {
    const opening = !isSidebarOpen;
    setIsSidebarOpen(opening);
    
    if (opening) {
        // Esperamos 300ms para que la animación termine antes de permitir clics
        setTimeout(() => setIsSidebarInteractive(true), 300);
    } else {
        setIsSidebarInteractive(false);
    }
};

    
    const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('ultimaActividad');
    localStorage.removeItem('username');
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

    // const [isExpedientesDropdownOpen, setIsExpedientesDropdownOpen] = useState(false);

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
            {/* <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
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
                </div> */}

                <div className={`sidebar ${isSidebarOpen ? 'open' : ''} ${isSidebarInteractive ? 'interactive' : ''}`}>
                <ul>
                    <li>
                    <FaTachometerAlt className="sidebar-icon" />
                    {isSidebarOpen && (
                        <span
                        className="dropdown-title"
                        onClick={() => window.location.href = '/dashboard'}
                        style={{ cursor: 'pointer' }}
                        >
                        Dashboard
                        </span>
                    )}
                    </li>

                    <li onClick={() => window.location.href = '/expedientes'}>
                    <FaFolderOpen className="sidebar-icon" />
                    {isSidebarOpen && (
                        <span className="dropdown-title" style={{ cursor: 'pointer' }}>
                        Expedientes
                        </span>
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
                    // setIsExpedientesDropdownOpen(false); 
                    }}
                />
            )}
        </>
    );
};

export default Navbar;
