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


   async function updateBoking(id: number, roomId: number) {

    return prisma.booking.update({
        where: {
            id
          },
          data: {
            roomId,
          },
  })
}

  const bookingRepository ={
    creatBooking,
    findBookingsbyid,
    findBookingsbyRoomId,
    findRoomssbyRoomId,
    updateBoking
  }

  export default bookingRepository;