import axios from 'axios';
import { BsTrash } from 'react-icons/bs';
import { useEffect, useState } from "react";
import { useReducer } from 'react';
import NavBar from '../NavBar';
// import React, { useState } from 'react';
// import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Swal from 'sweetalert2'
import { loadStripe } from '@stripe/stripe-js'
let count = 0;
const Cart = () => {
    const [orderDialogOpen, setOrderDialogOpen] = useState(false);
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [orderId, setOrderId] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const [ash, setash] = useState(1);
    const [open, setOpen] = useState(false);
    const [Item, setItem] = useState([]);
    const [user, setUser] = useState({});
    const [isCartEmpty, setIsCartEmpty] = useState(true);
    const [isCash, setIsCash] = useState(false);

    // const [custId,setCustId] = useState(localStorage.getItem("id"))
    // console.log(count)
    const handleClickOpen = (item) => {
        setItem(item)
        setOpen(true);
    };

    const handleClose = () => {
        setItem([])
        setOpen(false);
    };
    const customerId = localStorage.getItem("id");
    const id = {
        _id: localStorage.getItem("id")
    }

    var cartData
    useEffect(() => {
        // Replace with the actual customer ID
        // forceUpdate();

        axios.post("http://localhost:5000/Customer/Cart", { custId: customerId })
            .then((response) => {
                console.log(response.data)
                if (response.data.message === false) {
                    setIsCartEmpty(true)
                } else {
                    setIsCartEmpty(false)
                }
                cartData = response.data.cart.serList;
                console.log(cartData)
                fetchServiceDetails(cartData);
            })
            .catch((error) => {
                console.error('Error fetching cart data:', error);
            });

    }, [ash]);
    const fetchServiceDetails = (cartData) => {
        const promises = cartData.map(async (item) => {
            const serviceDetails = item?.serviceDetails || {}; // Ensure serviceDetails exists
    
            return axios.post("http://localhost:5000/service/getServiceById/", item)
                .then((response) => {
                    if (response.data) {
                        return {
                            ...item,
                            serviceDetails: response.data, // Ensure serviceDetails exists
                        };
                    }
                    return { ...item, serviceDetails: null }; // Fallback if data is invalid
                })
                .catch((error) => {
                    console.error('Error fetching service details:', error);
                    return { ...item, serviceDetails: null }; // Handle fetch error
                });
        });
    
        Promise.all(promises)
            .then((updatedCartData) => {
                console.log("Updated cart data", updatedCartData);
    
                // Filter out items with null or undefined serviceDetails or URL
                const validCartItems = updatedCartData.filter(
                    (item) => item.serviceDetails && item.serviceDetails.url
                );
    
                setCartItems(validCartItems);
            })
            .catch((error) => {
                console.error('Error updating cart data:', error);
            });
    };
    
    


    const calculateTotalPrice = () => {
        let totalPrice = 0;
        for (const item of cartItems) {
            totalPrice += parseInt(item.serviceDetails.price, 10);
        }
        return totalPrice;
    };
    const [address, setAddress] = useState({
        house_no: "",
        society_name: "",
        landmark: "",
        city: "",
        pincode: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log("here " + name, value)
        setAddress({ ...address, [name]: value });
    };


    const paymantDialog = (e) => {
        const { name, value } = e.target;
        console.log("here " + name, value)
        setAddress({ ...address, [name]: value });
    };

    const handlePaymantDialog = (e) => {
        setPaymentOpen(true)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // You can perform any action with the address data here
        console.log("Address submitted:", address);
    };
    const handlePlaceOrder = async () => {
        try {
            // Validate address fields
            if (!address.house_no || !address.society_name || !address.landmark || !address.city || !address.pincode) {
                Swal.fire({
                    title: "Incomplete Address",
                    text: "Please fill in all address fields before proceeding",
                    icon: "warning"
                });
                return;
            }

            // Get coordinates from pincode
            let lat = 0;
            let lng = 0;
            try {
                const geoResponse = await axios.get(
                    `https://api.geoapify.com/v1/geocode/search?postcode=${address.pincode}&type=postcode&format=json&apiKey=e61b88dd95644ef79521f24baa6fb8f4`
                );
                
                if (geoResponse.data.results && geoResponse.data.results.length > 0) {
                    lat = geoResponse.data.results[0].lat;
                    lng = geoResponse.data.results[0].lon;
                }
            } catch (error) {
                console.error("Geocoding error:", error);
                Swal.fire({
                    title: "Location Error",
                    text: "Could not validate address. Please check your pincode.",
                    icon: "error"
                });
                return;
            }

            // Check service availability for each item
            const availabilityChecks = await Promise.all(cartItems.map(async (item) => {
                try {
                    const check = await axios.post("http://localhost:5000/order/checkAvailability", {
                        serId: item.serId,
                        date: item.date,
                        time: item.time
                    });
                    return { 
                        serviceId: item.serId, 
                        available: check.data.message,
                        error: check.data.error,
                        empId: check.data.empId
                    };
                } catch (error) {
                    console.error(`Error checking availability for service ${item.serId}:`, error);
                    return { 
                        serviceId: item.serId, 
                        available: false,
                        error: "Failed to check service availability"
                    };
                }
            }));

            const unavailableServices = availabilityChecks.filter(check => !check.available);
            if (unavailableServices.length > 0) {
                const unavailableServiceNames = unavailableServices.map(check => {
                    const item = cartItems.find(i => i.serId === check.serviceId);
                    return item?.serviceDetails?.name || `Service ${check.serviceId}`;
                }).join(", ");

                Swal.fire({
                    title: "Service Unavailable",
                    text: `The following services are not available at the selected time: ${unavailableServiceNames}. Please try ordering one by one.`,
                    icon: "warning",
                    confirmButtonText: "Okay"
                });
                return;
            }

            // Calculate total amount
            const totalAmount = cartItems.reduce((sum, item) => sum + (item.serviceDetails?.price || 0), 0);

            // Prepare order data with employee assignments
            const orderData = {
                custId: customerId,
                services: cartItems.map((item, index) => ({
                    serId: item.serId,
                    date: item.date,
                    time: item.time,
                    serviceDetails: {
                        price: item.serviceDetails.price
                    },
                    empId: availabilityChecks[index].empId
                })),
                address: {
                    house_no: address.house_no,
                    society_name: address.society_name,
                    landmark: address.landmark,
                    city: address.city,
                    pincode: address.pincode
                },
                lat: lat,
                lng: lng,
                payment_method: 'Razorpay',
                totalAmount: totalAmount
            };

            try {
                // Create order on our backend first
                const response = await axios.post("http://localhost:5000/order/createCheckout", orderData);
                
                if (!response.data || !response.data.orderId) {
                    throw new Error("Invalid response from server");
                }

                // Load Razorpay script
                const isLoaded = await loadRazorpay();
                if (!isLoaded) {
                    throw new Error("Failed to load Razorpay");
                }

                // Initialize Razorpay
                const options = {
                    key: "rzp_test_BN58I09Ntf1QYq",
                    amount: Math.round(totalAmount * 100), // Amount in paise
                    currency: "INR",
                    name: "ServiceSync",
                    description: "Service Payment",
                    order_id: response.data.orderId,
                    handler: async function (response) {
                        try {
                            // Verify payment with our backend
                            const captureResponse = await axios.post("http://localhost:5000/order/success", {
                                orderId: response.razorpay_order_id,
                                paymentId: response.razorpay_payment_id
                            });

                            if (captureResponse.data.success) {
                                // Clear cart
                                await axios.post("http://localhost:5000/customer/removeCart", { custId: customerId });
                                
                                // Store order IDs for success page
                                localStorage.setItem("orderIds", JSON.stringify(captureResponse.data.orders));
                                
                                // Redirect to success page
                                window.location.href = "/Customer/checkout/success";
                            } else {
                                throw new Error(captureResponse.data.error || "Payment not completed");
                            }
                        } catch (error) {
                            console.error("Payment capture error:", error);
                            Swal.fire({
                                title: "Payment Error",
                                text: error.response?.data?.error || "There was an issue processing your payment. Please try again.",
                                icon: "error"
                            });
                        }
                    },
                    prefill: {
                        name: user.name || "",
                        email: user.email || "",
                        contact: user.phone || ""
                    },
                    theme: {
                        color: "#3399cc"
                    },
                    modal: {
                        ondismiss: function() {
                            Swal.fire({
                                title: "Payment Cancelled",
                                text: "Your payment was cancelled. You can try again.",
                                icon: "warning"
                            });
                        }
                    }
                };

                const razorpay = new window.Razorpay(options);
                razorpay.open();

            } catch (error) {
                console.error("Order creation error:", error);
                Swal.fire({
                    title: "Error",
                    text: error.response?.data?.error || "Failed to create order. Please try again.",
                    icon: "error"
                });
            }
        } catch (error) {
            console.error("Payment error:", error);
            Swal.fire({
                title: "Error",
                text: error.message || "Failed to process payment. Please try again.",
                icon: "error"
            });
        }
    };
    

    const HandleRemove = (item) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
        const data = {
            custId: customerId,
            serId: item.serId,
            time: item.time,
            date: item.date
                    };

                    const response = await axios.post("http://localhost:5000/customer/removeService", data);
                    
                    if (response.data.message) {
                    Swal.fire({
                        title: 'Removed!',
                            text: 'Your service has been removed from cart.',
                            icon: 'success'
                    }).then(() => {
                            // Refresh the cart items
                            setash(prev => prev + 1);
                        });
                    } else {
                        throw new Error(response.data.error || 'Failed to remove service from cart');
                    }
                } catch (error) {
                    console.error('Error removing item:', error);
                    Swal.fire({
                        title: 'Error',
                        text: error.response?.data?.error || 'Failed to remove service from cart',
                        icon: 'error'
                    });
                }
            }
                });
    };
    
    // const total = calculateTotalPrice();
    const handleOpenOrderDialog = () => {
        try {
            // Replace with the actual customer ID

            axios.post("http://localhost:5000/Customer/getCustomerById", id)
                .then((response) => {
                    setUser(response.data)
                    // const address = {
                    //     house_no: response.data[0].address[0].house_no,
                    //     society_name: response.data[0].address[0].society_name,
                    //     landmark: response.data[0].address[0].landmark,
                    //     pincode: response.data[0].address[0].pincode,
                    //     city : response.data[0].address[0].city   
                    // }
                    const address = response.data[0].address[0];
                    setAddress(address);
                })
        }
        catch (error) {
            console.error('Error fetching cart data:', error);
        }
        setOrderDialogOpen(true);
    };

    const handleCloseOrderDialog = () => {
        setOrderDialogOpen(false);
    };
    const payWithCash = async () => {
        try {
            // Validate address fields
            if (!address.house_no || !address.society_name || !address.landmark || !address.city || !address.pincode) {
                Swal.fire({
                    title: "Incomplete Address",
                    text: "Please fill in all address fields before proceeding",
                    icon: "warning"
                });
                return;
            }

            // Get coordinates from pincode
            let lat = 0;
            let lng = 0;
            try {
                const geoResponse = await axios.get(
                    `https://api.geoapify.com/v1/geocode/search?postcode=${address.pincode}&type=postcode&format=json&apiKey=e61b88dd95644ef79521f24baa6fb8f4`
                );
                
                if (geoResponse.data.results && geoResponse.data.results.length > 0) {
                    lat = geoResponse.data.results[0].lat;
                    lng = geoResponse.data.results[0].lon;
                }
            } catch (error) {
                console.error("Geocoding error:", error);
                Swal.fire({
                    title: "Location Error",
                    text: "Could not validate address. Please check your pincode.",
                    icon: "error"
                });
                return;
            }

            // Check service availability for each item
            const availabilityChecks = await Promise.all(cartItems.map(async (item) => {
                try {
                    const check = await axios.post("http://localhost:5000/order/checkAvailability", {
                        serId: item.serId,
                        date: item.date,
                        time: item.time
                    });
                    return { 
                        serviceId: item.serId, 
                        available: check.data.message,
                        error: check.data.error,
                        empId: check.data.empId // Get assigned employee ID
                    };
        } catch (error) {
                    console.error(`Error checking availability for service ${item.serId}:`, error);
                    return { 
                        serviceId: item.serId, 
                        available: false,
                        error: "Failed to check service availability"
                    };
                }
            }));

            const unavailableServices = availabilityChecks.filter(check => !check.available);
            if (unavailableServices.length > 0) {
                const unavailableServiceNames = unavailableServices.map(check => {
                    const item = cartItems.find(i => i.serId === check.serviceId);
                    return item?.serviceDetails?.name || `Service ${check.serviceId}`;
                }).join(", ");

                Swal.fire({
                    title: "Service Unavailable",
                    text: `The following services are not available at the selected time: ${unavailableServiceNames}. Please try ordering one by one.`,
                    icon: "warning",
                    confirmButtonText: "Okay"
                });
                return;
            }

            // Calculate total amount
            const totalAmount = cartItems.reduce((sum, item) => sum + (item.serviceDetails?.price || 0), 0);

            // Prepare order data with employee assignments
            const orderData = {
                custId: customerId,
                services: cartItems.map((item, index) => ({
                    serId: item.serId,
                    date: item.date,
                    time: item.time,
                    serviceDetails: {
                        price: item.serviceDetails.price
                    },
                    empId: availabilityChecks[index].empId // Include assigned employee ID
                })),
                address: address,
                lat: lat,
                lng: lng,
                payment_method: 'Cash',
                totalAmount: totalAmount
            };

            const response = await axios.post("http://localhost:5000/order/createCheckout", orderData);
            
            if (response.data.success) {
                // Clear cart
                await axios.post("http://localhost:5000/customer/removeCart", { custId: customerId });
                
                // Store order IDs for success page
                localStorage.setItem("orderIds", JSON.stringify(response.data.orders));
                
                // Redirect to success page
                        window.location.href = "/Customer/checkout/success";
                } else {
                throw new Error("Order creation failed");
            }
        } catch (error) {
            console.error("Order creation error:", error);
            Swal.fire({
                title: "Error",
                text: error.response?.data?.error || "Failed to create order. Please try again.",
                icon: "error"
            });
        }
    };
    const paypalScriptUrl = "https://www.paypal.com/sdk/js?client-id=AUInb_IsVUu6y0pTGcXHYtQyl-UpzYRbysyz0ijRftqmL362BDQDftOXp3eYcf6A8Srfop2AI5yEEZgi";

    const PayPalLoader = ({ totalAmount }) => {
        useEffect(() => {
            const existingScript = document.querySelector(`script[src="${paypalScriptUrl}"]`);
            if (!existingScript) {
                const script = document.createElement('script');
                script.src = paypalScriptUrl;
                script.onload = () => {
                    console.log('PayPal SDK loaded');
                    initializePayPalButtons(totalAmount);
                };
                script.onerror = () => {
                    Swal.fire("Error", "Failed to load PayPal SDK. Please try again later.", "error");
                };
                document.body.appendChild(script);
            } else {
                // If the script is already loaded
                initializePayPalButtons(totalAmount);
            }
        }, [totalAmount]);
    
        return <div id="paypal-button-container"></div>;
    };
    
    const initializePayPalButtons = (totalAmount) => {
        if (!window.paypal) {
            console.error("PayPal SDK not loaded");
            return;
        }
    
        window.paypal.Buttons({
            createOrder: async (data, actions) => {
                try {
                    // Validate address fields
                    if (!address.house_no || !address.society_name || !address.landmark || !address.city || !address.pincode) {
                        throw new Error("Please fill in all address fields");
                    }

                    // Get coordinates from pincode
                    let lat = 0;
                    let lng = 0;
                    try {
                        const geoResponse = await axios.get(
                            `https://api.geoapify.com/v1/geocode/search?postcode=${address.pincode}&type=postcode&format=json&apiKey=e61b88dd95644ef79521f24baa6fb8f4`
                        );
                        
                        if (geoResponse.data.results && geoResponse.data.results.length > 0) {
                            lat = geoResponse.data.results[0].lat;
                            lng = geoResponse.data.results[0].lon;
                        }
                    } catch (error) {
                        throw new Error("Could not validate address. Please check your pincode.");
                    }

                    // Check service availability
                    const availabilityChecks = await Promise.all(cartItems.map(async (item) => {
                        const check = await axios.post("http://localhost:5000/order/checkAvailability", {
                            serId: item.serId,
                            date: item.date,
                            time: item.time
                        });
                        return { 
                            serviceId: item.serId, 
                            available: check.data.message,
                            error: check.data.error
                        };
                    }));

                    const unavailableServices = availabilityChecks.filter(check => !check.available);
                    if (unavailableServices.length > 0) {
                        throw new Error("Some services are not available at the selected time");
                    }

                    // Create order on our backend first
                    const orderData = {
                        custId: customerId,
                        services: cartItems.map(item => ({
                            serId: item.serId,
                            date: item.date,
                            time: item.time,
                            serviceDetails: {
                                price: item.serviceDetails.price
                            }
                        })),
                        address: address,
                        lat: lat,
                        lng: lng,
                        payment_method: 'PayPal'
                    };

                    const response = await axios.post("http://localhost:5000/order/createCheckout", orderData);
                    
                    if (!response.data || !response.data.id) {
                        throw new Error("Invalid response from server");
                    }

                    // Store order ID for later use
                    localStorage.setItem("tempOrderId", response.data.orderId);
                    
                    // Create PayPal order
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: response.data.totalAmount.toString(),
                                currency_code: "USD"
                            }
                        }]
                    });
                } catch (error) {
                    console.error("Error creating order:", error);
                    Swal.fire({
                        title: "Error",
                        text: error.message || "Failed to create order. Please try again.",
                        icon: "error"
                    });
                    throw error;
                }
            },
    
            onApprove: async (data, actions) => {
                try {
                    const captureResponse = await axios.post("http://localhost:5000/order/success", {
                        orderId: localStorage.getItem("tempOrderId"),
                        paymentId: data.orderID
                    });

                    if (captureResponse.data.success) {
                        // Clear cart
                        await axios.post("http://localhost:5000/customer/removeCart", { custId: customerId });
                        
                        // Store order IDs for success page
                        localStorage.setItem("orderIds", JSON.stringify(captureResponse.data.orders));
                        
                        // Redirect to success page
                        window.location.href = "/Customer/checkout/success";
                    } else {
                        throw new Error("Payment not completed");
                    }
                } catch (error) {
                    console.error("Payment capture error:", error);
                    Swal.fire({
                        title: "Payment Error",
                        text: "There was an issue processing your payment. Please try again.",
                        icon: "error"
                    });
                }
            },

            onError: (err) => {
                console.error("PayPal error:", err);
                const tempOrderId = localStorage.getItem("tempOrderId");
                if (tempOrderId) {
                    axios.post("http://localhost:5000/order/failed", { orderId: tempOrderId });
                }
                Swal.fire({
                    title: "Payment Error",
                    text: "There was an issue with your payment. Please try again.",
                    icon: "error"
                });
            },

            onCancel: () => {
                const tempOrderId = localStorage.getItem("tempOrderId");
                if (tempOrderId) {
                    axios.post("http://localhost:5000/order/failed", { orderId: tempOrderId });
                }
                Swal.fire({
                    title: "Payment Cancelled",
                    text: "Your payment was cancelled. You can try again.",
                    icon: "warning"
                });
            }
        }).render("#paypal-button-container");
    };
    
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    return (
        <div >
            <NavBar></NavBar>
            {/* <div className='container mt-5 d-flex justify-content-center align-items-center' style={{ marginTop: "10px" }}>
                <Button
                    style={{ width: "400px" }}
                    variant="contained"
                    color="primary"
                    onClick={() => {

                        window.location.href = "/Customer/AddServices";
                    }}
                >
                    Add More Services
                </Button>
            </div> */}

            <div className="container-fluid" style={{ backgroundColor: '#D4E6F1' }}>
                <div className='col-md-12 justify-content-center' style={{ padding: 20 }}>

                    <div className="container-fluid" style={{ backgroundColor: '#FFFFF0' }}>
                        {/* <div className='col-md-11' style={{margin :'20'}}>  */}

                        <div className='col-md-12' style={{ padding: 20 }}>
                            {cartItems.length === 0 ? (
                                <h1 style={{ textAlign: 'center' }}>Cart is Empty</h1>
                            ) : (
                                cartItems.map((item, index) => (
                                    <div className='row mt-2'>
                                        <div className='col-md-8'>
                                            <div className="card" key={index} style={{ backgroundColor: '#f5f5f5', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)' }}>
                                                <div className='row' style={{ marginTop: 20 }}>
                                                    <div className="col-md-6">
                                                        <img className="rounded" src={item.serviceDetails.url|| 'fallback-image.jpg'} alt={item.serviceDetails.name} style={{ width: "50%", textAlign: "center", paddingLeft: 20 }} />
                                                    </div>



                                                    <div className='col-md-6' style={{ textAlign: 'left' }}>


                                                        <p className="card-title"> {item.serviceDetails.name}</p>

                                                        <p style={{ textAlign: 'left' }}>Price : ₹{item.serviceDetails.price}</p>

                                                        <p> Want on: {item.date} at: {item.time}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-12" style={{ textAlign: "right", paddingRight: '10%' }}>
                                                    <button className="btn btn-danger" style={{ width: 50 }} onClick={() => HandleRemove(item)}> <BsTrash /></button>
                                                </div>
                                                <div className="col-md-6" style={{ margin: 10 }}>


                                                    <div className="row">
                                                        <div className="col-md-8">
                                                            <Dialog open={open} onClose={handleClose} >
                                                                <DialogTitle>Item Details</DialogTitle>
                                                                <DialogContent>
                                                                    <DialogContentText>
                                                                        <div className='container d-flex'>
                                                                            <img src={Item.url|| 'Service'} alt={Item.name} className="img-fluid" style={{ width: "50%" }} />
                                                                            <div style={{ marginLeft: "20px" }}>
                                                                                <h5><strong>Name:</strong> {Item.name}</h5>
                                                                                <h5><strong>Price:</strong>  ₹{Item.price}</h5>
                                                                                <h5><strong>Description:</strong>  {Item.desc}</h5>
                                                                                <h5><strong>Time for Service:</strong>  {Item.time} </h5>

                                                                            </div>
                                                                        </div>

                                                                    </DialogContentText>

                                                                </DialogContent>
                                                                <DialogActions>
                                                                    <Button onClick={handleClose} style={{ backgroundColor: "blue", color: "black" }}>
                                                                        Close
                                                                    </Button>
                                                                </DialogActions>
                                                            </Dialog>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                ))
                            )}

                            {!isCartEmpty ?
                                <div className="col-md-12 align-content-right" style={{}}>
                                    <div className="col-md-11 mt-8 d-flex justify-content-end align-items-end" style={{ height: "10px" }} >
                                        <div className="card" style={{ height: "auto", marginBottom: "50px", textAlign: "center" }}>
                                            <div className="card-body">
                                                <h5 className="card-title" style={{ textAlign: "center" }}>Total Amount</h5>

                                                {
                                                    cartItems.map((item, index) => (
                                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                            <p style={{ textAlign: "left", marginRight: "15px" }}>{item.serviceDetails.name} : </p> <p style={{ textAlign: "right" }}>₹ {item.serviceDetails.price}</p>
                                                        </div>
                                                    ))
                                                }
                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                    <p style={{ textAlign: "left", marginRight: "15px" }}>Total : </p> <p style={{ textAlign: "right" }}>₹ {calculateTotalPrice()}</p>
                                                </div>

                                                <Button
                                                    style={{ width: "150px", justifyContent: "center" }}
                                                    variant="contained"
                                                    color="warning"
                                                    onClick={handleOpenOrderDialog}


                                                >
                                                    Place Order
                                                </Button>
                                            
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                : <></>}

                        </div>

                    </div>
                    <Dialog open={orderDialogOpen} onClose={handleCloseOrderDialog}>
                        <DialogTitle>Place Order</DialogTitle>
                        <DialogContent>
                            Confirm your address
                            <DialogContentText>
                                <form onSubmit={handleSubmit}>
                                    <TextField
                                        label="House Number"
                                        name="house_no"
                                        value={address.house_no}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Society"
                                        name="society_name"
                                        value={address.society_name}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Landmark"
                                        name="landmark"
                                        value={address.landmark}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label="City"
                                        name="city"
                                        value={address.city}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Pincode"
                                        name="pincode"
                                        value={address.pincode}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                </form>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handlePlaceOrder} variant="contained" color="success">
                              Online Payment
                            </Button>
                            <Button onClick={payWithCash} variant="contained" color="warning">
                            Place Order
                            </Button>
                        </DialogActions>
                    </Dialog>

                    







                </div>
            </div>
        </div>
    );
};

export default Cart;