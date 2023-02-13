
import { prisma } from "@/config";


export async function creatBooking(userId: number, roomId: number){
    return prisma.booking.create({
        data:{
            userId, roomId
        }
    })
}