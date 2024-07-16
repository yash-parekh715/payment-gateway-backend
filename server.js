require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const errorhandler = require("errorhandler");
const { swaggerUi, swaggerDocs } = require("./config/swagger");
const logger = require("./middleware/logger");
const helmet = require("helmet");
const cors = require("cors");
const paymentRoutes = require("./routes/paymentRoutes")

const app = express();
app.use(express.json());
app.use(logger);
app.use(errorhandler());
app.use(helmet());
app.use(cors());

app.use("/api", paymentRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req, res) => {
  res.redirect("/docs");
});

mongoose
  .connect(process.env.MONG_URI)
  .then(async () => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `db connected and app listening on http://localhost:${
          process.env.PORT || 5000
        }`
      );
    });
  })
  .catch((err) => {
    console.log(`cannot connect to db due to error ${err}`);
  });
