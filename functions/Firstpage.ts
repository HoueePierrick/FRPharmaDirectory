// const puppeteer = require("puppeteer");
import puppeteer from "puppeteer";

import fs from "fs";

// Function to tell is a page has results
const pageHasResults = async (i: number) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    `https://www.ordre.pharmacien.fr/annuaire/etablissement?zipcode=92100&page=${i}`,
    { waitUntil: "networkidle2" }
  );
  const hasResult: boolean = (await page.evaluate(() => {
    return document.querySelector(".no-result");
  }))
    ? false
    : true;
  await browser.close();
  return hasResult;
};

// Scrap the list of pharmacies available on a page
const pagePharmas = async (i: number) => {
  interface pageList {
    sid: string | null | undefined;
    category: string | null | undefined;
    name: string | null | undefined;
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    `https://www.ordre.pharmacien.fr/annuaire/etablissement?zipcode=92100&page=${i}`,
    { waitUntil: "networkidle2" }
  );
  const pageList: pageList[] = await page.evaluate(() => {
    const ul = [
      ...document.querySelectorAll("#slider4 > ul > li"),
    ] as HTMLElement[];
    return ul.map((el) => {
      const sid =
        el.querySelector("div > h2 > a") &&
        el.querySelector("div > h2 > a")?.getAttribute("href") &&
        el
          .querySelector("div > h2 > a")
          ?.getAttribute("href")
          ?.split("sid=")[1];
      const category =
        el.getAttribute("class") && el.getAttribute("class")?.split("-")[1];
      const pharmacyNameBlock: HTMLElement | null = el.querySelector("h2 a");
      const name = pharmacyNameBlock && pharmacyNameBlock?.innerText;
      return {
        sid,
        category,
        name,
      };
    });
  });
  await browser.close();
  return pageList;
};

// Get list of pharmacies on a city (multiple pages)
const getCityPharmas = async () => {
  interface pageList {
    sid: string | null | undefined;
    category: string | null | undefined;
    name: string | null | undefined;
  }
  let result: pageList[] = [];
  for (let i = 0; i < 100; i++) {
    console.log(`Scrapping page n°${i}`);
    const test = await pageHasResults(i);
    if (test) {
      const pageContent = await pagePharmas(i);
      for (let j = 0; j < pageContent.length; j++) {
        result.push(pageContent[j]);
      }
    } else {
      return result;
    }
  }
};

let scrapped = await getCityPharmas();
console.log(scrapped);

export default scrapped;
