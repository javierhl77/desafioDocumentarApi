



const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cart.controller.js");
const cartController = new CartController();

//crear-inicializar carrito con array de productos vacio
router.post("/", cartController.nuevoCarrito);



router.post("/:cid/product/:pid", cartController.agregarProductoEnCarrito);


router.delete("/:cid/product/:pid", cartController.eliminarProductoDeCarrito);

router.put("/:cid", cartController.actualizarProductoDeCarrito); 

router.put("/:cid/product/:pid", cartController.actualizarCantidades);

router.delete("/:cid", cartController.vaciarCarrito);


// mostrar el carrito correspondiente a su id
router.get("/:cid", cartController.obtenerProductoDeCarrito);

router.post("/:cid/purchase", cartController.finalizarCompra);


module.exports = router;