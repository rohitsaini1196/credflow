const mongoose = require("mongoose");

const DB =
  "mongodb+srv://fortwin:qwer5678@cluster0-dbmu0.mongodb.net/test?retryWrites=true&w=majority";

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log("DB connnection successful!"));

module.exports = mongoose;
