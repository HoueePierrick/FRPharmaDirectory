import { pageList } from "./Interfaces";
// import puppeteer from "puppeteer";
import saveToFile from "./SaveToFile.js";
import request from "request-promise";
import cheerio from "cheerio";
import sleep from "./Sleep.js";
import { pharmacists, result } from "./Interfaces";

// import { readFile } from "fs/promises";
// const data = JSON.parse(
//   await readFile(new URL("../generated-data/allPharmas.json", import.meta.url))
// );
import data from "../generated-data/allPharmasData.js";
// import data from "../generated-data/allPharmas.json";

// As an example
// const reine = {
//   sid: "96562",
//   category: "pharmacies",
//   name: "PHARMACIE REINE",
//   pagenum: 1,
//   postalCode: "92100",
// };

// Second example
// const LAM = {
//   sid: "102861",
//   category: "pharmacies",
//   name: "PHARMACIE L.A.M.",
//   pagenum: 5,
//   postalCode: "92100",
// };

// Interfaces documenting the expected result
// interface pharmacists {
//   fullName: string;
//   role: string;
//   inscriptionDate: string;
//   section: string;
// }

// interface result {
//   sid: string | null | undefined;
//   name: string | null | undefined;
//   legalName: string;
//   tradeName: string;
//   codeCity: string;
//   city: string;
//   category: string | null | undefined;
//   address: string;
//   phone: string;
//   fax: string;
//   pharmacists: pharmacists[];
// }

const finalResult: result[] = [];

// Function to get pharmacy details
// const getPharmacyDetails = async (input: pageList) => {
//   const { sid, category, name, pagenum, postalCode } = input;
//   let searchURL: string;
//   if (typeof sid === "string") {
//     searchURL = `https://www.ordre.pharmacien.fr/annuaire/etablissement?zipcode=${postalCode}&page=${pagenum}&sid=${sid}`;
//   } else {
//     searchURL = `https://www.ordre.pharmacien.fr/annuaire/etablissement?zipcode=${postalCode}&page=${pagenum}`;
//   }
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto(searchURL, { waitUntil: "networkidle2", timeout: 0 });
//   console.log(`Scrapping pharmacy ${name}`);
//   const result = await page.evaluate(() => {
//     // Getting all relevant elements to be scrapped
//     let focus = document.querySelector(
//       // .toggle-block > li > div
//       ".toggle-block > li"
//     ) as HTMLElement;
//     let allElems = [
//       ...focus.querySelectorAll(".inlineBlock > p"),
//     ] as HTMLElement[];
//     const keyData = allElems.map((el) => {
//       return el.innerText.trim().split("\n");
//     });
//     let legalName: string = "";
//     let codeCity: string = "";
//     let city: string = "";
//     let address: string = "";
//     let phone: string = "";
//     let fax: string = "";
//     let pharmacistArray: pharmacists[] = [];
//     for (let i = 0; i < keyData.length; i++) {
//       if (keyData[i].length === 3) {
//         legalName = keyData[i][0].split(" : ")[1];
//         address = keyData[i][1].split(" : ")[1];
//       } else if (keyData[i][0].substring(0, 19) === "Code postal - ville") {
//         const cityData = keyData[i][0].split(" : ")[1];
//         codeCity = cityData.split(" ")[0];
//         city = cityData.substring(codeCity.length + 1, cityData.length);
//       } else if (keyData[i][0].substring(0, 9) === "Téléphone") {
//         phone = keyData[i][0].split(" : ")[1];
//       } else if (keyData[i][0].substring(0, 9) === "Télécopie") {
//         fax = keyData[i][0].split(" : ")[1];
//       } else if (
//         keyData[i].length === 4 &&
//         keyData[i][0].toUpperCase() === keyData[i][0]
//       ) {
//         const fullName = keyData[i][0];
//         const role = keyData[i][1];
//         const inscriptionDate = keyData[i][2].split(" : ")[1];
//         const section = keyData[i][3].split(" : ")[1];
//         pharmacistArray.push({ fullName, role, inscriptionDate, section });
//       }
//     }
//     return {
//       legalName,
//       codeCity,
//       city,
//       address,
//       phone,
//       fax,
//       pharmacists: pharmacistArray,
//     };
//   });
//   await browser.close();
//   return result;
// };

