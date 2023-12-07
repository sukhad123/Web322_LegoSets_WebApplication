/********************************************************************************
*  WEB322 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: _____Sukhad Adhikari_________________ Student ID: _____156518219_________ Date: _November 30, 2023_____________
*
*  Published URL: _______https://tiny-underwear-yak.cyclic.app___________________________________________________
*
********************************************************************************/


const legoData = require("./modules/legoSets");
const authData = require('./modules/auth-service');
const path = require("path");
const fs = require("fs");
const express = require("express")
const app = express()

const HTTP_PORT = 8080
app.use(express.static('public'));
app.set('view engine', 'ejs');
express.urlencoded({extended:true})
const multer = require('multer');
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();
//const upload = multer({ dest: 'uploads/' });

app.get("/", (req, res) => {
  const aboutFilePath = path.join(__dirname, "views", "index.ejs");
  const notFoundFilePath = path.join(__dirname, "views", "404");
 
  fs.access(aboutFilePath, fs.constants.F_OK, (err) => {
    if (!err) {
       
      res.render('index');
    } else {
       res.status(404).render("404",{message:"I'm sorry, we are unable to find what you are looking for"});
      
    }
  });
});

 

app.get("/about", (req, res) => {
  res.render("about");
    
})
 

 


 
app.get("/lego/sets/:setNumber", async (req, res) => {
  try {
    const setNumValue = req.params.setNumber; // Extract set number from URL
    const result = await legoData.getSetByNum(setNumValue);

    if (result) {
     

      res.render("set", { set: result });
    } else {
      res.status(404).render("404",{message:"I'm sorry, we are unable to find what you are looking for"});
    }
  } catch (error) {
    console.error("Error while retrieving Lego set by ID:", error);
    res.status(404).render("404",{message:"I'm sorry, we are unable to find what you are looking for"});
  }
});

 
  
app.get("/lego/sets", async (req, res) => {
  try {
    const theme = req.query.theme; // Extract the "theme" query parameter
     const themeData = await legoData.getAllThemes();
    if (theme) {
      try{
      const filteredSets = await legoData.getSetsByTheme(theme);
       
      if (filteredSets.length > 0) {
        // Render the 'sets.ejs' template and pass the data to it
        res.render("sets", { sets: filteredSets,themes:themeData });
      } else {
        res.status(404).render("404",{message:"I'm sorry, we are unable to find what you are looking for"});
      }
    }
    catch(error)
    {
      res.status(404).render("404",{message:"There is no matching sets"});
    }
    } else {
      const allSets = await legoData.getAllSets();
      // Render the 'sets.ejs' template and pass the data to it
      res.render("sets", { sets: allSets,themes:themeData  });
    }
  } catch (error) {
    console.error("Error while retrieving Lego sets:", error);
    res.status(500).send("An error occurred while retrieving Lego sets.");
  }
});



app.get("/lego/addSet", async (req, res) => {
  try {
    const allSets = await legoData.getAllThemes();
    // Render the 'sets.ejs' template and pass the data to it
    res.render("addSet", { sets: allSets });
  } catch (err) {
    console.error("Error adding data:", err);

    // Send a response indicating the error to the client
    res.status(500).render("500", { message: "I am sorry, but we cannot add this values" });
  }
});


app.get("/lego/editSet/:setNumber",async(req,res)=>{
  try{
  const setNumValue = req.params.setNumber;
  const result = await legoData.getSetByNum(setNumValue);
  const themes = await legoData.getAllThemes();
      // Render the 'sets.ejs' template and pass the data to it
      res.render("editSet", { set: result, themes});
  }
  catch(err)
  {
    res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
  }
})
app.post('/lego/editSet', async (req, res) => {
 
  try {
    // Assuming req.body contains the necessary data for the LEGO set
   legoData.editSet(req.body);

    // Redirect to "/lego/sets" upon successful addition
    res.redirect('/lego/sets');
  } catch (err) {
    // If an error occurs, render the "500" view with an appropriate message
    res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
  }

   
 
});
app.get("/lego/deleteSet/:setNumber",async(req,res)=>{
  try{
  const setNumValue = req.params.setNumber;
  legoData.deleteSet(setNumValue);
  res.redirect('/lego/sets');
  }
  catch(err)
  {
    res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
  }
})

 
app.post('/lego/addSet', async (req, res) => {
 
  try {
    // Assuming req.body contains the necessary data for the LEGO set
   legoData.addSet(req.body);

    // Redirect to "/lego/sets" upon successful addition
    res.redirect('/lego/sets');
  } catch (err) {
    // If an error occurs, render the "500" view with an appropriate message
    res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
  }

   
 
});


const clientSessions = require('client-sessions');
app.use(
  clientSessions({
    cookieName: 'session', // this is the object name that will be added to 'req'
    secret: 'o6LjQ5EVNC28ZgK64hDELM18ScpFQr', // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60, // the session will be extended by this many ms each request (1 minute)
  })
);
 


app.use((req, res, next) => {
  res.locals.session = req.session;
  next()
});

app.get("/login", (req, res) => {
  res.render("login");
    
})



//register route
app.get("/register",(req,res) =>
{

  res.render("register");
}
);
 

app.post('/register', async (req, res) => {
  try {
    await authData.registerUser(req.body);
    res.redirect('/login');
  } catch (err) {
    // If an error occurs, render the "500" view with an appropriate message
    res.render("500", { message: ` ${err}` });
  }
});

app.post('/login',async(req,res)=>
{
  
  try{
    await authData.verifyUser(req.body)
    
      res.redirect('/lego/sets');
    }
    catch(err)
    {
      res.render("500", {message: ` ${err}`});
    }
});


legoData.initialize().then(authData.initialize).then(() => {
  app.listen(HTTP_PORT, () => {
    console.log("Server listening on port " + HTTP_PORT);
  });
});