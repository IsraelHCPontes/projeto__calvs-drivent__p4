import bookingRepository from "@/repositories/booking-repository";
import {  notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { number } from "joi";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";
import { cannotListBookingsError } from "@/errors/cannot-list-bookings-error";


async function getBookings(userId: number) {

    const bookings = await bookingRepository.findBookingsbyid(userId)

    if(!bookings){
        throw notFoundError()
    }

    return bookings
     
}

async function listBookings(userId: number, roomId: number) {
    //Tem enrollment?
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) {
      throw notFoundError();
    }
    //Tem ticket pago isOnline false e includesHotel true
    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  
    if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
      throw cannotListHotelsError();
    }

    const room = await bookingRepository.findRoomssbyRoomId(roomId)
    if(!room){
        throw notFoundError()
    }

    const booking = await bookingRepository.findBookingsbyRoomId(roomId)
    
    if(room.capacity <= booking.length){
      console.log('to no if',room.capacity,  booking.length)
        throw cannotListBookingsError();
    }
  }

  async function createBooking(userId: number, roomId: number) {
    await listBookings(userId, roomId);

    return bookingRepository.creatBooking(userId,  roomId)

  }
    

const bookingsService = {
    getBookings,
    createBooking,
    listBookings
}

export default bookingsService;