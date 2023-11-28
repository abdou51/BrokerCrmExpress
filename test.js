const { zonedTimeToUtc, utcToZonedTime, format } = require("date-fns-tz");

function getCurrentDateInAlgeria() {
  const timeZone = "Africa/Algiers";
  const now = new Date();
  const dateInAlgeria = utcToZonedTime(now, timeZone);
  return dateInAlgeria;
}

const nowInAlgeria = getCurrentDateInAlgeria();
console.log(nowInAlgeria);
