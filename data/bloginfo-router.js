const router = require('express').Router();
const Blog = require('./db');

router.post('/', (req, res) => {
    post = req.body;
    title = req.body.title;
    contents = req.body.contents;
    console.log(post)

    !title || !contents ?
    res.status(400).json({ errorMessage: "Please provide a title and contents for the post."})
    :
    Blog.insert(post)
        .then(id => {
            res.status(201).json(post);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: "There was an error while saving the post to the database."});
        });
});

router.get('/', (req, res) => {
    Blog.find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: "The posts information could not be retrieved." });
        });
});

module.exports = router;