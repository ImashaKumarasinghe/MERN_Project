
import User from "../../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export function createUser(req, res){
    // ❌ ERROR 2 FIXED: Validate required fields before hashing
    if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password) {
        return res.status(400).json({
            message: "Missing required fields: firstname, lastname, email, password"
        });
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role 
    });

    user.save()
        .then((data) => {
            res.status(201).json({ 
                message: "User created successfully",
                user: {
                    email: data.email,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    role: data.role
                }
            });
        })
        .catch((error) => {
            res.status(500).json({ 
                message: "Failed to create user", 
                error: error.message 
            });
        });
}

export function loginUser(req, res){
    // ❌ ERROR 3 FIXED: Added validation for email and password
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email})
        .then((user) => {
            if(user == null){
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const isPasswordCorrect = bcrypt.compareSync(password, user.password);
            
            if(isPasswordCorrect){
                // ❌ ERROR 4 FIXED: Removed .env.JWT_KEY syntax error
                // ✅ FIXED: Use process.env.JWT_KEY or fallback to hardcoded value
                const token = jwt.sign(
                    {
                        email: user.email,
                        firstname: user.firstname,  // ✅ FIXED: Changed firstName to firstname (match schema)
                        lastname: user.lastname,    // ✅ FIXED: Changed lastName to lastname (match schema)
                        role: user.role,
                        img: user.img,
                        userId: user._id  // ✅ Added userId for future use
                    }, 
                    process.env.JWT_KEY 
                );

                return res.json({
                    message: "Login successful",
                    token: token,
                    role: user.role,
                    user: {
                        email: user.email,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        role: user.role
                    },
                    
                });
            }else{
                return res.status(401).json({
                    message: "Invalid password"
                });
            }
        })
        .catch((error) => {
            res.status(500).json({
                message: "Internal server error",
                error: error.message
            });
        });
}

// ✅ FIXED: Added proper null/undefined check
export function isAdmin(req) {
    // ❌ ERROR 5 FIXED: Changed === null to !req.user (handles both null and undefined)
    if (!req.user) {
        return false;
    }
    
    return req.user.role === "admin";
}

export async function loginWithGoogle(req, res) { 
    const token = req.body.accessToken;
    if(token == null){
        return res.status(400).json({
            message: "Access token is required"
        });
        return;
    } 
    const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    console.log(response.data);


}
