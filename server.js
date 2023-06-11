require("dotenv").config()

const express = require("express")
const app = express()

// configuring our view engine, ejs
app.set("view engine", "ejs")

app.get("/", (req, res) => {
    // it will render our index view
    res.render("index")
})


console.log(`server running at https://localhost:${process.env.PORT}`)
// it will be listening on port 3000
app.listen(process.env.PORT)
