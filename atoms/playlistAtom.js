import { atom } from "recoil";

export const playlistState = atom({
	key: "playlistState",
	default: null,
});

export const playlistIdState = atom({
	key: "playlistIdState",
	// picking default playlist
	default: "6vWEpKDjVitlEDrOmLjIAj",
});
