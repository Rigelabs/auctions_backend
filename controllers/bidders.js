const { ensureAuth, ensureActive } = require("../middlewares/verifytoken");

const Joi = require('joi');
const { customAlphabet } = require('nanoid/non-secure');

const express = require('express');
const env = require('dotenv').config();
const logger = require("../middlewares/logger");
const generalrateLimiterMiddleware = require("../middlewares/rateLimiters/general_limiter");

const BiddersModel = require("../models/bidders");



const router = express.Router();



const create_schema = Joi.object({

    physical_location: Joi.object().required(),
    identification: Joi.string().required(),
    kra_pin: Joi.string().required(),
    full_name: Joi.string().required(),
    email: Joi.string().required(),
    kyc: Joi.object().required(),
    phone_number: Joi.string().required(),
    geo_data: Joi.object().required(),
});


const nanoid = customAlphabet('123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)

router.post('/create', generalrateLimiterMiddleware, async (req, res) => {

    //validate data before adding a user
    try {
        const bodyerror = await create_schema.validateAsync(req.body);
        if (!bodyerror) {

            return res.status(400).json({ message: bodyerror });
        } else {
            const {physical_location, identification,kyc, kra_pin, full_name, email,phone_number,geo_data } = req.body;
            //check if bidder has already bidded for the auction
            BiddersModel.findOne({ $or: [{ identification: identification }, { kra_pin: kra_pin },{ email: email },{ phone_number: phone_number }] }).then(found => {
                if (found) {
                    return res.status(400).json({ message: "You already have an account with us" })
                } else {

                    const bidder_id = nanoid();

                    BiddersModel.create({
                        physical_location: physical_location,
                        bidder_id: bidder_id,
                        identification: identification,
                        full_name: full_name,
                        kra_pin: kra_pin,
                        kyc: kyc,
                        email: email,
                        phone_number: phone_number,
                        geo_data: geo_data,
                    }).then(bidder => {
                        bidder.save().then(saved => {
                            
                            return res.status(200).json(saved)
                        }).catch(err => {
                            return res.status(400).json({ message: err.message })
                        });

                    }).catch(error => {
                        console.log(error)
                        return (res.status(500).json({ message: "Error creating the account, try again" }),
                            logger.error(`Error saving bidder account,${error}`))
                    })

                }
            })
        }
    } catch (error) {

        logger.error(`${error.status || 500} - ${req.body.user_id} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return res.status(400).json({ message: error.message })
    }


});
router.get("/bidder", async (req, res) => {
    try {
        const { bidder_id } = req.query;
        BiddersModel.aggregate([
            { $match:{bidder_id: bidder_id }},
            {
                $lookup: {
                    from: "bids",
                    let: { bidder_id: "$bidder_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$bidder_id", "$$bidder_id"] } } },
                      
                    ],
                    as: "bids"
                }
            },
        ]).then(exists => {
            if (exists.length<1) {
                return res.status(404).json({ message: "Bidder  not found" });
            } else {
                res.status(200).json(exists);      
            }
        }).catch(error => {
            logger.error(`Error while retriving bidder, ${error}`)
            return res.status(400).json({ message: error })
        });
    } catch (error) {
        logger.error(`Error while retriving bidder, ${error}`)
        return res.status(500).json({ message: "Server error while processing your request, try again" })
    }

});
router.get("/all", async (req, res) => {
    try {
      
        BiddersModel.find({status:"Active"},{password:0}).then(bidders => {
           
            if (bidders.length<1) {
                return res.status(404).json({ message: "We have not found any bidder" });
            } else {
                res.status(200).json(bidders);      
            }
        }).catch(error => {
            logger.error(`Error while retriving bidder, ${error}`)
            return res.status(400).json({ message: error })
        });
    } catch (error) {
        logger.error(`Error while retriving bidder, ${error}`)
        return res.status(500).json({ message: "Server error while processing your request, try again" })
    }

});
module.exports = router;