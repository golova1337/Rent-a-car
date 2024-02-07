class Auto {
  constructor(brand, model, number, price, year) {
    this.brand = brand;
    this.model = model;
    this.number = number;
    this.price = price;
    this.year = year;
  }

  info() {
    console.log(`Brand: ${this.brand}, model: ${this.model},year ${this.year}, price: ${this.price}`);
  }
}

module.exports = {
  Auto,
};
