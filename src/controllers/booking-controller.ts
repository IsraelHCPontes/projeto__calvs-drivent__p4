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
