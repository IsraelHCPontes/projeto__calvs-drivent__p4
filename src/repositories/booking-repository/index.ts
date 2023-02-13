import { prisma } from "@/config"; 

async function findBookingsbyid(userId: number) {
    return prisma.booking.findFirst({
      where: {
         userId
      },
      include: {
        Room: true
      }
    });
  }


  async function creatBooking(userId: number, roomId: number) {
        return prisma.booking.create({
            data: {roomId, userId }
        })
  }


  async function findBookingsbyRoomId(roomId: number) {

    return prisma.booking.findMany({
      where: {
         roomId
      },
      include: {
        Room: true
      }
    });
  }

  async function findRoomssbyRoomId(roomId: number) {

    return prisma.room.findFirst({
      where: {
         id: roomId
      }
    });
  }


  
  



  const bookingRepository ={
    creatBooking,
    findBookingsbyid,
    findBookingsbyRoomId,
    findRoomssbyRoomId
  }

  export default bookingRepository;