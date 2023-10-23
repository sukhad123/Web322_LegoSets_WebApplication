/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: __Sukhad Adhikari________ Student ID: ___156518219___________ Date: __2023/10/23____________
*
********************************************************************************/



const legoData = require("./modules/legoSets");

const path = require("path");
const fs = require("fs");
const express = require("express")
const app = express()

const HTTP_PORT = 8080

 

app.get("/", (req, res) => {
  const aboutFilePath = path.join(__dirname, "views", "about.html");
  const notFoundFilePath = path.join(__dirname, "views", "404.html");

 
  fs.access(aboutFilePath, fs.constants.F_OK, (err) => {
    if (!err) {
       
      res.sendFile(aboutFilePath);
    } else {
       
      res.status(404).sendFile(notFoundFilePath);
    }
  });
});

 
app.use(express.static('public'));
app.get("/about", (req, res) => {
     res.sendFile(path.join(__dirname, "/views/home.html"))


})

 


 
app.get("/lego/sets/:setNumber", async (req, res) => {
  try {
    const setNumValue = req.params.setNumber; // Extract set number from URL
    const result = await legoData.getSetByNum(setNumValue);

    if (result) {
      res.json(result);
    } else {
      res.status(404).send("Set not found");
    }
  } catch (error) {
    console.error("Error while retrieving Lego set by ID:", error);
    res.status(404).send("Set not found");
  }
});

 
app.get("/lego/sets", async (req, res) => {
  try {
    const theme = req.query.theme; // Extract the "theme" query parameter

    if (theme) {
  
      const filteredSets = await legoData.getSetsByTheme(theme);

      if (filteredSets.length > 0) {
        res.json(filteredSets);
      } else {
        res.status(404).send("No sets found for the specified theme");
      }
    } else {
      
      const allSets = await legoData.getAllSets();
      res.json(allSets);
    }
  } catch (error) {
    console.error("Error while retrieving Lego sets:", error);
    res.status(404).send("An error occurred while retrieving Lego sets.");
  }
});

 

legoData.initialize().then(() => {
  app.listen(HTTP_PORT, () => {
    console.log("Server listening on port " + HTTP_PORT);
  });
});