const setData = require("../data/setData");
const themeData = require("../data/themeData")
let sets = [];

function initialize() {
  return new Promise((resolve, reject) => {
    setData.forEach(set => {
      const themeId = set.theme_id;
      const theme = themeData.find(theme => theme.id === themeId);
  
      if (theme) {
        // Add the "theme" property to the setData object.
        set.theme = theme.name;
  
        // Push a copy of the setData object into the "sets" array.
        sets.push({ ...set });
      }
    });
      resolve()
  })
 
}
 
 
  initialize();
 

  function getAllSets() {
    return sets;
  }

  
  function getSetByNum(setNum) {
    return sets.find(set => set.set_num === setNum);
  }

  
  function getSetsByTheme(theme) {
    return sets.filter(set => set.theme.toLowerCase().includes(theme.toLowerCase()));
  }
  
 
  module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme }