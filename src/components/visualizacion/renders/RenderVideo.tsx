import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { audioExtensions } from '../../../utils/audioExtensions';
import { Button, Flex } from '@chakra-ui/react';
import {
  faPause,
  faPlay,
  faVolumeHigh,
  faVolumeXmark,
  faBackward,
  faForward,
} from '@fortawesome/free-solid-svg-icons';
import styles from '../../../assets/css/components/media/renderVideo.module.css';
import ReactPlayer from 'react-player/lazy';

interface Props {
  url: string;
}

function RenderVideo({ url }: Props) {
  const fileExtensionPoint = url.lastIndexOf('.') + 1;
  const fileType: string = url.slice(fileExtensionPoint, url.length);
  const [isVisible, setIsVisible] = useState<boolean | null>(null);
  const [videoRate, setVideoRate] = useState<number>(1);
  const [videoPLaying, setVideoPLaying] = useState<boolean | null>(null);
  const [videoMuted, setVideoMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const contVideoRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (isVisible !== entry.isIntersecting) {
          setIsVisible(entry.isIntersecting);
        }
      },
      {
        root: null,
        threshold: 0,
      }
    );
    if (contVideoRef.current) {
      observer.observe(contVideoRef.current);
    }
    return () => {
      if (contVideoRef.current) {
        observer.unobserve(contVideoRef.current);
      }
    };
  }, [isVisible]);

  const handleProgress = (progress: { playedSeconds: number }) => {
    setCurrentTime(progress.playedSeconds);
  };

  const handleSeekBackward = () => {
    if (videoRef.current) {
      const newTime = Math.max(0, currentTime - 5);
      videoRef.current.seekTo(newTime, 'seconds');
    }
  };

  const handleSeekForward = () => {
    if (videoRef.current) {
      const newTime = currentTime + 5;
      videoRef.current.seekTo(newTime, 'seconds');
    }
  };

  const isAudioFile = audioExtensions.some(
    (ext) => ext.toLowerCase() === fileType.toLowerCase()
  );

  return (
    <div ref={contVideoRef}>
      <div>
        {isAudioFile ? (
          <ReactPlayer
            ref={videoRef}
            url={url}
            height={'fit-content'}
            playbackRate={videoRate}
            playing={videoPLaying}
            muted={videoMuted}
            onPlay={() => setVideoPLaying(true)}
            onPause={() => setVideoPLaying(false)}
            onProgress={handleProgress}
            controls
          />
        ) : (
          <ReactPlayer
            ref={videoRef}
            url={url}
            width={'100%'}
            height={'100%'}
            playbackRate={videoRate}
            playing={videoPLaying}
            muted={videoMuted}
            onPlay={() => setVideoPLaying(true)}
            onPause={() => setVideoPLaying(false)}
            onProgress={handleProgress}
            controls
          />
        )}

        <div
          className={`${
            !isVisible && videoPLaying !== null && styles.floatControls
          }`}
        >
          <Flex justifyContent={'space-around'} gap={2} my={2}>
            <Button flex={1} p={2} onClick={() => setVideoRate(1)}>
              x1
            </Button>
            <Button flex={1} p={2} onClick={() => setVideoRate(1.25)}>
              x1.25
            </Button>
            <Button flex={1} p={2} onClick={() => setVideoRate(1.5)}>
              x1.5
            </Button>
            <Button flex={1} p={2} onClick={() => setVideoRate(2)}>
              x2
            </Button>

            <Button flex={1}
              p={2}
              onClick={handleSeekBackward}
              title="Retroceder 5 segundos"
              colorScheme="blue"
            >
              <FontAwesomeIcon icon={faBackward} />
            </Button>

            <Button flex={1} p={2} onClick={() => setVideoPLaying((prev) => !prev)}>
              {videoPLaying ? (
                <FontAwesomeIcon icon={faPause} />
              ) : (
                <FontAwesomeIcon icon={faPlay} />
              )}
            </Button>

            <Button flex={1}
              p={2}
              onClick={handleSeekForward}
              title="Avanzar 5 segundos"
              colorScheme="green"
            >
              <FontAwesomeIcon icon={faForward} />
            </Button>

            <Button flex={1} p={2} onClick={() => setVideoMuted((prev) => !prev)}>
              {videoMuted ? (
                <FontAwesomeIcon icon={faVolumeXmark} />
              ) : (
                <FontAwesomeIcon icon={faVolumeHigh} />
              )}
            </Button>
          </Flex>
        </div>
      </div>
    </div>
  );
}

export default RenderVideo;
