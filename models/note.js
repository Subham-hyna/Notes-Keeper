const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema({
    userName:String,
    title:String,
    content:String,
    bg:String,
    rotate:String,
    hoverRotate:String
})

const Note = new mongoose.model("Note",noteSchema);

module.exports.noteSchema=noteSchema;
module.exports.Note=Note;