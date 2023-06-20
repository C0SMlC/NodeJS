const fs = require("fs");
const http = require("http");
const url = require("url");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObject = JSON.parse(data);
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

// console.log(dataObject[0].productName);
// let newCard = tempCard.replace("{%PRODUCTNAME%}", dataObject[0].productName);
// newCard = newCard.replace(/{%IMAGE%}/g, dataObject[0].image);

// console.log(newCard);

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%ID%}/g, product.id);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%items}/g, product.quantity);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);

  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }

  return output;
};

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-Type": "text/html" });
    const productList = dataObject
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const completeOverview = tempOverview.replace(
      "{%PRODUCT_CARDS%}",
      productList
    );
    res.end(completeOverview);
  } else if (pathname === "/product") {
    res.writeHead(404, { "Content-Type": "text/html" });
    const productobj = dataObject[query.id];
    const product = replaceTemplate(tempProduct, productobj);
    res.end(product);
  }
});

server.listen(3000, "127.0.0.1", () => {
  console.log("listening to requests on port 3000");
});
