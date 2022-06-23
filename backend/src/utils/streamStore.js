class StreamStore {
  constructor() {
    this.rooms = [];
  }

  addRoom(roomID, streamer) {
    this.rooms.push({
      roomID: roomID,
      name: streamer,
    });
  }

  removeRoom(roomID) {
    this.rooms = this.rooms.filter((el) => el.roomID !== roomID);
  }

  getRooms() {
    return this.rooms;
  }
}

module.exports = new StreamStore();
