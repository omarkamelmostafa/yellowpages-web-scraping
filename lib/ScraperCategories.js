import {
  getRandomId,
  generateFileName,
  write_categories_to_excel,
  write_categories_to_json,
} from "../utils/data_dumper.js";

import {
  browserOptions,
  pageOptions,
  randomReferrer,
  randomUserAgent,
} from "../utils/options.js";
import { saveCategories } from "../utils/request_utils.js";
import { launchBrowser, closeBrowser } from "../utils/browser_manager.js";
import { sleep } from "../utils/sleep.js";

const scrapePage = async (page) => {
  await page.waitForTimeout(1000);
  const result = await page.evaluate(() => {
    let numPagesToScrape =
      document
        .querySelector(".pagination > li:nth-last-child(1) a")
        ?.getAttribute("href") || 7;

    let pageCategoriesNames =
      [...document.querySelectorAll("span.well a:nth-child(1)")]?.map((cat) => {
        var cat_href = cat.getAttribute("href")?.split("/");
        var decoded_cat_name = decodeURIComponent(
          cat_href[cat_href.length - 1]
        );
        return decoded_cat_name;
      }) || "NOT FOUND";

    let pageCategoriesHref =
      [...document.querySelectorAll("span.well a:nth-child(1)")]?.map((cat) => {
        const cat_href_parts = cat.getAttribute("href")?.split("/");

        const decoded_cat_name = decodeURIComponent(
          cat_href_parts[cat_href_parts.length - 1]
        );
        cat_href_parts.pop();
        cat_href_parts.push(decoded_cat_name);

        const categoryHref = `https://yellowpages.com.eg${[
          ...cat_href_parts,
        ].join("/")}`;
        return categoryHref;
      }) || "NOT FOUND";

    let pageCategories = [...pageCategoriesNames].map((elementA, i) => ({
      name: elementA,
      href: pageCategoriesHref[i],
    }));

    return {
      pageCategories,
      numPagesToScrape,
    };
  });

  return result;
};

export const ScraperCategories = async () => {
  try {
    const page = await launchBrowser();
    await page.setUserAgent(randomUserAgent);
    const scrapedCategories = [];
    let currentPageIndex = 1;
    let pagesCount = 7;
    const fileName = generateFileName();

    while (currentPageIndex <= pagesCount) {
      const pageUrl = `https://yellowpages.com.eg/ar/related-categories/p${currentPageIndex}`;
      await page.setExtraHTTPHeaders({ referer: randomReferrer });
      await page.goto(pageUrl, pageOptions);
      const result = await scrapePage(page);

      const parts_href = result["numPagesToScrape"].toString();
      const parts_href_splitted = parts_href.split("/p");
      pagesCount = parts_href_splitted[parts_href_splitted.length - 1];

      result.pageId = getRandomId();
      result.pageUrl = pageUrl;
      result.pagesCount = pagesCount;
      delete result.numPagesToScrape;

      // save results to database, excel and json files.
      await saveCategories(result);

      result.numPagesToScrape = pagesCount;
      scrapedCategories.push(result);
      const dataWithId = scrapedCategories.map((category, index) => ({
        ID: index + 1,
        ...category,
      }));

      await write_categories_to_excel(dataWithId, fileName);
      await write_categories_to_json(dataWithId, fileName);
      await sleep();

      if (currentPageIndex < pagesCount) {
        currentPageIndex++;
      } else break;
    }

    // return dataWithId;
    await closeBrowser();
  } catch (err) {
    console.log({ error: err.message });
  }
};

// const runTest = async () => {
//   try {
//     const data = await ScraperCategories();
//   } catch (err) {
//     console.log({ error: err.message });
//   }
// };

// runTest();
