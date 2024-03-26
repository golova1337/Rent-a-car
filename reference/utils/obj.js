class obj {
  notEmpty(obj) {
    return Object.entries(obj).reduce((acc, [key, val]) => {
      if (val.trim().length) {
        acc[key] = val.trim();
      }
      return acc;
    }, {});
  }
}

module.exports = new obj();
