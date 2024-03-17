const CarAccess = require("../../db/query/car/Car.Access");

class CarService {
  constructor(knex) {
    this.knex = knex;
    this.carAccess = new CarAccess(this.knex);
  }

  async insert(body) {
    const result = await this.carAccess.insert(body);
    return result;
  }

  async delete(id) {
    await this.carAccess.delete(id);
  }

  async lease() {
    const result = await this.carAccess.lease();
    return result;
  }

  async get(filters) {
    const result = await this.carAccess.get(filters);
    return result;
  }

  async search(substring) {
    const result = await this.carAccess.search(substring);
    return result;
  }

  async rent(body) {
    const result = await this.carAccess.rent(body);
    return result;
  }

  async reclaim(id) {
    const result = await this.carAccess.reclaim(id);
    return result;
  }
}

module.exports = CarService;
