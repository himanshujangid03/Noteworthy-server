const mongoose = require("mongoose")
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");

mongoose
  .connect(process.env.REACT_APP_DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection successfully!");
  });

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`server started successfully at ${PORT} 🔥🔥`);
});
