import express from "express";
import tokenVerify from "../../../tokens/token_verify.js";
import removeStudentController from "../../../controllers/admin/remove_student_controller.js";

const remove_student = express.Router();

// DELETE /remove-student/:id
remove_student.delete("/:id", tokenVerify, removeStudentController);

export default remove_student; 