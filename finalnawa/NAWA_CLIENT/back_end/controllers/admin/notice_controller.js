import notice_model from "../../database/mongoose_schema/notice_schema.js";
import adminSchema_model from "../../database/mongoose_schema/admin_schema.js";
import teachersSchema_model from "../../database/mongoose_schema/teachers_schema.js";

const noticeController = async (req, res) => {
  try {
    // Set the current date with time set to LOCAL midnight
    const now = new Date();
    const localDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let result = null;
    if (req.file) {
      result = await notice_model.create({
        adminID: req.user.id,
        noticecategory: req.body.noticecategory,
        targetaudience: req.body.targetaudience,
        noticetitle: req.body.noticetitle,
        noticedes: req.body.noticedes,
        attachments: req.file.originalname,
        date: localDate
      });
    } else {
      result = await notice_model.create({
        adminID: req.user.id,
        noticecategory: req.body.noticecategory,
        targetaudience: req.body.targetaudience,
        noticetitle: req.body.noticetitle,
        noticedes: req.body.noticedes,
        date: localDate
      });
    }
    res.json({ alertMsg: "Posted Notice Successfully", dateOF: result.date });
  } catch (error) {
    res.status(404).send(error.message);
  }
};

export default noticeController;
