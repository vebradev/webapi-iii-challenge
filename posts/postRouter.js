const express = require("express");
const router = express.Router();
const Post = require("./postDb");

router.get("/", (req, res) => {
  Post.get()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(500).json({
        message: "Failed to load posts."
      });
    });
});

router.get("/:id", validatePostId, async (req, res) => {
  Post.getById(req.params.id)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(500).json({
        message: `Can't load post with ID: ${req.params.id}`
      });
    });
});

router.delete("/:id", validatePostId, async (req, res) => {
  Post.remove(req.params.id)
    .then(data => {
      res.status(200).json({
        message: "Thanks to you this post was deleted."
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Can't delete this post."
      });
    });
});

router.put("/:id", validatePostId, validatePost, async (req, res) => {
  const newPost = req.body;
  Post.update(req.params.id, newPost)
    .then(data => {
      Post.getById(req.params.id).then(data => {
        res.status(200).json(data);
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Can't update post."
      });
    });
});

// custom middleware

async function validatePostId(req, res, next) {
  const post = await Post.getById(req.params.id);
  if (post) {
    req.post = post;
    next();
  } else {
    res.status(400).json({ message: "Invalid post ID" });
  }
}

function validatePost(req, res, next) {
  if (Object.keys(req.body) == 0) {
    res.status(400).json({ message: "Missing post data" });
  } else if (req.body.text) {
    next();
  } else {
    res.status(400).json({ message: "Missing required text field" });
  }
}

module.exports = router;
