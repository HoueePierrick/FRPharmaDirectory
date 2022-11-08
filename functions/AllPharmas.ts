import fs from "fs";
import allPostalCodes from "../external-data/postal-codes";
import getCityPharmas from "./PharmaCity";
import { pageList } from "./PharmaCity";

const saveToFile = (data: any) => {
  fs.writeFile(
    "./generated-data/allPharmas.json",
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

let AllPharmas: pageList[] = [];
let newArray: pageList[] | undefined = [];
// Test on 3 cities with 2 max (allPostalCodes.length)
for (let i = 0; i < 2; i++) {
  newArray = await getCityPharmas(allPostalCodes[i]);
  if (newArray) {
    if (newArray.length > 0) {
      for (let j = 0; j < newArray.length; j++) {
        AllPharmas.push(newArray[j]);
      }
    }
  }
}

saveToFile(AllPharmas);
