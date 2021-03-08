export default class User {
    constructor(email, password, name, lastname, carnet, rol) {
        this.name = name;
        this.lastname = lastname;
        this.carnet = carnet;
        this.email = email;
        this.password = password;
        this.rol = rol;
    }
  }