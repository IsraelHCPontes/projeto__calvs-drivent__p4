import { ApplicationError } from "@/protocols";

export function cannotListBookingsError(): ApplicationError {
  return {
    name: "CannotListBookingsError",
    message: "Cannot list bookings!",
  };
}