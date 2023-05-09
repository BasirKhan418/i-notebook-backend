console.log("hello worls")
const connectToMongo = require("./db");
const express = require('express')
var cors = require('cors')


connectToMongo();
const app = express()
const port = 5000
//Routes Starts Here
app.use(cors())
app.use(express.json());
app.use("/api/auth",require("./routes/auth"));
app.use("/api/notes",require("./routes/notes"));
app.listen(port, () => {
  console.log(`I-Notebook backend listening on port http://localhost:${port}`)
})