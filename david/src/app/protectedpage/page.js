'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Notification from '../dashboards/components/Notification';

const ProtectedPage = () => {
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [isValidating, setIsValidating] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (showVideo && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error('비디오 재생 실패:', error);
        setNotification({
          show: true,
          message: '비디오 파일을 찾을 수 없습니다.',
          type: 'error'
        });
      });
    }
  }, [showVideo]);

  if (isValidating) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">페이지를 준비 중입니다...</p>
        </div>
      </div>
    );
  }

  if (!showVideo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        className="max-w-full max-h-full"
        controls
        autoPlay
        muted
        loop
        preload="auto"
      >
        <source src="/테스트영상파일.mp4" type="video/mp4" />
        브라우저가 비디오를 지원하지 않습니다.
      </video>
      <Notification notification={notification} setNotification={setNotification} />
    </div>
  );
};

export default ProtectedPage; 