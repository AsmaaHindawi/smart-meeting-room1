// src/services/bookingService.js
import api from '../api';

export function createBooking({ room_id, start_time, duration, attendees }) {
  return api.post('/bookings', {
    room_id, start_time, duration, attendees
  });
}

export function listBookings(params) {
  return api.get('/bookings', { params });
}
