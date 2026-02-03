let socket = null;

export function connectSocket(onMessage, options = {}) {
  socket = new WebSocket("ws://localhost:5000");

  socket.onopen = () => {
    console.log("WebSocket connected");
    options?.onOpen?.();
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      onMessage({ type: "RAW_MESSAGE", data: event.data });
    }
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected");
    options?.onClose?.();
  };

  socket.onerror = (err) => {
    console.error("WebSocket error:", err);
    options?.onError?.(err);
  };
}

export function sendMessage(payload) {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(payload));
  }
}

export function sendRawMessage(message) {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(message);
  }
}
