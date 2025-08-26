from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from transformers import BartForConditionalGeneration, PreTrainedTokenizerFast
import re
import time 

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app, resources={r'/*': {'origins': 'http://localhost:3000'}})
socketio = SocketIO(app, cors_allowed_origins='*', async_mode='gevent')

# 텍스트를 문장 단위로 분할하는 함수
def split_sentences(text, max_length=20):
    sentences = re.split(r'[.?!]\s*', text)
    cleaned_sentences = [s.strip() for s in sentences if s.strip()]
    
    # 문장 길이가 길면 2차 분할
    chunks = []
    for sentence in cleaned_sentences:
        if len(sentence) > max_length:
            words = sentence.split()
            current_chunk = ""
            for word in words:
                if len(current_chunk) + len(word) + 1 > max_length and current_chunk:
                    chunks.append(current_chunk)
                    current_chunk = word
                else:
                    if current_chunk:
                        current_chunk += " " + word
                    else:
                        current_chunk = word
            if current_chunk:
                chunks.append(current_chunk)
        else:
            chunks.append(sentence)

    return chunks


# 백그라운드에서 실행될 번역 작업 함수
def background_translation_task (long_text, sid):
    try:
        parts = long_text.split(' ', 1)
        prefix_token = parts[0] if len(parts) > 1 and parts[0] in ['[제주]', '[표준]'] else ''
        text_without_prefix = parts[1] if len(parts) > 1 else long_text

        sentences = split_sentences(long_text)

        for i, sentence in enumerate(sentences):
            sentence = f"{prefix_token} {sentence}"
            inputs = tokenizer(sentence, return_tensors='pt')
            if 'token_type_ids' in inputs:
                del inputs['token_type_ids']

            # 모델 추론
            outputs = model.generate(**inputs, num_beams=5, early_stopping=True)
            translated_part = tokenizer.decode(outputs[0], skip_special_tokens=True)
            translated_part = translated_part.replace('[제주]', '').replace('[표준]', '').strip()

            words = translated_part.split()
            for j, word in enumerate(words):
                socketio.emit('translation_update', {'text': word + ' ', 'is_complete': False}, room=sid)
                print(f"[{j+1}/{len(words)}] 클라이언트에  단어 전송: {word}") 
                time.sleep(0.05)

        # 모든 문장 전송 후 완료 메시지 전송
        socketio.emit('translation_update', {'is_complete': True}, room=sid)
    
    except Exception as e:
        print(f'번역 중 오류 발생: {e}')
        socketio.emit('translation_update', {'text': '번역 중 요류가 발생했습니다.', 'is_complete': True}, room=sid)

model_path = '../../../models/jeju_satoru'
model = BartForConditionalGeneration.from_pretrained(model_path)
tokenizer = PreTrainedTokenizerFast.from_pretrained(model_path)

# 클라이언트가 'request_translation'이라는 이벤트를 보낼 때 백엔드에서 이를 처리.
@socketio.on('request_translation')
def handle_translation_request(data):
    long_text = data.get('text')
    prefix_token = data.get('direction') # 제주->표준, 표준->제주 방향

    if not long_text:
        socketio.emit('translation_updata', {'text': '번역할 문장이 없습니다.', 'is_complete': True})
        return
    
    text_to_translate = f'{prefix_token} {long_text}'

    socketio.start_background_task(background_translation_task, text_to_translate, request.sid)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)