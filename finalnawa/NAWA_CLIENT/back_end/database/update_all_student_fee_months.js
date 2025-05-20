import mongoose from "mongoose";
import studentFee_model from "./mongoose_schema/studentFeeRecord_schema.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/nawa_school";

const months = [
  "Baishakh", "Jestha", "Asadhh", "Shrawan", "Bhadra", "Ashwin", "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
];

const defaultMonthObj = { adm_fee: 0, month_fee: 0, comp_fee: 0 };

async function updateAllStudentFeeRecords() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const allRecords = await studentFee_model.find({});
  for (const record of allRecords) {
    let updated = false;
    for (const month of months) {
      if (!record.records[month]) {
        record.records[month] = { ...defaultMonthObj };
        updated = true;
      }
    }
    if (updated) {
      await record.save();
      console.log(`Updated record for studentID: ${record.studentID}`);
    }
  }
  console.log("All student fee records are up to date.");
  await mongoose.disconnect();
}

updateAllStudentFeeRecords().catch(err => {
  console.error("Error updating student fee records:", err);
  mongoose.disconnect();
}); 