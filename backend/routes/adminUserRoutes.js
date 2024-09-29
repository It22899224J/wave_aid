const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminUserController");

router.put("/update-user/:userId", adminController.updateUser);
router.delete("/delete-user/:userId", adminController.deleteUser);

module.exports = router;
