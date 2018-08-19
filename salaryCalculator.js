var salary = require('./salary');
var utils = require('./utils');

exports.calculateSalary = function(durationFinalDate, data)
{

    data = data + '';
    durationFinalDate = durationFinalDate + '';

    var endOfDuration = new Date(durationFinalDate);
    var startOfDuration = utils.addDays(endOfDuration, -7);

    var message = "";
    
    console.log("================");
    console.log("Duration began on " + utils.formatDate(startOfDuration));
    message += "Duration began on " + utils.formatDate(startOfDuration) + "\n";
    console.log("Duration ends on " + utils.formatDate(endOfDuration));
    message += "Duration ends on " + utils.formatDate(endOfDuration) + "\n";
    console.log("================\n");
    
    var lines = data.split("\n"); // Parse the lines
    var secondsAccumulated = 0;
    
    var secondFrom = 0;
    var secondTo = 0;
    
    lines.forEach(function(line, index){
        var elements = line.split(" ");
        var dateStr = elements[1] + " " + elements[2] + " " + elements[3];
        var date = new Date(dateStr);
    
        var inDuration = false; 
        if (date>startOfDuration && date<=endOfDuration) inDuration=true;
        if (elements[6]=="Start" && inDuration) // Start timer
        {
            secondFrom = parseInt(elements[7].split(":")[0])*60+parseInt(elements[7].split(":")[1]);
        } else if (elements[6]=="Stop" && elements[7]!="Alarm" && inDuration) // Pause timer
        {
            secondTo = parseInt(elements[7].split(":")[0])*60+parseInt(elements[7].split(":")[1]);
            secondsAccumulated += secondFrom - secondTo;
            console.log("Accumulated " + parseInt(secondFrom - secondTo) + " seconds upto entry #" + index);
        } else if (elements[6]=="Alarm" && inDuration)
        {
            secondTo = 0;
            secondsAccumulated += secondFrom - secondTo;
            console.log("Accumulated " + parseInt(secondFrom - secondTo) + " seconds upto entry #" + index);
        }
    });
    
    console.log("================\n");
    var hoursWorked = Math.floor(secondsAccumulated/3600);
    var minutesWorked = Math.floor((secondsAccumulated - hoursWorked*3600)/60);
    console.log("TOTAL TIME WORKED: " + hoursWorked + " hour(s) " + minutesWorked + " minute(s)");
    message += "TOTAL TIME WORKED: " + hoursWorked + " hour(s) " + minutesWorked + " minute(s) \n";
    console.log("TOTAL SALARY FOR THE ENTIRE DURATION: " + Math.floor(hoursWorked * salary.hourSalary + minutesWorked * salary.minuteSalary));
    message += "TOTAL SALARY FOR THE ENTIRE DURATION: " + Math.floor(hoursWorked * salary.hourSalary + minutesWorked * salary.minuteSalary);
    return message;
}

module.exports = exports;