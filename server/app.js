var mosca = require('mosca')
var cron = require('node-cron');
var uuid = require('node-uuid');

var clients_connected = {};

var moscaSettings = {
    port: 1883,
    backend: {
        type: 'redis',
        redis: require('redis'),
        db: 12,
        port: 6379,
        return_buffers: true, // to handle binary payloads
        host: "localhost"
    },
    persistence: {
        factory: mosca.persistence.Redis
    }
};


// fired when the mqtt server is ready
function setup() {
    console.log('Mosca server is up and running')
}


function print_rest(words, size, simbol) {
    var text = "";

    for (var i = 0; i < size - words.length; i++) {
        text = text + simbol;
    }

    return text;
}

var server = new mosca.Server(moscaSettings);

server.on('ready', setup);

server.on('published', function (packet, client) {

    if (packet.payload) {
        try {
            var payload = JSON.parse(packet.payload.toString('utf8'));

            if (payload.client && payload.message) {

                if (clients_connected[payload.client]) {
                    clients_connected[payload.client] = clients_connected[payload.client] + payload.message;
                } else {
                    clients_connected[payload.client] = payload.message;
                }
            }

        } catch (e) {
        }
    }
});

server.on('clientConnected', function (client) {
    console.log('Client Connected: ', client.id);
});

server.on('clientDisconnected', function (client) {
    console.log('Client Disconnected:', client.id);
});



// CRON JOB Tasks for Testing Purpose Only

var task = cron.schedule('*/5 * * * * *', function () {
    var lenght = 60;

    if(clients_connected.size > 0){
        console.log("\n\n\n\n\n\n");

        for (var key in clients_connected) {
            console.log(print_rest("", lenght, "."));
            console.log("Client : " + key + print_rest("Client : " + key, lenght, "."));
            console.log("Value  : " + clients_connected[key] + print_rest("Value  : " + clients_connected[key], lenght, "."));
        }
        console.log(print_rest("", lenght, "."));
    }

}, false);
task.start();

var task2 = cron.schedule('*/10 * * * * *', function () {

    var message = {
        topic: 'presence',
        payload: JSON.stringify({code: uuid.v4()}), // or a Buffer
        qos: 0, // 0, 1, or 2
        retain: false // or true
    };

    server.publish(message, function () {
        console.log('done!');
    });
}, false);
task2.start();

var task3 = cron.schedule('*/10 * * * * *', function () {

    var message = {
        topic: 'DOOR',
        payload: JSON.stringify({code: uuid.v4()}), // or a Buffer
        qos: 0, // 0, 1, or 2
        retain: false // or true
    };

    server.publish(message, function () {
        console.log('done!');
    });
}, false);
task3.start();

var task4 = cron.schedule('*/10 * * * * *', function () {

    var message = {
        topic: 'CAR',
        payload: JSON.stringify({code: uuid.v4()}), // or a Buffer
        qos: 0, // 0, 1, or 2
        retain: false // or true
    };

    server.publish(message, function () {
        console.log('done!');
    });
}, false);
task4.start();