const amqp = require('amqplib/callback_api');
const env = require('dotenv');


env.config();


async function publisher(msg) {
    try {

        amqp.connect(process.env.AMQP_URL, function (error, connection) {

            if (error) {
                console.log(`RabbitMQ connection failed, ${error}`)
             

            }

            if (connection) {
               
                console.log("Connected to RabbitMQ");


                connection.createChannel(function (error, channel) {

                    if (error) {

                        console.error(error)
                    }
                 
                    console.log("RabbitMQ created channel");


                    var exchange = "Rigel_Logger";
                    
                    channel.assertExchange(exchange, 'fanout', {
                        durable: true
                    });
                    channel.publish(exchange, '', Buffer.from(JSON.stringify(msg)), { persistent: true });
                    setTimeout(()=>{
                        connection.close();
                      
                    },10000);
                })
            } else {
                console.log("Message Broker Failed to Connect")
                
            }
        })
    } catch (error) {
        console.log(error)
    }
}
module.exports = { publisher };