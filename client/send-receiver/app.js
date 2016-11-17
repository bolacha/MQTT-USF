var mqtt = require('mqtt');
var cron = require('node-cron');
var uuid = require('node-uuid');
var client  = mqtt.connect('mqtt://127.0.0.1:1883');

// Local Variables
var message_value = 0;
var client_name = (process.argv[2])? process.argv[2] : uuid.v4();
var seconds = (process.argv[3] && process.argv[3] > 0 && process.argv[3] < 10)? process.argv[3] : randomInt(1,10);

console.log("Client Name : "+ client_name + " | " +"Seconds to Publish : "+ seconds);

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

client.on('message', function (topic, message) {

    try {
        var payload = JSON.parse(message);

        if(payload.code) {
            console.log("SERVER MESSAGE : "+ payload.code );
        }

    } catch (e) {
        //Error E
    }
})

client.on('connect', function () {
    client.subscribe('presence');

    // CRON JOB Tasks for Testing Purpose Only
    var task = cron.schedule('*/'+seconds+' * * * * *', function() {

        var message = {
            client: client_name,
            message: message_value++

        }

        //console.log("Publishing Message : "+JSON.stringify(message));

        client.publish('presence', JSON.stringify(message));
    }, false);

    task.start();
});


