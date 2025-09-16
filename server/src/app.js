const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || "5000";
const userRoutes = require("./routes/user.routes.js");


app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/uploads", express.static("public/uploads"));

app.use(bodyParser.json({ limit: "10mb" }));
app.use(cookieParser());

const apiRouter = express.Router();

apiRouter.use("/user", userRoutes);

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
