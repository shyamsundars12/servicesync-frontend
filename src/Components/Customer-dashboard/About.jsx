import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import img1 from './img/service-2.jpg';
import img2 from './img/service-1.jpg';
import img3 from './img/service-3.jpg';
import img4 from './img/about-1.jpg'
import img5 from './img/about-2.jpg'
import NavBar from '../NavBar';
import { FaShoppingCart } from 'react-icons/fa';
import axios from 'axios';
import md5 from 'md5';

const About = () => {
    const [cartActive, setCartActive] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role != null) {
            if (role === md5("Employee")) {
                window.location.href = '/Employee';
            } else if (role === md5("Admin")) {
                window.location.href = '/admin';
            }
            setIsLoggedIn(true);
            const data = {
                _id: localStorage.getItem('id')
            };
            axios.post(`https://servicesync-backend.vercel.app/customer/getCustomerById`, data)
                .then((response) => {
                    if (response?.data[0]?.cart?.serList == '') {
                        setCartActive(false);
                    } else {
                        setCartActive(true);
                    }
                });
        }
    }, []);

    return (
        <>
            <div style={{ 
                background: "linear-gradient(135deg, #1a237e 0%, #1976d2 100%)",
                minHeight: "100vh",
                padding: "40px 0"
            }}>
                <NavBar></NavBar>

                <div className="container py-5">
                    <div className="row g-5">
                        <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
                            <div className="position-relative h-100" style={{ 
                                padding: "30px",
                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                borderRadius: "20px",
                                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)"
                            }}>
                                <h6 className="text-primary text-uppercase" style={{ 
                                    fontSize: "1.2rem",
                                    fontWeight: "600",
                                    marginBottom: "20px"
                                }}>About Us</h6>
                                <h1 className="mb-4" style={{ 
                                    color: "#1a237e",
                                    fontSize: "2.5rem",
                                    fontWeight: "700",
                                    marginBottom: "30px"
                                }}>We Are Trusted Service Company Since 2020</h1>
                                <p className="mb-4" style={{ 
                                    color: "#333",
                                    fontSize: "1.1rem",
                                    lineHeight: "1.8"
                                }}>Service you can trust, results you can rely on—Service Sync is your go-to for excellence.</p>
                                
                                <div className="d-flex align-items-center mb-3">
                                    <div className="flex-shrink-0" style={{ 
                                        width: "40px",
                                        height: "40px",
                                        backgroundColor: "#e3f2fd",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: "15px"
                                    }}>
                                        <i className="fa fa-check text-primary"></i>
                                    </div>
                                    <p className="mb-0" style={{ 
                                        color: "#333",
                                        fontSize: "1.1rem"
                                    }}>Residential & commercial services</p>
                                </div>
                                
                                <div className="d-flex align-items-center mb-3">
                                    <div className="flex-shrink-0" style={{ 
                                        width: "40px",
                                        height: "40px",
                                        backgroundColor: "#e3f2fd",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: "15px"
                                    }}>
                                        <i className="fa fa-check text-primary"></i>
                                    </div>
                                    <p className="mb-0" style={{ 
                                        color: "#333",
                                        fontSize: "1.1rem"
                                    }}>Quality services at affordable prices</p>
                                </div>
                                
                                <div className="d-flex align-items-center mb-4">
                                    <div className="flex-shrink-0" style={{ 
                                        width: "40px",
                                        height: "40px",
                                        backgroundColor: "#e3f2fd",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: "15px"
                                    }}>
                                        <i className="fa fa-check text-primary"></i>
                                    </div>
                                    <p className="mb-0" style={{ 
                                        color: "#333",
                                        fontSize: "1.1rem"
                                    }}>Immediate 24/7 emergency services</p>
                                </div>

                                <div className="bg-primary d-flex align-items-center p-4" style={{ 
                                    borderRadius: "15px",
                                    marginTop: "30px"
                                }}>
                                    <div className="d-flex flex-shrink-0 align-items-center justify-content-center bg-white" style={{ 
                                        width: "60px", 
                                        height: "60px",
                                        borderRadius: "50%"
                                    }}>
                                        <i className="fa fa-phone-alt fa-2x text-primary"></i>
                                    </div>
                                    <div className="ms-3">
                                        <p className="fs-5 fw-medium mb-2 text-white">Emergency 24/7</p>
                                        <h3 className="m-0 text-white">+012 345 6789</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 pt-4">
                            <div className="position-relative h-100 wow fadeInUp" data-wow-delay="0.5s">
                                <img className="img-fluid w-100" src={img4} alt="About Us" style={{ 
                                    objectFit: "cover", 
                                    height: "600px", 
                                    borderRadius: "20px",
                                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)"
                                }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container py-5">
                    <h2 className="text-center mb-5" style={{ 
                        color: "#ffffff",
                        fontSize: "2.5rem",
                        fontWeight: "700",
                        textShadow: "2px 2px 4px rgba(0,0,0,0.2)"
                    }}>Our Services</h2>
                    <div className="row g-4">
                        <div className="col-lg-4 col-md-6">
                            <div className="service-item" style={{ 
                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                borderRadius: "20px",
                                padding: "20px",
                                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
                                transition: "transform 0.3s ease"
                            }}>
                                <div className="overflow-hidden mb-4">
                                    <img className="img-fluid w-100" src={img1} alt="" style={{ 
                                        borderRadius: "15px",
                                        height: "250px",
                                        objectFit: "cover"
                                    }} />
                                </div>
                                <h5 className="mb-3" style={{ 
                                    color: "#1a237e",
                                    fontSize: "1.5rem",
                                    fontWeight: "600"
                                }}>Residential Plumbing</h5>
                                <p style={{ 
                                    color: "#666",
                                    lineHeight: "1.6"
                                }}>Professional plumbing services for your home, ensuring quality and reliability.</p>
                                <Link className="btn btn-primary" to="/Customer/AddServices" style={{ 
                                    borderRadius: "10px",
                                    padding: "10px 20px",
                                    fontWeight: "500"
                                }}>Learn More</Link>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="service-item" style={{ 
                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                borderRadius: "20px",
                                padding: "20px",
                                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
                                transition: "transform 0.3s ease"
                            }}>
                                <div className="overflow-hidden mb-4">
                                    <img className="img-fluid w-100" src={img2} alt="" style={{ 
                                        borderRadius: "15px",
                                        height: "250px",
                                        objectFit: "cover"
                                    }} />
                                </div>
                                <h5 className="mb-3" style={{ 
                                    color: "#1a237e",
                                    fontSize: "1.5rem",
                                    fontWeight: "600"
                                }}>Commercial Plumbing</h5>
                                <p style={{ 
                                    color: "#666",
                                    lineHeight: "1.6"
                                }}>Expert plumbing solutions for businesses and commercial properties.</p>
                                <Link className="btn btn-primary" to="/Customer/AddServices" style={{ 
                                    borderRadius: "10px",
                                    padding: "10px 20px",
                                    fontWeight: "500"
                                }}>Learn More</Link>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="service-item" style={{ 
                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                borderRadius: "20px",
                                padding: "20px",
                                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
                                transition: "transform 0.3s ease"
                            }}>
                                <div className="overflow-hidden mb-4">
                                    <img className="img-fluid w-100" src={img3} alt="" style={{ 
                                        borderRadius: "15px",
                                        height: "250px",
                                        objectFit: "cover"
                                    }} />
                                </div>
                                <h5 className="mb-3" style={{ 
                                    color: "#1a237e",
                                    fontSize: "1.5rem",
                                    fontWeight: "600"
                                }}>Emergency Servicing</h5>
                                <p style={{ 
                                    color: "#666",
                                    lineHeight: "1.6"
                                }}>24/7 emergency services to handle urgent plumbing issues.</p>
                                <Link className="btn btn-primary" to="/Customer/AddServices" style={{ 
                                    borderRadius: "10px",
                                    padding: "10px 20px",
                                    fontWeight: "500"
                                }}>Learn More</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default About;
