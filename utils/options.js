import randUserAgent from "rand-user-agent";

const referrers = [
  "https://www.google.com",
  "https://www.facebook.com",
  "https://www.instagram.com",
  "https://www.youtube.com",
  "https://www.amazon.com",
  "https://www.wikipedia.org",
  "https://www.yahoo.com",
  "https://www.twitter.com",
  "https://www.microsoft.com",
  "https://www.apple.com",
  "https://www.netflix.com",
  "https://www.amazon.com",
  "https://www.cnn.com",
  "https://www.bbc.com",
  "https://www.espn.com",
  "https://www.reddit.com",
  "https://www.twitch.tv",
  "https://www.paypal.com",
  "https://www.ebay.com",
  "https://www.etsy.com",
  "https://www.amazon.in",
  "https://www.amazon.co.jp",
  "https://www.amazon.de",
  "https://www.amazon.ca",
  "https://www.amazon.com.au",
  "https://www.espncricinfo.com",
  "https://www.theguardian.com",
  "https://www.washingtonpost.com",
  "https://www.nytimes.com",
  "https://www.bbc.co.uk",
  "https://www.theguardian.com",
  "https://www.reddit.com",
  "https://www.amazon.fr",
  "https://www.amazon.es",
  "https://www.amazon.it",
  "https://www.amazon.mx",
  "https://www.amazon.nl",
  "https://www.amazon.pl",
  "https://www.amazon.se",
  "https://www.amazon.sg",
  "https://www.amazon.com.tr",
  "https://www.amazon.ae",
  "https://www.amazon.sa",
];

export const randomReferrer =
  referrers[Math.floor(Math.random() * referrers.length)];

export const randomUserAgent = randUserAgent("desktop");
export const pageOptions = {
  // waitUntil: "networkidle0",
  waitUntil: "load",
  networkIdleTimeout: 5000,
  timeout: 600000,
};
export const browserOptions = {
  headless: false,
  defaultViewport: false,
  userDataDir: "./tmp",
  // slowMo: 100,
};
