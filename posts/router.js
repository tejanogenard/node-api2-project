const express = require("express")
const posts = require("../data/db")
const router = express.Router()


//GET enpoint returns the array of posts inside the data base
router.get("/", (req, res) => {
    posts.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            console.log("Error getting posts from the database", err)
            res.status(500).json({
                error: "Posts could not be retrieved"
            })
        })
})

//GET endpoint returns the endpoint of a specific post by the ID 
router.get("/:id", (req, res) => {
    posts.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json({
                    post
                })
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }
        })
        .catch(err => res.status(500).json({
            error: "The post could not be removed"
        }))
})

//GET endpoint returns an array of all the comments associated with the post id 
router.get("/:id/comments", (req, res) => {
    posts.findCommentById(req.params.id)
        .then(comments => {
            if (comments.length) {
                res.status(200).json(comments)
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }
        })
        .catch(err => res.status(500).json({
            error: "The comments information could not be retrieved."
        }))
})

//POST endpoint creates a comment for a post with the specific ID 
router.post('/:id/comments', (req, res) => {
    if (req.body.text.length) {
        posts.insertComment(req.body)
            .then(comment => {
                res.status(201).json({
                    comment
                })
            })
            .catch(err => res.status(500).json({
                error: "There was an error while saving the comment to the database"
            }))
    } else {
        res.status(400).json({
            errorMessage: "Please provide text for the comment."
        })
    }
})

// POST endpoint returns the array with an added post 
router.post("/", (req, res) => {
    const rePost = req.body
    if (!rePost.title || !rePost.contents) {
        res.status(400).json({
            error: "Please provide a title and it's contents"
        })
    } else if (rePost.title && rePost.contents) {
        posts
            .insert(rePost)
            .then(post => {
                res.status(201).json(post)
            })
            .catch(err => {
                console.log("Error adding post to the database", err)
                res.status(500).json({
                    error: "error adding post to the databse"
                })
            })
    }
})

// PUT endpoint Updates a post with a specific ID 
// router.put('/:id', (req, res) =>{
//     posts.update(req.params, req.body)
//     .then(post => {
//         res.status(201).json({post})
//     })
//     .catch( err => res.status(500).json({ error: "The post information could not be modified." }))
// })
router.put("/:id", (req, res) => {
    const {
        id
    } = req.params;
    const data = req.body;

    posts.findById(id).then(post => {
        if (!post.length) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else if (post.length) {
            if (!data.title || !data.contents) {
                res.status(400).json({
                    errorMessage: "Please provide title and contents for the post"
                })
            } else if (data.title && data.contents) {
                posts.update(id, data)
                    .then(upd => {
                        res.status(200).json(data);
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: "The post information could not be modified"
                        });
                    });
            }
        }
    });
});

//DELETE endpoint by specific id

router.delete('/:id', (req, res) => {
    posts.remove(req.params.id)
    .then(post => {
        res.status(201).json({post})
    })
    .catch(err => {
        res.status(500).json({
            error: "The post could not be removed"
        })
    })
})


module.exports = router