const moment = require("moment");

const calculateAge = (birthdate) => {
  const currentDate = moment();
  const birthdateMoment = moment(birthdate, "DD-MM-YYYY");
  const age = currentDate.diff(birthdateMoment, "years");
  return age;
};

module.exports = calculateAge;
