

const UserModel = require("../models/user.model.js");
const CartModel = require("../models/cart.model.js");
const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");
class mongoUserDao {

  async registrarUsuario({first_name, last_name, email, password, age}) {
    try {
      const existeUsuario = await UserModel.findOne(email);
      if (existeUsuario) {
          //return res.status(400).send("El usuario ya existe");
          console.log("el usuario ya existe");
      }

      //Creo un nuevo carrito: 
      const nuevoCarrito = new CartModel({ products: [] });
      await nuevoCarrito.save();
       console.log("carrtito creado");
      const nuevoUsuario = new UserModel({
          first_name,
          last_name,
          email,
          password: createHash(password),
          age,
          cart: nuevoCarrito._id, 
          
          age
      });

      await nuevoUsuario.save();
      return nuevoUsuario;

        
    } catch (error) {
        throw new  error("error")
    }
  }

  async BuscarPorEmail (email) {
    try {
        const usuario = await UserModel.findOne(email);
        return usuario;
    } catch (error) {
        throw new  error("error")
    }
  }

  

}

module.exports = mongoUserDao;