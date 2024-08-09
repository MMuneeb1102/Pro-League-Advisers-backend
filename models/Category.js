import { Schema, model } from 'mongoose';
 const categorySchema = new Schema({
    categoryName: {
        type: String,
        required: true
    },

    description: {
        type: String,
    }
 })

 const Category = model('category', categorySchema);
 export default Category;