class BaseModel {
  constructor(databaseConnection) {
    this.knex = databaseConnection;
  }
}

module.exports = { BaseModel };
