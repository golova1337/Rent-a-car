class Users {
  constructor(name, lastName, email) {
    if (!name || !lastName || !email) {
      throw new Error("Не все обязательные параметры были переданы");
    }
    this.name = name;
    this.lastName = lastName;
    this.email = email;
    this.role = "user";
  }

  displayInfo() {
    console.log(`Name: ${this.name}, lastName: ${this.lastName},email ${this.email}, Role: ${this.role}`);
  }
}

class Admin extends Users {
  constructor(name, lastName, email, password) {
    super(name, lastName, email, password);
    this.role = "admin";
  }
}

class SuperAdmin extends Users {
  static CreateAdmin(name, lastName, email, password) {
    return new Admin(name, lastName, email, password);
  }
}

module.exports = { Users, Admin, SuperAdmin };
