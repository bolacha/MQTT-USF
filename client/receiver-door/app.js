var mqtt = require('mqtt');

var client  = mqtt.connect('mqtt://127.0.0.1:1883');

console.log('SERVER TOPIC DOOR');

client.on('message', function (topic, message) {

    if(topic == 'DOOR') {
        try {
            var payload = JSON.parse(message);

            if(payload.code) {
                console.log("SERVER MESSAGE : "+ payload.code );
            }

        } catch (e) {}
    }
    
});


client.on('connect', function () {
    client.subscribe('DOOR');
});




