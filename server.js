import express from "express";
// Load the middleware.
import { logRequest } from "./middleware/middleware.js";
import { getCompaniesUrls, saveCompanies } from "./routes/companies.js";
import {
  getCategories,
  saveCategories,
  saveCompaniesUrls,
} from "./routes/categories.js";
import { connectToMongo, client } from "./config/mongo.js";

const app = express();
app.use(express.json());
app.use(logRequest);
connectToMongo();

// Load the routes.

// insert one document.
app.post("/save-categories", logRequest, saveCategories);

// get all categories documents.
app.get("/get-categories", logRequest, getCategories);

// insert one document.
app.post("/save-companies-urls", logRequest, saveCompaniesUrls);

app.get("/get-companies-urls", logRequest, getCompaniesUrls);
app.post("/save-companies", logRequest, saveCompanies);

// Close the MongoDB connection before exiting the process.
process.on("exit", () => {
  client.close();
});

// Start the server.
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
