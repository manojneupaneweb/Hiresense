import axios from 'axios';
import { toast } from "react-toastify";

export const initiateKhaltiPayment = async (amount, productId, redirectLink) => {
    try {
        const payload = {
            amount: amount * 100,
            productId,
            redirectLink: redirectLink || "paymentsuccess",
        };

        const response = await axios.post("/api/payment/khalti/initiate", payload, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                "Content-Type": "application/json"
            },
        });

        if (response.data && response.data.payment_url) {
            window.location.href = response.data.payment_url;
        } else {
            console.error("Payment initiation failed", response);
            toast.error("Payment initiation failed. Try again.");
        }
    } catch (error) {
        console.error(error.response?.data || error.message);
        toast.error("Payment error. Try again.");
    }
};
