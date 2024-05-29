class UserDTO {
    constructor(first_name, last_name, role) {
        this.nombre = first_name;
        this.apellido = last_name;
        this.role = role;
    }
}

module.exports = UserDTO;