import axios from "axios";

const BASE_URL = "http://localhost:5000/game";

export async function createPlayer(count) {
  const response = await axios.post(`${BASE_URL}/createplayer`, null, {
    params: { count }
  });
  return await response;
}

export async function startGame() {
  const response = await axios.post(`${BASE_URL}/start`);
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

export async function playCard(player, idx, color) {
  const response = await axios.post(`${BASE_URL}/play`, null, {
    params: { player, idx, color }
  });
  return response;
}

export async function callUno(player) {
  const response = await axios.post(`${BASE_URL}/uno`, null, {
    params: { player }
  });
  return response;
}
