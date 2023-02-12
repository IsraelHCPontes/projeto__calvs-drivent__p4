import bookingRepository from "@/repositories/booking-repository";
import { notFoundError } from "@/errors";

async function getBookings(userId: number) {

    const bookings = await bookingRepository.findBookingsbyid(userId)
    
    console.log(bookings)

    if(!bookings){
        throw notFoundError()
    }

    return bookings
     
}

const bookingsService = {
    getBookings
}

export default bookingsService;