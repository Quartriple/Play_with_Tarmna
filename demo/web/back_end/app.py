from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import BartForConditionalGeneration, PreTrainedTokenizerFast

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app)

model_path = '../../../models/real_final_model2'
model = BartForConditionalGeneration.from_pretrained(model_path)
tokenizer = PreTrainedTokenizerFast.from_pretrained(model_path)

@app.route('/translate', methods=['POST'])  # 단일 엔드포인트로 변경
def translate_text():
    data = request.json
    text_to_translate = data.get('text', '')

    if not text_to_translate:
        return jsonify({'error': 'No text provided'}), 400

    inputs = tokenizer(text_to_translate, return_tensors='pt')
    if 'token_type_ids' in inputs:
        del inputs['token_type_ids']
    
    # 모델 추론
    outputs = model.generate(**inputs, num_beams=5, early_stopping=True)
    translated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

    translated_text = translated_text.replace('[제주]', '').replace('[표준]', '').strip()

    return jsonify({'translated_text': translated_text})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)