const {BookingService} =require('../services/index');
const {StatusCodes} = require('http-status-codes')
const bookingService = new BookingService();
const {createChannel,publishMessage} = require('../utils/messageQueue')
const {REMINDER_BINDING_KEY} = require('../config/serverConfig')
class BookingController{

    constructor( ){
        
    }


    async sendMessageToQueue(req,res){
        const channel = await createChannel();
        const data = {message:"Success"}
        publishMessage(channel,REMINDER_BINDING_KEY);
        return res.status(200).json({
            message:"successfully published the message"
        })
    }


    async create(req,res){
        try {
            
            const response =  await bookingService.createBooking(req.body);
            return res.status(StatusCodes.OK).json({
                message:"successfully completed the booking",
                success:true,
                err:{},
                data:response
            });
            
        } catch (error) {
            return res.status(error.StatusCode).json({
                message:error.message,
                success:false,
                err:error.explanation,
                data:{}
            })
            
        }
    }
    
}
module.exports = BookingController 
