const { BaseModel } = require("../modelBasic/BaseModel");
const { TABLES } = require("../../db/config/tablesCars");

class CarsModel extends BaseModel {
  constructor(databaseConnection) {
    super(databaseConnection);
    this.carsTable = TABLES.CARS;
    this.leaseTable = TABLES.LEASE;
  }

  async insertNewCarDB(objDate) {
    const result = await this.knex(this.carsTable).insert(objDate);
    return result[0];
  }

  async deleteCarFromDB(id) {
    await this.knex(this.carsTable).where({ id: id }).update({ status: "deleted" });
  }

  async getCarsIsBeingRentedDB() {
    const getCarsInRenting = await this.knex(this.carsTable).select("*").where({ status: "in_rent" });
    return getCarsInRenting;
  }

  async filterCarsDb(params) {
    const data = {};
    Object.keys(params).forEach((key) => {
      if (params[key].trim().length !== 0) {
        data[key] = params[key];
      }
    });
    data.status = "not_in_rent";

    const rows = await this.knex(this.carsTable).select("*").where(data);
    return rows;
  }

  async getAllCarsDb() {
    const result = await this.knex(this.carsTable).select("*").where({ status: "not_in_rent" });
    return result;
  }

  async searchCarsDb(params) {
    const query = this.knex(this.carsTable).select("*");

    if (params.brand && params.brand.trim().length !== 0) {
      query.whereILike("brand", `%${params.brand}%`);
    }

    if (params.model && params.model.trim().length !== 0) {
      query.andWhereILike("model", `%${params.model}%`);
    }
    const result = await query;
    return result;
  }

  async rentCarDb(body) {
    const trx = await this.knex.transaction();
    try {
      const result = await trx(this.leaseTable).select("*").where({ user_id: body.user_id }).orderBy("start_time", "desc").limit(1);
      if (result.length > 0 && result[0].status === "active") {
        throw new Error("you are renting");
      }
      const leaseId = await trx(this.leaseTable).insert(body);
      await trx(this.carsTable).where({ id: body.car_id }).update({ status: "in_rent" });
      await trx.commit();
      return leaseId[0];
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async reclaimCarDb(id) {
    const end = new Date();
    const trx = await this.knex.transaction();
    try {
      const result = await trx(this.leaseTable).select("*").where({ id: id });
      if (result[0].status === "inactive") throw new Error("it's inactive");
      await trx(this.leaseTable).where({ id: id }).update({ status: "inactive", end_time: end });
      await trx(this.carsTable).where({ id: result[0].car_id }).update({ status: "not_in_rent" });
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}

module.exports = CarsModel;
