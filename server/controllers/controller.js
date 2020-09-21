const { Pet } = require('../models/models');

module.exports = {
//==   C R E A T E   ==||
    // http://localhost:8000/api/create
    create: (req, res) => {
        Pet.create(req.body)
            .then(data => res.json(data))
            .catch(err => res.json(err));
    },

//==   R E A D   ==||
    // http://localhost:8000/api/all
    all: (req, res) => {
        Pet.find({})
            .then(data => res.json(data))
            .catch(err => res.json(err));
    },
    
    // http://localhost:8000/api/:id
    one: (req, res) => {
        Pet.findOne({ _id: req.params.id })
            .then(data => res.json(data))
            .catch(err => res.json(err));
    },

//==   U P D A T E   ==||
    // http://localhost:8000/api/:id/update
    update: (req, res) => {
        Pet.findOneAndUpdate({ _id: req.params.id }, req.body, { runValidators: true, useFindAndModify: false, new: true})
            .then(data => res.json(data))
            .catch(err => res.json(err));
    },

    //http://localhost:8000/api/:id/add-nested
    addNested: (req, res) => {
        Pet.findByIdAndUpdate({ _id: req.params.id }, { $addToSet: {books: req.body } }, { runValidators: true, useFindAndModify: false, new: true })
            .then(data => res.json(data))
            .catch(err => res.json(err))
    },

    //http://localhost:8000/api/:id/:rId/update-nested
    updateNested: (req,res) => {
        Pet.findOneAndUpdate({ 'book._id': req.params.rId }, { $set: { 'reviews.$': req.body }}, { new: true, runValidators: true })
            .then(data => res.json(data))
            .catch(err => res.json(err));
    },

    //http://localhost:8000/api/:id/:rId/delete-nested
    deleteNested: (req, res) => {
        Pet.findOneAndUpdate({ _id: req.params.id }, { $pull: {books: {_id: req.params.rId } } }, { runValidators: true, useFindAndModify: false, new: true })
            .then(data => res.json(data))
            .catch(err => res.json(err))
    }, 

//==   D E L E T E   ==||
    // http://localhost:8000/api/:id/delete
    delete: (req, res) => {
        Pet.findOneAndDelete({ _id: req.params.id })
            .then(data => res.json(data))
            .catch(err => res.json(err));
    },
}