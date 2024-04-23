const { ensureAuth, ensureActive } = require("../middlewares/verifytoken");

const Joi = require('joi');
const { customAlphabet } = require('nanoid/non-secure');

const express = require('express');
const env = require('dotenv').config();
const logger = require("../middlewares/logger");
const generalrateLimiterMiddleware = require("../middlewares/rateLimiters/general_limiter");

const BeneficiaryModel = require("../models/beneficiary");



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
    bank_details: Joi.object().required(),
});


const nanoid = customAlphabet('123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)

router.post('/create', generalrateLimiterMiddleware, async (req, res) => {

    //validate data before adding a user
    try {
        const bodyerror = await create_schema.validateAsync(req.body);
        if (!bodyerror) {

            return res.status(400).json({ message: bodyerror });
        } else {
            const {physical_location,bank_details, identification,kyc, kra_pin, full_name, email,phone_number,geo_data } = req.body;
            //check if beneficiary has an account
            BeneficiaryModel.findOne({ $or: [{ identification: identification }, { kra_pin: kra_pin },{ email: email },{ phone_number: phone_number }] }).then(found => {
                if (found) {
                    return res.status(400).json({ message: "You already have an account with us" })
                } else {

                    const beneficiary_id = nanoid();

                    BeneficiaryModel.create({
                        physical_location: physical_location,
                        beneficiary_id: beneficiary_id,
                        identification: identification,
                        full_name: full_name,
                        kra_pin: kra_pin,
                        kyc: kyc,
                        email: email,
                        phone_number: phone_number,
                        geo_data: geo_data,
                        bank_details:bank_details
                    }).then(bidder => {
                        bidder.save().then(saved => {
                            
                            return res.status(200).json(saved)
                        }).catch(err => {
                            return res.status(400).json({ message: err.message })
                        });

                    }).catch(error => {
                        console.log(error)
                        return (res.status(500).json({ message: "Error creating the account, try again" }),
                            logger.error(`Error saving beneficiary account,${error}`))
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