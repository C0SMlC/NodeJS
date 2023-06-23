const fs = require("fs");
const parse = require("csv-parse");
// console.log(parse);
const result = [];

function ishabitable(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

fs.createReadStream("kepler_data.csv")
  .pipe(
    parse.parse({
      comment: "#",
      columns: true,
    })
  )
  .on("data", (data) => {
    if (ishabitable(data)) result.push(data);
  })
  .on("end", () => {
    console.log(result);
    console.log(`${result.length} habitable planets found!`);
  });

console.log(result);
