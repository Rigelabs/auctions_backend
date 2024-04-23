const { ensureAuth, ensureActive } = require("../middlewares/verifytoken");
const cloudinary = require('../middlewares/cloudinary');
const Joi = require('joi');
const { customAlphabet } = require('nanoid/non-secure');
const multer = require('multer');
const express = require('express');
const env = require('dotenv').config();
const logger = require("../middlewares/logger");
const generalrateLimiterMiddleware = require("../middlewares/rateLimiters/general_limiter");

const AuctionModel = require("../models/auction");
const auction = require("../models/auction");



const router = express.Router();



const create_schema = Joi.object({

    auction_title: Joi.string().required().max(500),
    auctioneer_id: Joi.string().required(),
    beneficiary_id: Joi.string().required(),
    auction_start_time: Joi.date(),
    auction_end_time: Joi.date(),
    images: Joi.array(),
    location_id: Joi.string().required(),
    video: Joi.string(),
    reserved_price: Joi.number().required(),
    deposit_value: Joi.number().required(),
    category_id: Joi.string().required(),
    sub_category_id: Joi.string().required(),
    description: Joi.string().required(),
    item_condition: Joi.string().required(),
    warranty_period: Joi.string(),
    allocated_group: Joi.string(),
});


const nanoid = customAlphabet('123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 22)
const storage = multer.diskStorage({

    filename: function (req, file, cb) {
        cb(null, nanoid() + '-' + file.originalname)
    },
})

const uploads = multer({
    limits: { fileSize: 20 * 1000 * 1000 },

    storage: storage, 
    fileFilter: (req, file, cb) => {
      
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "video/mp4") {
            cb(null, true);
        } else {
           
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});
router.post('/create', generalrateLimiterMiddleware, async (req, res) => {

    //validate data before adding a user
    try {
        const bodyerror = await create_schema.validateAsync(req.body);
        if (!bodyerror) {

            return res.status(400).json({ message: bodyerror });
        } else {
            const { auction_title, auctioneer_id, beneficiary_id, auction_start_time, auction_end_time, location_id, reserved_price, category_id, sub_category_id, description, item_condition,
                warranty_period, allocated_group, deposit_value } = req.body;


            const auction_id = nanoid();
            const now = new Date();
            AuctionModel.create({
                auction_title: auction_title,
                auction_id: auction_id,
                auctioneer_id: auctioneer_id,
                beneficiary_id: beneficiary_id,
                location_id: location_id,
                reserved_price: reserved_price,
                deposit_value: deposit_value,
                auction_start_time: new Date(),
                auction_end_time: new Date(`${now.getMonth()}/${now.getDate() + 3}/${now.getFullYear()}`),
                bidding_start_time: new Date(`${now.getMonth()}/${now.getDate() + 1}/${now.getFullYear()}`),
                bidding_end_time: new Date(`${now.getMonth()}/${now.getDate() + 2}/${now.getFullYear()}`),
                category_id: category_id,
                sub_category_id: sub_category_id,
                description: description,
                item_condition: item_condition,
                warranty_period: warranty_period,
                allocated_group: allocated_group,
                images: [],
                images_id: [],

            }).then(auction => {
                auction.save().then(saved => {
                    return res.status(200).json(saved)
                }).catch(err => {
                    return res.status(400).json({ message: err.message })
                });

            }).catch(error => {
                console.log(error)
                return (res.status(500).json({ message: "Error creating the auction, try again" }),
                    logger.error(`Error saving auction,${error}`))
            })
        }
    } catch (error) {

        logger.error(`${error.status || 500} - ${req.body.user_id} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return res.status(400).json({ message: error.message })
    }


});
router.put('/media/update', generalrateLimiterMiddleware, uploads.fields([{ name:"images",maxCount: 12 }, {name: "video",maxCount: 1 }]), async (req, res) => {

    //validate data before adding a user
    try {

        const { auction_id } = req.query;

        if (!auction_id) {
            res.status(400).json({ message: "Invalid Request" })
        } else {
            //check if the account updating is the client or the expert assigned
            AuctionModel.findOne({ auction_id: auction_id }).then(found => {
                if (found) {
                    if (found.stage === "Open") {
                        if (req.files) {
                            let images = [];
                            let images_id =[];
                            let video = null;
                            let video_id = null
                            //uplodading images

                            const cloudinaryImagesUpload = path => {
                                return new Promise(resolve => {
                                    cloudinary.uploader.upload(path,
                                        {
                                            folder: `auctions/${auction_id}/images/`, 
                                            transformation: [
                                                { dpr: "auto", responsive: true, width: "auto" },
                                                { fetch_format: "auto", quality: "auto" },
                                                {overlay:"logo:logo_bo_bg_opacity_80_guxhnb/fl_layer_apply"}

                                            ],
                                        }, (err, res) => {
                                            if (err) return console.error("upload file error", err.message)

                                            resolve({
                                                res: res.secure_url,
                                                cloudinary_id: res.public_id
                                            })
                                        })
                                })
                            }
                            const cloudinaryVideoUpload = path => {
                                return new Promise(resolve => {
                                    cloudinary.uploader.upload(path,
                                        {
                                            resource_type: 'video',
                                            folder: `auctions/${auction_id}/video/`,
                                            eager: [
                                                { width: 300, height: 300, crop: 'fill', audio_codec: "none" },
                                                { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" },
                                            ],
                                            eager_async: true
                                        }, (err, res) => {
                                            if (err) return console.error("upload file error", err.message)

                                            resolve({
                                                res: res.secure_url,
                                                cloudinary_id: res.public_id
                                            })
                                        })
                                })
                            }
                            async function uploadFiles() {
                              
                                if (req.files["images"]) {
                                    for (const file of req.files["images"]) {
                                        await cloudinaryImagesUpload(file.path).then(data => {
                                            images.push(data.res);
                                            images_id.push(data.cloudinary_id);

                                        }).catch(e => console.log(e));
                                    }


                                }
                                if (req.files["video"]) {
                                    for (const file of req.files["video"]) {
                                        await cloudinaryVideoUpload(file.path).then(data => {
                                            video=data.res;
                                            video_id=data.cloudinary_id;

                                        }).catch(e => console.log(e));
                                    }


                                }

                            }
                            uploadFiles().then(done => {
                                const data_obj = {
                                    images: images.concat(found.images),
                                    images_id: images_id.concat(found.images_id),
                                    video: video ? video : found.video,
                                    video_id: video_id ? video_id : found.video_id,
                                }
                                AuctionModel.findOneAndUpdate(
                                    { auction_id: auction_id },
                                    { $set: data_obj },
                                    { new: true }
                                ).then(auction => {
                                    res.status(200).json(auction)
                                }).catch(error => {
                                    return res.status(400).json({ message: error.message })
                                })

                            })

                        } else {
                            res.status(400).json({ message: "Invalid Request" })
                        }
                    } else {
                        res.status(404).json({ message: "Auction is not ready to receive new data" });
                    }
                } else {
                    res.status(404).json({ message: "Auction not found" });
                }
            }).catch(error => {
                logger.error(error);
                return res.status(500).json({ message: error.message })
            })
        }
        } catch (error) {
            
            logger.error(`${error.status || 500} - ${req.body.user_id} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(400).json({ message: error.message })
        }


});

module.exports = router;