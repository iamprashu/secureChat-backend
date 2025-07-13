let io = null;

export function setSocketInstance(socketInstance) {
  io = socketInstance;
}

export function getSocketInstance() {
  return io;
}
