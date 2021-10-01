const path = require("path");
const express = require("express");
const hbs = require("hbs");
const forecast = require("./utils/forecast");
const geoCode = require("./utils/geocode");

// console.log(__dirname);
// console.log(path.join(__dirname, "../public"));

const app = express();
const port = process.env.PORT || 3000;

// DEFINE PATHS FOR EXPRESS CONFIG
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// SETUP HANDLEBARS ENGINE AND VIEWS LOCATION
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
// SETUP STATIC DIRECTORY TO SERVE
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Raymund Catalan",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "Raymund Catalan",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    name: "Raymund Catalan",
    title: "Help",
    question: "Questions?",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address!",
    });
  }
  geoCode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }
        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
  // res.send({ forecast: 50, location: "Boston", address: req.query.address });
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }
  console.log(req.query.search);
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Raymund Catalan",
    errorMessage: "Help article not found",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Raymund Catalan",
    errorMessage: "Page not found.",
  });
});

// app.com
// app.com/help
// app.com/about

app.listen(port, () => {
  console.log("Server is up on port" + port);
});
