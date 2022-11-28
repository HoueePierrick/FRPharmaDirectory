// const puppeteer = require("puppeteer");
import puppeteer from "puppeteer";

// Function to tell is a page has results
const pageHasResults = async (i: number, postalCode: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const status = await page.goto(
    `https://www.ordre.pharmacien.fr/annuaire/etablissement?zipcode=${postalCode}&page=${
      i + 1
    }`,
    { waitUntil: "networkidle2", timeout: 0 }
  );

  // Checking if there is a server answer (no if status 404)
  let pageExist = true;
  const statusCode = await status?.status();
  if (statusCode === 404) {
    pageExist = false;
  }

  // Checking if there are results (i.e. we can find a class "no-result")
  const hasResult: boolean = (await page.evaluate(() => {
    return document.querySelector(".no-result");
  }))
    ? false
    : true;
  await browser.close();

  // Returning result
  if (pageExist) {
    return hasResult;
  } else {
    return false;
  }
};

export interface pageList {
  sid: string | null | undefined;
  category: string | null | undefined;
  name: string | null | undefined;
  pagenum: number;
  postalCode: string;
}

// Scrap the list of pharmacies available on a page
const pagePharmas = async (z: number, postalCode: string) => {
  const pagenum: number = z + 1;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const status = await page.goto(
    `https://www.ordre.pharmacien.fr/annuaire/etablissement?zipcode=${postalCode}&page=${pagenum}`,
    { waitUntil: "networkidle2", timeout: 0 }
  );

  // Checking if there is a server answer (no if status 404)
  let pageExist = true;
  const statusCode = await status?.status();
  if (statusCode === 404) {
    pageExist = false;
  }

  // Scrapping page content
  const pageList: pageList[] = await page.evaluate(
    (pagenum, postalCode) => {
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
          pagenum,
          postalCode,
        };
      });
    },
    pagenum,
    postalCode
  );
  // console.log(pageList);
  await browser.close();

  // Returning result based on request status
  if (pageExist) {
    return pageList;
  } else {
    return [];
  }
};

// Get list of pharmacies on a city (multiple pages)
const getCityPharmas = async (postalCode: string) => {
  let result: pageList[] = [];
  let pageContent: pageList[] = [];
  for (let i = 0; i < 100; i++) {
    console.log(`Scrapping page n°${i + 1}`);
    const test = await pageHasResults(i, postalCode);
    if (test) {
      pageContent = await pagePharmas(i, postalCode);
      for (let j = 0; j < pageContent.length; j++) {
        result.push(pageContent[j]);
      }
    } else {
      return result;
    }
  }
};

// let scrapped = await getCityPharmas();
// console.log(scrapped);
// let result = await getCityPharmas("01004");
// console.log(result);

export default getCityPharmas;
