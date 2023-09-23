const moment = require("moment");

const formatDate = (next) => {
  if (this.date) {
    this.date = moment(this.date, "DD-MM-YYYY").format("DD-MM-YYYY");
  }
  next();
};
module.exports = formatDate;
