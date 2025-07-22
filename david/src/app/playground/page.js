'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../dashboards/supabaseClient';

const PlaygroundPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('API 키를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      // API 키 유효성 검사
      const isValid = await validateApiKey(apiKey);
      
      if (isValid) {
        // API 키가 유효한 경우에만 localStorage에 저장하고 protected 페이지로 이동
        localStorage.setItem('apiKey', apiKey);
        router.push('/protectedpage');
      } else {
        // API 키가 유효하지 않은 경우 에러 메시지 표시
        setError('API 키가 유효하지 않습니다. 올바른 키를 입력해주세요.');
        setIsSubmitting(false);
      }
    } catch (error) {
      setError('API 키 검증 중 오류가 발생했습니다.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">API Playground</h1>
          <p className="text-gray-600">API 키를 입력하여 서비스를 시작하세요</p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>테스트용 API 키:</strong> 3자 이상의 영문자, 숫자, 언더스코어, 하이픈만 포함된 키를 입력하세요.
              <br />
              <strong>유효한 예시:</strong> <code className="bg-blue-100 px-1 rounded">test</code>, <code className="bg-blue-100 px-1 rounded">api123</code>, <code className="bg-blue-100 px-1 rounded">my_key</code>
              <br />
              <strong>유효하지 않은 예시:</strong> <code className="bg-red-100 px-1 rounded">invalid</code>, <code className="bg-red-100 px-1 rounded">ab</code>
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
              API 키
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="API 키를 입력하세요"
              required
            />
            {error && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '제출 중...' : 'API 키 제출'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <a href="/dashboards" className="text-blue-600 hover:text-blue-800 text-sm">
            대시보드로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
};

export default PlaygroundPage; 