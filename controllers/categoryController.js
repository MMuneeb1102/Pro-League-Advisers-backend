import Category from '../models/Category.js';

const createCategory = async (req, res) =>{
    try {
        const checkExistingCat = await Category.findOne({categoryName: req.body.categoryName});
        if(checkExistingCat){
            return res.status(401).json({success: false, message: "This category already exists!"});
            }
        const category = await Category.create({
            categoryName: req.body.categoryName
            })
        res.status(201).json({success: true, message: "Category created successfully!!"})
        
        } catch (error) {
            return res.status(400).json({success: false, message: "Error while creating category!"});
    }
}

export default createCategory;