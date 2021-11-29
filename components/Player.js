import {
	HeartIcon,
	VolumeUpIcon as VolumeDownIcon,
} from "@heroicons/react/outline";
import {
	FastForwardIcon,
	PauseIcon,
	PlayIcon,
	ReplyIcon,
	VolumeUpIcon,
	RewindIcon,
	SwitchHorizontalIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";

function Player() {
	const spofitfyApi = useSpotify();
	const { data: session, status } = useSession();
	const [currentTrackId, setCurrentIdTrack] = useRecoilState(currentTrackState);
	const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
	const [volume, setVolume] = useState(50);
	const songInfo = useSongInfo();

	const fetchCurrentSong = () => {
		if (!songInfo) {
			spofitfyApi.getMyCurrentPlayingTrack().then((data) => {
				// console.log("Now playing:", data.body?.item);
				setCurrentIdTrack(data.body?.item?.id);

				spofitfyApi.getMyCurrentPlaybackState().then((data) => {
					// console.log("Now playing: ", data.body);
					setIsPlaying(data.body?.is_playing);
				});
			});
		}
	};

	useEffect(() => {
		if (spofitfyApi.getAccessToken() && !currentTrackId) {
			//fetch song info
			fetchCurrentSong();
			setVolume(50);
		}
	}, [currentTrackState, spofitfyApi, session]);

	const handlePlayPause = () => {
		spofitfyApi.getMyCurrentPlaybackState().then((data) => {
			if (data.body.is_playing) {
				spofitfyApi.pause();
				setIsPlaying(false);
			} else {
				spofitfyApi.play();
				setIsPlaying(true);
			}
		});
	};

	useEffect(() => {
		if (volume > 0 && volume < 100) {
			debouncedAdjustVolume(volume);
		}
	}, [volume]);

	const debouncedAdjustVolume = useCallback(
		debounce((volume) => {
			// console.log("changing volume");
			spofitfyApi.setVolume(volume).catch((err) => {
				console.log("error: ", err);
			});
		}, 500),
		[]
	);

	return (
		<div className="h-24 text-white bg-gradient-to-b from-black to-gray-900 grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
			{/* left */}
			<div className="flex items-center space-x-4 ">
				<img
					className="hidden md:inline h-10 w-10"
					src={songInfo?.album.images?.[0]?.url}
					alt="image thumb"
				/>
				<div>
					<h3>{songInfo?.name}</h3>
					<p>{songInfo?.artists?.[0].name}</p>
				</div>
			</div>

			{/* center */}
			<div className="flex items-center justify-evenly">
				<SwitchHorizontalIcon className="button" />
				<RewindIcon className="button" />

				{isPlaying ? (
					<PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
				) : (
					<PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
				)}

				<FastForwardIcon className="button" />
				<ReplyIcon className="button" />
			</div>

			{/* right */}
			<div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
				<VolumeDownIcon
					onClick={() => volume > 0 && setVolume(volume - 10)}
					className="button"
				/>
				<input
					className="w-14 md:w-28"
					type="range"
					value={volume}
					onChange={(e) => {
						setVolume(Number(e.target.value));
					}}
					min={0}
					max={100}
				/>
				<VolumeUpIcon
					onClick={() => volume < 100 && setVolume(volume + 10)}
					className="button"
				/>
			</div>
		</div>
	);
}

export default Player;
