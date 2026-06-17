import Product from "../models/Product.js";


/* ----------- PUBLIC: GET ALL PRODUCTS ----------- */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true,
      status: "published",
    }).sort({createdAt: -1});
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};



/* ----------- PUBLIC: GET PRODUCT BY ID ----------- */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
      status: "published",
    }).lean();

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};


// for admin only
/* ----------- ADMIN: ADD PRODUCT ----------- */
export const addProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      isActive: true,
      status: "published",
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ message: "Failed to add product" });
  }
};


// for admin only
/* ----------- ADMIN: UPDATE PRODUCT ----------- */
export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Product not found" });
    else
    res.status(200).json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update product" });
  }
};



// for admin only
/* ----------- ADMIN: DELETE PRODUCT ----------- */
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ message: "Product not found" });
    else
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};


// for admin only
/* ----------- ADMIN: DELETE ALL THE PRODUCTS ----------- */
// Dangerous
 export const deleteAllProducts = async (req, res) => {
  try {
    const result = await Product.deleteMany({});

    res.status(200).json({
      success: true,
      message: "All products deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Delete all products error:", error.message);
    res.status(500).json({ message: "Failed to delete all products" });
  }
};
