

const express = require("express");
const router = express.Router();
const UserController = require ("../controllers/user.controller.js");
const passport = require("passport");
const initializePassport = require("../config/passport.config.js");


//const authMiddleware = require("../middleware/authmiddleware.js");
//const Passport = require("../config/passport.js");

//const { route } = require("./carts.router");
const userController = new UserController();






const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");

const UserDTO = require("../dto/user.dto.js");


router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile",passport.authenticate("jwt", { session: false }),  userController.profile);
router.post("/logout", userController.logout.bind(userController));
router.get("/admin",passport.authenticate("jwt", { session: false }), userController.admin);
 

  

module.exports = router;