import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { audioExtensions } from '../../../utils/audioExtensions';
import {
  faPause,
  faPlay,
  faVolumeHigh,
  faVolumeXmark,
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
  const [videoPLaying, setVideoPLaying] = useState<boolean>(null);
  const [videoMuted, setVideoMuted] = useState<boolean>(false);
  const contVideoRef = useRef(null);
  const videoRef = useRef(null);

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
  }, []);

  console.log();

  return (
    <>
      <div ref={contVideoRef} className={styles.renderVideo}>
        <div className={styles.container}>
          {audioExtensions.some(
            (ext) => ext.toLocaleLowerCase() === fileType.toLocaleLowerCase()
          ) ? (
            <ReactPlayer
              ref={videoRef}
              url={url}
              height={'fit-content'}
              playbackRate={videoRate}
              playing={videoPLaying}
              muted={videoMuted}
              onPlay={() => setVideoPLaying(true)}
              onPause={() => setVideoPLaying(false)}
              controls
            />
          ) : (
            <div className={styles.cont_video}>
              <ReactPlayer
                ref={videoRef}
                url={url}
                width={'100%'}
                height={'100%'}
                playbackRate={videoRate}
                playing={videoPLaying}
                muted={videoMuted}
              />
            </div>
          )}

          <div
            className={`${styles.controls} ${
              !isVisible && videoPLaying !== null && styles.floatControls
            }`}
          >
            <button onClick={() => setVideoRate(1)}>x1</button>
            <button onClick={() => setVideoRate(1.25)}>x1.25</button>
            <button onClick={() => setVideoRate(1.5)}>x1.5</button>
            <button onClick={() => setVideoRate(2)}>x2</button>

            <button onClick={() => setVideoPLaying((prev) => !prev)}>
              {videoPLaying ? (
                <FontAwesomeIcon icon={faPause} />
              ) : (
                <FontAwesomeIcon icon={faPlay} />
              )}
            </button>

            <button onClick={() => setVideoMuted((prev) => !prev)}>
              {videoMuted ? (
                <FontAwesomeIcon icon={faVolumeXmark} />
              ) : (
                <FontAwesomeIcon icon={faVolumeHigh} />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default RenderVideo;
