const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();

const TicketModel = require("../models/ticket.model.js");
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const UserModel = require("../models/user.model.js");

const { generatedUniqueCode, calcTotal } = require("../utils/cartutils.js");

class CartController {
  async nuevoCarrito(req, res) {
    try {
        const nuevoCarrito = await cartRepository.CreateCart();
        res.json(nuevoCarrito);
    } catch (error) {
        res.status(500).send("Error");
    }
  }

  async obtenerProductoDeCarrito(req, res) {
    const carritoId = req.params.cid;
    try {
        const productos = await cartRepository.GetProductsCart(carritoId);
        console.log(productos);
        res.json(productos);

    } catch (error) {
        res.status(500).send("error")
    }
  }


  async agregarProductoEnCarrito(req, res){
    const cartId = req.params.cid;
    const productoId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        await cartRepository.AddProductsCart(cartId, productoId, quantity);
        res.send("producto Agregado");
        
    } catch (error) {
      res.status(500).send("error")
    }
  }

  async eliminarProductoDeCarrito(req, res) {
    const cartId = req.params.cid;
    const productoId = req.params.pid;

    try {
      const carrito = await cartRepository.DeleteProductCart(cartId, productoId)
      res.json({
        status: "succes",
        message: "producto eliminado correctamente",
        carrito
      })
    } catch (error) {
      res.status(500).send("error")
    }

  }

  async actualizarProductoDeCarrito(req, res) {
    const cartId = req.params.cid;
    const updateProducts = req.body;
    try {
      const carrito = await cartRepository.UpdateProductCart(cartId, updateProducts);
      res.json({
        status: "succes",
        message: "producto actualizado correctamnete",
        carrito
      })
    } catch (error) {
      res.status(500).send("error")
    }
  }
  async actualizarCantidades(req, res) {
    const cartId = req.params.cid;
    const productoId = req.params.pid;
    const newQuantity = req.body.quantity;
    try {
      const carrito = await cartRepository.UpdateQuantityProductCart(cartId, productoId, newQuantity);
      res.json({
        status: "succes",
        message: "carrito actualizado en sus cantidades",
        carrito 
      })
    } catch (error) {
      res.status(500).send("error")
    }
  }

  async vaciarCarrito(req,res) {
    const cartId = req.params.cid;
    try {
      const carrito = await cartRepository.EmptyCart(cartId);

      res.json({
        status: "succes",
        message: "productos eliminados del carrito",
        carrito 
      })
    } catch (error) {
      
    }
  }

  //finalizar compra (purchase)

  async finalizarCompra(req, res) {
    const cartId = req.params.cid;
    try {
        // Obtener el carrito y sus productos
        const cart = await cartRepository.GetProductsCart(cartId);
        const products = cart.products;

        // Inicializar un arreglo para almacenar los productos no disponibles
        const productosNoDisponibles = [];

        // Verificar el stock y actualizar los productos disponibles
        for (const item of products) {
            const productId = item.product;
            const product = await productRepository.getById(productId);
            if (product.stock >= item.quantity) {
                // Si hay suficiente stock, restar la cantidad del producto
                product.stock -= item.quantity;
                await product.save();
            } else {
                // Si no hay suficiente stock, agregar el ID del producto al arreglo de no disponibles
                productosNoDisponibles.push(productId);
            }
        }

        const userWithCart = await UserModel.findOne({ cart: cartId });

        // Crear un ticket con los datos de la compra
        const ticket = new TicketModel({
            code: generatedUniqueCode(),
            purchase_datetime: new Date(),
            amount: calcTotal(cart.products),
            purchaser: userWithCart._id
        });
        await ticket.save();

        // Eliminar del carrito los productos que sí se compraron
        cart.products = cart.products.filter(item => productosNoDisponibles.some(productId => productId.equals(item.product)));

        // Guardar el carrito actualizado en la base de datos
        await cart.save();

        res.status(200).json({ productosNoDisponibles });
    } catch (error) {
        console.error('Error al procesar la compra:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
}

module.exports = CartController;