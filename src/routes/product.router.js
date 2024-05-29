const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/product.controller.js");
const productController = new ProductController();


router.post("/", productController.agregarProducto);
router.get("/", productController.listarProductos);

module.exports = router;