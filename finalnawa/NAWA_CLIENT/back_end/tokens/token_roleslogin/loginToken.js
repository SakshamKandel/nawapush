import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv();

const token_login = async (req, res) => {
  try {
    console.log('User type:', req.userType); // Debug log
    
    const pay_load = {
      user: {
        id: req.data._id,
        role: req.userType.charAt(0).toUpperCase() + req.userType.slice(1) // Capitalize first letter
      },
    };
    console.log('Token payload:', pay_load); // Debug log
    
    const token = jwt.sign(pay_load, process.env.SECRET_KEY);
    if (req.userType === "teacher") {
      res.cookie("teacherToken", token, {
        secure: true,
        sameSite: "strict",
      });
    } else if (req.userType === "admin") {
      res.cookie("adminToken", token, {
        secure: true,
        sameSite: "strict",
      });
    } else {
      res.cookie("studentToken", token, {
        secure: true,
        sameSite: "strict",
      });
    }
    res.json({alertMsg:"Logged In Successfully",name:req.data.name, email:req.data.email})
  } catch (error) {
    console.log('Token generation error:', error); // Debug log
    return res.status(404).send(error.message);
  }
};

export default token_login;
