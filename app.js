import { ScraperCategories } from "./lib/ScraperCategories.js";
import { ScraperCategory } from "./lib/ScraperCategory.js";
import { ScraperCompany } from "./lib/ScraperCompany.js";
import { getCategories, getCompaniesUrls } from "./utils/request_utils.js";

const main = async () => {
  try {
    // ******************** Scrape URL and name for each category ******************** //
    // Scrape the URL and name of each category from the website. This will give us a list of categories to scrape companies from.
    await ScraperCategories();
    // ******** Scrape companies URLs for each category ******** //
    // For each category, scrape the URLs of all the companies in that category. This will give us a list of company URLs to scrape company details from.
    // const categories_urls = await getCategories();
    // await ScraperCategory(categories_urls.slice(0, 1));
    //  ********** Scrape all details of each company for each category *********** //
    // For each company URL, scrape all the details of the company, such as company name, address, phone number, website, and email address.
    // const companies_urls = await getCompaniesUrls();
    // await ScraperCompany(companies_urls.slice(6, 8));
  } catch (err) {
    console.log({ "error message": err.message });
  }
};

main();

// net start MongoDB
// net STOP MongoDB
// net status MongoDB
