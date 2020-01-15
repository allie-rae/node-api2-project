const router = require('express').Router();
const Blog = require('./db');

// POST Blog 
router.post('/', (req, res) => {
    post = req.body;
    title = req.body.title;
    contents = req.body.contents;
    console.log(post)

    !title || !contents ?
        res.status(400).json({ errorMessage: "Please provide a title and contents for the post." })
        :
        Blog.insert(post)
            .then(id => {
                res.status(201).json(post);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ errorMessage: "There was an error while saving the post to the database." });
            });
});

// POST Comment 
router.post('/:id/comments', (req, res) => {
    req.body.post_id = req.params.id;
    let text = req.body.text;
    let comment = req.body;
    console.log(comment)
    !text ?
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
        :
        Blog.insertComment(comment)
            .then(id => {
                console.log(id)
                !id ?
                    res.status(404).json({ errorMessage: "The post with the specified ID does not exist." })
                    :
                    res.status(201).json(id);
                // Blog.findCommentById(id)
                //     .then(comment => {
                //         console.log(comment)
                //         res.status(200).json(comment);
                //     })
                //     .catch(err => {
                //         console.log(err);
                //     });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ errorMessage: "There was an error while saving the comment to the database." });
            });
});

// GET all posts 
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

// GET post by id
router.get('/:id', (req, res) => {
    let id = req.params.id
    Blog.findById(id)
        .then(array => {
            !array[0] ? 
            res.status(404).json({ errorMessage: "The post with the specified ID does not exist." })
            :
            res.status(200).json(array[0]);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: "The post information could not be retrieved." });
        });
});

module.exports = router;