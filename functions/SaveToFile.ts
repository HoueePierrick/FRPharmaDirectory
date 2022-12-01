import fs from "fs";

export default async function saveToFile(data: any, name: string) {
  fs.writeFile(
    // "../generated-data/allPharmas.json",
    `../generated-data/${name}.json`,
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
}
