import { Link } from 'react-router-dom';
// import Carousels from './Carousels';
import { FaShoppingCart } from 'react-icons/fa';

import NavBar from '../NavBar';
import * as React from "react";
// import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import moment from 'moment';
import axios from 'axios';
// import { Carousel } from 'react-carousel-minimal';
import { useEffect, useState } from "react";
import Swal from "sweetalert2"
import '@fortawesome/fontawesome-free/css/all.css';
const CustAddser = () => {
    const [open, setOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [selectedDate, setSelectedDate] = useState(moment());
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [next6Days, setNext6Days] = useState([]);
    const [SerId, SetSerId] = useState('');
    const [cartActive, setCartActive] = useState(false);
    const [message, HideMessage] = useState(false);
    const [searchText, setSearchText] = useState("");
  
    const handleSearch = (event) => {
      setSearchText(event.target.value);
  };
    const handleHideMessage = () => {
        HideMessage(true);
    }
    useEffect(() => {

        //Runs only on the first render
        if (localStorage.getItem('role') != null) {
            setIsLoggedIn(true);
            const data = {
                _id: localStorage.getItem('id')
            };
            axios.post(`https://servicesync-backend.onrender.com/customer/getCustomerById`, data)
                .then((response) => {

                    if (response?.data[0]?.cart?.serList == '') {
                        setCartActive(false)

                    } else {
                        setCartActive(true)
                    }

                });

        }
    }, []);

    const handleClickOpen = (item) => {

        SetSerId(item)
        setOpen(true)


    };

    const handleClose = () => {
        SetSerId('');
        setOpen(false);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setSelectedTimeSlot('');
    };

    const handleTimeSlotChange = (e) => {
        setSelectedTimeSlot(e.target.value);
    };

    const handleConfirm = () => {
        if (!selectedDate) {
            Swal.fire({
                title: 'Date Not Selected!',
                text: 'Select Date',
                icon: 'warning',
                confirmButtonText: 'Okay'
            })
        }
        if (!selectedTimeSlot) {
            Swal.fire({
                title: 'Time Not Selected!',
                text: 'Select Time',
                icon: 'warning',
                confirmButtonText: 'Okay'
            })
        }
        if (selectedDate && selectedTimeSlot) {
            const formattedDate = `${SelectedDay.year}-${SelectedDay.month}-${SelectedDay.date}`;

            const data = {
                custId: id._id,
                serId: SerId,
                time: selectedTimeSlot,
                date: selectedDate.format('YYYY-MM-DD')
            }
            try {

                axios.post(`https://servicesync-backend.onrender.com/order/checkAvailability`, data)
                    .then((response) => {
                        if (!response.data.available) {
                            Swal.fire({
                                title: 'Service Unavailable',
                                text: response.data.error || "No workers are available for the selected date and time. Please try a different slot.",
                                icon: 'warning',
                                confirmButtonText: 'Okay'
                            });
                            return;
                        }

                        // Proceed with adding service to cart
                        axios.post(`https://servicesync-backend.onrender.com/customer/addService`, data)
                            .then((response) => {
                                Swal.fire({
                                    title: 'Service Added To Cart',
                                    text: "Service has been successfully added to your cart",
                                    icon: 'success',
                                    showCancelButton: true,
                                    confirmButtonColor: '#0000FF',
                                    confirmButtonText: 'Add More Services',
                                    cancelButtonText: 'Go To Cart',
                                    cancelButtonColor: '#0000FF'
                                }).then((result) => {
                                    if (!result.isConfirmed) {
                                        window.location.href = '/Customer/Cart';
                                    }
                                });
                            })
                            .catch((error) => {
                                console.error('Error adding service:', error);
                                Swal.fire({
                                    title: 'Error',
                                    text: 'Failed to add service to cart. Please try again.',
                                    icon: 'error',
                                    confirmButtonText: 'Okay'
                                });
                            });
                    })
                    .catch((error) => {
                        console.error('Error checking availability:', error);
                        Swal.fire({
                            title: 'Error',
                            text: 'Failed to check service availability. Please try again.',
                            icon: 'error',
                            confirmButtonText: 'Okay'
                        });
                    });


            }
            catch (error) {

                console.error('Error fetching customer data:', error);
            }




            console.log('Selected Date:', selectedDate.format('YYYY-MM-DD'));
            console.log('Selected Time Slot:', selectedTimeSlot);
        }




        handleClose();
    };

    // Generate buttons for the next 6 days including today
    const generateNext6Days = () => {
        const days = [];
        for (let i = 0; i < 6; i++) {
            const day = moment().add(i, 'days');
            days.push(day);
        }
        setNext6Days(days);
    };

    // Initialize the date buttons
    useState(() => {
        const data = {
            _id: localStorage.getItem('id')
        };
        axios.post(`https://servicesync-backend.onrender.com/customer/getCustomerById`, data)
            .then((response) => {
                // console.log(response.data[0].cart.serList )
                if (response?.data[0]?.cart?.serList == '') {
                    setCartActive(false)
                } else {
                    setCartActive(true)
                }
            });
        generateNext6Days();
    }, []);

    const generateTimeSlots = () => {
        const timeSlots = [];
        const today = moment();
        if (selectedDate.isSame(today, 'day')) {
            const nextHour = moment().startOf('hour').add(1, 'hour');
            while (nextHour.isBefore(moment().endOf('day')) && nextHour.hour() <= 18) {
                timeSlots.push(nextHour.format('HH:mm:ss'));
                nextHour.add(1, 'hour');
            }
        } else {
            // Display time slots from 8:00 AM to 6:00 PM for other days
            let hour = 8;
            while (hour <= 18) {
                timeSlots.push(moment().hour(hour).format('HH:00:00'));
                hour++;
            }
        }
        return timeSlots;
    };

    const timeSlots = generateTimeSlots();

    const id = {
        _id: localStorage.getItem('id')
    }
    const [user, setuser] = useState([])
    const [thought, setthougth] = useState({})
    const [openDialog, handleDisplay] = React.useState(false);
    const [SelectedDay, Setday] = React.useState({});
    const [next5DaysWithDayAndDate, setNext5DaysWithDayAndDate] = useState([]);

    useEffect(() => {
        function getNext5DaysWithDayAndDate() {
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const today = new Date();
            const next5DaysWithDayAndDate = [];

            for (let i = 1; i <= 6; i++) {
                const nextDay = new Date(today);
                nextDay.setDate(today.getDate() + i);
                const dayName = daysOfWeek[nextDay.getDay()];
                const month = nextDay.getMonth() + 1;;
                const year = nextDay.getFullYear();
                const date = nextDay.getDate();
                next5DaysWithDayAndDate.push({ dayName, date, month, year });
            }

            return next5DaysWithDayAndDate;
        }
        const next5Days = getNext5DaysWithDayAndDate();
        setNext5DaysWithDayAndDate(next5Days);
    }, []);

    const [selectedTime, setSelectedTime] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [service_id, setSevice_id] = useState('');





    const handleTimeChange = (e) => {
        setSelectedTime(e.target.value);


    };




    const openDialogBox1 = (item) => {

        setSevice_id(item._id);
        handleDisplay(true);
    };


    const HandleConfirm = () => {

        if (!SelectedDay) {
            Swal.fire({
                title: 'Date Not Selected!',
                text: 'Select Date',
                icon: 'warning',
                confirmButtonText: 'Okay'
            })
        }
        if (!selectedTime) {
            Swal.fire({
                title: 'Time Not Selected!',
                text: 'Select Time',
                icon: 'warning',
                confirmButtonText: 'Okay'
            })
        }
        if (SelectedDay && selectedTime) {
            const formattedDate = `${SelectedDay.year}-${SelectedDay.month}-${SelectedDay.date}`;

            const data = {
                custId: id._id,
                serId: service_id,
                time: selectedTime,
                date: formattedDate
            }
            try {

                axios.post(`https://servicesync-backend.onrender.com/customer/AddService`, data)
                    .then((response) => {

                        console.log(response.data)
                        
                        Swal.fire({
                            title: 'Service Added To Cart',
                            text: "Added",
                            icon: 'success',
                            showCancelButton: true,
                            confirmButtonColor: '#0000FF',
                            confirmButtonText: 'Add More Services',
                            cancelButtonText: 'Go To Cart',
                            cancelButtonColor: '#0000FF'
                        }).then((result) => {
                            if (!result.isConfirmed) {
                                window.location.href = '/Customer/Cart'
                            }
                        })

                    })
            }
            catch (error) {

                console.error('Error fetching customer data:', error);
            }



            console.log(formattedDate);
            // console.log(SelectedDay);
            console.log(selectedTime);
            console.log(service_id);
        }

    }
    useEffect(() => {

        const updateTime = () => {
            setCurrentTime(new Date());
        };

        const intervalId = setInterval(updateTime, 1000);


        return () => clearInterval(intervalId);
    }, []);
    const filteredTimeSlots = timeSlots.filter((slot) => {
        const [hour, minute] = slot.split(':');
        const slotTime = new Date();
        slotTime.setHours(parseInt(hour));
        slotTime.setMinutes(parseInt(minute));

        return slotTime > currentTime;
    });
    const buttonStyle = {
        width: "15rem",
        fontsize: "1.5rem",
        height: "2rem",
        padding: "5px",
        borderRadius: "10px",
        backgroundColor: "green",
        color: "White",
        border: "2px solid yellow",
    };
    const divStyle = {
        display: "flex",
        felxDirection: "row",
        position: "absolute",
        right: "0px",
        bottom: "0px",

        //    padding: "0rem",
    };
    const confirmButtonStyle = {
        margin: "10px",
        width: "5rem",
        height: "2.5rem",
        fontsize: "1rem",
        backgroundColor: "grey",
        color: "black",
        margin: "5px",
        borderRadius: "10px",
        border: "1px solid black",
    };
    const item = {
        id: "6503f21d269c4df8700b622e"
    }
    useEffect(() => {

        axios.post(`https://servicesync-backend.onrender.com/service/getService`)
            .then((response) => {
                // Set the fetched customer data in the state
                // setCustomers(response.data);
                console.log(response.data)
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


    useEffect(() => {

        axios("https://api.quotable.io/random")
            .then((response) => {
                // Set the fetched customer data in the state
                // setCustomers(response.data);
                console.log(response)
                setthougth(response.data)

                // console.log(response.data.address[0])
                // empdatachange(response.data);
            })
            .catch((error) => {
                // Handle any errors here
                console.log(error)
                console.error('Error fetching customer data:', error);
            });
    }, []);
    const handleday = (day) => {

        Setday(day);
        // localStorage.setItem("day",SelectedDay)
        // localStorage.setItem("day",SelectedDay)

    }
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
    const filteredEmpData = user.filter((item) => {
        return (
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.price.toString().includes(searchText)
        );
    });

    return (
        <>
            <div style={{ background: "#74BDEE" }}>
                <NavBar></NavBar>
                <div className="divbtn">
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                   
                                        <div style={{ width: "600px", display: "flex", alignItems: "flex-end", backgroundColor: "#feffdf", border: "1px solid #fff", borderRadius: "5px", padding: "5px", boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)" ,marginTop:"10px",marginBottom:"10px" ,marginLeft:"400px"}}>
                                            <input
                                                type="text"
                                                placeholder="Search..."
                                                value={searchText}
                                                onChange={handleSearch}
                                                style={{ border: "none", outline: "none", width: "100%", padding: "5px",backgroundColor:"#feffdf",marginTop:"2px",marginBottom:"10px" }}
                                            />
                                            <i className="fa fa-search" style={{ marginLeft: "10px", color: "#888", cursor: "pointer", fontSize: "18px" }}></i>
                                        </div>
                                    </div>
                                </div> 

                {!isLoggedIn && !message && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '40px', // Adjust the height as needed
                            backgroundColor: '#f8f8ff', // Set your desired background color
                            color: 'red', // Set your desired text color
                            fontSize: '18px', // Set your desired font size
                        }}
                    >
                        If you want to add a service to your cart, please log in.
                        <button
                            onClick={handleHideMessage}
                            style={{

                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'inherit',
                                fontSize: '20px',
                                position: 'absolute',
                                right: "10px"
                            }}
                        >
                            &#x2716; {/* Unicode for the "X" character */}
                        </button>
                    </div>
                )}
                <div className="container mt-4" style={{
                paddingLeft:'150PX'}}>
  <div className="row">
    {user &&
      filteredEmpData
        .filter((item) => item.isActive)
        .map((item) => (
          <div className="col-md-4 col-sm-6 mb-4" key={item._id}>
            <div
              className="card"
              style={{
                border: '1px solid white',
                borderRadius: '10px',
                backgroundColor: '#f8f8ff',
              }}
            >
              <img
                src={item.url}
                alt="Product"
                className="card-img-top"
                style={{
                  height: '180px',
                  objectFit: 'cover',
                  borderRadius: '10px 10px 0 0',
                }}
              />
              <div className="card-body">
                <h5 className="card-title">
                  {item.name === 'Appliances Repairing' ? 'Repairing' : item.name}
                </h5>
                <p className="card-text">Product Price: ₹{item.price}</p>
                <div className="d-flex justify-content-between">
                  <Link to={`/Home/DetailsServices/${item._id}`}>
                    <button
                      className="btn btn-primary"
                      style={{
                        width: '120px',
                      }}
                    >
                      Read More
                    </button>
                  </Link>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleClickOpen(item._id)}
                    style={{
                      width: '150px',
                    }}
                    disabled={!isLoggedIn}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
  </div>
</div>




                
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Select Date and Time Slot</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <div>
                                <div>
                                    <h5>Select Date:</h5>

                                    <div className="row">

                                        {next6Days.map((day, index) => (
                                            <div className="col-md-2" key={index}>
                                                <button

                                                    key={day}
                                                    className={`btn btn-sm ${day.isSame(selectedDate, 'day') ? 'btn-primary' : 'btn-success'
                                                        }`}
                                                    onClick={() => handleDateChange(day)}
                                                    style={{ width: "65px", height: "50px", borderRadius: "14px" }}
                                                >
                                                    {day.format('MMM DD')}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>

                                    <h5 style={{ marginTop: "10px" }}>Select Time Slot:</h5>
                                    <select
                                        id="timeSlotSelect"
                                        className="form-select"
                                        value={selectedTimeSlot}
                                        onChange={handleTimeSlotChange}
                                    >
                                        <option value="">Select a time slot</option>
                                        {timeSlots.map((slot) => (
                                            <option key={slot} value={slot}>
                                                {slot}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleConfirm} variant="contained" color="warning">
                            Confirm
                        </Button>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>

                {cartActive && isLoggedIn
                    ? <Link to={"/Customer/Cart/"}>
                        <FaShoppingCart size={50} color="#89cff0" item='10' style={{
                            position: 'fixed', bottom: '20px', right: '20px', cursor: 'pointer', border: '1px solid #f8f4ff',
                            borderRadius: '10px',
                            padding: '8px',
                            backgroundColor: '#faebd7',
                            boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', marginRight: "50px"
                        }} cartActive={false} />
                    </Link>
                    : <></>
                }
            </div>
        </>
    );
}
export default CustAddser;