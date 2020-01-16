const router = require('express').Router();
const Blog = require('./db');

// POST Blog 
router.post('/', (req, res) => {
    post = req.body;
    title = req.body.title;
    contents = req.body.contents;

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

    !text ?
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
        :
        Blog.insertComment(comment)
            .then(newId => {
                    Blog.findCommentById(newId.id)
                        .then(comment => {
                            res.status(201).json(comment[0]);
                        })
                        .catch(err => {
                            console.log(err);
                        });
            })
            .catch(err => {
                console.log(err);
                err.errno === 19 ? 
                res.status(404).json({ errorMessage: "The post with the specified ID does not exist." })
                :
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
    let id = req.params.id;
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

// GET comments by post id 
router.get('/:id/comment', (req, res) => {
    let id = req.params.id;
    Blog.findPostComments(id)
        .then(array => {
            !array[0] ?
                res.status(404).json({ errorMessage: "The post with the specified ID does not exist." })
                :
                res.status(200).json(array)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: "The comments information could not be retrieved." })
        });
});


// DELETE post by id
router.delete('/:id', (req, res) => {
    let id = req.params.id;
    Blog.remove(id)
        .then(num => {
            num < 1 ?
                res.status(404).json({ errorMessage: "The post with the specified ID does not exist." })
                :
                res.status(200).json({ message: "Post successfully deleted." })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: "The post could not be removed" })
        });
});


// PUT (edit) post by id
router.put('/:id', (req, res) => {
    let id = req.params.id;
    let changes = req.body;
    let title = req.body.title;
    let contents = req.body.contents;

    !title || !contents ?
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
        :
        Blog.update(id, changes)
            .then(num => {
                num < 1 ?
                    res.status(404).json({ errorMessage: "The post with the specified ID does not exist." })
                    :
                    Blog.findById(id)
                        .then(post => {
                            res.status(200).json(post[0])
                        })
                        .catch(err => {
                            console.log(err);
                        });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ errorMessage: "The post information could not be modified." })
            });
});


module.exports = router;