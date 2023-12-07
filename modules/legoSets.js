 
 
const env = require("dotenv")
env.config()
  
const Sequelize = require('sequelize');

 
let sets = [];
// set up sequelize to point to our postgres database
const sequelize = new Sequelize('neondb', process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});

const Theme = sequelize.define('Theme', {
  theme_id: {
    type:Sequelize.INTEGER,
  primaryKey:true,
  autoIncrement:true
},
  name: Sequelize.STRING,
},
{
  createdAt:false,
  updatedAt:false,
}


);

const Set = sequelize.define('Set', {
  set_num: {
    type:Sequelize.STRING,
  primaryKey:true,
  
},
  name: Sequelize.STRING,
  year:Sequelize.INTEGER,
  num_parts:Sequelize.INTEGER,
  theme_id:Sequelize.INTEGER,
  img_url:Sequelize.STRING
  
},
{
  createdAt:false,
  updatedAt:false,
});


 


Set.belongsTo(Theme, {foreignKey: 'theme_id'})
 





function initialize() {
  return new Promise((resolve, reject) => {
     sequelize.sync().then(()=>{
     console.log("connected to DB")
     resolve()
     }).catch((err)=>{
      resolve(err)
  })
})
 
}
 
 
  initialize();
 
  function getAllSets() {
    return new Promise((resolve, reject) => {
      Set.findAll({
        include: [Theme], // Include Theme data
      })
        .then((sets) => {
          resolve(sets);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  function getSetByNum(setNum) {
    console.log(setNum);
    return new Promise((resolve, reject) => {
      Set.findOne({
        where: {
          set_num: setNum
        },
        include: [Theme]
      })
        .then((set) => {
          if (set) {
            resolve(set);
          } else {
            reject("Unable to find requested set");
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
 
  

  function getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
      Set.findAll({include: [Theme], where: {
        '$Theme.name$': {
        [Sequelize.Op.iLike]: `%${theme}%`
        }
       }})
        .then((sets) => {
          if (sets.length > 0) {
            resolve(sets);
          } else {
            reject("Unable to find requested sets");
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  let themes =[];
function getAllThemes(){
  return new Promise((resolve,reject)=>{
    Theme.findAll({  
    })
      .then((themes) => {
        resolve(themes);
      })
      .catch((error) => {
        reject(error);
      });
  })
}
function addSet(formData) {
  return new Promise((resolve, reject) => {
      Set.create(formData).then(() => {
          resolve()
      }).catch((err) => {
          reject(err)
      })
  })
}

function editSet(formData) {
  return new Promise((resolve, reject) => {
    const result = formData.set_num;
  
    // Assuming Set is your Sequelize model
    Set.update(
      formData, // Object containing values to be updated
      {
        where: { set_num: result } // Condition for the update
      }
    ).then(() => {
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
}


function deleteSet(data)
{
  return new Promise((resolve,reject)=>
  {
    Set.destroy({where:{set_num: data }}).then(()=>{
      resolve();
    }).catch((err)=>{
      reject(err);
    });
  });
}
 
  module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme,getAllThemes,addSet,editSet,deleteSet}
   
 // Code Snippet to insert existing data from Set / Themes
 