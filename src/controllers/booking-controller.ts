import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import bookingsService from "@/services/bookings-service";
import httpStatus from "http-status";

export async function listBoking(req: AuthenticatedRequest, res: Response ){
    const { userId } = req;

    try{
        const bookings = await bookingsService.getBookings(userId)
        const response = {id :bookings.id, Room: bookings.Room }
        return res.status(httpStatus.OK).send(response);
    }catch(error){
        if (error.name === "NotFoundError"){
            return res.sendStatus(httpStatus.NOT_FOUND);
          }
        
    }}

    export async function creatBoking(req: AuthenticatedRequest, res: Response ){
        const { userId } = req;
        const roomId  = Number(req.body.roomId);

        try{
            const bookings = await bookingsService.createBooking(userId, roomId)
            console.log(bookings)
            const response = {id :bookings.id, Room: bookings.roomId }
            return res.status(httpStatus.OK).send(bookings);
        }catch(error){
            
            if (error.name === "NotFoundError"){
                return res.sendStatus(httpStatus.NOT_FOUND);
              }
              if(error.name === "CannotListBookingsError"){
                return res.sendStatus(403);
              }
           
        }
    }


    export async function updateBoking(req: AuthenticatedRequest, res: Response ){
        const { userId } = req;
        const roomId  = Number(req.body.roomId);
        const bookingId = Number(req.params.bookingId)

        try{
            const bookings = await bookingsService.updateBooking(userId, roomId, bookingId)
            return res.status(httpStatus.OK).send(bookings);
        }catch(error){
            
            if (error.name === "NotFoundError"){
                return res.sendStatus(httpStatus.NOT_FOUND);
              }
              if(error.name === "CannotListBookingsError"){
                return res.sendStatus(403);
              }
           
        }
    }

