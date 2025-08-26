import React, { useState, useEffect, useRef } from 'react';
import TranslationBox from '../components/TranslationBox';
import DirectionToggle from '../components/DirectionToggle';
import '../styles/TranslationPage.css';
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ['websocket']
});

function TranslationPage() {
  const [direction, setDirection] = useState('jeju-to-std');
  const [sourceText, setSourceText] = useState('');
  const [renderedText, setRenderedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const renderedTextRef = useRef('');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('웹소켓 연결 성공:', socket.id);
    });
    socket.on('disconnect', () => {
      console.log('웹소켓 연결 해제');
    });
    socket.on('connect_error', (err) => {
      console.error('웹소켓 연결 오류:', err.message);
    });

    socket.on('translation_update', (data) => {
      console.log("웹소켓으로부터 데이터 수신:", data);

      if (data.is_complete) {
        setIsLoading(false);
        console.log("번역 완료 메시지 수신.");
      } else {
        renderedTextRef.current += data.text;
        setRenderedText(renderedTextRef.current);
      }
    });

    return () => {
      socket.off('translation_update');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, []);

  const handleToggle = () => {
    const newSourceText = renderedText;
    const newDirection = direction === 'jeju-to-std' ? 'std-to-jeju' : 'jeju-to-std';

    setSourceText(newSourceText);
    setDirection(newDirection);
    setRenderedText('');
    renderedTextRef.current = '';

    if (newSourceText.trim() !== '') {
      handleTranslate(newSourceText, newDirection);
    }
  };

  const handleTranslate = (textToTranslate = sourceText, currentDirection = direction) => {
    if (!textToTranslate) {
      alert("번역할 텍스트를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setRenderedText('');
    renderedTextRef.current = '';

    const prefixToken = currentDirection === 'jeju-to-std' ? '[제주]' : '[표준]';
    socket.emit('request_translation', {
      text: textToTranslate,
      direction: prefixToken
    });
  };

  return (
    <div className="translation-page-container">
      <header className="page-header">
        <h1>Jejusatoru</h1>
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
            text={renderedText}
          />
        </div>
      </main>
      <footer className="page-footer">
        <p>Jejusatoru는 실수를 할 수 있으니 다시 한번 확인하세요.</p>
      </footer>
    </div>
  );
}

export default TranslationPage;
