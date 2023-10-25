import { Schema, model } from "mongoose";

const companiesUrlsSchema = new Schema({
  _id: ObjectId(),
  categoryName: String,
  pageId: String,
  pageUrl: String,
  pagesCount: Number,
  companiesUrls: [],
});

const CompaniesUrls = model("CompaniesUrls", categoriesSchema);

export default CompaniesUrls;
