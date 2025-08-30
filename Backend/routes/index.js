const express = require("express");
const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/carpool", require("./carpoolRoutes"));
router.use("/rental", require("./rentalRoutes"));
router.use("/admin", require("./adminRoutes"));

module.exports = router;
