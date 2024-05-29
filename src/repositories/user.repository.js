

//const Userfactory = require("../dao/userFactory");
//const userService = new Userfactory();

const UserModel = require("../models/user.model.js");
const CartModel = require("../models/cart.model.js");

const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");

class UserRepository {


/*     async findByEmail({email}) {
        try {
            const usuario = await UserModel.findOne({email});
            return usuario;
        } catch (error) {
            throw new  error("error")
        }
    }
 */
    async RegisterUser({first_name, last_name, email, password, age}) {



        try {
            
            const carrito = new CartModel({products: []});
            await carrito.save();
            const user = await UserModel.findOne({email});
            if(user) {
                throw new Error("El usuario ya existe");
            }

             nuevoUsuario = new UserModel({
                first_name, 
                last_name, 
                email, 
                password: createHash(password),
                age,
                cart: carrito._id
            });
            
            await nuevoUsuario.save();
            console.log("usuario creado");
            return nuevoUsuario;
            
        } catch (error) {
            throw new  error("error")
        }
    }
}

module.exports = UserRepository;