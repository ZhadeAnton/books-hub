import express, { Application } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import bookRoutes from "./src/routes/bookRoutes";
import userRoutes from "./src/routes/userRoutes";

dotenv.config();
const app: Application = express();

app.use(bodyParser.json());

app.use("/", bookRoutes);
app.use("/", userRoutes);

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
