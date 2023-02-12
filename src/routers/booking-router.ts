import { Router } from 'express'
import { authenticateToken } from "@/middlewares";
import { listBoking } from '@/controllers/booking-controller';


const bookingRouter = Router();

bookingRouter
    .all("/*", authenticateToken)
    .get("/", listBoking)

export { bookingRouter }    