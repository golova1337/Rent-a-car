const CarRepository = require("../db/repository/Car.repository");
const obj = require("../utils/obj");

class CarService {
  async insert(body) {
    await CarRepository.insert(body);
  }

  async delete(id) {
    await CarRepository.delete(id);
  }

  async lease() {
    const result = await CarRepository.lease();
    return result;
  }

  async get(filters) {
    const data = obj.notEmpty(filters);

    if (!Object.keys(data).length) return CarRepository.get({ status: "not_in_rent" });
    return CarRepository.get({ ...data, status: "not_in_rent" });
  }

  async search(substring) {
    const data = obj.notEmpty(substring);
    if (!Object.keys(data).length) return CarRepository.get({ status: "not_in_rent" });

    return CarRepository.search(data);
  }

  async rent(body) {
    const result = await CarRepository.checkActiveLease(body.user_id);
    if (result.length > 0 && result[0].status === "active") {
      throw new Error("you are renting");
    }
    return CarRepository.rent(body);
  }

  async reclaim(data) {
    const end = new Date();
    const resultExist = await CarRepository.checkLeaseExist(data.id);
    if (!resultExist.length) {
      throw new Error("Lease doesn't exist");
    }
    const result = await CarRepository.checkActiveLease(data.userId);
    if (result.length > 0 && result[0].status === " inactive") {
      throw new Error("it's inacrive");
    }

    return CarRepository.reclaim({ ...data, end, carId: result[0].car_id });
  }
}

module.exports = new CarService();
