import { client } from "../config/mongo.js";

const db = client.db("yellow_pages_database");

export const getCategories = async (req, res) => {
  try {
    const documents = await db.collection("categories").find({}).toArray();
    const urls = documents.reduce(
      (acc, item) =>
        acc.concat(item.pageCategories.map((category) => category.href)),
      []
    );
    console.log("✅ Categories sent from the database successfully!");
    res.send(urls);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

export const getCompaniesUrls = async (req, res) => {
  try {
    const documents = await db.collection("companies_urls").find({}).toArray();
    const urls = documents.reduce(
      (acc, item) => acc.concat(item.companiesUrls.map((url) => url)),
      []
    );
    console.log("✅ Companies Urls sent from the database successfully!");
    res.send(urls);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

export const saveCompanies = async (req, res) => {
  const data = req.body;
  try {
    await db.collection("company").insertOne(data);
    console.log("✅ Company added to the database successfully!");
    res.send("✅ Company added to the database successfully!");
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};
// // Get a company by ID
// router.get("/:id", async (req, res) => {
//   const company = await findById(req.params.id);
//   res.send(company);
// });

// // Create a new company
// router.post("/", async (req, res) => {
//   const company = new Company(req.body);
//   await company.save();
//   res.send(company);
// });

// // Update a company
// router.put("/:id", async (req, res) => {
//   await findByIdAndUpdate(req.params.id, req.body);
//   res.send("Company updated successfully");
// });

// // Delete a company
// router.delete("/:id", async (req, res) => {
//   await findByIdAndDelete(req.params.id);
//   res.send("Company deleted successfully");
// });

// export default router;
