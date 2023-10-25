import axios from "axios";

// Create a proxy instance
const proxy = axios.create({
  baseURL: "http://localhost:3000",
});

export const saveCategories = async (data) => {
  await proxy.post("/save-categories", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getCategories = async () => {
  // get categories from the server and return urls of pageCategories objects from the server
  const urls = await proxy.get("/get-categories", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return urls.data;
};

export const saveCompaniesUrls = async (data) => {
  await proxy.post("/save-companies-urls", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getCompaniesUrls = async () => {
  // get companies from the server and return urls of companies_urls objects from the server
  const urls = await proxy.get("/get-companies-urls", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return urls.data;
};

export const saveCompanies = async (data) => {
  await proxy.post("/save-companies", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
