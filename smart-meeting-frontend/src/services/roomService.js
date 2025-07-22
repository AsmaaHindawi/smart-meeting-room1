// src/services/roomService.js
import api from '../api';

export function listRooms() {
  return api.get('/rooms');
}

export function getRoom(id) {
  return api.get(`/rooms/${id}`);
}
