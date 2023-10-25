import puppeteer from "puppeteer";
import ProxyList from "proxy-sources";
import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import fs from "fs";

const proxyRotator = async () => {
  const pl = await ProxyList();
  const proxyList = pl.list;
  fs.writeFileSync("proxy_servers.txt", proxyList.join("\n"), "utf-8");

  const proxyServers = fs
    .readFileSync("proxy_servers.txt", "utf-8")
    .split("\n");

  // Return all proxy servers.
  return proxyServers;
};

const checkProxyServer = async (proxy) => {
  const url = "https://www.google.com";

  // Create a new HttpsProxyAgent instance with the proxy server information.
  const proxyAgent = new HttpsProxyAgent(`https://${proxy}`);

  const axiosWithProxy = axios.create({
    baseURL: url,
    timeout: 30000,
    headers: {
      Authorization: `Basic ####`,
    },
    httpsAgent: proxyAgent,
  });

  // Try to make a request to the website using the axiosWithProxy instance.
  try {
    const response = await axiosWithProxy.get(url);

    // If the response status code is 200, then the proxy is working.
    if (response.status === 200) {
      console.log(`Proxy ${proxy} is working!`);
    }
  } catch (error) {
    // If the request fails, then the proxy is not working.
    console.log(`Proxy ${proxy} is not working.`);
  }
};

const runTest = async () => {
  const proxies = await proxyRotator();

  // Check each proxy server.
  for (const proxy of proxies) {
    await checkProxyServer(proxy);
  }
};

runTest();
