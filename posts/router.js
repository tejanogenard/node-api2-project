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


module.exports = router