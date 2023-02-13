import app, { init } from "@/app";
import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import e from "express";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  createPayment,
  generateCreditCardData,
  createTicketTypeWithHotel,
  createTicketTypeRemote,
  createHotel,
  createRoomWithHotelId,
  creatBooking
} from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /booking", () => {

    it("should respond with status 401 if no token is given", async () => {
        const response = await server.get("/booking");
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();
    
        const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });


      describe("when token is valid", () => {

            it("should respond with status 404 when user has no booking", async () => {
                const user = await createUser();
                const token = await generateValidToken(user);
                const enrollment = await createEnrollmentWithAddress(user);
                const ticketType = await createTicketTypeWithHotel();
                const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
                const payment = await createPayment(ticket.id, ticketType.price);
                const createdHotel = await createHotel();
                const room = await createRoomWithHotelId(createdHotel.id);

                const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

                expect(response.status).toEqual(httpStatus.NOT_FOUND);
             })   


             it("should respond with status 200 when user has booking", async () => {
                const user = await createUser();
                const token = await generateValidToken(user);
                const enrollment = await createEnrollmentWithAddress(user);
                const ticketType = await createTicketTypeWithHotel();
                const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
                const payment = await createPayment(ticket.id, ticketType.price);
                const createdHotel = await createHotel();
                const room = await createRoomWithHotelId(createdHotel.id);
                const booking = await creatBooking(user.id, room.id)
    
                const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
          
                expect(response.status).toEqual(httpStatus.OK);
            
                expect(response.body).toEqual(
                    {
                      id: booking.id,
                      Room:{
                        id: expect.any(Number),
                        name: expect.any(String),
                        capacity: expect.any(Number),
                        hotelId: expect.any(Number),
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String)
                    }} )
                })
        })
    })


    describe("POST /booking", () => {
        
        it("should respond with status 401 if no token is given", async () => {
            const body = {"roomId": 1}
            const response = await server.post("/booking").send(body);
        
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
          });
        
          it("should respond with status 401 if given token is not valid", async () => {
            const body = {"roomId": 1}
            const token = faker.lorem.word();
        
            const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);
        
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
          });
        
          it("should respond with status 401 if there is no session for given token", async () => {
            const body = {"roomId": 1}
            const userWithoutSession = await createUser();
            const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
        
            const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);
        
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
          });
    
    
          describe("when token is valid", () => {
    
                it("should respond with status 404 when user has no booking", async () => {
                    const user = await createUser();
                    const token = await generateValidToken(user);
                    const enrollment = await createEnrollmentWithAddress(user);
                    const ticketType = await createTicketTypeWithHotel();
                    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
                    const payment = await createPayment(ticket.id, ticketType.price);
                    const createdHotel = await createHotel();
                    const room = await createRoomWithHotelId(createdHotel.id);
                    const body = {"roomId": 1}

                    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);
    
                    expect(response.status).toEqual(httpStatus.NOT_FOUND);

                    })
                 
                 it("should respond with status 200 when user has booking", async () => {
                    const user = await createUser();
                    const token = await generateValidToken(user);
                    const enrollment = await createEnrollmentWithAddress(user);
                    const ticketType = await createTicketTypeWithHotel();
                    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
                    const payment = await createPayment(ticket.id, ticketType.price);
                    const createdHotel = await createHotel();
                    const room = await createRoomWithHotelId(createdHotel.id);
                    const booking = await creatBooking(user.id, room.id)
                    const body = {"roomId": room.id}
        
                    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);
                   
                    expect(response.status).toEqual(httpStatus.OK);
                    })
            })
        })

        describe("PUT /booking/:bookingId", () => {
           
            it("should respond with status 401 if no token is given", async () => {
                 const body = {"roomId": 1}
                const response = await server.get("/booking/1").send(body);
            
                expect(response.status).toBe(httpStatus.UNAUTHORIZED);
              });
            
              it("should respond with status 401 if given token is not valid", async () => {
                const body = {"roomId": 1}
                const token = faker.lorem.word();
            
                const response = await server.put("/booking/1").set("Authorization", `Bearer ${token}`).send(body);
            
                expect(response.status).toBe(httpStatus.UNAUTHORIZED);
              });
            
              it("should respond with status 401 if there is no session for given token", async () => {
                const body = {"roomId": 1}
                const userWithoutSession = await createUser();
                const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
            
                const response = await server.put("/booking/1").set("Authorization", `Bearer ${token}`).send(body);
            
                expect(response.status).toBe(httpStatus.UNAUTHORIZED);
              });
        
        
              describe("when token is valid", () => {
        
                    it("should respond with status 404 when user has no booking", async () => {
                        const user = await createUser();
                        const token = await generateValidToken(user);
                        const enrollment = await createEnrollmentWithAddress(user);
                        const ticketType = await createTicketTypeWithHotel();
                        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
                        const payment = await createPayment(ticket.id, ticketType.price);
                        const createdHotel = await createHotel();
                        

                        const body = {"roomId": 1}
    
                        const response = await server.put("/booking/1").set("Authorization", `Bearer ${token}`).send(body);
        
                        expect(response.status).toEqual(httpStatus.NOT_FOUND);
    
                        })
                     
        
        
                     it("should respond with status 200 when user has booking", async () => {
                        const user = await createUser();
                        const token = await generateValidToken(user);
                        const enrollment = await createEnrollmentWithAddress(user);
                        const ticketType = await createTicketTypeWithHotel();
                        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
                        const payment = await createPayment(ticket.id, ticketType.price);
                        const createdHotel = await createHotel();
                        const room = await createRoomWithHotelId(createdHotel.id);
                        const room2 = await createRoomWithHotelId(createdHotel.id);
                        const booking = await creatBooking(user.id, room.id)
                        const body = {"roomId": room2.id}
            
                        const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send(body);
                        console.log(response.body)

                        expect(response.status).toEqual(httpStatus.OK);
                    
                        })
                })
            })
    


