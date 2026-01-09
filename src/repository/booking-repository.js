const { statusCode, StatusCodes } = require("http-status-codes");
const { ValidationError, AppError } = require("../utils/error/index");
const { Booking } = require("../models/index");

class BookingRepository {
  async create(data) {
    try {
      const booking = await Booking.create(data);
      return booking;
    } catch (error) {
      if ((error.name = "SequelizeValidationError")) {
        throw new ValidationError(error);
      }
      throw new AppError(
        "RepositoryError",
        "Cannot Create Booking",
        "There was some issue creating the booking",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }


  async update(data){
     
  }



}

module.exports = BookingRepository;
