const { ensureAuth, ensureActive } = require("../middlewares/verifytoken");

const Joi = require('joi');
const { customAlphabet } = require('nanoid/non-secure');

const express = require('express');
const env = require('dotenv').config();
const logger = require("../middlewares/logger");
const generalrateLimiterMiddleware = require("../middlewares/rateLimiters/general_limiter");
const AuctionModel = require("../models/auction");
const BidsModel = require("../models/bids");
const { newBidNotification } = require("../middlewares/email");
const { default: mongoose } = require("mongoose");



const router = express.Router();



const create_schema = Joi.object({

    auction_id: Joi.string().required(),
    bidder_id: Joi.string().required(),
    bid_minimum_value: Joi.number().required(),
    bid_maximum_value: Joi.number().required(),
    bid_deposit_ref: Joi.string().required(),

});


const nanoid = customAlphabet('123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 22)

router.post('/create', generalrateLimiterMiddleware, async (req, res) => {

    //validate data before adding a user
    try {
        const bodyerror = await create_schema.validateAsync(req.body);
        if (!bodyerror) {

            return res.status(400).json({ message: bodyerror });
        } else {
            const { auction_id, bidder_id, bid_minimum_value, bid_maximum_value, bid_deposit_ref } = req.body;
            //check if bidder has already bidded for the auction
            BidsModel.findOne({ $and: [{ bidder_id: bidder_id }, { auction_id: auction_id }] }).then(found => {
                if (found) {
                    return res.status(400).json({ message: "You have already sent a bid on this auction" })
                } else {
                    //check if auction is open
                    AuctionModel.findOne({ auction_id: auction_id }).then(auction => {
                        if (auction.stage === 'Open') {
                            if (parseInt(auction.reserved_price) < parseInt(bid_minimum_value)) {
                                const bid_id = nanoid();

                                BidsModel.create({
                                    bid_id: bid_id,
                                    bidder_id: bidder_id,
                                    bid_minimum_value: bid_minimum_value,
                                    bid_maximum_value: bid_maximum_value,
                                    bid_deposit_ref: bid_deposit_ref,
                                    auction_id: auction_id,

                                }).then(bid => {
                                    bid.save().then(saved => {
                                        return res.status(200).json(saved);
                                    }).catch(err => {
                                        return res.status(400).json({ message: err.message })
                                    });

                                }).catch(error => {

                                    logger.error(`Error saving bid,${error}`)
                                    return res.status(500).json({ message: "Error creating the bid, try again" })

                                })

                            } else {
                                res.status(400).json({ message: "Submitted minimum bid value is below or equal the reserved price" })
                            }
                        } else {
                            res.status(400).json({ message: "The auction is not ready to accept bids" })
                        }
                    }).catch(error => {
                        
                        return (res.status(500).json({ message: "Error processing the bid, try again" }),
                            logger.error(`Error processing bid,${error}`))
                    })
                }
            })
        }
    } catch (error) {

        logger.error(`${error.status || 500} - ${req.body.user_id} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return res.status(400).json({ message: error.message })
    }


});


module.exports = router;