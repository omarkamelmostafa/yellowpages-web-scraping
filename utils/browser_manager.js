import puppeteer from "puppeteer";
import { browserOptions } from "./options.js";
import randUserAgent from "rand-user-agent";

let browser;
export const launchBrowser = async () => {
  browser = await puppeteer.launch(browserOptions);
  const page = await browser.newPage();
  const userAgent = randUserAgent("desktop");
  await page.setUserAgent(userAgent);
  return page;
};

export const closeBrowser = async () => {
  await browser.close();
};
