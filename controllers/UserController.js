const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.postAddUser = (req, res, next) => {
    const { name, email, password } = req.body;
    if(!name || !email || !password) {
        res.status(400).json({ msg: "All Field are required" })
    }else {
        let hashedPassword;
        User.findOne({
            where: { email }
        }).then(user => {
            if(user) {
                return res.status(400).json({ msg: "User already exists" })
            }
        }).catch(err => next(err))
        try {
            const salt = bcrypt.genSaltSync(10);
            hashedPassword = bcrypt.hashSync(password, salt);
        } catch (error) {
            throw error;
        }
        User.create({
            name,
            email,
            password: hashedPassword
        }).then(user => {
            jwt.sign(
                { id: user.id }, 
                process.env.AUTH_SECRET_KEY, 
                (err, token) => {
                    res.json({
                        token,
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email
                        }
                    })
                });
        }).catch(err => res.status(500).json({ msg: "An error occured", error: err }))
    }
}
