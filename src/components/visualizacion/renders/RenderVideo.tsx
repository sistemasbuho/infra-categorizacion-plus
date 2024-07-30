import { useEffect, useRef, useState } from 'react';

import styles from '../../../assets/css/components/media/renderVideo.module.css';
import ReactPlayer from 'react-player/lazy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPause,
  faPlay,
  faVolumeHigh,
  faVolumeXmark,
} from '@fortawesome/free-solid-svg-icons';

interface Props {
  url: string;
}

function RenderVideo({ url }: Props) {
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

  return (
    <>
      <div ref={contVideoRef} className={styles.renderVideo}>
        <div
          className={
            !isVisible && videoPLaying !== null
              ? styles.floatContainer
              : styles.container
          }
        >
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

          <div className={styles.controls}>
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
