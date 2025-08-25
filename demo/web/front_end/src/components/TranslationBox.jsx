import React from 'react';
import '../styles/TranslationBox.css';

function TranslationBox({ type, language, text, onTextChange, onTranslate, isLoading }) {
  return (
    <div className={`translation-box ${type}`}>
      <div className="box-header">
        <span>{language}</span>
      </div>
      <textarea
        className="text-area"
        value={text}
        onChange={(e) => onTextChange && onTextChange(e.target.value)}
        readOnly={type === 'output'}
        placeholder={type === 'input' ? "번역할 내용을 입력하세요..." : "번역 결과가 여기에 표시됩니다."}
        disabled={isLoading}
      />
      {type === 'input' && (
        <div className="box-footer">
          <button
            className="translate-button"
            onClick={onTranslate}
            disabled={isLoading}
          >
            {isLoading ? '번역 중...' : '번역하기'}
          </button>
        </div>
      )}
    </div>
  );
}

export default TranslationBox;