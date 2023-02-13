import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import bookingsService from "@/services/bookings-service";
import httpStatus from "http-status";

export async function listBoking(req: AuthenticatedRequest, res: Response ){
    const { userId } = req;

    try{
        const bookings = await bookingsService.getBookings(userId)
        return res.status(httpStatus.OK).send(bookings);
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
