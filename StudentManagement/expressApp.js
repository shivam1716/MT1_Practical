const express = require("express");

const app = express();

app.use(express.json());

let products = [
  { id: 301, name: "Wireless Mouse", category: "Electronics", price: 799, quantity: 25, inStock: true },
  { id: 302, name: "Notebook", category: "Stationery", price: 60, quantity: 100, inStock: true },
  { id: 303, name: "USB Keyboard", category: "Electronics", price: 999, quantity: 0, inStock: false }
];

function validProduct(product) {
  return product &&
    typeof product.name === "string" && product.name.trim() !== "" &&
    typeof product.category === "string" && product.category.trim() !== "" &&
    typeof product.price === "number" && Number.isFinite(product.price) &&
    typeof product.quantity === "number" && Number.isFinite(product.quantity) &&
    typeof product.inStock === "boolean";
}

app.get("/api/products", (req, res) => {
  res.status(200).json(products);
});

app.post("/api/products", (req, res) => {
  if (!validProduct(req.body)) {
    return res.status(400).json({ message: "Invalid product data" });
  }

  const newProduct = {
    id: products.length ? Math.max(...products.map(product => product.id)) + 1 : 301,
    name: req.body.name.trim(),
    category: req.body.category.trim(),
    price: req.body.price,
    quantity: req.body.quantity,
    inStock: req.body.inStock
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.get("/api/products/filter", (req, res) => {
  const category = req.query.category;

  if (typeof category !== "string") {
    return res.status(200).json([]);
  }

  const matchingProducts = products.filter(product =>
    product.category.toLowerCase() === category.toLowerCase()
  );

  res.status(200).json(matchingProducts);
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find(item => item.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json(product);
});

app.put("/api/products/:id", (req, res) => {
  const product = products.find(item => item.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (!validProduct(req.body)) {
    return res.status(400).json({ message: "Invalid product data" });
  }

  product.name = req.body.name.trim();
  product.category = req.body.category.trim();
  product.price = req.body.price;
  product.quantity = req.body.quantity;
  product.inStock = req.body.inStock;

  res.status(200).json(product);
});

app.delete("/api/products/:id", (req, res) => {
  const index = products.findIndex(item => item.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  products.splice(index, 1);
  res.status(200).json({ message: "Product deleted successfully" });
});

app.use((error, req, res, next) => {
  res.status(400).json({ message: "Invalid JSON body" });
});

module.exports = app;
