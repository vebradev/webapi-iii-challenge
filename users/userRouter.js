const express = require("express");
const router = express.Router();
const User = require("./userDb");
const Post = require("../posts/postDb");

router.post("/", validateUser, async (req, res) => {
  User.insert(req.body.name)
    .then(data => {
      User.getById(data.id).then(data => {
        res.status(201).json(data);
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Can't to add user to the database"
      });
    });
});

router.post("/:id/posts", validateUserId, validatePost, async (req, res) => {
  const newPost = { text: req.body.text, user_id: req.params.id };
  Post.insert(newPost)
    .then(data => {
      res.status(201).json(data);
    })
    .catch(error => {
      res.status(500).json({ message: "Unable to add post." });
    });
});

router.get("/", (req, res) => {
  User.get()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).json({
        message: "Can't get users."
      });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  User.getById(req.params.id)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).json({
        message: `Can't retrieve user by ID: ${req.params.id}.`
      });
    });
});

router.get("/:id/posts", validateUserId, async (req, res) => {
  User.getUserPosts(req.params.id)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(error => {
      res.status(500).json({
        message: `Can't retrieve posts for user with ID: ${req.params.id}.`
      });
    });
});

router.delete("/:id", validateUserId, async (req, res) => {
  User.remove(req.params.id)
    .then(data => {
      res.status(200).json({
        message: `User with ID: ${req.params.id} has been deleted.`
      });
    })
    .catch(err => {
      res.status(500).json({
        message: `Can't delete user with ID: ${req.params.id}.`
      });
    });
});

router.put("/:id", validateUserId, validateUser, async (req, res) => {
  User.update(req.params.id, req.body)
    .then(data => {
      User.getById(req.params.id).then(data => {
        res.status(201).json(data);
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: `Can't update user with ID: ${req.params.id}.`
      });
    });
});

//custom middleware

async function validateUserId(req, res, next) {
  const user = await User.getById(req.params.id);

  if (user) {
    req.user = user;
    next();
  } else {
    res.status(400).json({
      error: `No such user with ID ${req.params.id}.`
    });
  }
}

function validateUser(req, res, next) {
  if (Object.keys(req.body) == 0) {
    res.status(400).json({
      message: "Missing user data."
    });
  } else if (req.body.name) {
    next();
  } else {
    res.status(400).json({
      message: "Missing required name field."
    });
  }
}

function validatePost(req, res, next) {
  if (Object.keys(req.body) == 0) {
    res.status(400).json({
      message: "Missing post data"
    });
  } else if (req.body.text) {
    next();
  } else {
    res.status(400).json({
      message: "Missing required text field"
    });
  }
}

module.exports = router;
