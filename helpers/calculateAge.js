const moment = require("moment");

const calculateAge = (birthdate) => {
  const currentDate = moment();
  const birthdateMoment = moment(birthdate, "DD-MM-YYYY");
  const ageInYears = currentDate.diff(birthdateMoment, "years");

  const ageInMonths = currentDate.diff(birthdateMoment, "months");
  if (ageInYears < 1) {
    return ageInMonths / 10;
  }

  return ageInYears;
};

module.exports = calculateAge;
