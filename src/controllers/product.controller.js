

const productRepository = require("../repositories/product.repository.js");
const ProductRepository = new productRepository();

class productController {

    async agregarProducto (req,res) {
        const {title, description, price, img, code, stock, category, thumbnails} = req.body;
        try {
            const nuevoProducto = await ProductRepository.addProduct({title, description, price, img, code, stock, category, thumbnails});
            res.status(200).send("producto agregado con exito");
        } catch (error) {
            res.status(500).send("error")
        }

    }
    async listarProductos (req,res) {
        const {limit, page, sort, query} = req.query;
        try {
            const productos = await ProductRepository.getAll({limit, page, sort, query});
            res.status(200).send(productos);
        } catch (error) {
            res.status(500).send("error")
        }
    }
    async listarProductosPorId (req,res) {
        try {
            
        } catch (error) {
            res.status(500).send("error")
        }
    }
    async actualizarProducto (req,res) {
        try {
            
        } catch (error) {
            res.status(500).send("error")
        }
    }
    async eliminarProducto (req,res) {
        try {
            
        } catch (error) {
            res.status(500).send("error")
        }
    }
}

module.exports = productController;