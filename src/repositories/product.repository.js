const productFactory = require("../dao/product.Factory");
const ProductService = new productFactory();

class ProductRepository {
 async addProduct(product) {
    try {
          const nuevoProducto = await ProductService.addProduct(product);
          return nuevoProducto;
        
    } catch (error) {
        throw new  error("error");
    }
 }

 async getAll(limit, page, sort, query ){
    try {
        const nuevoProducto = await ProductService.getProducts(limit, page, sort, query );
        return nuevoProducto;
        
    } catch (error) {
        throw new  error("error");
    }
 }
 async getById(pid){
    try {
        const producto = await ProductService.getProductsById(pid);
        return producto;
        
    } catch (error) {
        throw new  error("error");
    }
 }
 async updateProducts(id, productoActualizado) {
    try {
        const producto = await ProductService.updateProduct(id, productoActualizado);
        return producto;
        
    } catch (error) {
        throw new  error("error");
    }
 }
 async deleteProd(pid) {
    try {
        const producto = await ProductService.deleteProduct(pid);
        return producto;
        
    } catch (error) {
        throw new  error("error");
    }
 }

 

}

module.exports = ProductRepository;