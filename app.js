const express = require("express");
const app = express();
const mongoose = require("mongoose");
//-----import user route---
const userRoute = require("./Routes/userRoute");

app.use(express.json());

//------------connect database--------------
mongoose
  .connect(
    "mongodb+srv://AbdoOkasha:DPDp7kqFUTOahhjj@final-project.dpoef6d.mongodb.net/E-learning"
  )
  .then(() => console.log("Database connected"))
  .catch((err) => console.error(err));

//----------------listen on port-------------
app.listen(1911, () => {
  console.log("server connected on port 1911");
});
