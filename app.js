const express = require("express");
const app = express();
const mongoose = require("mongoose");
//-----import routes---
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
const paymentRoute = require("./Routes/paymentRoute");
//----------cors------------
const cors = require("cors");
//------------ swagger -----------
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const reviewRoute = require("./Routes/reviewsRoute");


//------------dotenv----------------
require("dotenv").config();

app.use(express.json());

//--------user cors to allow all origins (all methods) -------
app.use(cors());

//------------connect database--------------
mongoose
  .connect(
    "mongodb+srv://AbdoOkasha:DPDp7kqFUTOahhjj@final-project.dpoef6d.mongodb.net/E-learning"
  )
  .then(() => console.log("Database connected"))
  .catch((err) => console.error(err));

//----------routes------------
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
app.use(reviewRoute)
app.use(paymentRoute);

//-------swagger setup---------
const swaggerSpec = swaggerJsDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-learning",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:1911" }],
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
app.listen(1911, () => {
  console.log("server connected on port 1911");
});
