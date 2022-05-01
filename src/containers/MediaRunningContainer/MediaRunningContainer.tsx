import React, { FC, LegacyRef, useEffect, useRef, useState } from "react";
import { useAppSelector } from "app/hooks";
import { selectCurrentAudioUrl } from "app/mediaRunning/mediaRunning";
import ReactPlayer from "react-player";
import MyPlayer from "./MyPlayer";
import PlayerContent from "./PlayerContent";
import _ from "lodash";
import usePrevious from "react-use/lib/usePrevious";

export interface MediaRunningContainerProps {
  className?: string;
}

const MediaRunningContainer: FC<MediaRunningContainerProps> = ({
  className = "",
}) => {
  const playerRef: LegacyRef<ReactPlayer> | undefined = useRef(null);

  const currentAudioUrl = useAppSelector(selectCurrentAudioUrl);
  const prevAudioUrl = usePrevious(currentAudioUrl);

  // STATE
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [played, setPlayed] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [playbackRate, setPlaybackRate] = useState<1 | 1.5 | 2>(1);
  const [muted, setMuted] = useState(false);
  const [seeking, setSeeking] = useState(false);
  //
  // Player cannot play audio on this posts
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (!prevAudioUrl || currentAudioUrl === prevAudioUrl) {
      return;
    }
    setIsError(false);
  }, [currentAudioUrl]);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.currentTarget.value));
  };

  const handleSeekMouseUp = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    setSeeking(false);
    if (playerRef.current) {
      playerRef.current.seekTo(parseFloat(e.currentTarget.value));
    }
  };
  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const renderPlayer = () => {
    return (
      <MyPlayer
        playerRef={playerRef}
        volume={volume}
        muted={muted}
        playbackRate={playbackRate}
        onDuration={(d) => {
          setDurationSeconds(d);
        }}
        onError={(error, data, hlsInstance, hlsGlobal) => {
          if (error.code !== 20) {
            console.log(789, "MyPlayer-error:", {
              error,
              data,
              hlsInstance,
              hlsGlobal,
            });
            setIsError(true);
          }
        }}
        onProgress={(e) => {
          setLoaded(e.loaded);
          !seeking && setPlayed(e.played);
          setPlayedSeconds(e.playedSeconds);
        }}
      />
    );
  };

  return (
    <div
      className={`nc-MediaRunningContainer fixed bottom-0 inset-x-0 flex z-30 ${className}`}
      data-nc-id="MediaRunningContainer"
    >
      <PlayerContent
        isError={isError}
        isMuted={muted}
        handleSetMuted={(isMuted) => setMuted(isMuted)}
        durationSeconds={durationSeconds}
        playedSeconds={playedSeconds}
        handleSeekMouseUp={handleSeekMouseUp}
        handleSeekMouseDown={handleSeekMouseDown}
        handleSeekChange={handleSeekChange}
        played={played}
        loaded={loaded}
        handleVolumeChange={(e) => setVolume(e)}
        volume={volume}
        playbackRate={playbackRate}
        handleSetPlaybackRate={(e) => setPlaybackRate(e)}
        handleClickBackwards10Sec={_.debounce(function () {
          playerRef.current?.seekTo(playedSeconds - 10, "seconds");
        }, 200)}
        handleClickForwards15Sec={_.debounce(function () {
          playerRef.current?.seekTo(playedSeconds + 15, "seconds");
        }, 200)}
      />

      {/* PLAYER -- */}
      <div className="hidden" hidden>
        {renderPlayer()}
      </div>
    </div>
  );
};

export default MediaRunningContainer;
