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
            axios.post(`https://servicesync-backend.onrender.com/customer/getCustomerById`, data)
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
        axios.post(`https://servicesync-backend.onrender.com/customer/getCustomerById`, data)
            .then((response) => {
                console.log(cartActive)
              
                if (response?.data[0]?.cart?.serList == '') {
                    setCartActive(false)
                } else {
                    setCartActive(true)
                }
            });
        axios.post(`https://servicesync-backend.onrender.com/service/getService`)
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
        fontSize: 'clamp(1.2em, 4vw, 2em)',
        fontWeight: 'bold',
    }
    const slideNumberStyle = {
        fontSize: 'clamp(0.8em, 2vw, 1.2em)',
        fontWeight: 'bold',
    }

    // Main styles with responsive design
    const styles = {
        mainContainer: {
            background: 'linear-gradient(135deg, #1a237e 0%, #1976d2 100%)',
            minHeight: '100vh',
            paddingTop: '20px',
            overflowX: 'hidden',
        },
        carouselContainer: {
            padding: '20px',
            maxWidth: '100%',
        },
        carouselWrapper: {
            padding: '0 clamp(5px, 3vw, 20px)',
            maxWidth: '100%',
            margin: '0 auto',
        },
        carouselCustomStyle: {
            textAlign: "center",
            maxWidth: "100%",
            maxHeight: "1000px",
            margin: "20px auto",
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            borderRadius: '15px',
        },
        sectionContainer: {
            marginTop: '50px',
            position: 'relative',
        },
        sectionHeading: {
            color: '#ffffff', 
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '800',
            letterSpacing: '1px',
            marginBottom: '30px',
            textAlign: 'center',
        },
        serviceCardContainer: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            justifyContent: 'center',
            padding: '0 clamp(10px, 3vw, 20px)',
        },
        serviceCard: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
        },
        serviceCardImage: {
            height: '250px',
            overflow: 'hidden',
            position: 'relative',
        },
        serviceCardImg: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
        },
        serviceCardOverlay: {
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
        },
        serviceCardTitle: {
            color: '#ffffff', 
            margin: 0,
            fontWeight: '600',
            fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
        },
        serviceCardContent: {
            padding: '25px',
        },
        serviceCardPrice: {
            color: '#1a237e', 
            fontWeight: '600',
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            margin: '0',
            transition: 'all 0.3s ease',
        },
        serviceCardButton: {
            backgroundColor: '#1a237e',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 20px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        },
        aboutContainer: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            alignItems: 'center',
            padding: '0 clamp(10px, 3vw, 20px)',
        },
        aboutTitle: {
            color: '#ffffff',
            fontSize: 'clamp(1rem, 2vw, 1.2em)',
            fontWeight: '500',
            letterSpacing: '2px',
        },
        aboutHeading: {
            color: '#ffffff',
            fontSize: 'clamp(2rem, 5vw, 3.5em)',
            fontWeight: '800',
            lineHeight: '1.2',
            marginBottom: '20px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        },
        aboutText: {
            color: '#e3f2fd',
            fontSize: 'clamp(1rem, 2vw, 1.2em)',
            lineHeight: '1.8',
            marginBottom: '30px',
        },
        featureBox: {
            width: 'clamp(50px, 8vw, 60px)',
            height: 'clamp(50px, 8vw, 60px)',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '20px',
            transition: 'all 0.3s ease',
        },
        featureIcon: {
            color: '#4caf50', 
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            transition: 'all 0.3s ease',
        },
        featureText: {
            color: '#e3f2fd',
            fontSize: 'clamp(1rem, 2vw, 1.2em)',
            fontWeight: '500',
        },
        emergencyBox: {
            borderRadius: '15px',
            background: 'linear-gradient(135deg, #1976d2 0%, #1a237e 100%)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            padding: 'clamp(15px, 4vw, 25px)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            marginTop: '30px',
        },
        emergencyIcon: {
            width: 'clamp(50px, 8vw, 70px)', 
            height: 'clamp(50px, 8vw, 70px)',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
        },
        emergencyText: {
            fontSize: 'clamp(1rem, 2vw, 1.2em)',
            marginBottom: '2px',
        },
        emergencyPhone: {
            fontSize: 'clamp(1.2rem, 3vw, 1.8em)',
        },
        aboutImage: {
            minHeight: 'clamp(300px, 50vw, 500px)',
        },
        aboutImg: {
            objectFit: "cover", 
            height: "100%", 
            width: "100%",
            borderRadius: "20px",
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        },
        footerContainer: {
            marginTop: '50px',
            backgroundColor: 'rgba(26, 35, 126, 0.9)',
            borderRadius: '15px',
            padding: 'clamp(20px, 5vw, 40px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            margin: '0 clamp(10px, 3vw, 20px)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px',
        },
        footerHeading: {
            color: 'white',
            marginBottom: '20px',
            fontWeight: '600',
            fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
        },
        footerText: {
            color: 'white',
        },
        footerIcon: {
            marginRight: '10px',
        },
        footerCopyright: {
            textAlign: 'center',
            marginTop: '30px',
            color: 'white',
            padding: '10px',
        },
        floatingCart: {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            backgroundColor: '#1976d2',
            borderRadius: '50%',
            width: 'clamp(50px, 10vw, 60px)',
            height: 'clamp(50px, 10vw, 60px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            zIndex: 1000,
        },
    };

    // Hover effects applied using event handlers
    const handleServiceCardHover = (e, enter) => {
        if (enter) {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
        } else {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.1)';
        }
    };

    const handleButtonHover = (e, enter) => {
        if (enter) {
            e.currentTarget.style.backgroundColor = '#1976d2';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
        } else {
            e.currentTarget.style.backgroundColor = '#1a237e';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        }
    };

    const handleFeatureHover = (e, enter) => {
        if (enter) {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
        } else {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
        }
    };

    const handleEmergencyHover = (e, enter) => {
        if (enter) {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
        } else {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        }
    };

    const handleIconRotation = (e, enter) => {
        if (enter) {
            e.currentTarget.style.transform = 'rotate(360deg)';
        } else {
            e.currentTarget.style.transform = 'rotate(0)';
        }
    };

    const handleImageHover = (e, enter) => {
        if (enter) {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
        } else {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
        }
    };

    const handleCartHover = (e, enter) => {
        if (enter) {
            e.currentTarget.style.transform = 'scale(1.1) rotate(10deg)';
            e.currentTarget.style.backgroundColor = '#1a237e';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        } else {
            e.currentTarget.style.transform = 'scale(1) rotate(0)';
            e.currentTarget.style.backgroundColor = '#1976d2';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        }
    };

    return (
        <>
            <div style={styles.mainContainer}>
                <NavBar></NavBar>

                {/* Carousel */}
                <div className='container-fluid' style={styles.carouselContainer}>
                    <div style={{ textAlign: "center" }}>
                        <div style={styles.carouselWrapper}>
                            <Carousel
                                data={data}
                                time={1500}
                                width="100%"
                                height="500px"
                                captionStyle={captionStyle}
                                radius="10px"
                                slideNumber={true}
                                slideNumberStyle={slideNumberStyle}
                                captionPosition="bottom"
                                automatic={true}
                                dots={true}
                                pauseIconColor="white"
                                pauseIconSize="40px"
                                slideBackgroundColor="transparent"
                                thumbnailWidth="100px"
                                style={styles.carouselCustomStyle}
                            />
                        </div> 
                    </div> 

                    {/* Services Section */}
                    <div className="container py-5" style={styles.sectionContainer}>
                        <h2 style={styles.sectionHeading}>Our Services</h2>
                        <div style={styles.serviceCardContainer}>
                            {user.map((item, index) => (
                                <div key={index} 
                                    style={styles.serviceCard}
                                    onMouseEnter={(e) => handleServiceCardHover(e, true)}
                                    onMouseLeave={(e) => handleServiceCardHover(e, false)}
                                >
                                    <Link to={`/Home/DetailsServices/${item._id}`} style={{ textDecoration: 'none' }}>
                                        <div style={styles.serviceCardImage}>
                                            <img 
                                                src={item.url} 
                                                alt={item.name}
                                                style={styles.serviceCardImg}
                                            />
                                            <div style={styles.serviceCardOverlay}>
                                                <h5 style={styles.serviceCardTitle}>{item.name}</h5>
                                            </div>
                                        </div>
                                        <div style={styles.serviceCardContent}>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p style={styles.serviceCardPrice}>₹{item.price}</p>
                                                <button 
                                                    style={styles.serviceCardButton}
                                                    onMouseEnter={(e) => handleButtonHover(e, true)}
                                                    onMouseLeave={(e) => handleButtonHover(e, false)}
                                                >
                                                    Book Now
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="container-xxl py-5" style={styles.sectionContainer}>
                        <div style={styles.aboutContainer}>
                            <div>
                                <h6 style={styles.aboutTitle}>About Us</h6>
                                <h1 style={styles.aboutHeading}>We Are Trusted Servicing Company Since 2020</h1>
                                <p style={styles.aboutText}>Service you can trust, results you can rely on—Service Sync is your go-to for excellence.</p>
                                
                                <div className="d-flex align-items-center mb-4">
                                    <div 
                                        style={styles.featureBox}
                                        onMouseEnter={(e) => handleFeatureHover(e, true)}
                                        onMouseLeave={(e) => handleFeatureHover(e, false)}
                                    >
                                        <i className="fa fa-check-circle" style={styles.featureIcon}></i>
                                    </div>
                                    <p style={styles.featureText}>Residential & commercial services</p>
                                </div>

                                <div className="d-flex align-items-center mb-4">
                                    <div 
                                        style={styles.featureBox}
                                        onMouseEnter={(e) => handleFeatureHover(e, true)}
                                        onMouseLeave={(e) => handleFeatureHover(e, false)}
                                    >
                                        <i className="fa fa-check-circle" style={styles.featureIcon}></i>
                                    </div>
                                    <p style={styles.featureText}>Immediate 24/7 emergency services</p>
                                </div>

                                <div 
                                    style={styles.emergencyBox}
                                    onMouseEnter={(e) => handleEmergencyHover(e, true)}
                                    onMouseLeave={(e) => handleEmergencyHover(e, false)}
                                >
                                    <div 
                                        style={styles.emergencyIcon}
                                        onMouseEnter={(e) => handleIconRotation(e, true)}
                                        onMouseLeave={(e) => handleIconRotation(e, false)}
                                    >
                                        <i className="fa fa-phone-alt fa-2x text-white"></i>
                                    </div>
                                    <div className="ms-3">
                                        <p className="fs-5 fw-medium mb-2 text-white" style={styles.emergencyText}>Emergency 24/7</p>
                                        <h3 className="m-0 text-white" style={styles.emergencyPhone}>+91 9080745849</h3>
                                    </div>
                                </div>
                            </div>
                            <div style={styles.aboutImage}>
                                <div className="position-relative h-100">
                                    <img 
                                        className="img-fluid w-100" 
                                        src={img4} 
                                        alt="About Us 1" 
                                        style={styles.aboutImg}
                                        onMouseEnter={(e) => handleImageHover(e, true)}
                                        onMouseLeave={(e) => handleImageHover(e, false)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="container-fluid">
                        <div style={styles.footerContainer}>
                            <div>
                                <h4 style={styles.footerHeading}>Address</h4>
                                <p style={styles.footerText}>
                                    <i className="fa fa-map-marker-alt me-2" style={styles.footerIcon}></i>Peelamedu, Coimbatore
                                </p>
                                <p style={styles.footerText}>
                                    <i className="fa fa-phone-alt me-2" style={styles.footerIcon}></i>+91 8780176056
                                </p>
                                <p style={styles.footerText}>
                                    <i className="fa fa-envelope me-2" style={styles.footerIcon}></i>ServiceSync@gmail.com
                                </p>
                            </div>

                            <div>
                                <h4 style={styles.footerHeading}>ServiceSync</h4>
                                <p style={styles.footerText}>You Say We Do..!</p>
                            </div>

                            <div>
                                <h4 style={styles.footerHeading}>Opening Hours</h4>
                                <h6 style={styles.footerText}>Monday - Sunday:</h6>
                                <p style={styles.footerText}>08.00 AM - 06.00 PM</p>
                            </div>
                        </div>
                        <div style={styles.footerCopyright}>
                            <p>&copy; {new Date().getFullYear()} ServiceSync. All rights reserved.</p>
                        </div>
                    </div>

                    {/* Cart Icon */}
                    {cartActive && isLoggedIn && (
                        <Link to={"/Customer/Cart/"}>
                            <div 
                                style={styles.floatingCart}
                                onMouseEnter={(e) => handleCartHover(e, true)}
                                onMouseLeave={(e) => handleCartHover(e, false)}
                            >
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