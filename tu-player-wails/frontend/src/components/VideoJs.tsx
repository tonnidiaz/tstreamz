import React from "react";
import videojs from "video.js";
import Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";

export const VideoJS = (props: {
    options: {
        autoplay: boolean;
        controls: boolean;
        responsive: boolean;
        fluid: boolean;
        sources: {
            src: string;
            type: string;
        }[];
    };
    onReady: any;
}) => {
    const videoRef = React.useRef(null);
    const playerRef = React.useRef<Player>(null);
    const { options, onReady } = props;

    React.useEffect(() => {
        // Make sure Video.js player is only initialized once
        if (!playerRef.current) {
            console.log({ source: options.sources });
            // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
            const videoElement = document.createElement("video-js");

            videoElement.classList.add("vjs-big-play-centered");
            videoRef.current.appendChild(videoElement);

            const player = (playerRef.current = videojs(
                videoElement,
                options,
                () => {
                    videojs.log("player is ready");
                    onReady && onReady(player);
                }
            ));

            // You could update an existing player in the `else` block here
            // on prop change, for example:
        } else {
            const player = playerRef.current;
            try {
                player.pause();
                player.reset();
            } catch (err) {}

            player.autoplay(options.autoplay);
            player.src(options.sources);
            console.log({ sourceElse: options.sources });
        }
    }, [options, videoRef]);

    // Dispose the Video.js player when the functional component unmounts
    React.useEffect(() => {
        const player = playerRef.current;

        if (player){
            // setPlayerState({duration: player.duration()})
        }

        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);

    return (
        <div data-vjs-player className="w-full h-full">
            <div className="h-full" ref={videoRef} />
        </div>
    );
};
