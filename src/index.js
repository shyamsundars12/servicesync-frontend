import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Swal from 'sweetalert2';
import './index.css';

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
    const paypalContainer = document.getElementById('paypal-button-container');
    if (!paypalContainer) {
        console.error("#paypal-button-container does not exist.");
        return;
    }

    if (!window.paypal) {
        console.error("PayPal SDK not loaded.");
        return;
    }

    window.paypal.Buttons({
        // Create the order in the backend
        createOrder: async (data, actions) => {
            try {
                const response = await fetch("https://servicesync-backend.onrender.com/order/createCheckout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        products: [
                            // Example product, you should dynamically pass products
                            { serviceDetails: { price: totalAmount } },
                        ],
                    }),
                });

                if (!response.ok) {
                    Swal.fire("Error", "Failed to create checkout order.", "error");
                    throw new Error("Failed to create checkout order.");
                }

                const { id } = await response.json(); // Retrieve PayPal order ID
                return id; // Return the order ID to PayPal SDK
            } catch (error) {
                console.error("Error creating order:", error);
                Swal.fire("Error", "Unable to create an order. Please try again later.", "error");
                throw error;
            }
        },

        // Handle approval of the payment
        onApprove: async (data, actions) => {
            try {
                const response = await fetch(`https://servicesync-backend.onrender.com/order/success?token=${data.orderID}`, {
                    method: "POST",
                });

                if (!response.ok) {
                    Swal.fire("Payment Successful");
                    window.location.href = "/Customer/checkout/success";
                }

                // Redirect to success page

            } catch (error) {
                console.error("Error capturing order:", error);
                Swal.fire("Payment Error", "There was an issue capturing the order. Please try again.", "error");
            }
        },

        // Handle errors during the payment process
        onError: (err) => {
            Swal.fire("Payment Error", "There was an issue with your payment.", "error");
            console.error("PayPal error:", err);
        },
    }).render("#paypal-button-container");
};

// Render the application and the PayPalLoader component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
        {/* <PayPalLoader totalAmount="4000" /> Pass totalAmount dynamically */}
    </React.StrictMode>
);
