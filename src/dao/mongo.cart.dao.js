
// 
const CartModel = require("../models/cart.model.js");


class mongoCartDao {

    async crearCarrito() {
        

        try {
            const nuevoCarrito = new CartModel({ products: [] });
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            throw new  error("error")
        }
    }
    
    async obtenerProductosDelCarrito(idCarrito) {
        try {
            const carrito = await CartModel.findById(idCarrito);
            if(!carrito) {
                console.log("no existe carrito con ese id")
                return null;
            }
            return carrito;
        } catch (error) {
            throw new  error("error")
        }
    }

    async agregarProductoAlCarrito(cartId, productoId, quantity = 1 ) {

        try {
            const carrito = await this.obtenerProductosDelCarrito(cartId);
            const existeProducto = carrito.products.find(item => item.product._id.toString() === productoId)

            if (existeProducto) {
                existeProducto.quantity += quantity
            } else {
                carrito.products.push({product: productoId, quantity})
            }

            //marcar la propiedad "products" como modificada
            carrito.markModified("products");
            await carrito.save();
            return carrito;
        } catch (error) {
            throw new  error("error")
        }
    }

    async eliminarProducto(cartId, productoId) {
        try {
            const carrito = await CartModel.findById(cartId);
            if(!carrito){
                throw new error("carrito no encontrado");
            }
            carrito.products = carrito.products.filter(item => item.product._id.toString() !== productoId );
            await carrito.save();
            return carrito;
        } catch (error) {
            throw new  error("error")
        }
    }

    async actualizarProductoEnCarrito(cartId, updateProducts ) {
        try {
            const carrito = await CartModel.findById(cartId);
            if(!carrito){
                console.log("no existe carrito")
            }
            carrito.products = updateProducts;
            carrito.markModified("products")
            await carrito.save();
            return carrito;
        } catch (error) {
            throw new  error("error")
        }
    }

    async actualizarCantidadesEnCarrito(cartId, productId, newQuantity) {
        try {
            const carrito = await CartModel.findById(cartId);
            if(!carrito){
                console.log("no existe carrito")
            }

            const productoIndex = carrito.products.findIndex(item => item._id.toString() === productId) 
            if(productoIndex !== -1) {
                carrito.products[productoIndex].quantity = newQuantity
            }
            carrito.markModified("products")
            await carrito.save();
            return carrito;

        } catch (error) {
            throw new  error("error")
        }
    }

    async vaciarCarrito(cartId) {
        try {
            const carrito = await CartModel.findByIdAndUpdate(
                cartId,
                {products: []},
                {new : true}
            );
            if(!carrito){
                throw new error("carrito no exiisteee")
            }
            return carrito;
        } catch (error) {
            throw new  error("error")
        }
    }
}

module.exports = mongoCartDao;