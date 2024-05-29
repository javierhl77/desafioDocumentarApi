

require("dotenv").config();

const config = {
    persistence: process.env.PERSISTENCE //|| "mongo"
    //Mongo es la opción por defecto
};

module.exports = config; 