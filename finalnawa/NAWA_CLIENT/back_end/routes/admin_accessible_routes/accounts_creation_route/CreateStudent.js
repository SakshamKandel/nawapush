import express from "express";
import tokenVerify from "../../../tokens/token_verify.js";
import student_accountCreate from "../../../controllers/admin/student_account_create_controller.js";

const create_student=express.Router();

create_student.post("/student",tokenVerify,student_accountCreate);

// Debug route to catch incorrect /student:1 requests
create_student.post('/student:bad', (req, res) => {
  console.error('DEBUG: Bad student creation endpoint hit:', req.originalUrl, req.body);
  res.status(400).json({ message: 'Bad student creation endpoint. Check your frontend or scripts for incorrect API calls.' });
});

export default create_student;