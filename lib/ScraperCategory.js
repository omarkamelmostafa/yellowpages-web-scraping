import {
  getRandomId,
  generateFileName,
  write_cat_companiesUrls_to_json,
  write_cat_companiesUrls_to_excel,
} from "../utils/data_dumper.js";
import fs, { readFileSync, close, readSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  pageOptions,
  randomReferrer,
  randomUserAgent,
} from "../utils/options.js";
import { getCategories, saveCompaniesUrls } from "../utils/request_utils.js";
import { closeBrowser, launchBrowser } from "../utils/browser_manager.js";
import { sleep } from "../utils/sleep.js";

const scrapeCategory = async (page) => {
  await page.waitForTimeout(1000);

  const result = await page.evaluate(() => {
    let numPagesToScrape =
      document
        .querySelector(".pagination > li:nth-last-child(1) a")
        ?.getAttribute("href") || 1;

    let companiesUrls =
      [...document.querySelectorAll(".item-details .item-title")]?.map(
        (company) => {
          const unDecodedHref = company.getAttribute("href");
          const decodedHref = decodeURIComponent(unDecodedHref);
          const [url, queryParameters] = decodedHref.split("?");
          const updatedUrl = url.replace(queryParameters, "");
          return updatedUrl;
        }
      ) || "NOT FOUND";

    return {
      companiesUrls,
      numPagesToScrape,
    };
  });

  return result;
};

export const ScraperCategory = async (categoriesUrls) => {
  const page = await launchBrowser();
  await page.setUserAgent(randomUserAgent);
  const scrapedUrls = [];
  for (const categoryUrl of categoriesUrls) {
    try {
      let currentPageIndex = 1;
      let pagesCount = 1;
      let fileName = generateFileName();

      let pattern = "https://yellowpages.com.eg/ar/category/";
      let categoryName = categoryUrl.replace(pattern, "");

      while (currentPageIndex <= pagesCount) {
        const pageUrl = `${categoryUrl}/p${currentPageIndex}`;
        await page.setExtraHTTPHeaders({ referer: randomReferrer });
        await page.goto(pageUrl, pageOptions);
        const result = await scrapeCategory(page);

        const parts_href = result["numPagesToScrape"].toString();
        const parts_href_splitted = parts_href.split("/p");
        pagesCount = parts_href_splitted[parts_href_splitted.length - 1];

        result.pageId = getRandomId();
        result.pageUrl = pageUrl;
        result.categoryName = categoryName;
        result.pagesCount = pagesCount;
        delete result.numPagesToScrape;
        // save results to database, excel and json files.

        await saveCompaniesUrls(result);

        result.numPagesToScrape = pagesCount;
        scrapedUrls.push(result);
        const dataWithId = scrapedUrls
          .filter((x) => x.categoryName === categoryName)
          .map((urls, index) => ({
            ID: index + 1,
            ...urls,
          }));

        await write_cat_companiesUrls_to_excel(
          dataWithId,
          `${result.categoryName}_${fileName}`
        );

        await write_cat_companiesUrls_to_json(
          dataWithId,
          `${result.categoryName}_${fileName}`
        );
        await sleep();

        if (currentPageIndex < pagesCount) {
          currentPageIndex++;
        } else {
          break;
        }
      }
    } catch (err) {
      console.log({ error: err.message });
    }
  }
  // await browser.close();
  await closeBrowser();
  // return dataWithId;
};

// get categories urls from a json file
// const categories_urls = await getCategories();
// // console.log(categories_urls.slice(0, 1));

// await ScraperCategory(categories_urls.slice(0, 1));
// export default ScraperCategory;

// const getCategoryHref = (fileName) => {
//   const fd = fs.openSync(fileName, "r");
//   const fileData = fs.readFileSync(fileName, "utf8");
//   const parsedFileData = JSON.parse(fileData);

//   // let outputData = [];
//   // parsedFileData.forEach((ele) => {
//   //   ele?.pageCategories?.forEach((category) => outputData.push(category?.href));
//   // });

//   const urls = parsedFileData.reduce(
//     (acc, item) =>
//       acc.concat(item.pageCategories.map((category) => category.href)),
//     []
//   );

//   // fs.closeSync(parseInt(fd));
//   // fs.close(fileData);

//   return urls;
// };

// const runTest = async () => {
//   try {
//     const __filename = fileURLToPath(import.meta.url);
//     const __dirname = path.dirname(__filename);
//     let categoriesFilePath = path.resolve(
//       __dirname,
//       "../data/json/categories/categories-2023-10-11_T_9-38-23.json"
//     );

//     // const categoriesUrls = getCategoryHref(categoriesFilePath);
//     // await getCategories();
//     // const categoriesUrls = getCategoryHref(categoriesFilePath);
//     // console.log(categoriesUrls);

//     // const data = await ScraperCategory(categoriesUrls.slice(0, 2));
//     // await ScraperCategory(categoriesUrls.slice(0, 2));
//     // await write_cat_companiesUrls_to_json(data);
//     // await write_cat_companiesUrls_to_excel(data);
//   } catch (err) {
//     console.log({ error: err.message });
//   }
// };

// runTest();
