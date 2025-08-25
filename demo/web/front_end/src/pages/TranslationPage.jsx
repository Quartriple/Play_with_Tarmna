import React, { useState, useEffect } from 'react';
import TranslationBox from '../components/TranslationBox';
import DirectionToggle from '../components/DirectionToggle';
import '../styles/TranslationPage.css';

function TranslationPage() {
  const [direction, setDirection] = useState('jeju-to-std');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 번역 방향을 전환하는 함수
  const handleToggle = () => {
    // 이전 번역 결과를 새로운 입력 텍스트로 설정합니다.
    const newSourceText = translatedText;
    const newDirection = direction === 'jeju-to-std' ? 'std-to-jeju' : 'jeju-to-std';
    
    // 상태를 업데이트합니다.
    setSourceText(newSourceText);
    setDirection(newDirection);
    setTranslatedText(''); // 이전 출력 텍스트 초기화

    // 만약 이전 번역 결과가 비어있지 않다면, 자동으로 번역을 시작합니다.
    if (newSourceText.trim() !== '') {
      handleTranslate(newSourceText, newDirection);
    }
  };

  const handleTranslate = async (textToTranslate = sourceText, currentDirection = direction) => {
    if (!textToTranslate) {
      alert("번역할 텍스트를 입력해주세요.");
      return;
    }
    
    setIsLoading(true);

    try {
      const prefixToken = currentDirection === 'jeju-to-std' ? '[제주]' : '[표준]';
      const textToSend = `${prefixToken} ${textToTranslate}`;

      const apiUrl = 'http://localhost:5000';
      const endpoint = '/translate';

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textToSend,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTranslatedText(data.translated_text);
      
    } catch (error) {
      console.error("번역 중 오류가 발생했습니다:", error);
      setTranslatedText("번역에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="translation-page-container">
      <header className="page-header">
        <h1>✨ 옴팡: 제주 방언 번역기</h1>
      </header>
      <main className="translation-main">
        <div className="translation-inputs">
          <TranslationBox
            type="input"
            language={direction === 'jeju-to-std' ? '제주어' : '표준어'}
            text={sourceText}
            onTextChange={setSourceText}
            onTranslate={() => handleTranslate()}
            isLoading={isLoading}
          />
          <DirectionToggle onToggle={handleToggle} />
          <TranslationBox
            type="output"
            language={direction === 'jeju-to-std' ? '표준어' : '제주어'}
            text={isLoading ? '번역 중...' : translatedText}
          />
        </div>
      </main>
      <footer className="page-footer">
        <p>ⓒ 2025 Team Ompang. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default TranslationPage;