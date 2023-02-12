import { prisma } from "@/config"; 

async function findBookingsbyid(userId: number) {
    return prisma.hotel.findFirst({
      where: {
        id: userId,
      },
      include: {
        Rooms: true,
      }
    });
  }

  const bookingRepository ={
    findBookingsbyid
  }

  export default bookingRepository;