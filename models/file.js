const mongoose = require("mongoose")

const File = new mongoose.Schema({
    path: {
        type: String, 
        required: true
    }, 
    originalName: {
        type: String, 
        required: true
    }, 
    password: String,
    downlaodCount: {
        type: Number,
        required: true,
        default: 0
    }
})

module.exports = mongoose.model("File", File)