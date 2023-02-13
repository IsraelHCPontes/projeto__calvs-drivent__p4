import { Router } from 'express'
import { authenticateToken } from "@/middlewares";
import { listBoking, creatBoking, updateBoking} from '@/controllers/booking-controller';


const bookingRouter = Router();

bookingRouter
    .all("/*", authenticateToken)
    .get("/", listBoking)
    .post("/", creatBoking)
    .put("/:bookingId", updateBoking)

export { bookingRouter }    