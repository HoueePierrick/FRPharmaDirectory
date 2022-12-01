// const data = require("../generated-data/allPharmas.json");
import data from "../generated-data/allPharmasData.js";
// const result = JSON.parse(data);

// import { readFile } from "fs/promises";

// // const reader = async () => {
// //   const json = JSON.parse(
// //     await readFile(
// //       //   "../generated-data/allPharmas.json"
// //       new URL("../generated-data/allPharmas.json", import.meta.url)
// //     ).toString()
// //   );
// //   return json;
// // };

// console.log(reader());

console.log(data.length);
