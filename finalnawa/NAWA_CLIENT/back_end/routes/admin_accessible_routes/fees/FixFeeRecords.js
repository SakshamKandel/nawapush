import express from "express";
import tokenVerify from "../../../tokens/token_verify.js";
import fixStudentFees from "../../../fix-student-fees.js";

const fixFeeRecordsRouter = express.Router();

// POST endpoint to fix student fee records
fixFeeRecordsRouter.post("/fix-fee-records", tokenVerify, async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(403).json({ 
        message: "Unauthorized access. Only admin can fix fee records." 
      });
    }
    
    console.log("Admin initiated student fee records fix");
    const result = await fixStudentFees();
    
    if (result.success) {
      res.status(200).json({
        message: "Student fee records fixed successfully",
        ...result
      });
    } else {
      res.status(500).json({
        message: "Failed to fix student fee records",
        error: result.error
      });
    }
  } catch (error) {
    console.error("Error fixing student fee records:", error);
    res.status(500).json({ 
      message: "An unexpected error occurred", 
      error: error.message 
    });
  }
});

export default fixFeeRecordsRouter; 