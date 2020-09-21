const mongoose = require('mongoose');
const { BookSchema } = require('./book.model');

const PetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "{PATH} is required"],
        minlength: [3, "{PATH} must be {MINLENGTH} characters or more"]
    },
    type: {
        type: String,
        required: [true, "{PATH} is required."],
        minlength: [3, "{PATH} must be {MINLENGTH} characters or more"]
    },
    description: {
        type: String,
        required: [true, "{PATH} is required."],
        minlength: [3, "{PATH} must be {MINLENGTH} characters or more"]
    },
    skill1: {
        type: String,
    },
    skill2: {
        type: String,
    },
    skill3: {
        type: String,
    },
}, { timestamps: true });

const Pet = mongoose.model("Pet", PetSchema);

module.exports = {
    Pet
}