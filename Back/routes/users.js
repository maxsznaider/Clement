const router = require("express").Router()
const { User } = require("../models")
const { Op } = require("sequelize")
const { checkToken } = require("../middleware/jswt")
const jswt = require("jsonwebtoken")
const { checkAdmin } = require("../middleware/isAdmin")

router.get("/admin/all/:id/:isAdmin", checkAdmin, (req, res) => {
  User.findAll({
    where: { id: { [Op.ne]: req.params.id } }, // Menos el del req.params.id
  })
    .then((users) => {
      res.status(200).json(users)
    })
    .catch((err) => {
      console.log(err)
      res.sendStatus(400)
    })
})

router.put("/:id", (req, res) => {
  User.update(req.body, {
    where: { id: req.params.id },
    returning: true,
    plain: true,
  })
    .then((userUpdated) => {
      res.status(200).json(userUpdated[1])
    })
    .catch((err) => {
      console.log(err)
      res.sendStatus(400)
    })
})

router.delete("/:id", (req, res) => {
  User.destroy({
    where: { id: req.params.id },
  })
    .then(() => {
      res.status(200).send()
    })
    .catch((err) => {
      console.log(err)
      res.sendStatus(400)
    })
})

router.post("/register", (req, res) => {
  const { email, password, name, lastName } = req.body
  if (!email) res.status(500).send("Please enter an email address")
  else if (!name) res.status(500).send("Please enter a first name")
  else if (!lastName) res.status(500).send("Please enter a last name")
  else if (!password) res.status(500).send("Please enter a password")
  else
    User.findOne({ where: { email: req.body.email } }).then((user) => {
      if (user) res.status(400).send("Email address already in use.")
      else
        return User.create(req.body).then((user) => {
          const token = jswt.sign(
            { id: user.id, isAdmin: user.isAdmin },
            "ecommerce"
          )
          res.status(201).json({ token, user })
        })
    })
})

router.post("/login", (req, res) => {
  const { email, password } = req.body
  if (!email) res.status(500).send("Please enter an email address")
  else if (!password) res.status(500).send("Please enter a password")
  else
    User.findOne({
      where: {
        email,
      },
    }).then((user) => {
      if (!user) return res.status(400).send("No user with that email address")
      else if (!user.validPassword(password))
        return res.status(401).send("Invalid email or password")
      else {
        const token = jswt.sign(
          { id: user.id, isAdmin: user.isAdmin },
          "ecommerce"
        )
        res.status(200).json({ token, user })
      }
    })
})

router.get("/private/:token", checkToken, (req, res) => {
  res.status(200).send(req.user)
})

router.get("/admin", (req, res) => {
  User.findAll()
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((err) => {
      console.log(err)
      res.status(500)
    })
})

router.put("/admin/updateuser", (req, res) => {
  const { id, isAdmin } = req.body
  User.update(
    { isAdmin: !isAdmin },
    {
      where: {
        id: id,
      },
      returning: true,
      plain: true,
    }
  )
    .then((updatedUser) => res.send(updatedUser[1]))
    .catch((err) => console.log(err))
})

module.exports = router
