import express from "express"
import multer from "multer"
import path from "path"
import noticeController from "../../../controllers/admin/notice_controller.js"
import tokenVerify from "../../../tokens/token_verify.js"

const admin_notice_route=express.Router()


const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(process.cwd(),"public","notice_files"))
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

const upload=multer({storage:storage})

admin_notice_route.post("/create-notice",tokenVerify,upload.single("attachments"),noticeController)

admin_notice_route.delete("/delete/notice/:id", tokenVerify, async (req, res) => {
  try {
    const noticeId = req.params.id;
    const deleted = await (await import("../../../database/mongoose_schema/notice_schema.js")).default.findByIdAndDelete(noticeId);
    if (!deleted) {
      return res.status(404).json({ message: "Notice not found" });
    }
    res.json({ message: "Notice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default admin_notice_route