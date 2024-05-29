

const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cart.controller.js");
const cartController = new CartController();
const cartModel = require("../models/cart.model.js");

const ProductController = require("../controllers/product.controller.js");
const productController = new ProductController();

const productRepository = require("../repositories/product.repository.js");
const ProductRepository = new productRepository();

/*  const ProductManager = require("../controllers/product-manager-db.js");

const productManager = new ProductManager(); */


router.get("/products", async (req, res) => {
   try {
      const { limit = 2 ,page = 1 } = req.query;
      const productos = await ProductRepository.getAll({
         page: parseInt(page),
         limit: parseInt(limit)
      });

      const nuevoArray = productos.docs.map(producto => {
         const { _id, ...rest } = producto.toObject();
         return rest;
      });

      
      res.render("products", {
         productos: nuevoArray,
         hasPrevPage: productos.hasPrevPage,
         hasNextPage: productos.hasNextPage,
         prevPage: productos.prevPage,
         nextPage: productos.nextPage,
         currentPage: productos.page,
         totalPages: productos.totalPages
      });

   } catch (error) {
      console.error("Error al obtener productos", error);
      res.status(500).json({
         status: 'error',
         error: "Error interno del servidor"
      });
   }
});
 



router.get("/carts/:cid", async (req, res) => {
   const cartId = req.params.cid;
   
   try {
      const carrito = await cartModel.findById(cartId)//.populate("products");
      console.log(JSON.stringify(carrito, null, 2));
      if (!carrito) {
         console.log("No existe ese carrito con el id");
         return res.status(404).json({ error: "Carrito no encontrado" });
      }

      const productosEnCarrito = carrito.products.map(item => ({
         product: item.product.toObject(),
         quantity : item.quantity
      })
   );


      res.render("carts", { productos : productosEnCarrito });
   } catch (error) {
      console.error("Error al obtener el carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
   }
});




router.get("/", async(req,res) => {
    res.render("chat");
})

module.exports = router;