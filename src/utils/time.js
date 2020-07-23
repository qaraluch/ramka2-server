function getDate(passedDate) {
  const currentDate = new Date();
  const currentDateMs = currentDate.getTime();
  const passedDateValue = new Date(passedDate).getTime();
  const timeZoneOffsetMs = currentDate.getTimezoneOffset() * 60 * 1000;
  const theDate = new Date(
    (passedDateValue || currentDateMs) - timeZoneOffsetMs
  );
  return theDate.toISOString();
}

module.exports = {
  getDate,
};
