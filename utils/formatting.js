const moment = require('moment');

function formatString(username, message) {
  return({
    username, 
    message,
    time: moment().format('h:mm a')
  });
}

module.exports = formatString;