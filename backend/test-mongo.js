const mongoose = require("mongoose");

const uri = "mongodb+srv://mazemindUser:mazemind123@mazemind.mex4a7z.mongodb.net/mazemind";

mongoose.connect(uri)
  .then(() => {
    console.log("Connexion réussie");
    process.exit();
  })
  .catch(err => {
    console.log(err);
    process.exit();
  });