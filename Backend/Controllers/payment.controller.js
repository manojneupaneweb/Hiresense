import axios from "axios";

// Initiate Khalti Payment
export const initiateKhaltiPayment = async (req, res) => {
    try {
        const { amount, productId, redirectLink } = req.body;

        if (!amount || !productId || !redirectLink) {
            return res.status(400).json({ status: "error", message: "Invalid input" });
        }

        const payload = {
            return_url: `http://localhost:5173/paymentsuccess`,
            website_url: "http://localhost:5173",
            amount: amount,
            purchase_order_id: Date.now().toString(), 
            purchase_order_name: `Product ${productId}`,
            customer_info: {
                name: "Test User",
                email: "test@khalti.com",
                phone: "9800000001"
            }
        };

        const response = await axios.post(
            "https://dev.khalti.com/api/v2/epayment/initiate/",
            payload,
            {
                headers: {
                    "Authorization": "key live_secret_key_68791341fdd94846a146f0457ff7b455", // Replace with your test key
                    "Content-Type": "application/json"
                }
            }
        );

        return res.json(response.data);

    } catch (error) {
        console.error(error.response?.data || error.message);
        return res.status(500).json({
            status: "error",
            message: error.response?.data?.detail || error.message
        });
    }
};

// Verify Khalti Payment
export const verifyKhaltiPayment = async (req, res) => {
    try {
        const { pidx } = req.body;

        if (!pidx) {
            return res.status(400).json({ status: false, message: "Invalid input" });
        }

        const response = await axios.post(
            "https://dev.khalti.com/api/v2/epayment/lookup/",
            { pidx },
            {
                headers: {
                    Authorization: "Key <live_secret_key>", // exactly as in Khalti dashboard
                    "Content-Type": "application/json"
                }
            }
        );

        const result = response.data;

        if (result.status === "Completed") {
            return res.json({
                success: true,
                message: "Payment verified",
                data: result
            });
        } else {
            return res.json({
                success: false,
                message: "Payment not completed",
                data: result
            });
        }

    } catch (error) {
        console.error(error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: error.response?.data?.detail || error.message
        });
    }
};
