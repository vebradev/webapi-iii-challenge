const express = require("express");
const router = express.Router();
const User = require("./userDb");

router.post("/", (req, res) => {});

router.post("/:id/posts", (req, res) => {});

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

router.get("/:id/posts", (req, res) => {});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {});

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

function validateUser(req, res, next) {}

function validatePost(req, res, next) {}

module.exports = router;
