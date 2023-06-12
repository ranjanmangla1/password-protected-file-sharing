require("dotenv").config()

const multer = require("multer")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const File = require("./models/file")

// const req = require("express/lib/request")

const express = require("express")
const app = express()

app.use(express.urlencoded({ extended: true }))

mongoose.connect(process.env.DATABASE_URL)

const upload = multer({ dest: "uploads"})

// configuring our view engine, ejs
app.set("view engine", "ejs")

app.get("/", (req, res) => {
    // it will render our index view
    res.render("index")
})

app.post("/upload", upload.single("file"), async (req, res) => {
    const fileData = {
        path: req.file.path,
        originalName: req.file.originalname
    }

    if(req.body.password != null && req.body.password != "") {
        fileData.password = await bcrypt.hash(req.body.password, 10)
    }

    const file = await File.create(fileData)

    res.render("index", { fileLink: `${req.headers.origin}/file/${file.id}` })
}) 

app.route("/file/:id").get(handleDownload).post(handleDownload)

async function handleDownload(req, res) {
    const file = await File.findById(req.params.id)

    if(file.password != null) {
        if(req.body.password == null) {
            res.render("password")
            return
        }

        if (!(await bcrypt.compare(req.body.password, file.password))) {
            res.render("password", { error: true })
            return
        }
    }

    file.downloadCount++
    await file.save()
    console.log(file.downloadCount)
  
    res.download(file.path, file.originalName)
}


// app.get("/file/:id", async (req, res) => {
//     const file = await File.findById(req.params.id)

//     file.downlaodCount++;
//     await file.save();

//     console.log(file.downlaodCount);

//     res.download(file.path, file.originalName)
// })

// it will be listening on port 3000
app.listen(process.env.PORT)