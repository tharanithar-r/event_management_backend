import "dotenv/config";
import express from "express";
import cors from "cors";
import rootRouter from "./routes/index";
import cookieparser from "cookie-parser";

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://event-management-frontend-m7ct.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

const PORT = Number(process.env.PORT) || 3000;
console.log("Server will start on port:", PORT);

const app = express();

app.use(cors(corsOptions));
app.use(cookieparser());
app.use(express.json());

app.use("/api/v1", rootRouter);

app.get("/", async (request, response) => {
  try {
    console.log("Received GET request at /");
    response.send("Received GET request at /");
  } catch (error) {
    console.error("Error handling GET request:", error);
    response.status(500).send("An error occurred");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
