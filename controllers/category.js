const router = require("express").Router();

const logger = require("../middlewares/logger");
const CategoryModel = require("../models/category");
const Sub_CategoryModel = require("../models/sub_category");
const { customAlphabet } = require('nanoid/non-secure');

const nanoid = customAlphabet('123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)


router.post("/create", async (req, res) => {
    try {
        const { category_name } = req.body;
        CategoryModel.findOne({ category_name: category_name }).then(exists => {
            if (exists) {
                return res.status(400).json({ message: "Category already exists" });
            } else {
                const category_id = nanoid();
                CategoryModel.create({
                    category_id: category_id,
                    category_name: category_name
                }).then(cat => {
                    cat.save().then(saved => {
                        res.status(200).json(saved);

                    }).catch(error => {
                        logger.error(`Error while crreating category, ${error}`)
                        return res.status(400).json({ message: error })
                    });

                }).catch(error => {
                    logger.error(`Error while crreating category, ${error}`)
                    return res.status(400).json({ message: error })
                });
            }
        })
    } catch (error) {
        logger.error(`Error while crreating category, ${error}`)
        return res.status(500).json({ message: "Server error while processing your request, try again" })
    }

});

router.post("/sub_category/create", async (req, res) => {
    try {
        const { sub_category_name,category_id } = req.body;
        Sub_CategoryModel.findOne({ sub_category_name: sub_category_name }).then(exists => {
            if (exists) {
                return res.status(400).json({ message: "Sub Category already exists" });
            } else {
                const sub_category_id = nanoid();
                Sub_CategoryModel.create({
                    category_id:category_id,
                    sub_category_id: sub_category_id,
                    sub_category_name: sub_category_name
                }).then(cat => {
                    cat.save().then(saved => {
                        res.status(200).json(saved);

                    }).catch(error => {
                        logger.error(`Error while creating Sub category, ${error}`)
                        return res.status(400).json({ message: error.message })
                    });

                }).catch(error => {
                    logger.error(`Error while creating Sub category, ${error}`)
                    return res.status(400).json({ message: error.message })
                });
            }
        })
    } catch (error) {
        logger.error(`Error while creating Sub category, ${error}`)
        return res.status(500).json({ message: "Server error while processing your request, try again" })
    }

});
router.get("/category", async (req, res) => {
    try {
        const { category_id } = req.query;
        CategoryModel.aggregate([
            { $match:{category_id: category_id }},
            {
                $lookup: {
                    from: "sub_categories",
                    let: { category_id: "$category_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$category_id", "$$category_id"] } } },
                      
                    ],
                    as: "sub_categories"
                }
            },
        ]).then(exists => {
            if (exists.length<1) {
                return res.status(404).json({ message: "Category not found" });
            } else {
                res.status(200).json(exists);      
            }
        }).catch(error => {
            logger.error(`Error while retriving category, ${error}`)
            return res.status(400).json({ message: error })
        });
    } catch (error) {
        logger.error(`Error while retriving category, ${error}`)
        return res.status(500).json({ message: "Server error while processing your request, try again" })
    }

});
router.post("/update", async (req, res) => {
    try {
        const { category_name,category_id } = req.body;
        CategoryModel.findOne({ category_name: category_name }).then(exists => {
            if (exists) {
                return res.status(404).json({ message: "Category not found" });
            } else {
               
                CategoryModel.findOneAndUpdate(
                    {category_id:category_id},
                    {$set:{category_name: category_name?category_name:exists.category_name}},
                    {new:true}
                ).then(cat => {
                   
                        res.status(200).json(cat);

                }).catch(error => {
                    logger.error(`Error while updating category, ${error}`)
                    return res.status(400).json({ message: error })
                });
            }
        })
    } catch (error) {
        logger.error(`Error while updating category, ${error}`)
        return res.status(500).json({ message: "Server error while processing your request, try again" })
    }

});
router.post("/update/sub_category", async (req, res) => {
    try {
        const { sub_category_name,category_id,sub_category_id } = req.body;
        Sub_CategoryModel.findOne({ sub_category_id: sub_category_id }).then(exists => {
            if (exists) {
                return res.status(404).json({ message: "Sub category not found" });
            } else {
               
                Sub_CategoryModel.findOneAndUpdate(
                    {sub_category_id:sub_category_id},
                    {$set:{sub_category_name: sub_category_name?sub_category_name:exists.sub_category_name,category_id:category_id?category_id:exists.category_id}},
                    {new:true}
                ).then(cat => {
                   
                        res.status(200).json(cat);

                }).catch(error => {
                    logger.error(`Error while updating sub category, ${error}`)
                    return res.status(400).json({ message: error })
                });
            }
        })
    } catch (error) {
        logger.error(`Error while updating sub category, ${error}`)
        return res.status(500).json({ message: "Server error while processing your request, try again" })
    }

});
module.exports = router;