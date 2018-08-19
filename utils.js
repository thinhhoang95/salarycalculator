exports.addDays = function(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

exports.formatDate = function(date)
{
    return date.toLocaleDateString("en-US", options);
}

module.exports = exports;