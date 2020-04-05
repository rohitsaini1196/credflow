const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
var cors = require("cors");

//modules
const User = require("./schema/userSchema");
const Restaurant = require("./schema/restoSchema");
const mongoose = require("./config/db");
const sessionConfig = require("./config/sessionConfig");

//middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    name: "sids",
    resave: false,
    saveUninitialized: false,
    secret: "aurkyakarsaktehai!",
    cookie: {
      maxAge: 60 * 60 * 2 * 1000,
      sameSite: false,
      secure: false
    }
  })
);
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

var allowedOrigins = ["http://localhost:3001", "http://localhost:3000"];
app.use(
  cors({
    origin: function(origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  })
);

app.use(
  cors({
    credentials: true
  })
);

//db connection
const db = mongoose.connection;
db.on("error", () => {
  console.log("> error occurred from the database");
});
db.once("open", () => {
  console.log("> successfully connected to the database");
});

//Routes
app.get("/", (req, res) => {
  const { userId } = req.session;
  console.log("this is main userid in / get req. " + userId);

  if (userId) {
    User.findOne({ _id: userId }, (err, user) => {
      if (err) {
        console.log(err);
      }
      if (user) {
        return res.send(`hello mr ${user.name}`);
      }
    });
  }
});

app.get("/restaurant", async (req, res) => {
  // const { userId } = req.session;

  console.log("get command working for restaurents");

  // const userId = "5e85e4b2fecb9320dc4f9324";

  const restaurants = await Restaurant.find();

  res.send(restaurants);
});

app.post("/login", sessionConfig.redirectHome, (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      console.log(err);
    }
    if (user) {
      if (user.password == req.body.password) {
        const { userId } = req.session;
        req.session.userId = user._id;

        console.log("this is user id which is :: " + user._id);

        return res.send("login sucess, lets go to profile");
      } else {
        return res.status(401).send("Username and password not matched");
      }
    } else {
      return res.status(404).send("NO user find with this email id");
    }
  });
});

app.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) {
      console.log(err);
    }

    if (user) {
      res.status(403).send("A user already exists with this email id");
    } else {
      if (req.body.email && req.body.name && req.body.password) {
        var newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          bio: req.body.bio
        });

        newUser
          .save()
          .then(result => {
            console.log("USer saved to DB");
            console.log("something routing command");
            return res.send("User added SuccessFul");
          })
          .catch(err => console.log("Error", err));
      }
    }
  });
});

app.post("/restaurant", (req, res) => {
  if (req.body) {
    var newRestaurant = new Restaurant({
      name: req.body.name,
      capacity: req.body.capacity,
      menu: req.body.menu,
      cuisines: req.body.cuisines,
      location: [{ let: req.body.let, long: req.body.long }],
      review: []
    });

    newRestaurant
      .save()
      .then(result => {
        console.log("Restaurant saved to DB");
        console.log("something routing command");
        return res.send("Restaurnet added SuccessFul");
      })
      .catch(err => console.log("Error", err));
  }
});

app.post("/review", async (req, res) => {
  // console.log("Posting review initiated");

  // const { userId } = req.session;
  const userId = req.body.userId;
  const restaurantId = req.body.restaurantId;

  Restaurant.findOne({ _id: restaurantId }, function(err, restaurant) {
    if (err) {
      console.log(err);
    }

    if (restaurant) {
      User.findOne({ _id: userId }, (err, user) => {
        restaurant.review.push({
          userId: userId,
          name: user.name,
          description: req.body.reviewtext
        });
        restaurant
          .save()
          .then(result => {
            console.log("Restaurant saved to DB");
            console.log("something routing command");
            return res.send("Restaurnet added SuccessFul");
          })
          .catch(err => console.log("Error", err));
      });
    }
  });
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/index2.html");
});

app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect("/");
    }
    res.clearCookie("sids");
    return res.redirect("/login");
  });
});

app.listen(3000, () => {
  console.log("App listening at 3000");
});
