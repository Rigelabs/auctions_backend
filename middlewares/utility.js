const { default: axios } = require('axios');
const jwt = require('jsonwebtoken');
const env = require('dotenv').config();
const AuctionModel = require("../models/auction");
const BidsModel = require("../models/bids");
var cron = require('node-cron');
const logger = require('./logger');
const { auctionStartingAuctioneer, auctionStartingBidder } = require('./email');

const send_subsriber_id = () => {

    //generate json web token for logging service ;
    const token = jwt.sign({ subsriber_id: process.env.LOGGING_SUB_ID, date: new Date() }, process.env.TOKEN_SECRET)
    const requestUrl = new URL(`${process.env.LOGGING_SERVICE_LOCAL}/onboarding`);
    var config = {
        headers: { "Authorization": `Bearer ${token}` },
    }
    var data = { subscriber_id: process.env.LOGGING_SUB_ID }

    axios.post(requestUrl.href, data, config).catch(error => {
        console.log(`Failed to send to onboard to Logging Service, ${error}`)
    })
}
const watch_auction_start_time = () => {
    try {
        cron.schedule('*/5 * * * *', () => {
            const now = new Date();
            AuctionModel.aggregate([
                {
                    $match: {
                        $and: [
                            { auction_start_time: { $lte: now } },
                            { settled: false },
                            { stage: "Pending" }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: "auctioneers",
                        let: { auctioneer_id: "$auctioneer_id" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$auctioneer_id", "$$auctioneer_id"] } } },
                            { $project: { email: 1,full_name:1 } },
                        ],
                        as: "auctioneer"
                    }
                },


            ]).then(data => {
                if (data.length > 0) {
                    //iterate each of the auction
                    data.forEach(element => {
                        //update stage to ongoing , set incremental value
                        AuctionModel.findByIdAndUpdate(element._id, { $set: { stage: "Open" } }).then(ongoing => {
                            
                            //notify auctioneer
                            auctionStartingAuctioneer(element.auctioneer[0].fullname,element.auctioneer[0].email,element.auction_title,)

                            //get auction bids
                            BidsModel.aggregate([
                                { $match: { auction_id: element.auction_id } },
                                {
                                    $lookup: {
                                        from: "bidders",
                                        let: { bidder_id: "$bidder_id" },
                                        pipeline: [
                                            { $match: { $expr: { $eq: ["$bidder_id", "$$bidder_id"] } } },
                                            { $project: { _id: 0, password: 0 } },
                                        ],
                                        as: "bidder"
                                    }
                                },
                                
                            ]).then(bids=>{
                                //save increment value                                
                                const  minimum_value = bids.reduce((prev,curr)=>prev.bid_minimum_value<curr.bid_minimum_value ? prev : curr);
                                AuctionModel.findByIdAndUpdate(element._id, { $set: { increment_value: parseInt(minimum_value.bid_minimum_value)/100} }).then(ongoing => {

                                });
                                 //send notification to bidders
                                 
                                bids.forEach(bid=>{
                                    auctionStartingBidder(bid.bidder[0].full_name,bid.bidder[0].email,element.auction_title)
                                    
                                })
                               
                            })
                        }).catch(error => {
                            console.log(error)
                            logger.error(error)
                        })
                    })
                }
            }).catch (error=>{
                logger.error(error)
                console.log(error)
            })
        })

    } catch (error) {
        logger.error(error)
        console.log(error)
    }
}
const watch_auction_end_time = () => {
    try {
        cron.schedule('*/10 * * * *', () => { //run task every 10 minutes
            const now = new Date();
            AuctionModel.aggregate([
                {
                    $match: {
                        $and: [
                            { auction_end_time: { $lte: now } },
                            { stage: { $ne: "Closed" } }
                        ]
                    }
                }
            ]).then(data => {
                if (data.length > 0) {
                    //iterate each of the auction
                    data.forEach(element => {
                        //update stage to ongoing , set incremental value
                        AuctionModel.findByIdAndUpdate(element._id, { $set: { stage: "Closed" } }).then(ongoing => {

                        }).catch(error => {
                            logger.error(error)
                        })
                    })
                }
            })
        })

    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    send_subsriber_id, watch_auction_start_time, watch_auction_end_time
};