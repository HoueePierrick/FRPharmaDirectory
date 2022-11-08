const pupeteer = require("pupeteer");

const fs = require("fs");

// Get list of pharmacies on a page (left)
const getList = async () => {
  const browser = await pupeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://www.ordre.pharmacien.fr/annuaire/etablissement?zipcode=92100&page=1",
    { waitUntill: "networkidle2" }
  );
  return document.querySelectorAll(".picto-pharmacies");
};

console.log(getList());
