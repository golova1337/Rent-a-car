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

  async lease(conditions) {
    const [data, count] = await Promise.all([
      this.knex(TABLES.CARS)
        .limit(conditions.perPage)
        .offset((conditions.page - 1) * conditions.page)
        .select("*")
        .where({ status: "in_rent" }),
      this.knex(TABLES.CARS).count("* as count").where({ status: "in_rent" }),
    ]);
    return [data, count[0].count];
  }

  async get(pagination, filters) {
    const [data, count] = await Promise.all([
      this.knex(TABLES.CARS)
        .limit(pagination.perPage)
        .offset((pagination.page - 1) * pagination.page)
        .select("*")
        .where(filters),
      this.knex(TABLES.CARS).count("* as count").where(filters),
    ]);
    return [data, count[0].count];
  }

  async search(pagination, substring) {
    const query = this.knex(TABLES.CARS).select("*");
    const countQuery = this.knex(TABLES.CARS).count("* as count");
    query.limit(pagination.perPage).offset((pagination.page - 1) * pagination.page);

    if (substring.brand) {
      query.whereILike("brand", `%${substring.brand}%`);
      countQuery.whereILike("brand", `%${substring.brand}%`);
    }

    if (substring.model) {
      query.andWhereILike("model", `%${substring.model}%`);
      countQuery.andWhereILike("model", `%${substring.model}%`);
    }
    query.where({ status: "not_in_rent" });

    const [data, count] = await Promise.all([query, countQuery]);
    return [data, count[0].count];
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
      await trx(TABLES.LEASE)
        .where({ id: data.id })
        .update({ status: "inactive", end_time: trx.fn.now(6) });
      await trx(TABLES.CARS).where({ id: data.carId }).update({ status: "not_in_rent" });
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}
module.exports = new CarRepository(knex);
