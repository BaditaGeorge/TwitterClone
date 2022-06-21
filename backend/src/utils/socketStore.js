class PrivateSocketStore {
  constructor() {
    this.socketStore = {};
  }

  getSocket(userID) {
    if (userID in this.socketStore) {
      return this.socketStore[userID];
    } else return null;
  }

  removeSocket(userID, socketID) {
    if (userID in this.socketStore) {
      this.socketStore[userID] = this.socketStore[userID].filter(
        (socket) => socket.id !== socketID
      );
    }
  }

  addSocket(userID, newSocket) {
    if (!this.socketStore[userID]) {
      this.socketStore[userID] = [];
    }
    if (
      !this.socketStore[userID].find((socket) => socket.id === newSocket.id)
    ) {
      this.socketStore[userID].push(newSocket);
    }
  }

  emitFor(userID, event, data) {
    if (userID in this.socketStore) {
      this.socketStore[userID].forEach((socket) => {
        socket.emit(event, data);
      });
    }
  }
}

module.exports = new PrivateSocketStore();
