

const generatedUniqueCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const codeLength = 8;
    let code = '';

    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    const timestamp = Date.now().toString(36);
    return code + '-' + timestamp;
}

// Función para calcular el total de la compra
const calcTotal = (products) => {
    let total = 0;

    products.forEach(item => {
        total += item.product.price * item.quantity;
    });

    return total;
}

module.exports = {
    generatedUniqueCode,
    calcTotal
}