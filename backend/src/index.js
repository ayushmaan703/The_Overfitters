import "./helpers/envConfig.js";
import app from "./app.js";
import connectDB from "./dbConnect/index.db.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`App Started On Port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Database Error: ${err}`);
  });
