const amqp = require('amqplib');
// const amqp = require('amqplib/callback_api');
const config = require('../config');

const opt = { credentials: require('amqplib').credentials.plain(config.amqp_user_name, config.amqp_password) };

var connection;
//  Connect RabbitMQ
async function connectRabbitMQ()
{
    try
    {
        connection = await amqp.connect(`amqp://${config.amqp_host}:${config.amqp_port}/${config.amqp_virtual_host}`, opt)
        console.log("Connect to RabbitMQ success");

        const channel = await connection.createChannel();

        channel.assertExchange(config.amqp_exchange, 'topic', {
          durable: true
        });

        await channel.assertQueue(`${config.amqp_queue_name}`, {
            durable: true,
        });

        console.log(' [*] Waiting for logs');
        await channel.bindQueue(`${config.amqp_queue_name}`, config.amqp_exchange, config.amqp_routing_key);
        await channel.consume(`${config.amqp_queue_name}`, async function(msg)
        {
            console.log(" [x] Message from key %s: %s", msg.fields.routingKey, msg.content.toString());
            channel.ack(msg);
        });

        connection.on("error", function(err)
        {
            console.log(err);
            setTimeout(connectRabbitMQ, 5000);
        });

        connection.on("close", function()
        {
            console.error("connection to RabbitQM closed!");
            setTimeout(connectRabbitMQ, 5000);
        });
    }
    catch (err)
    {
        console.error(err);
        setTimeout(connectRabbitMQ, 5000);
    }
}

connectRabbitMQ();

module.exports = {}


// using amqlib/callback_api
// const receive = () => {
//     amqp.connect(`amqp://${config.amqp_host}:${config.amqp_port}/${config.amqp_virtual_host}`, opt, (err, conn) => {
//         if (err) {
//             console.log(err);
//             throw err;
//         }
//         conn.createChannel(function(error1, channel) {
//             if (error1) {
//                 console.log(error1);

//                 throw error1;
//             }

//             channel.assertExchange(config.amqp_exchange, 'topic', {
//               durable: true
//             });

//             channel.assertQueue(`${config.amqp_queue_name}`, {
//                 exclusive: true
//               }, function(error2, q) {
//                     if (error2) {
//                         throw error2;
//                     }

//                 console.log(' [*] Waiting for logs. To exit press CTRL+C');
          
//                 channel.bindQueue(q.queue, config.amqp_exchange, config.amqp_routing_key);
          
//                 channel.consume(q.queue, function(msg) {
//                   console.log(" [x] Message from key %s:'%s'", msg.fields.routingKey, msg.content.toString());
//                 }, {
//                   noAck: true
//                 });
//               });
//         });
//     });
// }

