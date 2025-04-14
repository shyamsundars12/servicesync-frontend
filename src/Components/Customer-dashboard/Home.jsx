// import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import Carousels from './Carousels';
import NavBar from '../NavBar';
import { FaShoppingCart } from 'react-icons/fa';
import { Carousel } from 'react-carousel-minimal';
import { useEffect, useState } from "react";
import img1 from './img/service-2.jpg';
import img2 from './img/service-1.jpg';
import img3 from './img/service-3.jpg';
import img4 from './img/about-1.jpg'
import img5 from './img/about-2.jpg'
import img6 from './img/team-1.jpg'
import img7 from './img/team-2.jpg'
import img8 from './img/team-3.jpg'
import img9 from './img/team-4.jpg'
import Card from 'react-bootstrap/Card';
// import Span from '@babel/core'
// import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import md5 from 'md5'
// import img6 from '../img/carousel1.jpg'
// import '../Components/CssF/home.css' 
// import Carousel from "react-multi-carousel";
// import "react-multi-carousel/lib/styles.css"

import '@fortawesome/fontawesome-free/css/all.css';
import Navbar from '../NavBar';
import { Container, backdropClasses } from '@mui/material';
// import { useState } from 'react';

const Home = () => {
    const [user, setuser] = useState([{}])
    const [cartActive, setCartActive] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [pincode,setPincode] = useState(0)
    useEffect(() => {
       
        //Runs only on the first render
        const role = localStorage.getItem('role');
        if (role != null) {
            if(role === md5("Employee"))
            {
                window.location.href='/Employee';
            }else if(role === md5("Admin")){
                window.location.href='/admin';
            }
            setIsLoggedIn(true);
            const data = {
                _id: localStorage.getItem('id')
            };
            axios.post(`http://localhost:5000/customer/getCustomerById`, data)
                .then((response) => {
                    
                    console.log("response")
                  
                    setPincode(response.data[0].address[0]?.pincode || "No address found");

                    
                    

                    if (response?.data[0]?.cart?.serList == '' || response?.data[0]?.cart?.serList == null) {
                        setCartActive(false)
                      
                    } else {
                        setCartActive(true) 
                    }
                    
                });
                
               
        }
    }, []);
  
    useEffect(() => {
        const data = {
            _id:localStorage.getItem('id')
        };
        axios.post(`http://localhost:5000/customer/getCustomerById`, data)
            .then((response) => {
                console.log(cartActive)
              
                if (response?.data[0]?.cart?.serList == '') {
                    setCartActive(false)
                } else {
                    setCartActive(true)
                }
            });
        axios.post(`http://localhost:5000/service/getService`)
            .then((response) => {
                // Set the fetched customer data in the state
                // setCustomers(response.data);
                setuser(response.data);
                // console.log(response.data.address[0])
                // empdatachange(response.data);
            })
            .catch((error) => {
                // Handle any errors here
                console.log(error)
                console.error('Error fetching customer data:', error);
            });
    }, []);

    const linkStyle = {
        textDecoration: 'none',
        color: 'black', // Change the color to your preference
    };

    const iconStyle = {
        fontSize: '24px', // Adjust the size as needed
        cursor: 'pointer',
    };
    const cartIconStyle = {
        border: '1px solid #e8630a',
        borderRadius: '10px',
        padding: '8px',
        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', // Add the box shadow property
    };


    const data = [
        {
            image: "https://try.geoop.com/wp-content/uploads/2023/03/Best-apps-for-cleaners.jpg",
            caption: " Making Your Life Easier, One Service at a Time."
        },
        {
            image: "https://homemaidbetter.com/wp-content/uploads/2019/05/shutterstock_526418566.jpg",
            caption: "Your Comfort, Our Priority."
        },
        {
            image: "https://cdn.gobankingrates.com/wp-content/uploads/2018/06/20-Professional-House-Cleaning-shutterstock_395889778.jpg?webp=1&w=675&quality=75",
            caption: "Experience the Joy of Convenience"
        },
        {
            image: "https://www.setuppost.com/wp-content/uploads/2022/07/Move-Out-Cleaning-Services-Houston.jpg",
            caption: "We Take Care of Your Home, So You Can Take Care of Life."
        },
        {
            image: "https://integrityjanitorialcleaning.com/wp-content/uploads/2020/02/AdobeStock_217254228-scaled.jpeg",
            caption: "Transforming Homes, Building Trust"
        },
        {
            image: "https://homemaidbetter.com/wp-content/uploads/2018/04/cleaning-services.jpg",
            caption: "From Skilled Professionals to Happy Homes."
        },
        {
            image: "https://fastmaidservice.com/wp-content/uploads/2021/05/What-to-Expect-from-a-Maid-Service.jpg",
            caption: "Effortless Living, Exceptional Services"
        },
        {
            image: "https://alpinemaintenance.com/wp-content/uploads/2017/02/commercial-cleaning-services.jpg",
            caption: "A Better Way to Home Services."
        },
        {
            image: "https://mrtrimfit.com/wp-content/uploads/2022/04/janitorial-services.jpg",
            caption: "Your Happiness is Our Business."
        }
    ];

    const captionStyle = {
        fontSize: '2em',
        fontWeight: 'bold',
    }
    const slideNumberStyle = {
        fontSize: '20px',
        fontWeight: 'bold',
    }


    return (
        <>
            <div style={{ 
                background: 'linear-gradient(135deg, #1a237e 0%, #1976d2 100%)', 
                minHeight: '100vh',
                paddingTop: '20px'
            }}>
            <NavBar></NavBar>

            {/* Carousel */}
                <div className='container-fluid' style={{ padding: '20px' }}>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ padding: "0 20px" }}>
                    <Carousel
                        data={data}
                        time={1500}
                        width="1300px"
                        height="500px"
                                captionStyle={{
                                    ...captionStyle,
                                    color: '#ffffff',
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                    fontSize: '2.5em',
                                    fontWeight: '600',
                                    animation: 'fadeIn 1s ease-in-out'
                                }}
                        radius="10px"
                        slideNumber={true}
                                slideNumberStyle={{
                                    ...slideNumberStyle,
                                    color: '#ffffff',
                                    fontSize: '1.2em',
                                    animation: 'slideIn 0.5s ease-out'
                                }}
                        captionPosition="bottom"
                        automatic={true}
                        dots={true}
                        pauseIconColor="white"
                        pauseIconSize="40px"
                        slideBackgroundColor="transparent"
                        thumbnailWidth="100px"
                        style={{
                            textAlign: "center",
                            maxWidth: "1200px",
                            maxHeight: "1000px",
                                    margin: "20px auto",
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                    borderRadius: '15px',
                                    animation: 'fadeIn 1s ease-in-out'
                        }}
                    />
                </div> 
            </div> 

                    {/* Services Section */}
                    <div className="container py-5" style={{ 
                        marginTop: '50px',
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '100px',
                            height: '4px',
                            background: 'linear-gradient(90deg, #1976d2, #1a237e)',
                            borderRadius: '2px'
                        }
                    }}>
                        <h2 className="text-center mb-5" style={{ 
                            color: '#ffffff', 
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                            fontSize: '3.5rem',
                            fontWeight: '800',
                            letterSpacing: '1px',
                            marginBottom: '30px',
                            position: 'relative',
                            paddingBottom: '20px',
                            animation: 'slideInDown 1s ease-out',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '150px',
                                height: '3px',
                                background: 'linear-gradient(90deg, #1976d2, #1a237e)',
                                borderRadius: '2px'
                            }
                        }}>Our Services</h2>
                        <div className="row g-4 justify-content-center">
                            {user.map((item, index) => (
                                <div key={index} className="col-lg-4 col-md-6">
                                    <div style={{ 
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        borderRadius: '20px',
                                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                                        transition: 'all 0.3s ease',
                                        height: '100%',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s`,
                                        transform: 'translateY(0)',
                                        '&:hover': {
                                            transform: 'translateY(-10px)',
                                            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)'
                                        }
                                    }}>
                                        <Link to={`/Home/DetailsServices/${item._id}`} style={{ textDecoration: 'none' }}>
                                            <div style={{ 
                                                height: '250px',
                                                overflow: 'hidden',
                                                position: 'relative'
                                            }}>
                                                <img 
                                                    src={item.url} 
                                                    alt={item.name}
                                                    style={{ 
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        transition: 'transform 0.5s ease',
                                                        '&:hover': {
                                                            transform: 'scale(1.1)'
                                                        }
                                                    }}
                                                />
                                                <div style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5))',
                                                    display: 'flex',
                                                    alignItems: 'flex-end',
                                                    padding: '20px',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))'
                                                    }
                                                }}>
                                                    <h5 style={{ 
                                                        color: '#ffffff', 
                                                        margin: 0,
                                                        fontWeight: '600',
                                                        fontSize: '1.5rem',
                                                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'scale(1.05)'
                                                        }
                                                    }}>{item.name}</h5>
                            </div>
                        </div>
                                            <div style={{ padding: '25px' }}>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <p style={{ 
                                                        color: '#1a237e', 
                                                        fontWeight: '600',
                                                        fontSize: '1.2rem',
                                                        margin: '0',
                                                        transition: 'all 0.3s ease'
                                                    }}>₹{item.price}</p>
                                                    <button 
                                                        style={{ 
                                                            backgroundColor: '#1a237e',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '10px',
                                                            padding: '8px 20px',
                                                            fontWeight: '500',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.3s ease',
                                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                                            '&:hover': {
                                                                backgroundColor: '#1976d2',
                                                                transform: 'translateY(-2px)',
                                                                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)'
                                                            }
                                                        }}
                                                    >
                                                        Book Now
                                                    </button>
                            </div>
                        </div>
                                        </Link>
                            </div>
                            </div>
                            ))}
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="container-xxl py-5" style={{ 
                        marginTop: '50px',
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '100px',
                            height: '4px',
                            background: 'linear-gradient(90deg, #1976d2, #1a237e)',
                            borderRadius: '2px'
                        }
                    }}>
                        <div className="row g-5 align-items-center">
                            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
                                <h6 className="text-uppercase" style={{ 
                                    color: '#ffffff',
                                    fontSize: '1.2em',
                                    fontWeight: '500',
                                    letterSpacing: '2px',
                                    animation: 'fadeInLeft 1s ease-out'
                                }}>About Us</h6>
                                <h1 className="mb-4" style={{ 
                                    color: '#ffffff',
                                    fontSize: '3.5em',
                                    fontWeight: '800',
                                    lineHeight: '1.2',
                                    marginBottom: '20px',
                                    animation: 'fadeInLeft 1s ease-out 0.2s',
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                                }}>We Are Trusted Servicing Company Since 2020</h1>
                                <p className="mb-4" style={{ 
                                    color: '#e3f2fd',
                                    fontSize: '1.2em',
                                    lineHeight: '1.8',
                                    marginBottom: '30px',
                                    animation: 'fadeInLeft 1s ease-out 0.4s'
                                }}>Service you can trust, results you can rely on—Service Sync is your go-to for excellence.</p>
                                
                                <div className="d-flex align-items-center mb-4" style={{ animation: 'fadeInLeft 1s ease-out 0.6s' }}>
                                    <div style={{ 
                                        width: '60px',
                                        height: '60px',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: '20px',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.1)',
                                            backgroundColor: 'rgba(255,255,255,0.2)'
                                        }
                                    }}>
                                        <i className="fa fa-check-circle" style={{ 
                                            color: '#4caf50', 
                                            fontSize: '2rem',
                                            transition: 'all 0.3s ease'
                                        }}></i>
                </div>
                                    <p className="mb-0" style={{ 
                                        color: '#e3f2fd',
                                        fontSize: '1.2em',
                                        fontWeight: '500'
                                    }}>Residential & commercial services</p>
            </div>

                                <div className="d-flex align-items-center mb-4" style={{ animation: 'fadeInLeft 1s ease-out 0.8s' }}>
                                    <div style={{ 
                                        width: '60px',
                                        height: '60px',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: '20px',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.1)',
                                            backgroundColor: 'rgba(255,255,255,0.2)'
                                        }
                                    }}>
                                        <i className="fa fa-check-circle" style={{ 
                                            color: '#4caf50', 
                                            fontSize: '2rem',
                                            transition: 'all 0.3s ease'
                                        }}></i>
                                    </div>
                                    <p className="mb-0" style={{ 
                                        color: '#e3f2fd',
                                        fontSize: '1.2em',
                                        fontWeight: '500'
                                    }}>Immediate 24/7 emergency services</p>
                                </div>

                                <div className="bg-primary d-flex align-items-center p-4 mt-5" style={{ 
                                    borderRadius: '15px',
                                    background: 'linear-gradient(135deg, #1976d2 0%, #1a237e 100%)',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                    animation: 'fadeInUp 1s ease-out 1s',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                                    }
                                }}>
                                    <div className="d-flex flex-shrink-0 align-items-center justify-content-center" style={{ 
                                        width: "70px", 
                                        height: "70px",
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        borderRadius: '50%',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'rotate(360deg)'
                                        }
                                    }}>
                                        <i className="fa fa-phone-alt fa-2x text-white"></i>
                                </div>
                                <div className="ms-3">
                                        <p className="fs-5 fw-medium mb-2 text-white" style={{ fontSize: '1.2em' }}>Emergency 24/7</p>
                                        <h3 className="m-0 text-white" style={{ fontSize: '1.8em' }}>+91 9080745849</h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 pt-4" style={{ minHeight: "500px" }}>
                            <div className="position-relative h-100 wow fadeInUp" data-wow-delay="0.5s">
                                    <img className="img-fluid w-100 rounded-3" src={img4} alt="About Us 1" style={{ 
                                        objectFit: "cover", 
                                        height: "500px", 
                                        borderRadius: "20px",
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                        animation: 'fadeInRight 1s ease-out 0.5s',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                            boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                                        }
                                    }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="container-fluid" style={{ marginTop: '50px' }}>
                        <div className="row g-5 justify-content-center" style={{ 
                            backgroundColor: 'rgba(26, 35, 126, 0.9)',
                            borderRadius: '15px',
                            padding: '40px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                            margin: '0 20px',
                            animation: 'fadeInUp 1s ease-out'
                        }}>
                            <div className="col-lg-3 col-md-6" style={{ animation: 'fadeInLeft 1s ease-out 0.2s' }}>
                                <h4 className="text-white mb-4" style={{ fontWeight: '600' }}>Address</h4>
                                <p className="mb-2 text-white"><i className="fa fa-map-marker-alt me-2"></i>Peelamedu, Coimbatore</p>
                                <p className="mb-2 text-white"><i className="fa fa-phone-alt me-2"></i>+91 8780176056</p>
                                <p className="mb-3 text-white"><i className="fa fa-envelope me-2"></i>ServiceSync@gmail.com</p>
                            </div>

                            <div className="col-lg-3 col-md-6" style={{ animation: 'fadeInUp 1s ease-out 0.4s' }}>
                                <h4 className="text-white mb-4" style={{ fontWeight: '600' }}>ServiceSync</h4>
                                <p className="text-white" style={{ fontSize: '1.1em' }}>You Say We Do..!</p>
                            </div>

                            <div className="col-lg-3 col-md-6" style={{ animation: 'fadeInRight 1s ease-out 0.6s' }}>
                                <h4 className="text-white mb-4" style={{ fontWeight: '600' }}>Opening Hours</h4>
                                <h6 className="text-white">Monday - Sunday:</h6>
                                <p className="text-white">08.00 AM - 06.00 PM</p>
                            </div>
                        </div>
                        <div className="text-center mt-4" style={{ color: '#ffffff', animation: 'fadeIn 1s ease-out 0.8s' }}>
        <p>&copy; {new Date().getFullYear()} ServiceSync. All rights reserved.</p>
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
            </div>
        </>
    )
}
export default Home;
