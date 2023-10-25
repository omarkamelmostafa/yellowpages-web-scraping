import { Schema, model } from "mongoose";

const companySchema = new Schema({
  _id: ObjectId(),
  companyId: String,
  companyName: String,
  companyAddress: String,
  companyLogo: String,
  companyPhoneNumbers: String,
  companyWebsite: String,
  companyWhatsapp: String,
  companyAbout: String,
  companyDescription: String,
  companyCategory: String,
  companyKeywords: String,
  companyBranches: String,
  workingHours: [
    {
      dayOfWeekOfWeek: String,
      workHours: String,
    },
  ],
});

const Company = model("Company", companySchema);

export default Company;
