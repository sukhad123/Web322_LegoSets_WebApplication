/********************************************************************************

* WEB322 – Assignment 03

*

* I declare that this assignment is my own work in accordance with Seneca's

* Academic Integrity Policy:

*

* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html

*

* Name: ________Sukhad Adhikari______________ Student ID: _____156518219_________ Date: __2023-10-24____________

*

* Published URL:https://quaint-underwear-bear.cyclic.app/

*

********************************************************************************/

const legoData = require("./modules/legoSets");

const path = require("path");
const fs = require("fs");
const express = require("express")
const app = express()

const HTTP_PORT = 8080
app.use(express.static('public'));
app.set('view engine', 'ejs');
 
let someData = {
  name: 'John',
  age: 23,
  occupation: 'developer',
  company: 'Scotiabank',
};
app.get("/", (req, res) => {
  const aboutFilePath = path.join(__dirname, "views", "index.ejs");
  const notFoundFilePath = path.join(__dirname, "views", "404");

 
  fs.access(aboutFilePath, fs.constants.F_OK, (err) => {
    if (!err) {
       
      res.render('index', {
        data: someData,
      });
    } else {
       
      res.status(404).sendFile(notFoundFilePath);
    }
  });
});

 

app.get("/about", (req, res) => {
  res.render("about");
    
})
app.get("/technic", (req, res) => {
  res.render("technic");
})

 


 
app.get("/lego/sets/:setNumber", async (req, res) => {
  try {
    const setNumValue = req.params.setNumber; // Extract set number from URL
    const result = await legoData.getSetByNum(setNumValue);

    if (result) {
     // res.json(result);

      res.render("set", { set: result });
    } else {
      res.status(404).send("Set not found");
    }
  } catch (error) {
    console.error("Error while retrieving Lego set by ID:", error);
    res.status(404).send("Set not found");
  }
});

 
// app.get("/lego/sets", async (req, res) => {
//   try {
//     const theme = req.query.theme; // Extract the "theme" query parameter

//     if (theme) {
  
//       const filteredSets = await legoData.getSetsByTheme(theme);

//       if (filteredSets.length > 0) {
//         res.json(filteredSets);
//       } else {
//         res.status(404).send("No sets found for the specified theme");
//       }
//     } else {
      
//       const allSets = await legoData.getAllSets();
//       res.json(allSets);
//     }
//   } catch (error) {
//     console.error("Error while retrieving Lego sets:", error);
//     res.status(404).send("An error occurred while retrieving Lego sets.");
//   }
// });

app.get("/lego/sets", async (req, res) => {
  try {
    const theme = req.query.theme; // Extract the "theme" query parameter
 
    if (theme) {
      const filteredSets = await legoData.getSetsByTheme(theme);

      if (filteredSets.length > 0) {
        // Render the 'sets.ejs' template and pass the data to it
        res.render("sets", { sets: filteredSets });
      } else {
        res.status(404).send("No sets found for the specified theme");
      }
    } else {
      const allSets = await legoData.getAllSets();
      // Render the 'sets.ejs' template and pass the data to it
      res.render("sets", { sets: allSets });
    }
  } catch (error) {
    console.error("Error while retrieving Lego sets:", error);
    res.status(500).send("An error occurred while retrieving Lego sets.");
  }
});


legoData.initialize().then(() => {
  app.listen(HTTP_PORT, () => {
    console.log("Server listening on port " + HTTP_PORT);
  });
});
 

 