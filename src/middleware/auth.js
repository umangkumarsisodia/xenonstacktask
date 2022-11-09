const jwt = require("jsonwebtoken");
const db = require("../db");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.user;
        const verifyUser = jwt.verify(token, "mynameisumangkumarsisodiamernstackdeveloper");
        const user = await db.Account.findOne({_id: verifyUser._id});
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send(error);
    }
}

module.exports = auth;