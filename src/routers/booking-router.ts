import { Router } from 'express'
import { authenticateToken } from "@/middlewares";
import { listBoking, creatBoking} from '@/controllers/booking-controller';


const bookingRouter = Router();

bookingRouter
    .all("/*", authenticateToken)
    .get("/", listBoking)
    .post("/", creatBoking)

export { bookingRouter }    