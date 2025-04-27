import { useEffect, useRef, type FC, type HTMLAttributes } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import { css, cx } from "@linaria/core";

interface ScanCodeProps extends HTMLAttributes<HTMLDivElement> {
    onScanCode?: (result?: string) => void;
}

const ScanCode: FC<ScanCodeProps> = ({
    onScanCode,
    className,
    ...restProps
}) => {

    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;
        (async () => {
            if (videoRef.current != null) {

                const video = videoRef.current;
                const reader = new BrowserQRCodeReader();
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'environment',
                    }
                });
                video.srcObject = stream;
                video.addEventListener('play', () => {
                    reader.decodeFromVideoElement(video, (result) => {
                        if (result) {
                            onScanCode?.(result.getText());
                        } else {
                        }
                    });

                });
                video.play();
            }
        })()
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                if (videoRef.current) {
                    videoRef.current.srcObject = null;
                }
            }
        }
    }, [])

    return (
        <div
            className={cx(
                css`
                    position: relative;
                `,
                className
            )}
            {...restProps}
        >
            <video
                className={css`
                    position: absolute;
                    object-fit: cover;
                    width: 100%;
                    height: 100%;
                `}
                ref={videoRef}
            />
        </div>
    )
}

export default ScanCode;
