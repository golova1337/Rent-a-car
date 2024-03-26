const { TABLES } = require("../config/tablesCars");
const { knex } = require("../config/connection");

class CarRepository {
  constructor(connection) {
    this.knex = connection;
  }

  async insert(body) {
    await this.knex(TABLES.CARS).insert(body);
  }

  async delete(id) {
    await this.knex(TABLES.CARS).where({ id: id }).update({ status: "deleted" });
  }

  async lease() {
    return this.knex(TABLES.CARS).select("*").where({ status: "in_rent" });
  }

  async get(filters) {
    return this.knex(TABLES.CARS).select("*").where(filters);
  }

  async search(substring) {
    const query = this.knex(TABLES.CARS).select("*");

    if (substring.brand) {
      query.whereILike("brand", `%${substring.brand}%`);
    }

    if (substring.model) {
      query.andWhereILike("model", `%${substring.model}%`);
    }
    query.where({ status: "not_in_rent" });
    const result = await query;
    return result;
  }

  async checkActiveLease(id) {
    const result = await this.knex(TABLES.LEASE).select("*").where({ user_id: id }).orderBy("start_time", "desc").limit(1);
    return result.length > 0 && result[0].status === "active";
  }

  async checkLeaseExist(id) {
    return this.knex(TABLES.LEASE).select("*").where({ id: id });
  }

  async rent(body) {
    const trx = await this.knex.transaction();
    try {
      const leaseId = await trx(TABLES.LEASE).insert(body);
      await trx(TABLES.CARS).where({ id: body.car_id }).update({ status: "in_rent" });
      await trx.commit();
      return leaseId[0];
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async reclaim(data) {
    const trx = await this.knex.transaction();
    try {
      await trx(TABLES.LEASE).where({ id: data.id }).update({ status: "inactive", end_time: data.end });
      await trx(TABLES.CARS).where({ id: data.carId }).update({ status: "not_in_rent" });
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}
module.exports = new CarRepository(knex);
