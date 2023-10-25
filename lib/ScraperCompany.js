import {
  getRandomId,
  downloadImageFromURL,
  write_companies_to_excel,
  write_companies_to_json,
  generateFileName,
} from "../utils/data_dumper.js";
import {
  browserOptions,
  pageOptions,
  randomReferrer,
  randomUserAgent,
} from "../utils/options.js";
import { saveCompanies } from "../utils/request_utils.js";
import { closeBrowser, launchBrowser } from "../utils/browser_manager.js";
import { sleep } from "../utils/sleep.js";

const scrapeCompany = async (page) => {
  await page.waitForSelector("div.logo-div img.lazyloaded");
  await page.click("div.action-btns-div div:nth-child(1)");
  await page.waitForTimeout(5000);

  const result = await page.evaluate(() => {
    let companyName =
      document.querySelector("div.company-name > h1.companyName")?.innerText ||
      "NOT FOUND";

    companyAddress =
      document.querySelector("div.company-address > span")?.innerText ||
      "NOT FOUND";

    let companyLogo =
      document
        .querySelector("div.logo-div img.lazyloaded")
        ?.getAttribute("src") || "NOT FOUND";

    let companyPhoneNumbers =
      [...document.querySelectorAll("div.popover-phones > a")]
        ?.map((phone) => phone.innerText)
        .join(",  ") || "NOT FOUND";

    let companyWebsite =
      document.querySelector("a.website")?.getAttribute("href") || "NOT FOUND";

    let companyWhatsapp =
      document
        .querySelector("div.whatsapp-div > a.whatsapp")
        ?.getAttribute("href") || "NOT FOUND";

    let companyDetails = document.querySelectorAll(
      ".center-col div.inner div.header-div:nth-child(-n + 5)"
    );

    let companyAbout;
    let companyDescription;
    let companyCategory;
    let companyKeywords;
    companyDetails.forEach((selector) => {
      const firstChild = selector.children[0];

      if (firstChild && firstChild?.textContent === "نبذة عنا") {
        const dataDiv = selector?.querySelector(".data");
        companyAbout = dataDiv?.innerText || "NOT FOUND";
      }
      if (firstChild && firstChild?.innerText === "وصف الشركة") {
        const dataDiv = selector?.querySelector("div.data");
        companyDescription = dataDiv?.innerText || "NOT FOUND";
      }
      if (firstChild && firstChild?.innerText.includes("التصنيفات")) {
        companyCategory =
          [...selector?.querySelectorAll("div.data a")]
            .map((a) => a.innerText)
            .filter((text) => text !== "")
            .join(",  ") || "NOT FOUND";
      }
      if (firstChild && firstChild?.innerText.includes("كلمات البحث")) {
        companyKeywords =
          [...selector?.querySelectorAll("div.data a")]
            .map((a) => a.innerText)
            .filter((text) => text !== "")
            .join(",  ") || "NOT FOUND";
      }
    });

    companyAbout ??= "NOT FOUND";
    companyDescription ??= "NOT FOUND";
    companyCategory ??= "NOT FOUND";
    companyKeywords ??= "NOT FOUND";
    // Object.keys(result).forEach(key => result[key] ??= "NOT FOUND");

    let companyBranches =
      [...document.querySelectorAll(".branches-data a")]
        ?.map((branch) => branch.innerText)
        .join("\n") || "NOT FOUND";

    let socialLinks = [...document.querySelectorAll(".social-links-div a")];
    let companySocialLinks = socialLinks.map((socialLink) => ({
      [socialLink.getAttribute("class")]: socialLink.getAttribute("href"),
    }));

    if (companySocialLinks === undefined || companySocialLinks.length === 0) {
      companySocialLinks = "NOT FOUND";
    }
    let companyDays =
      [
        ...document.querySelectorAll(
          ".working-hours-div .days-hours .days-div p"
        ),
      ]?.map((day) => day.innerText) || "NOT FOUND";

    let companyHours =
      [
        ...document.querySelectorAll(".working-hours-div .days-hours .hours p"),
      ]?.map((hour) => hour.innerText) || "NOT FOUND";

    let companyWorkingHours = [...companyDays].map((elementA, i) => ({
      day: elementA,
      hours: companyHours[i],
    }));

    if (companyWorkingHours === undefined || companyWorkingHours.length === 0) {
      companyWorkingHours = "NOT FOUND";
    }

    // TODO: scrap these data in the future
    // let companyBrands = document.querySelector("div.inner div:nth-child(5) div.data").innerText;

    // let companyGoogleMapsLat = document
    //   .querySelector("div.call-directions-div a:nth-child(2)")
    //   .getAttribute("href");

    // // let companyGoogleMapsLng = document
    // //   .querySelector("span.distance")
    // //   .getAttribute("data-lng");

    return {
      companyName,
      companyAddress,
      companyLogo,
      companyPhoneNumbers,
      companyWebsite,
      companyWhatsapp,
      companyAbout,
      companyDescription,
      companyCategory,
      companyKeywords,
      companyBranches,
      companyWorkingHours,
      companySocialLinks,
      // companyBrands,
      // companyGoogleMapsLat,
      // companyGoogleMapsLng,
    };
  });
  return result;
};

export const ScraperCompany = async (companiesUrls) => {
  const page = await launchBrowser();
  await page.setUserAgent(randomUserAgent);
  const scrapedCompanies = [];
  const fileName = generateFileName();
  try {
    for (const companyUrl of companiesUrls) {
      await page.setExtraHTTPHeaders({ referer: randomReferrer });
      await page.goto(`https:${companyUrl}`, pageOptions);
      const result = await scrapeCompany(page);
      result["companyId"] = getRandomId();
      const imageName = result["companyId"] + ".png";

      const c_logo = result["companyLogo"];
      if (
        c_logo ===
          "//cdn.yellowpages.com.eg/static/v2022/img/closed-logo.png?20" &&
        c_logo !== "NOT FOUND"
      ) {
        result.companyLogo = "default";
        console.log(
          `%cDefault company logo for %s 🎉`,
          "color: green",
          result.companyName
        );
      } else if (
        c_logo !== "NOT FOUND" &&
        c_logo !==
          "//cdn.yellowpages.com.eg/static/v2022/img/closed-logo.png?20"
      ) {
        downloadImageFromURL(c_logo, imageName)
          .then(() => {
            console.log(
              "%cImage downloaded successfully for %s ⏬🔻",
              "color: blue",
              result.companyName.rtl
            );
          })
          .catch((err) => {
            console.error({ "error downloading image": err.message });
          });
      }
      // save results to database, excel and json files.
      await saveCompanies(result);
      scrapedCompanies.push(result);

      const dataWithId = scrapedCompanies.map((company, index) => ({
        ID: index + 1,
        ...company,
      }));
      await write_companies_to_excel(dataWithId, fileName);
      await write_companies_to_json(dataWithId, fileName);
      await sleep();
      // return dataWithId;
    }
    await closeBrowser();
  } catch (err) {
    console.log({ error: err.message });
  }
};

// const companiesUrls = [
//   "//yellowpages.com.eg/ar/profile/كولينج-لانظمة-التكييف/312561",
//   "//yellowpages.com.eg/ar/profile/الوطنية-للتكييف-المركزى-وغرف-التبريد/601837",
//   "//yellowpages.com.eg/ar/profile/إيه-سى-بلس-للتكييف/688476",
// ];
// const runTest = async () => {
//   try {
//     await ScraperCompany(companiesUrls);
//   } catch (err) {
//     console.log({ error: err.message });
//   }
// };

// runTest();
