# 제주 사토루 모델 (Jeju Satoru Model)

이 폴더는 '제주 사토루' 프로젝트를 통해 학습된 제주어-표준어 양방향 번역 모델을 관리합니다. 모델 파일 자체는 용량 문제로 인해 깃허브 저장소에는 직접 포함되지 않으며, 아래 허깅페이스 허브를 통해 제공됩니다.

## 모델 개요

* **기반 모델**: **KoBART (gogamza/kobart-base-v2)**
* **모델 아키텍처**: Seq2Seq (인코더-디코더 구조)
* **주요 기능**: 제주어와 표준어 간의 양방향 텍스트 번역을 수행합니다.
* **학습 데이터**: 허깅페이스에 공개된 `Junhoee/Jeju-Standard-Translation` 데이터셋을 활용하여 약 93만 개의 문장 쌍으로 학습되었습니다.



## 학습 전략 및 파라미터

모델 학습은 **2단계 도메인 적응 기법**을 적용하여 진행되었습니다.

1.  **표준어 도메인 적응**: 기존 데이터셋의 표준어 문장을 입력과 타겟이 동일한 쌍으로 구성하여, 모델이 표준어의 '패턴'과 '스타일'을 더 깊이 이해하도록 했습니다.
2.  **제주어 도메인 적응**: 표준어 적응과 동일하게 제주어 문장으로 모델을 학습시켜 제주어의 특징을 익히게 했습니다.
3.  **번역 파인튜닝**: 최종적으로 `[제주]` 또는 `[표준]` 태그가 추가된 양방향 데이터셋을 활용해 제주어와 표준어 간의 '번역 규칙'을 학습했습니다.

### 주요 하이퍼파라미터 및 기법

* **Learning Rate**: 2e-5
* **Epochs**: 3
* **Batch Size**: 128
* **Weight Decay**: 0.01
* **Generation Beams**: 5
* **GPU 메모리 효율성**: FP16 (혼합 정밀도 학습)을 적용하여 학습 시간을 단축했습니다.
* **Gradient Accumulation Steps**: 16

---

## 모델 성능

모델의 성능은 SacreBLEU, CHRF, BERTScore와 같은 정량적 지표와 유창성(Fluency), 정확성(Adequacy), 어조(Tone)를 평가하는 정성적 지표로 다각적으로 평가되었습니다.

* **제주어 → 표준어**:
    * SacreBLEU: 77.19
    * CHRF: 83.02
    * BERTScore: 0.97
* **표준어 → 제주어**:
    * SacreBLEU: 64.86
    * CHRF: 72.68
    * BERTScore: 0.94

---

## 모델 다운로드 및 사용 방법

학습된 모델은 다음 허깅페이스 허브에서 다운로드할 수 있습니다.

[**제주 사토루 모델 허깅페이스 링크**](https://huggingface.co/sbaru/jeju-satoru)

`transformers` 라이브러리의 `pipeline`을 활용하면 간단하게 추론을 실행할 수 있습니다. 아래 예시 코드를 참고해 주세요.

```python
from transformers import pipeline

# 모델 경로를 허깅페이스 링크로 변경
translator = pipeline(
    "translation",
    model="sbaru/jeju-satoru"
)

# 제주어 -> 표준어 번역
jeju_sentence = '[제주] 멩심허라, 우리 집이 펜안허다.'
result = translator(jeju_sentence, max_length=128)
print(f"입력: {jeju_sentence}")
print(f"출력: {result[0]['translation_text']}")

# 표준어 -> 제주어 번역
standard_sentence = '[표준] 염려 마라, 우리 집은 편안하다.'
result = translator(standard_sentence, max_length=128)
print(f"입력: {standard_sentence}")
print(f"출력: {result[0]['translation_text']}")
