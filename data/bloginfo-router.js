const router = require('express').Router();
const Blog = require('./db');

router.get('/', (req, res) => {
    Blog.find()
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ errorMessage: "The posts information could not be retrieved."})
    })
})

module.exports = router;