import { client } from "../config/mongo.js";

const db = client.db("yellow_pages_database");

export const saveCategories = async (req, res) => {
  try {
    const data = req.body;
    let len = data.pageCategories.length;
    await db.collection("categories").insertOne(data);
    console.log(
      `✅ Inserted ${len} Categories added to the database successfully!`
    );
    res.send(
      `✅ Inserted ${len} Categories added to the database successfully!`
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

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

export const saveCompaniesUrls = async (req, res) => {
  try {
    const data = req.body;
    let len = data.companiesUrls.length;
    await db.collection("companies_urls").insertOne(data);
    console.log(
      `✅ Inserted ${len} company URLs into the companies_urls collection`
    );
    res.send(
      `✅ Inserted ${len} company URLs into the companies_urls collection`
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

// export const sendBulkRequest = async (data) => {
//   const response = await axios.post("http://localhost:3000/send-bulk", data, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   return response;
// };
