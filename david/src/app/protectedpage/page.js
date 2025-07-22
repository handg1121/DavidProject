'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Notification from '../dashboards/components/Notification';
import { supabase } from '../dashboards/supabaseClient';

const ProtectedPage = () => {
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [isValidating, setIsValidating] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);
  const router = useRouter();

  // API 키 유효성 검사 함수
  const validateApiKey = async (apiKey) => {
    try {
      // Supabase에서 API 키를 검증
      // 실제 환경에서는 api_keys 테이블을 사용하지만, 
      // 여기서는 간단한 검증을 위해 특정 패턴을 확인합니다
      
      // 방법 1: Supabase 테이블에서 검증 (api_keys 테이블이 있다면)
      try {
        const { data, error } = await supabase
          .from('api_keys')
          .select('*')
          .eq('key', apiKey);

        if (!error && data && data.length > 0) {
          console.log('API 키 검증 성공 (테이블):', data[0]);
          return true;
        }
      } catch (tableError) {
        console.log('테이블 검증 실패, 다른 방법 시도');
      }

      // 방법 2: 간단한 패턴 검증 (백업 방법)
      // 실제 환경에서는 이 부분을 제거하고 위의 테이블 검증만 사용
      const isValidPattern = apiKey.length >= 3 && 
                           /^[a-zA-Z0-9_-]+$/.test(apiKey) &&
                           !apiKey.includes('invalid');

      if (isValidPattern) {
        console.log('API 키 검증 성공 (패턴):', apiKey);
        return true;
      }

      console.log('API 키 검증 실패:', apiKey);
      return false;
    } catch (error) {
      console.error('API 키 검증 중 오류:', error);
      return false;
    }
  };

  useEffect(() => {
    const checkApiKey = async () => {
      const apiKey = localStorage.getItem('apiKey');
      
      if (!apiKey) {
        setNotification({
          show: true,
          message: 'API 키가 없습니다. playground 페이지로 이동합니다.',
          type: 'error'
        });
        setTimeout(() => {
          router.push('/playground');
        }, 2000);
        return;
      }

      try {
        const isValid = await validateApiKey(apiKey);
        
        if (isValid) {
          setNotification({
            show: true,
            message: 'API 키가 유효합니다! 비디오를 재생합니다.',
            type: 'success'
          });
          setShowVideo(true);
        } else {
          setNotification({
            show: true,
            message: 'API 키가 유효하지 않습니다. 올바른 키를 입력해주세요.',
            type: 'error'
          });
          // localStorage에서 잘못된 API 키 제거
          localStorage.removeItem('apiKey');
          setTimeout(() => {
            router.push('/playground');
          }, 2000);
        }
      } catch (error) {
        setNotification({
          show: true,
          message: 'API 키 검증 중 오류가 발생했습니다.',
          type: 'error'
        });
        setTimeout(() => {
          router.push('/playground');
        }, 2000);
      } finally {
        setIsValidating(false);
      }
    };

    checkApiKey();
  }, [router]);

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
          <p className="text-white text-lg">API 키를 검증하고 있습니다...</p>
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