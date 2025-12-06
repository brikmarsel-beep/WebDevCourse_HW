 const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, "client")));
 
 
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "home.html"));
});

// Route: /about → /client/about.html
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "home.html"));
});

// Route: /contact → /client/contact.html
app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "home.html"));
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});







