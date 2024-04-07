
const env = require('dotenv');
const { publisher } = require('./logs_producer');
env.config();


class logger_class {
    constructor(message) {

        this.message = message;
    }
    //getter
    get get_sys_down() {
        this.sys_down()

    }
    //getter
    get get_error() {
        this.error()

    }
    get get_info() {
        this.info()

    }
    //methods
    sys_down(message) {
        let severity = "SYSTEM_DOWN";
        this.message = message;

        //sending notification
        var error_logger = {
            severity: severity,
            message: message,
            timestamp: new Date(),
            channel: process.env.LOGGING_SUB_ID,
            app: "WARIDI"
        }

        return publisher({ msg: error_logger })
    }
    //methods
    error(message) {
        let severity = "ERROR";
        this.message = message;

        //sending notification
        var error_logger = {
            severity: severity,
            message: message,
            timestamp: new Date(),
            channel: process.env.LOGGING_SUB_ID,
            app: "WARIDI"
        }

        return publisher({ msg: error_logger })
    }
    info(message) {
        let severity = "INFO";
        this.message = message;

        //sending notification
        var info_logger = {
            severity: severity,
            message: message,
            timestamp: new Date(),
            channel: process.env.LOGGING_SUB_ID,
            app: "WARIDI"
        }
        return publisher({ msg: info_logger })

    }
}

const logger = new logger_class();

module.exports = logger;