// Function to get pharmacy details
const getPharmacyDetails = async (input: pageList) => {
  const { sid, category, name, pagenum, postalCode } = input;
  let searchURL: string;
  if (typeof sid === "string") {
    searchURL = `https://www.ordre.pharmacien.fr/annuaire/etablissement?zipcode=${postalCode}&page=${pagenum}&sid=${sid}`;
  } else {
    searchURL = `https://www.ordre.pharmacien.fr/annuaire/etablissement?zipcode=${postalCode}&page=${pagenum}`;
  }
  try {
    const query = await request.get(searchURL);
    const htmlResult = query && query;
    const $ = await cheerio.load(htmlResult);
    console.log(`Scrapping pharmacy ${name}`);

    // Getting all relevant elements to be scrapped
    let focus = $(".toggle-block > li");
    // let allElems = $(".inlineBlock > p");
    // const keyData = allElems.map((i, e) => {
    //   return $(e).text().trim().split("\n");
    // });

    // $(".hidden-xs").remove();
    // let allElems = $(".inlineBlock > p");
    // const keyData: any = allElems.map((i, e) => {
    //   return $(e)
    //     .text()
    //     .replace(/ +(?= )/g, "")
    //     .trim()
    //     .split("\n");
    // });
    // let cleanData: any[] = [];
    // for (let i = 0; i < keyData.length; i++) {
    //   let newPush: string[] = [];
    //   for (let j = 0; j < keyData[i].length; j++) {
    //     if (keyData[i][j].length > 1) {
    //       newPush.push(keyData[i][j].trim());
    //     }
    //   }
    //   cleanData.push(newPush);
    // }

    let legalName: string = "";
    let tradeName: string = "";
    let codeCity: string = "";
    let city: string = "";
    let address: string = "";
    let phone: string = "";
    let fax: string = "";
    let pharmacists: pharmacists[] = [];
    // for (let i = 0; i < keyData.length; i++) {
    //   if (keyData[i].length === 3) {
    //     legalName = keyData[i][0].split(" : ")[1];
    //     address = keyData[i][1].split(" : ")[1];
    //   } else if (keyData[i][0].substring(0, 19) === "Code postal - ville") {
    //     const cityData = keyData[i][0].split(" : ")[1];
    //     codeCity = cityData.split(" ")[0];
    //     city = cityData.substring(codeCity.length + 1, cityData.length);
    //   } else if (keyData[i][0].substring(0, 9) === "Téléphone") {
    //     phone = keyData[i][0].split(" : ")[1];
    //   } else if (keyData[i][0].substring(0, 9) === "Télécopie") {
    //     fax = keyData[i][0].split(" : ")[1];
    //   } else if (
    //     keyData[i].length === 4 &&
    //     keyData[i][0].toUpperCase() === keyData[i][0]
    //   ) {
    //     const fullName = keyData[i][0];
    //     const role = keyData[i][1];
    //     const inscriptionDate = keyData[i][2].split(" : ")[1];
    //     const section = keyData[i][3].split(" : ")[1];
    //     pharmacistArray.push({ fullName, role, inscriptionDate, section });
    //   }
    // }
    // for (let i = 0; i < keyData.length; i++) {}

    $(".hidden-xs").remove();
    let allElems = $(".inlineBlock > p");
    const keyData = allElems.map((i, e) => {
      return $(e)
        .text()
        .replace(/ +(?= )/g, "")
        .trim();
    });
    let cleanDataOne: string[][] = [];
    let cleanDataTwo: string[][] = [];
    for (let i = 0; i < keyData.length; i++) {
      let newPush: string[] = keyData[i].split("\n");
      cleanDataOne.push(newPush);
    }
    for (let i = 0; i < cleanDataOne.length; i++) {
      let newPush: string[] = [];
      for (let j = 0; j < cleanDataOne[i].length; j++) {
        if (cleanDataOne[i][j].length > 1) {
          newPush.push(cleanDataOne[i][j].trim());
        }
      }
      cleanDataTwo.push(newPush);
    }
    // console.log(cleanDataTwo);

    for (let i = 0; i < cleanDataTwo.length; i++) {
      if (cleanDataTwo[i][0] === "Raison sociale :") {
        legalName = cleanDataTwo[i][1];
        if (cleanDataTwo[i][2] === "Adresse :") {
          address = cleanDataTwo[i][3] + " " + cleanDataTwo[i][4];
        }
      }
      if (cleanDataTwo[i][0] === "Dén. commerciale :") {
        tradeName = cleanDataTwo[i][1];
        if (cleanDataTwo[i][2] === "Code postal - ville :") {
          codeCity = cleanDataTwo[i][3];
          city = cleanDataTwo[i][4];
        }
      }
      if (cleanDataTwo[i][0] === "Code postal - ville :") {
        codeCity = cleanDataTwo[i][1];
        city = cleanDataTwo[i][2];
      }
      if (cleanDataTwo[i][0] === "Téléphone :") {
        phone = cleanDataTwo[i][1];
      }
      if (cleanDataTwo[i][0] === "Télécopie :") {
        fax = cleanDataTwo[i][1];
      } else if (cleanDataTwo[i].length === 4) {
        let pharmacist = {
          fullName: cleanDataTwo[i][0],
          role: cleanDataTwo[i][1],
          inscriptionDate: cleanDataTwo[i][2].split(" : ")[1],
          section: cleanDataTwo[i][3].split(" : ")[1],
        };
        pharmacists.push(pharmacist);
      }
    }

    if (tradeName === "") {
      tradeName = legalName;
    }

    const result = {
      sid,
      name,
      legalName,
      tradeName,
      codeCity,
      city,
      category,
      address,
      phone,
      fax,
      pharmacists,
    };
    console.log(result);
    finalResult.push(result);
  } catch (error: any) {
    console.log(error.message);
  }
};

