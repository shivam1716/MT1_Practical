const app = require("./expressApp");

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Product API server started at http://localhost:${PORT}`);
});
