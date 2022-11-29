import data from "./laposte_hexasmal.json" assert { type: "json" };

type GPSCoords = [number, number];

interface postData {
  datasetid: string;
  recordid: string;
  fields: {
    nom_de_la_commune: string;
    libelle_d_acheminement: string;
    code_postal: string;
    coordonnees_gps: GPSCoords;
    code_commune_insee: string;
  };
  geometry: { type: string; coordinates: GPSCoords };
  record_timestamp: string;
}

// const postOfficeData = require("./laposte_hexasmal.json");
const postOfficeData: postData[] = data as postData[];
let allPostalCodes: string[] = [];

for (let i = 0; i < postOfficeData.length; i++) {
  allPostalCodes.push(postOfficeData[i].fields.code_commune_insee);
}

allPostalCodes = allPostalCodes.sort();

console.log(allPostalCodes.length);
export default allPostalCodes;
