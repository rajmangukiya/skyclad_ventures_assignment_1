import { Express } from "express";
import dotenv from "dotenv";
import { connectDB } from "./database/config";
dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async (app: Express) => {
    try {
      // Connect to MongoDB
      await connectDB();

      // Start the server
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  };

export { startServer };