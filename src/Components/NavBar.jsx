import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import '@fortawesome/fontawesome-free/css/all.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './img/ss.jpg';
import Swal from 'sweetalert2'

const NavBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState('');
    const [address, setAddress] = useState('');
    const [cartActive, setCartActive] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('');

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    useEffect(() => {
        if (localStorage.getItem('role') != null) {
            setIsLoggedIn(true);
            const data = { _id: localStorage.getItem('id') };
            axios.post(`http://localhost:5000/customer/getCustomerById`, data)
                .then((response) => {
                    setUserData(response.data[0]);
                    setCartActive(response?.data[0]?.cart?.serList !== '');
                    setAddress(response.data[0]?.address[0]);
                });
        }
        // Set initial active link based on current path
        setActiveLink(window.location.pathname);
    }, []);
    
    const logout = () => {
        Swal.fire({
            title: 'Logout Successfully',
            icon: 'success',
            confirmButtonText: 'Okay'
        }).then(() => {
            window.location.href = "/";
        });
        localStorage.clear();
    };

    const handleLinkClick = (path) => {
        setActiveLink(path);
    };

    return (
        <>
            {/* Top Bar */}
            <div className="container-fluid d-none d-lg-block" style={{ 
                background: 'linear-gradient(135deg, #1a237e 0%, #1976d2 100%)', 
                width: "100%",
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                position: 'relative',
                zIndex: 1000
            }}>
                <div className="row align-items-center top-bar" style={{ 
                    height: "70px", 
                    marginLeft: 20, 
                    marginRight: 20,
                    position: 'relative'
                }}>
                    <div className="col-lg-3 col-md-12">
                        <Link to="/" className="navbar-brand" style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            height: '100%'
                        }}>
                            <img 
                                src={logo} 
                                style={{ 
                                    width: 'auto',
                                    height: '50px',
                                    objectFit: 'contain',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05)'
                                    }
                                }} 
                                alt="Logo" 
                            />
                        </Link>
                    </div>
                    <div className="col-lg-9 col-md-12 text-end">
                        {isLoggedIn &&
                            <>
                                <div className="d-inline-flex align-items-center me-4" style={{
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    padding: '8px 15px',
                                    borderRadius: '20px',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}>
                                    <Link to="" style={{ color: '#ffffff', textDecoration: 'none' }}>
                                        <i className="fa fa-map-marker-alt me-2"></i>
                                        <span style={{ fontSize: '0.9em' }}>{address.city}</span>
                                    </Link>
                                </div>
                                <div className="d-inline-flex align-items-center me-4" style={{
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    padding: '8px 15px',
                                    borderRadius: '20px',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}>
                                    <Link to="" style={{ color: '#ffffff', textDecoration: 'none' }}>
                                        <i className="far fa-envelope-open me-2"></i>
                                        <span style={{ fontSize: '0.9em' }}>{userData?.email || "dummymail@gmail.com"}</span>
                                    </Link>
                                </div>
                            </>
                        }
                        <div className="d-inline-flex align-items-center" style={{ marginRight: "64px" }}>
                            {!isLoggedIn ?
                                <Link to="/login" className="btn btn-sm-square" style={{ 
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    color: '#ffffff',
                                    fontSize: '1.1em',
                                    fontWeight: '500',
                                    padding: '8px 20px',
                                    borderRadius: '20px',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,0.3)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                                    }
                                }}>
                                    Login
                                </Link>
                                :
                                <div className="dropdown">
                                    <button
                                        className="btn btn-primary rounded-circle dropdown-toggle"
                                        type="button"
                                        id="dropdownMenuButton"
                                        data-bs-toggle="dropdown"
                                        aria-expanded={dropdownOpen}
                                        onClick={toggleDropdown}
                                        style={{
                                            width: '45px',
                                            height: '45px',
                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                            border: 'none',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255,255,255,0.3)',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                                            }
                                        }}
                                    >
                                        <i className="fas fa-user" style={{ color: '#ffffff' }}></i>
                                    </button>
                                    <ul className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`} 
                                        aria-labelledby="dropdownMenuButton"
                                        style={{
                                            backgroundColor: 'rgba(255,255,255,0.95)',
                                            border: 'none',
                                            borderRadius: '15px',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                            padding: '10px 0',
                                            marginTop: '10px'
                                        }}>
                                        <li>
                                            <Link 
                                                to={`/Customer/Profile/${localStorage.getItem('id')}`} 
                                                className="dropdown-item"
                                                style={{
                                                    padding: '10px 20px',
                                                    color: '#1a237e',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(26, 35, 126, 0.1)',
                                                        transform: 'translateX(5px)'
                                                    }
                                                }}
                                            >
                                                <i className="fas fa-user-circle me-2"></i>Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <Link 
                                                to={`/Customer/CustEditProfile/${localStorage.getItem('id')}`} 
                                                className="dropdown-item"
                                                style={{
                                                    padding: '10px 20px',
                                                    color: '#1a237e',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(26, 35, 126, 0.1)',
                                                        transform: 'translateX(5px)'
                                                    }
                                                }}
                                            >
                                                <i className="fas fa-edit me-2"></i>Edit Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <button 
                                                className="dropdown-item" 
                                                onClick={logout}
                                                style={{
                                                    padding: '10px 20px',
                                                    color: '#dc3545',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(220, 53, 69, 0.1)',
                                                        transform: 'translateX(5px)'
                                                    }
                                                }}
                                            >
                                                <i className="fas fa-sign-out-alt me-2"></i>Logout
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light" style={{ 
                background: "rgba(255, 255, 255, 0.95)",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                padding: "15px 30px",
                position: 'sticky',
                top: 0,
                zIndex: 999
            }}>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <div className="navbar-nav me-auto" style={{ 
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        gap: '20px'
                    }}>
                        <Link
                            to="/"
                            className={`nav-item nav-link ${activeLink === '/' ? 'active' : ''}`}
                            style={{
                                color: activeLink === '/' ? '#1a237e' : '#333',
                                padding: "12px 25px",
                                fontWeight: activeLink === '/' ? "700" : "500",
                                fontSize: "1.1em",
                                transition: "all 0.3s ease",
                                position: 'relative',
                                borderRadius: '8px',
                                backgroundColor: activeLink === '/' ? 'rgba(26, 35, 126, 0.1)' : 'transparent',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: activeLink === '/' ? '80%' : '0',
                                    height: '3px',
                                    background: 'linear-gradient(90deg, #1976d2, #1a237e)',
                                    transition: 'width 0.3s ease',
                                    borderRadius: '2px'
                                },
                                '&:hover': {
                                    color: '#1a237e',
                                    backgroundColor: 'rgba(26, 35, 126, 0.05)',
                                    '&::before': {
                                        width: '80%'
                                    }
                                }
                            }}
                            onClick={() => handleLinkClick('/')}
                        >
                            Home
                        </Link>
                        <Link
                            to="/Customer/About"
                            className={`nav-item nav-link ${activeLink === '/Customer/About' ? 'active' : ''}`}
                            style={{
                                color: activeLink === '/Customer/About' ? '#1a237e' : '#333',
                                padding: "12px 25px",
                                fontWeight: activeLink === '/Customer/About' ? "700" : "500",
                                fontSize: "1.1em",
                                transition: "all 0.3s ease",
                                position: 'relative',
                                borderRadius: '8px',
                                backgroundColor: activeLink === '/Customer/About' ? 'rgba(26, 35, 126, 0.1)' : 'transparent',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: activeLink === '/Customer/About' ? '80%' : '0',
                                    height: '3px',
                                    background: 'linear-gradient(90deg, #1976d2, #1a237e)',
                                    transition: 'width 0.3s ease',
                                    borderRadius: '2px'
                                },
                                '&:hover': {
                                    color: '#1a237e',
                                    backgroundColor: 'rgba(26, 35, 126, 0.05)',
                                    '&::before': {
                                        width: '80%'
                                    }
                                }
                            }}
                            onClick={() => handleLinkClick('/Customer/About')}
                        >
                            About
                        </Link>
                        <Link
                            to="/Customer/AddServices/"
                            className={`nav-item nav-link ${activeLink === '/Customer/AddServices/' ? 'active' : ''}`}
                            style={{
                                color: activeLink === '/Customer/AddServices/' ? '#1a237e' : '#333',
                                padding: "12px 25px",
                                fontWeight: activeLink === '/Customer/AddServices/' ? "700" : "500",
                                fontSize: "1.1em",
                                transition: "all 0.3s ease",
                                position: 'relative',
                                borderRadius: '8px',
                                backgroundColor: activeLink === '/Customer/AddServices/' ? 'rgba(26, 35, 126, 0.1)' : 'transparent',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: activeLink === '/Customer/AddServices/' ? '80%' : '0',
                                    height: '3px',
                                    background: 'linear-gradient(90deg, #1976d2, #1a237e)',
                                    transition: 'width 0.3s ease',
                                    borderRadius: '2px'
                                },
                                '&:hover': {
                                    color: '#1a237e',
                                    backgroundColor: 'rgba(26, 35, 126, 0.05)',
                                    '&::before': {
                                        width: '80%'
                                    }
                                }
                            }}
                            onClick={() => handleLinkClick('/Customer/AddServices/')}
                        >
                            Services
                        </Link>
                        <Link
                            to="/Customer/CustOrder"
                            className={`nav-item nav-link ${activeLink === '/Customer/CustOrder' ? 'active' : ''}`}
                            style={{
                                color: activeLink === '/Customer/CustOrder' ? '#1a237e' : '#333',
                                padding: "12px 25px",
                                fontWeight: activeLink === '/Customer/CustOrder' ? "700" : "500",
                                fontSize: "1.1em",
                                transition: "all 0.3s ease",
                                position: 'relative',
                                borderRadius: '8px',
                                backgroundColor: activeLink === '/Customer/CustOrder' ? 'rgba(26, 35, 126, 0.1)' : 'transparent',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: activeLink === '/Customer/CustOrder' ? '80%' : '0',
                                    height: '3px',
                                    background: 'linear-gradient(90deg, #1976d2, #1a237e)',
                                    transition: 'width 0.3s ease',
                                    borderRadius: '2px'
                                },
                                '&:hover': {
                                    color: '#1a237e',
                                    backgroundColor: 'rgba(26, 35, 126, 0.05)',
                                    '&::before': {
                                        width: '80%'
                                    }
                                }
                            }}
                            onClick={() => handleLinkClick('/Customer/CustOrder')}
                        >
                            Order
                        </Link>
                        <Link
                            to="/Customer/Contact"
                            className={`nav-item nav-link ${activeLink === '/Customer/Contact' ? 'active' : ''}`}
                            style={{
                                color: activeLink === '/Customer/Contact' ? '#1a237e' : '#333',
                                padding: "12px 25px",
                                fontWeight: activeLink === '/Customer/Contact' ? "700" : "500",
                                fontSize: "1.1em",
                                transition: "all 0.3s ease",
                                position: 'relative',
                                borderRadius: '8px',
                                backgroundColor: activeLink === '/Customer/Contact' ? 'rgba(26, 35, 126, 0.1)' : 'transparent',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: activeLink === '/Customer/Contact' ? '80%' : '0',
                                    height: '3px',
                                    background: 'linear-gradient(90deg, #1976d2, #1a237e)',
                                    transition: 'width 0.3s ease',
                                    borderRadius: '2px'
                                },
                                '&:hover': {
                                    color: '#1a237e',
                                    backgroundColor: 'rgba(26, 35, 126, 0.05)',
                                    '&::before': {
                                        width: '80%'
                                    }
                                }
                            }}
                            onClick={() => handleLinkClick('/Customer/Contact')}
                        >
                            Contact
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default NavBar;
