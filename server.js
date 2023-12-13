/********************************************************************************
* WEB322 – Assignment 06
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: __Sukhad Adhikari____________________ Student ID: __156518219____________ Date: __12/12/2023____________
*
* Published URL: _______________https://tiny-underwear-yak.cyclic.app____________________________________________
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
 

const clientSessions = require('client-sessions');
app.use(
  clientSessions({
    cookieName: 'session', // this is the object name that will be added to 'req'
    secret: 'o6LjQ5EVNC28ZgK64hDELM18ScpFQr', // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60, // the session will be extended by this many ms each request (1 minute)
  })
);


 

app.get("/", (req, res) => {
  const aboutFilePath = path.join(__dirname, "views", "index.ejs");
  const notFoundFilePath = path.join(__dirname, "views", "404");
 
  fs.access(aboutFilePath, fs.constants.F_OK, (err) => {
    if (!err) {
 
    const session = req.session;
        res.render('index',{session});
 
     
    } else {
       res.status(404).render("404",{message:"I'm sorry, we are unable to find what you are looking for"});
      
    }
  });
});

 

app.get("/about", (req, res) => {
  res.render("about");
    
})
 

 

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    next();
  }
}

app.use((req, res, next) => {
  res.locals.session = req.session;
  next()
});

app.get("/lego/sets/:setNumber", async (req, res) => {
  try {
    const setNumValue = req.params.setNumber; // Extract set number from URL
    const result = await legoData.getSetByNum(setNumValue);

    if (result) {
      
       
      // Pass both 'set' and 'session' in a single object
      res.render("set", { set: result  });
    } else {
      res.status(404).render("404", { message: "I'm sorry, we are unable to find what you are looking for" });
    }
  } catch (error) {
    console.error("Error while retrieving Lego set by ID:", error);
    res.status(404).render("404", { message: "I'm sorry, we are unable to find what you are looking for" });
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
      res.render("sets", { sets: allSets,themes:themeData });
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


 


app.get("/login", (req, res) => {
  let error = []; 
  res.render("login",{error});
    
})

 
app.get("/register",(req,res) =>
{
  let error = []; 
  res.render("register",{error});
   
}
);


app.get("/userHistory",(req,res) =>
{

  res.render("userHistory");
}
);
 
 
app.post("/register", (req, res) => {
  let error = [];
  authData.registerUser(req.body).then((success) => {
    res.render('login', {
      successMsg: success
    })
  }).catch((err) => {
    error = err;
    res.render('register', {
      error
    })
  })
})

app.post("/login", (req, res) => {
  req.body.userAgent = req.get("User-Agent")
  let error = [];
  authData.loginUser(req.body).then((user) => {
    req.session.user = {
      username: user.username,
      email: user.email,
      loginHistory: user.loginHistory
    }
    
    res.redirect("/",)
  
 
  }).catch((err) => {
    error = err;
    res.render("login", {
      error
    })
  })
 
})

app.get("/logout", ensureLogin, (req, res) => {
  req.session.reset();
  res.redirect("/")
})

app.get("*", (req, res) => {
  res.status(404).send("404")
})



//main server
legoData.initialize()
.then(authData.initialize())
.then(() => { 
  app.listen(HTTP_PORT, () => {
    console.log("server listening on port " + HTTP_PORT)
  })
})