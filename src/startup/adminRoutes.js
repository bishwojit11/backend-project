const express = require("express");
const expressApp = express(); 
const adminUserDeserialization = require("../common/middlewares/adminUserDeserialization")

const router = express.Router();
function getAdminRouter(){
    router.use("/", require("../adminAuth/routes"))
    router.use(adminUserDeserialization)
    router.use("/bookings" ,require("../booking/routes/adminBookingRoutes"))
    return router
}

/**
 *
 * @param {expressApp} app
 */
module.exports = function (app) {
    app.use("/admin", getAdminRouter() )
    
};
