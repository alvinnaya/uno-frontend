import axios from "axios";

const BASE_URL = "http://localhost:5047/game";

export async function createPlayer(count) {
  const response = await axios.post(`${BASE_URL}/createplayer`, null, {
    params: { count }
  });
  console.log("create player", response)
  return await response;
}

export async function startGame() {
  const response = await axios.post(`${BASE_URL}/start`);
  console.log("start game", response)
  return response;
}

export async function getCurrentState() {
  const response = await axios.get(`${BASE_URL}/getcurrentstate`);
  return response;
}

export async function getCard(player) {
  const response = await axios.get(`${BASE_URL}/getcard`, {
    params: { player }
  });
  return response;
}

export async function drawCard(player) {
  const response = await axios.post(`${BASE_URL}/draw`, null, {
    params: { player }
  });
  return response;
}

export async function playCard(player, idx, color, connectionId) {
  const response = await axios.post(`${BASE_URL}/play`, null, {
    params: { player, idx, color, connectionId }
  });
  return response;
}

export async function callUno(player) {
  console.log("call uno", player);
  const response = await axios.post(`${BASE_URL}/uno`, null, {
    params: { player }
  });
  console.log("call uno", response);
  return response;
}

export async function resetGame() {
  const response = await axios.post(`${BASE_URL}/resetgame`);
  console.log("reset game", response);
  return response;
}
