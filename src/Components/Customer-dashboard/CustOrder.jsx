import NavBar from "../NavBar";
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BsTrash } from 'react-icons/bs';
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FaShoppingCart } from 'react-icons/fa';
import { Box, Paper, Container, Grid, Rating, TextareaAutosize } from '@mui/material';
import { Send } from '@mui/icons-material';
import {
    Card,
    CardContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Tabs, Tab, Divider } from '@mui/material';

const CustOrder = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [cartActive, setCartActive] = useState(false)
    const [orders, setOrders] = useState({
        pending: [],
        completed: [],
        cancelled: []
    });
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [open, setOpen] = useState(false);
    const [opencomp, setOpencomp] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [pItem, setpItem] = useState({});
    const [Feed, SetFeedOpen] = useState(false);
    const [Item, SetItem] = useState([]);
    const [serviceRating, setServiceRating] = useState(0);
    const [employeeRating, setEmployeeRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [Feedget, SetFeedgetOpen] = useState(false);
    const [Itemget, SetgetItem] = useState([]);
    const [feedbackDetails, setFeedbackDetails] = useState({
        serviceRating: 0,
        employeeRating: 0,
        feedback: ''
    });
    const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
    const [viewFeedbackDialogOpen, setViewFeedbackDialogOpen] = useState(false);

    const handleServiceRatingChange = (event, newValue) => {
        setServiceRating(newValue);
    };

    const handleEmployeeRatingChange = (event, newValue) => {
        setEmployeeRating(newValue);
    };

    const handleSubmit = (e) => {
        SetFeedOpen(false);
        e.preventDefault();
        const data = {
            orderId: Item._id,
            serRating: serviceRating,
            empRating: employeeRating,
            feed_text: feedback
        }
        try {
            axios.post("https://servicesync-backend.onrender.com/feedback/createFeedback", data)
                .then((response) => {
                    console.log(response.data);
                    Swal.fire({
                        title: 'Send successfully.',
                        text: 'Feedback is Send successfully',
                        icon: 'success',
                        confirmButtonText: 'Okay'
                    }).then(() => {
                        window.location.href = "/Customer/CustOrder/"
                    })
                })
        }
        catch (error) {
            console.log(error)
        }
        console.log('Service Rating:', serviceRating);
        console.log('Employee Rating:', employeeRating);
        console.log('Feedback:', feedback);
    };

    const handleClose = () => {
        setIsOpen(false);
    };
    const handleOrderDetails = (item) => {
        setpItem(item)
        setOpen(true);
    }
    const handleC = () => {
        setpItem({})
        setOpen(false)
    }
    const handleCancelOrder = async (item) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, cancel it!'
        });

            if (result.isConfirmed) {
            try {
                const response = await axios.post('https://servicesync-backend.onrender.com/order/cancelOrder', {
                    orderId: item._id
                });

                if (response.data.message) {
                    Swal.fire('Cancelled!', 'Your order has been cancelled.', 'success');
                    fetchOrders();
                        } else {
                    throw new Error(response.data.error || 'Failed to cancel order');
                }
            } catch (error) {
                console.error('Error cancelling order:', error);
                Swal.fire('Error', 'Failed to cancel order', 'error');
            }
        }
    }
    const handlecompOrderDetails = (item) => {
        setpItem(item)
        setOpencomp(true);
    }
    const handleCcomp = () => {
        setpItem({})
        setOpencomp(false)
    }

    const handleLogin = () => {
        window.location.href = "/Login"
    };
    const dialogStyles = {
        maxWidth: '1000px',
    };

    useEffect(() => {
        const checkLoginStatus = () => {
            if (localStorage.getItem('role') !== null) {
            setIsLoggedIn(true);
                fetchOrders();
            }
        };

        checkLoginStatus();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.post('https://servicesync-backend.onrender.com/order/getOrderByCustId/', {
                custId: localStorage.getItem('id')
            });
            
            if (response.data) {
                setOrders({
                    pending: response.data.pendingOrders || [],
                    completed: response.data.completedOrders || [],
                    cancelled: response.data.cancelledOrders || []
                });
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            Swal.fire('Error', 'Failed to fetch orders', 'error');
        }
    };

    const HandleFeedback = (item) => {
        SetFeedOpen(true);
        SetItem(item);
    }
    const HandleFeedClose = () => {
        SetItem([]);
        SetFeedOpen(false);
    }

    const HandleViewFeedback = (item) => {
        SetFeedgetOpen(true);
        SetgetItem(item);

        const data1 = {
            orderId: item._id
        }

        axios.post(`https://servicesync-backend.onrender.com/feedback/getFeedbackByOrderId/`, data1)
            .then((response) => {
                console.log(response.data);
                setFeedbackDetails(response.data[0]);
                setViewFeedbackDialogOpen(true);
            })
    }
    const HandleFeedgetClose = () => {
        SetFeedgetOpen(false);
        SetgetItem([]);
    }
    function mapRatingToLabel(rating) {
        switch (rating) {
          case 1:
            return 'Very Poor';
          case 2:
            return 'Poor';
          case 3:
            return 'Average';
          case 4:
            return 'Good';
          case 5:
            return 'Very Good';
          default:
            return 'Not Rated';
        }
      }
      
    const handleSubmitFeedback = async (order) => {
        try {
            const response = await axios.post('https://servicesync-backend.onrender.com/feedback/createFeedback', {
                orderId: order._id,
                custId: localStorage.getItem('id'),
                empId: order.employeeDetails[0]._id,
                serId: order.serviceDetails[0]._id,
                serRating: feedbackDetails.serviceRating,
                empRating: feedbackDetails.employeeRating,
                feed_text: feedbackDetails.feedback
            });

            if (response.data.message) {
                Swal.fire('Success!', 'Feedback submitted successfully', 'success');
                setFeedbackDialogOpen(false);
                fetchOrders();
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            Swal.fire('Error', 'Failed to submit feedback', 'error');
        }
    };

    const renderOrderCard = (order) => (
        <Card key={order._id} sx={{ mb: 2, p: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <img 
                        src={order.serviceDetails[0]?.url} 
                        alt={order.serviceDetails[0]?.name}
                        style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }}
                    />
                </Grid>
                <Grid item xs={12} md={8}>
                    <Typography variant="h6" gutterBottom>
                        {order.serviceDetails[0]?.name}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Order ID: {order.orderId}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Amount: ₹{order.serviceDetails[0]?.price}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Payment Mode: {order.payment_mode}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Status: {order.status}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Employee: {order.employeeDetails[0]?.fname} {order.employeeDetails[0]?.lname}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Button 
                            variant="contained" 
                            color="primary"
                            onClick={() => setSelectedOrder(order)}
                        >
                            Details
                        </Button>
                        {order.status === 'pending' && (
                            <Button 
                                variant="contained" 
                                color="error"
                                onClick={() => handleCancelOrder(order)}
                            >
                                Cancel
                            </Button>
                        )}
                        {order.status === 'completed' && !order.feedback && (
                            <Button 
                                variant="contained" 
                                color="success"
                                onClick={() => {
                                    setSelectedOrder(order);
                                    setFeedbackDialogOpen(true);
                                }}
                            >
                                Feedback
                            </Button>
                        )}
                        {order.status === 'completed' && order.feedback && (
                            <Button 
                                variant="contained" 
                                color="info"
                                onClick={() => HandleViewFeedback(order)}
                            >
                                View Feedback
                            </Button>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Card>
    );

    if (!isLoggedIn) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Typography variant="h4" gutterBottom>
                    Please Login to View Orders
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigate('/Customer/Login')}
                >
                    Login
                </Button>
            </div>
        );
    }

    return (
        <>
            <NavBar></NavBar>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 3 }}>
                    <Tabs 
                        value={selectedTab} 
                        onChange={(e, newValue) => setSelectedTab(newValue)}
                        sx={{ mb: 3 }}
                    >
                        <Tab label="Pending Orders" />
                        <Tab label="Completed Orders" />
                        <Tab label="Cancelled Orders" />
                    </Tabs>

                    <Divider sx={{ mb: 3 }} />

                    {selectedTab === 0 && (
                        orders.pending.length === 0 ? (
                            <Typography variant="h6" align="center">
                                No pending orders
                            </Typography>
                        ) : (
                            orders.pending.map(renderOrderCard)
                        )
                    )}

                    {selectedTab === 1 && (
                        orders.completed.length === 0 ? (
                            <Typography variant="h6" align="center">
                                No completed orders
                            </Typography>
                        ) : (
                            orders.completed.map(renderOrderCard)
                        )
                    )}

                    {selectedTab === 2 && (
                        orders.cancelled.length === 0 ? (
                            <Typography variant="h6" align="center">
                                No cancelled orders
                            </Typography>
                        ) : (
                            orders.cancelled.map(renderOrderCard)
                        )
                    )}
                </Paper>
            </Container>

            {/* Order Details Dialog */}
            <Dialog 
                open={selectedOrder !== null} 
                onClose={() => setSelectedOrder(null)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Order Details</DialogTitle>
                                                        <DialogContent>
                    {selectedOrder && (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Service Details
                        </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <img 
                                        src={selectedOrder.serviceDetails[0]?.url} 
                                        alt={selectedOrder.serviceDetails[0]?.name}
                                        style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body1" gutterBottom>
                                        Service: {selectedOrder.serviceDetails[0]?.name}
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        Price: ₹{selectedOrder.serviceDetails[0]?.price}
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        Date: {selectedOrder.service_date}
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        Time: {selectedOrder.service_startTime} - {selectedOrder.service_endTime}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
                                Employee Details
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Name: {selectedOrder.employeeDetails[0]?.fname} {selectedOrder.employeeDetails[0]?.lname}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Contact: {selectedOrder.employeeDetails[0]?.contact_no}
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedOrder(null)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Feedback Dialog */}
            <Dialog 
                open={feedbackDialogOpen} 
                onClose={() => setFeedbackDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Submit Feedback</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Service Rating
                        </Typography>
                        <Rating
                            value={feedbackDetails.serviceRating}
                            onChange={(e, newValue) => setFeedbackDetails({
                                ...feedbackDetails,
                                serviceRating: newValue
                            })}
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Employee Rating
                        </Typography>
                        <Rating
                            value={feedbackDetails.employeeRating}
                            onChange={(e, newValue) => setFeedbackDetails({
                                ...feedbackDetails,
                                employeeRating: newValue
                            })}
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Feedback
                        </Typography>
                        <textarea
                            value={feedbackDetails.feedback}
                            onChange={(e) => setFeedbackDetails({
                                ...feedbackDetails,
                                feedback: e.target.value
                            })}
                            style={{ width: '100%', minHeight: '100px', padding: '8px' }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFeedbackDialogOpen(false)}>Cancel</Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                        onClick={() => handleSubmitFeedback(selectedOrder)}
                                >
                                    Submit
                                </Button>
                </DialogActions>
            </Dialog>

            {/* View Feedback Dialog */}
            <Dialog 
                open={viewFeedbackDialogOpen} 
                onClose={() => setViewFeedbackDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Feedback Details</DialogTitle>
  <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Service Rating
                        </Typography>
                        <Rating value={feedbackDetails.serviceRating} readOnly />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Employee Rating
                        </Typography>
                        <Rating value={feedbackDetails.employeeRating} readOnly />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Feedback
              </Typography>
              <Typography variant="body1">
                            {feedbackDetails.feedback}
              </Typography>
        </Box>
  </DialogContent>
  <DialogActions>
                    <Button onClick={() => setViewFeedbackDialogOpen(false)}>Close</Button>
  </DialogActions>
</Dialog>
        </>
    );
}

export default CustOrder