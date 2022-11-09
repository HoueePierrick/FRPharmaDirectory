import fs from "fs";
import allPostalCodes from "../external-data/postal-codes.js";
import getCityPharmas from "./PharmaCity.js";
import { pageList } from "./PharmaCity.js";

const saveToFile = async (data: any) => {
  fs.writeFile(
    "../generated-data/allPharmas.json",
    JSON.stringify(data),
    "utf8",
    (err: any) => {
      if (err) {
        console.log(err);
      } else {
        console.log("scrapping terminé");
      }
    }
  );
};

// Test on 3 cities with 2 max (allPostalCodes.length)
const getAllPharmas = async () => {
  let pharmaArray: pageList[] = [];
  let newArray: pageList[] | undefined = [];
  for (let i = 2; i < 3; i++) {
    console.log(`Scrapping city number: ${i + 1}`);
    newArray = await getCityPharmas(allPostalCodes[i]);
    if (newArray) {
      if (newArray.length > 0) {
        for (let j = 0; j < newArray.length; j++) {
          pharmaArray.push(newArray[j]);
        }
      }
    }
  }
  return pharmaArray;
};

const AllPharmas = await getAllPharmas();
console.log(AllPharmas);
saveToFile(AllPharmas);

// for (let i = 0; i < 10; i++) {
//   console.log(allPostalCodes[i]);
// }
// 2 first cities are empty, crashes when there is data: 01004
