import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import NavBar from '../NavBar';
import axios from 'axios';
import Swal from 'sweetalert2';

const Contact = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cartActive, setCartActive] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    useEffect(() => {
        if (localStorage.getItem('role') != null) {
            setIsLoggedIn(true);
            const data = { _id: localStorage.getItem('id') };
            axios.post(`http://localhost:5000/customer/getCustomerById`, data)
                .then((response) => {
                    setCartActive(response?.data[0]?.cart?.serList !== '');
                });
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Message Sent!',
            text: 'Thank you for contacting us. We will get back to you soon.',
            icon: 'success',
            confirmButtonText: 'Okay'
        });
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
        });
    };

    return (
        <div style={{ 
            background: 'linear-gradient(135deg, #1a237e 0%, #1976d2 100%)',
            minHeight: '100vh',
            paddingTop: '20px'
        }}>
            <NavBar />
            
            <div className="container py-5">
                <div className="text-center mb-5">
                    <h6 className="text-uppercase" style={{ 
                        color: '#ffffff',
                        fontSize: '1.2em',
                        fontWeight: '500',
                        letterSpacing: '2px',
                        marginBottom: '15px',
                        animation: 'fadeInDown 1s ease-out'
                    }}>Contact Us</h6>
                    <h1 className="display-5 mb-0" style={{ 
                        color: '#ffffff',
                        fontSize: '3.5em',
                        fontWeight: '800',
                        lineHeight: '1.2',
                        marginBottom: '20px',
                        animation: 'fadeInUp 1s ease-out',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                    }}>Get In Touch</h1>
                    <div className="mx-auto" style={{ 
                        width: '100px',
                        height: '3px',
                        background: 'linear-gradient(90deg, #1976d2, #1a237e)',
                        borderRadius: '2px',
                        marginBottom: '30px',
                        animation: 'fadeIn 1s ease-out'
                    }}></div>
                </div>

                <div className="row g-4">
                    {/* Contact Information */}
                    <div className="col-lg-4" style={{ animation: 'fadeInLeft 1s ease-out' }}>
                        <div className="bg-white rounded-3 p-4 h-100" style={{ 
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                            }
                        }}>
                            <div className="d-flex align-items-center mb-4" style={{ 
                                backgroundColor: 'rgba(26, 35, 126, 0.1)',
                                padding: '20px',
                                borderRadius: '15px',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: 'rgba(26, 35, 126, 0.2)',
                                    transform: 'scale(1.05)'
                                }
                            }}>
                                <div style={{ 
                                    width: '60px',
                                    height: '60px',
                                    backgroundColor: 'rgba(26, 35, 126, 0.2)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '20px',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                }}>
                                    <FaMapMarkerAlt size={24} color="#1a237e" />
                                </div>
                                <div>
                                    <h5 className="mb-1" style={{ color: '#1a237e', fontWeight: '600' }}>Address</h5>
                                    <p className="mb-0" style={{ color: '#666' }}>Peelamedu, Coimbatore</p>
                                </div>
                            </div>

                            <div className="d-flex align-items-center mb-4" style={{ 
                                backgroundColor: 'rgba(26, 35, 126, 0.1)',
                                padding: '20px',
                                borderRadius: '15px',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: 'rgba(26, 35, 126, 0.2)',
                                    transform: 'scale(1.05)'
                                }
                            }}>
                                <div style={{ 
                                    width: '60px',
                                    height: '60px',
                                    backgroundColor: 'rgba(26, 35, 126, 0.2)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '20px',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                }}>
                                    <FaPhoneAlt size={24} color="#1a237e" />
                                </div>
                                <div>
                                    <h5 className="mb-1" style={{ color: '#1a237e', fontWeight: '600' }}>Phone</h5>
                                    <p className="mb-0" style={{ color: '#666' }}>+91 8780176056</p>
                                </div>
                            </div>

                            <div className="d-flex align-items-center" style={{ 
                                backgroundColor: 'rgba(26, 35, 126, 0.1)',
                                padding: '20px',
                                borderRadius: '15px',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: 'rgba(26, 35, 126, 0.2)',
                                    transform: 'scale(1.05)'
                                }
                            }}>
                                <div style={{ 
                                    width: '60px',
                                    height: '60px',
                                    backgroundColor: 'rgba(26, 35, 126, 0.2)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '20px',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                }}>
                                    <FaEnvelope size={24} color="#1a237e" />
                                </div>
                                <div>
                                    <h5 className="mb-1" style={{ color: '#1a237e', fontWeight: '600' }}>Email</h5>
                                    <p className="mb-0" style={{ color: '#666' }}>ServiceSync@gmail.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="col-lg-8" style={{ animation: 'fadeInRight 1s ease-out' }}>
                        <div className="bg-white rounded-3 p-4 h-100" style={{ 
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                            }
                        }}>
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                name="name"
                                                placeholder="Your Name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                style={{
                                                    border: '2px solid rgba(26, 35, 126, 0.1)',
                                                    borderRadius: '10px',
                                                    padding: '15px',
                                                    transition: 'all 0.3s ease',
                                                    '&:focus': {
                                                        borderColor: '#1a237e',
                                                        boxShadow: '0 0 0 0.2rem rgba(26, 35, 126, 0.25)'
                                                    }
                                                }}
                                            />
                                            <label htmlFor="name" style={{ color: '#666' }}>Your Name</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                name="email"
                                                placeholder="Your Email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                style={{
                                                    border: '2px solid rgba(26, 35, 126, 0.1)',
                                                    borderRadius: '10px',
                                                    padding: '15px',
                                                    transition: 'all 0.3s ease',
                                                    '&:focus': {
                                                        borderColor: '#1a237e',
                                                        boxShadow: '0 0 0 0.2rem rgba(26, 35, 126, 0.25)'
                                                    }
                                                }}
                                            />
                                            <label htmlFor="email" style={{ color: '#666' }}>Your Email</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="subject"
                                                name="subject"
                                                placeholder="Subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                style={{
                                                    border: '2px solid rgba(26, 35, 126, 0.1)',
                                                    borderRadius: '10px',
                                                    padding: '15px',
                                                    transition: 'all 0.3s ease',
                                                    '&:focus': {
                                                        borderColor: '#1a237e',
                                                        boxShadow: '0 0 0 0.2rem rgba(26, 35, 126, 0.25)'
                                                    }
                                                }}
                                            />
                                            <label htmlFor="subject" style={{ color: '#666' }}>Subject</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <textarea
                                                className="form-control"
                                                id="message"
                                                name="message"
                                                placeholder="Message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                style={{
                                                    height: '150px',
                                                    border: '2px solid rgba(26, 35, 126, 0.1)',
                                                    borderRadius: '10px',
                                                    padding: '15px',
                                                    transition: 'all 0.3s ease',
                                                    '&:focus': {
                                                        borderColor: '#1a237e',
                                                        boxShadow: '0 0 0 0.2rem rgba(26, 35, 126, 0.25)'
                                                    }
                                                }}
                                            ></textarea>
                                            <label htmlFor="message" style={{ color: '#666' }}>Message</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <button
                                            type="submit"
                                            className="btn btn-primary w-100 py-3"
                                            style={{
                                                background: 'linear-gradient(135deg, #1a237e 0%, #1976d2 100%)',
                                                border: 'none',
                                                borderRadius: '10px',
                                                fontSize: '1.1em',
                                                fontWeight: '600',
                                                transition: 'all 0.3s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '10px',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                                }
                                            }}
                                        >
                                            <FaPaperPlane size={20} />
                                            Send Message
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cart Icon */}
            {cartActive && isLoggedIn && (
                <Link to={"/Customer/Cart/"}>
                    <div style={{
                        position: 'fixed',
                        bottom: '30px',
                        right: '30px',
                        backgroundColor: '#1976d2',
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        zIndex: 1000,
                        animation: 'bounceIn 1s ease-out',
                        '&:hover': {
                            transform: 'scale(1.1) rotate(10deg)',
                            backgroundColor: '#1a237e',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
                        }
                    }} className="hover-shadow">
                        <FaShoppingCart size={30} color="#ffffff" />
                    </div>
                </Link>
            )}
        </div>
    );
};

export default Contact;
