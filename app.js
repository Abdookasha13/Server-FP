const express = require("express");
const app = express();
const mongoose = require("mongoose");
//-----import routes---
const passport = require("passport");
const userRoute = require("./Routes/userRoute");
const courseRoute = require("./Routes/courseRoute");
const lessonRoute = require("./Routes/lessonRoute");
const enrollmentRoute = require("./Routes/enrollmentRoute");
const categoryRoute = require("./Routes/categoryRoute");
const eventRoute = require("./Routes/eventRoute");
const testimonialRoute = require("./Routes/testimonialRoute");
const serviceRoute = require("./Routes/servicesRoute");
const contactUsRoute = require("./Routes/contactUsRoute");
const cartRoute = require("./Routes/cartRoute");
const reviewRoute = require("./Routes/reviewsRoute");
const paymentRoute = require("./Routes/paymentRoute");
const aiRoute = require("./Routes/aiRoute");
require("./Config/passport");
//----------cors------------
const cors = require("cors");
//------------ swagger -----------
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

//------------dotenv----------------
require("dotenv").config();

app.use(express.json());

//--------user cors to allow all origins (all methods) -------
app.use(cors());

//------------connect database--------------
mongoose
.connect(process.env.mongoURL)
.then(() => console.log("Database connected"))
.catch((err) => console.error(err));

//----------routes------------
app.use(passport.initialize());
app.get("/", (req, res) => {
  res.json({
    message: "API is running"
  });
});
app.use(userRoute);
app.use(lessonRoute);
app.use(courseRoute);
app.use(enrollmentRoute);
app.use(categoryRoute);
app.use(eventRoute);
app.use(testimonialRoute);
app.use(serviceRoute);
app.use(contactUsRoute);
app.use(cartRoute);
app.use(reviewRoute);
app.use(paymentRoute);
app.use(aiRoute);

//-------swagger setup---------
const swaggerSpec = swaggerJsDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-learning",
      version: "1.0.0",
    },
    servers: [{ url: "https://server-fp-git-main-abdookasha13s-projects.vercel.app/" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [__dirname + "/Routes/*.js"],
});

app.use("/swaggerApis", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//----------------listen on port-------------

module.exports = app;
