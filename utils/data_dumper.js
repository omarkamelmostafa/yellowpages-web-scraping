import ExcelJS from "exceljs";
import fs from "fs/promises";
import { mkdirSync, existsSync } from "fs";
import axios from "axios";
import path from "path";
import crypto from "crypto";

// create dir if not exists
const createDirIfNotExists = (dir) => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
};

const generateFileName = () => {
  var date = new Date();
  var hour = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();

  var filename = `${date
    .toISOString()
    .slice(0, 10)}_T_${hour}-${minutes}-${seconds}`;

  return filename;
};

export const getRandomId = () => crypto.randomBytes(20).toString("hex");

export const downloadImageFromURL = async (src, imageName) => {
  const destinationPath = "../data/logo";
  createDirIfNotExists(destinationPath);

  const response = await axios.get(src, { responseType: "arraybuffer" });

  const filePath = path.join(destinationPath, imageName);

  await fs.writeFile(filePath, response.data);
};

//*******************************************************************************//
//  **********  save all details of each company to json & excel file  **********//
//*******************************************************************************//

export const write_companies_to_excel = async (data, fName) => {
  const fileDir = `../data/excel/companies/`;
  createDirIfNotExists(fileDir);
  const fileName = `../data/excel/companies/companies-${fName}.xlsx`;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(
    `Companies Data - ${new Date().toISOString().slice(0, 10)}`
  );

  sheet.columns = [
    { header: "ID", key: "ID", name: "ID" },
    { header: "companyId", key: "companyId", name: "companyId" },
    { header: "companyName", key: "companyName", name: "companyName" },
    { header: "companyAddress", key: "companyAddress", name: "companyAddress" },
    { header: "companyLogo", key: "companyLogo", name: "companyLogo" },
    {
      header: "companyPhoneNumbers",
      key: "companyPhoneNumbers",
      name: "companyPhoneNumbers",
    },
    {
      header: "companyWhatsapp",
      key: "companyWhatsapp",
      name: "companyWhatsapp",
    },
    { header: "companyAbout", key: "companyAbout", name: "companyAbout" },
    {
      header: "companyDescription",
      key: "companyDescription",
      name: "companyDescription",
    },
    {
      header: "companyCategory",
      key: "companyCategory",
      name: "companyCategory",
    },
    {
      header: "companyKeywords",
      key: "companyKeywords",
      name: "companyKeywords",
    },
    {
      header: "companyBranches",
      key: "companyBranches",
      name: "companyBranches",
    },
    {
      header: "companySocialLinks",
      key: "companySocialLinks",
      name: "companySocialLinks",
    },
    {
      header: "companyWorkingHours",
      key: "companyWorkingHours",
      name: "companyWorkingHours",
    },
  ];
  sheet.addRows(data);

  try {
    await workbook.xlsx.writeFile(fileName);
    console.log(
      "%cAdded %d rows to Excel file: %s",
      "color: green",
      workbook.worksheets.length,
      fileName
    );
  } catch (err) {
    console.log(err);
  }
};

export const write_companies_to_json = async (data, fName) => {
  const fileDir = `../data/json/companies/`;
  createDirIfNotExists(fileDir);
  const fileName = `../data/json/companies/companies-${fName}.json`;

  try {
    await fs.writeFile(fileName, JSON.stringify(data, null, 2));
    console.log(
      "%cWrote %d companies to JSON file: %s",
      "color: blue",
      data.length,
      fileName
    );
  } catch (err) {
    console.error(err);
  }
};

//*******************************************************************************//
//  **********  save url & name for each category to json & excel file  **********//
//*******************************************************************************//

export const write_categories_to_excel = async (data, fName) => {
  const fileDir = `./data/excel/categories/categories_urls/`;
  createDirIfNotExists(fileDir);
  const fileName = `./data/excel/categories/categories_urls/categories-${fName}.xlsx`;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(
    `Categories Data-${new Date().toISOString().slice(0, 10)}`
  );

  sheet.columns = [
    { header: "ID", key: "ID", name: "ID" },
    { header: "pagesCount", key: "pagesCount", name: "pagesCount" },
    { header: "pageId", key: "pageId", name: "pageId" },
    { header: "pageUrl", key: "pageUrl", name: "pageUrl" },
    { header: "pageCategories", key: "pageCategories", name: "pageCategories" },
  ];

  sheet.addRows(data);
  try {
    await workbook.xlsx.writeFile(fileName);
    console.log(
      `Added ${workbook.worksheets.length} rows to Excel file: ${fileName}`
    );
  } catch (err) {
    console.log(err);
  }
};

export const write_categories_to_json = async (data, fName) => {
  const fileDir = `./data/json/categories/categories_urls/`;
  createDirIfNotExists(fileDir);
  const fileName = `./data/json/categories/categories_urls/categories-${fName}.json`;

  try {
    await fs.writeFile(fileName, JSON.stringify(data, null, 2));
    console.log(`Wrote ${data.length} categories to JSON file: ${fileName}`);
  } catch (err) {
    console.error(err);
  }
};

//*******************************************************************************//
// ********  save companies urls for each category to json & excel file  ******** //
//*******************************************************************************//

export const write_cat_companiesUrls_to_excel = async (data, fName) => {
  const fileDir = `./data/excel/categories/companies_urls/`;
  createDirIfNotExists(fileDir);
  const fileName = `./data/excel/categories/companies_urls/category-${fName}.xlsx`;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(
    `Categories Data-${new Date().toISOString().slice(0, 10)}`
  );

  sheet.columns = [
    { header: "ID", key: "ID", name: "ID" },
    { header: "pagesCount", key: "pagesCount", name: "pagesCount" },
    { header: "categoryName", key: "categoryName", name: "categoryName" },
    { header: "pageUrl", key: "pageUrl", name: "pageUrl" },
    { header: "pageId", key: "pageId", name: "pageId" },
    { header: "companiesUrls", key: "companiesUrls", name: "companiesUrls" },
  ];

  sheet.addRows(data);
  try {
    await workbook.xlsx.writeFile(fileName);
    console.log(
      `Added ${workbook.worksheets.length} rows to Excel file: ${fileName}`
    );
  } catch (err) {
    console.log(err);
  }
};

export const write_cat_companiesUrls_to_json = async (data, fName) => {
  const fileDir = `./data/json/categories/companies_urls/`;
  createDirIfNotExists(fileDir);
  const fileName = `./data/json/categories/companies_urls/category-${fName}.json`;

  try {
    await fs.writeFile(fileName, JSON.stringify(data, null, 2));
    console.log(`Wrote ${data.length} categories to JSON file: ${fileName}`);
  } catch (err) {
    console.error(err);
  }
};

export { createDirIfNotExists, generateFileName };
