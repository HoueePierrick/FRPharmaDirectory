import { pageList } from "./PharmaCity";
import puppeteer from "puppeteer";
import { saveToFile } from "./AllPharmas";

import data from "../generated-data/92100.json" assert { type: "json" };

// As an example
const reine = {
  sid: "96562",
  category: "pharmacies",
  name: "PHARMACIE REINE",
  pagenum: 1,
  postalCode: "92100",
};

// Interfaces documenting the expected result
interface pharmacists {
  fullName: string;
  role: string;
  inscriptionDate: string;
  section: string;
}

interface result {
  legalName: string;
  codeCity: string;
  city: string;
  address: string;
  phone: string;
  fax: string;
  pharmacists: pharmacists[];
}

// Function to get pharmacy details
const getPharmacyDetails = async (input: pageList) => {
  const { sid, category, name, pagenum, postalCode } = input;
  let searchURL: string;
  if (typeof sid === "string") {
    searchURL = `https://www.ordre.pharmacien.fr/annuaire/etablissement?zipcode=${postalCode}&page=${pagenum}&sid=${sid}`;
  } else {
    searchURL = `https://www.ordre.pharmacien.fr/annuaire/etablissement?zipcode=${postalCode}&page=${pagenum}`;
  }
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(searchURL, { waitUntil: "networkidle2" });
  console.log(`Scrapping pharmacy ${name}`);
  const result = await page.evaluate(() => {
    // Getting all relevant elements to be scrapped
    const focus = document.querySelector(
      ".toggle-block > li > div"
    ) as HTMLElement;
    const allElems = [
      ...focus.querySelectorAll(
        // .toggle-block > ul > li >
        ".inlineBlock > p"
      ),
    ] as HTMLElement[];
    const keyData = allElems.map((el) => {
      return el.innerText.trim().split("\n");
    });
    let legalName: string = "";
    let codeCity: string = "";
    let city: string = "";
    let address: string = "";
    let phone: string = "";
    let fax: string = "";
    let pharmacistArray: pharmacists[] = [];
    for (let i = 0; i < keyData.length; i++) {
      if (keyData[i].length === 3) {
        legalName = keyData[i][0].split(" : ")[1];
        address = keyData[i][1].split(" : ")[1];
      } else if (keyData[i][0].substring(0, 19) === "Code postal - ville") {
        const cityData = keyData[i][0].split(" : ")[1];
        codeCity = cityData.split(" ")[0];
        city = cityData.substring(codeCity.length + 1, cityData.length);
      } else if (keyData[i][0].substring(0, 9) === "Téléphone") {
        phone = keyData[i][0].split(" : ")[1];
      } else if (keyData[i][0].substring(0, 9) === "Télécopie") {
        fax = keyData[i][0].split(" : ")[1];
      } else if (
        keyData[i].length === 4 &&
        keyData[i][0].toUpperCase() === keyData[i][0]
      ) {
        const fullName = keyData[i][0];
        const role = keyData[i][1];
        const inscriptionDate = keyData[i][2].split(" : ")[1];
        const section = keyData[i][3].split(" : ")[1];
        pharmacistArray.push({ fullName, role, inscriptionDate, section });
      }
    }
    return {
      legalName,
      codeCity,
      city,
      address,
      phone,
      fax,
      pharmacists: pharmacistArray,
    };
  });
  await browser.close();
  return result;
};

const displayed = await getPharmacyDetails(reine);
console.log(displayed);

// TO DO (probably)
// Trim
// Split, for certain, by ":" and re-trim
// For others test
// First one split also by >

// For help
// console.log("Raison sociale".length); => 14
// console.log("Adresse".length); => 7
// console.log("Code postal - ville".length); => 19
// console.log("Téléphone".length); => 9
// console.log("Télécopie".length); => 9

// TO TEST
// console.log("Date d'inscription à cette activité")
// console.log("Section d'inscription")

// .substring(0, X)
// .trim()

// Key data is that:

[
  [
    "Raison sociale : PHARMACIE REINE",
    "Adresse : 126 RTE DE LA REINE",
    "> Plan d'accès",
  ],
  ["Code postal - ville : 92100 BOULOGNE-BILLANCOURT"],
  ["Téléphone : 0146040062"],
  ["Télécopie : 0146054933"],
  [
    "RUDY COHEN",
    "PHARMACIEN TITULAIRE D'OFFICINE",
    "Date d'inscription à cette activité : 07/02/2019",
    "Section d'inscription : A",
  ],
  [
    "THOMAS JAILLETTE",
    "PHARMACIEN ADJOINT D'OFFICINE",
    "Date d'inscription à cette activité : 08/01/2020",
    "Section d'inscription : D",
  ],
  [
    "JONATHAN SADOUN",
    "PHARMACIEN ADJOINT D'OFFICINE",
    "Date d'inscription à cette activité : 07/02/2019",
    "Section d'inscription : D",
  ],
  [
    "DÉBORAH WAJNSZTOK-ROSIER",
    "PHARMACIEN ADJOINT D'OFFICINE",
    "Date d'inscription à cette activité : 26/02/2019",
    "Section d'inscription : D",
  ],
];

// Checking if string is at case
// const letter = 'A';

// if (letter.toUpperCase() === letter) {
//   console.log('✅ letter is uppercase');
// } else {
//   console.log('⛔️ letter is lowercase');
// }
