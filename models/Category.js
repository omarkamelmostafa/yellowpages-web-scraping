import { Schema, model } from "mongoose";

const categoriesSchema = new Schema({
  _id: ObjectId(),
  pageId: String,
  pageUrl: String,
  pagesCount: Number,
  categories: [
    {
      name: String,
      href: String,
    },
  ],
});

const Categories = model("Categories", categoriesSchema);

export default Categories;
