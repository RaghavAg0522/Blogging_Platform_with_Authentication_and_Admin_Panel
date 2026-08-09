const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// REGISTER USER
exports.register = async (req, res) => {
    console.log("REGISTER API HIT");
    console.log(req.body);

    const { name, email, password } = req.body;

    try {

        if (!name || !email || !password) {
            return res.status(400).json({
                msg: "All fields are required"
            });
        }


        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                msg: "User already exists"
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10);


        user = new User({
            name,
            email,
            password: hashedPassword
        });


        await user.save();


        return res.status(201).json({
            success: true,
            msg: "Registered successfully"
        });


    } catch (err) {

        console.log("REGISTER ERROR:", err);

        return res.status(500).json({
            msg: err.message
        });
    }
};



// LOGIN USER
exports.login = async (req, res) => {

    const { email, password } = req.body;


    try {

        if (!email || !password) {
            return res.status(400).json({
                msg: "Email and password required"
            });
        }


        const user = await User.findOne({ email });


        if (!user) {
            return res.status(400).json({
                msg: "Invalid credentials"
            });
        }


        const isMatch = await bcrypt.compare(
            password,
            user.password
        );


        if (!isMatch) {
            return res.status(400).json({
                msg: "Invalid credentials"
            });
        }



        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );


        return res.json({
            success: true,
            message: "Login Successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });


    } catch (err) {

        console.log("LOGIN ERROR:", err);

        return res.status(500).json({
            msg: err.message
        });
    }
};