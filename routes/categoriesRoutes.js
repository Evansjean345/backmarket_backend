const router = require("express").Router();
const {
  getAllCategories,
  addCategory,
  addSubCategory,
  addCategoriesAndSubCategories,
} = require("../controllers/categoriesController");


router.get("/getAllCategories", getAllCategories);
router.post("/addCategory", addCategory);
router.post("/addSubCategory", addSubCategory);
router.post("/addMultipleCategories", addCategoriesAndSubCategories);

module.exports = router;