let testjson: result[] = [];

for (let i = 0; i < data.length; i++) {
  await sleep(277);
  console.log(`Scraping pharmacy number ${i + 1}`);
  await getPharmacyDetails(data[i]);
}

saveToFile(finalResult, "AllDetails");

export default getPharmacyDetails;

// const displayed = await getPharmacyDetails(reine);
// console.log(displayed);

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

// [
//   [
//     "Raison sociale : PHARMACIE REINE",
//     "Adresse : 126 RTE DE LA REINE",
//     "> Plan d'accès",
//   ],
//   ["Code postal - ville : 92100 BOULOGNE-BILLANCOURT"],
//   ["Téléphone : 0146040062"],
//   ["Télécopie : 0146054933"],
//   [
//     "RUDY COHEN",
//     "PHARMACIEN TITULAIRE D'OFFICINE",
//     "Date d'inscription à cette activité : 07/02/2019",
//     "Section d'inscription : A",
//   ],
//   [
//     "THOMAS JAILLETTE",
//     "PHARMACIEN ADJOINT D'OFFICINE",
//     "Date d'inscription à cette activité : 08/01/2020",
//     "Section d'inscription : D",
//   ],
//   [
//     "JONATHAN SADOUN",
//     "PHARMACIEN ADJOINT D'OFFICINE",
//     "Date d'inscription à cette activité : 07/02/2019",
//     "Section d'inscription : D",
//   ],
//   [
//     "DÉBORAH WAJNSZTOK-ROSIER",
//     "PHARMACIEN ADJOINT D'OFFICINE",
//     "Date d'inscription à cette activité : 26/02/2019",
//     "Section d'inscription : D",
//   ],
// ];

// // Checking if string is at case
// // const letter = 'A';

// // if (letter.toUpperCase() === letter) {
// //   console.log('✅ letter is uppercase');
// // } else {
// //   console.log('⛔️ letter is lowercase');
// // }
