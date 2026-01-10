const { BookingRepository } = require("../repository/index");
const axios = require("axios");
const { FLIGHT_SERVICE_PATH } = require("../config/serverConfig");
const { ServiceError } = require("../utils/error");

class BookingService {
  constructor() {
    this.bookingRepository = new BookingRepository();
  }

  async createBooking(data) {
    try {
      const flightId = data.flightId;
      let getFLightURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
      const response = await axios.get(getFLightURL);
      const flightData = response.data.data;
      let priceOfTheFlight = flightData.price;
      if (data.noOfSeats > flightData.totalSeats) {
        throw new ServiceError('Something went wrong in the booking process','Insufficient seats in the flight');
      }

      const totalCost = priceOfTheFlight * data.noOfSeats;
      const bookingPlayload = {...data,totalCost};
      const booking =  await this.bookingRepository.create(bookingPlayload);
      const updateFlighRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`
      await axios.patch(updateFlighRequestURL,{totalSeats:flightData.totalCost- booking.noOfSeats})
     const finalBooking =  await this.bookingRepository.update(booking.id,{status:"Booked"}); 
      return finalBooking;
    } catch (error) {
        if(error.name ='RepositoryError'||(error.name = 'ValidationError')){
            throw error;
        }
      throw new ServiceError();
    }
  }
}

module.exports = BookingService;
