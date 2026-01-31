import dotenv from "dotenv";
import { connectDB } from "./utils/db";
import app from "./app";
import { syncUploadsWithDB } from "./utils/sync";

dotenv.config();
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    // Run the sync script after connecting to the DB
    syncUploadsWithDB();

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});