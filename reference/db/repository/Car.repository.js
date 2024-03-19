const { TABLES } = require("../config/tablesCars");

class CarAccess {
  constructor(knex) {
    this.knex = knex;
  }

  async insert(body) {
    await this.knex(TABLES.CARS).insert(body);
  }

  async delete(id) {
    await this.knex(TABLES.CARS).where({ id: id }).update({ status: "deleted" });
  }

  async lease() {
    const result = await this.knex(TABLES.CARS).select("*").where({ status: "in_rent" });
    return result;
  }

  async get(filters) {
    const data = {};
    if (!Object.keys(filters).length) {
      const result = await this.knex(TABLES.CARS).select("*").where({ status: "not_in_rent" });
      return result;
    }

    Object.keys(filters).forEach((key) => {
      if (filters[key].trim().length !== 0) {
        data[key] = filters[key];
      }
    });
    const query = this.knex(TABLES.CARS).select("*").where({ status: "not_in_rent" });
    if (Object.keys(data).length) {
      query.where(data);
    }

    const result = await query;
    return result;
  }

  async search(substring) {
    const query = this.knex(TABLES.CARS).select("*");

    if (substring.brand && substring.brand.trim().length !== 0) {
      query.whereILike("brand", `%${substring.brand}%`);
    }

    if (substring.model && substring.model.trim().length !== 0) {
      query.andWhereILike("model", `%${substring.model}%`);
    }
    const result = await query;
    return result;
  }

  async rent(body) {
    const trx = await this.knex.transaction();
    try {
      const result = await trx(TABLES.LEASE).select("*").where({ user_id: body.user_id }).orderBy("start_time", "desc").limit(1);
      if (result.length > 0 && result[0].status === "active") {
        throw new Error("you are renting");
      }
      const leaseId = await trx(TABLES.LEASE).insert(body);
      await trx(TABLES.CARS).where({ id: body.car_id }).update({ status: "in_rent" });
      await trx.commit();
      return leaseId[0];
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async reclaim(id) {
    const end = new Date();
    const trx = await this.knex.transaction();
    try {
      const result = await trx(TABLES.LEASE).select("*").where({ id: id });
      if (result[0].status === "inactive") throw new Error("it's inactive");
      await trx(TABLES.LEASE).where({ id: id }).update({ status: "inactive", end_time: end });
      await trx(TABLES.CARS).where({ id: result[0].car_id }).update({ status: "not_in_rent" });
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}

module.exports = CarAccess;
