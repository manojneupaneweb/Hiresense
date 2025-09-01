import connectDB from "./config/DBconnect.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }).catch((error) => {
        console.error("Database connection failed:", error);
        process.exit(1);
    });

