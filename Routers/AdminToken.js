const jwt = require("jsonwebtoken");

const check_admin_token = (req, res, next) => {
    try {
        let token = req.headers["x-access-token"] || req.headers["authorization"];

        if (token && token.startsWith("Bearer ")) {
            token = token.slice(7);
        }

        if (!token) {
            throw new Error("Auth token is not supplied");
        }

        jwt.verify(token, "attendance_system_@545", (err, decoded) => {
            if (err) {
                throw new Error("Token is not valid");
            }

            req.decoded = decoded;

            // Check the role claim
            const { role } = decoded;
            if (role !== 'admin') {
                throw new Error("User is Not Authorized");
            }

            next();
        });
    } catch (error) {
        return res.status(401).json({
            Error: error.message || "Unauthorized",
        });
    }
};

module.exports = {
    check_admin_token,
};
