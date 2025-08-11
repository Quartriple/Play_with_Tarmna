# 옴팡 (OM-PANG) : 제주 방언-표준어 변환 모델 개발 프로젝트

## 1. 프로젝트 소개
[cite_start]'옴팡' 프로젝트는 유네스코 지정 소멸 위기 언어인 제주어의 보존과 제주어 사용 고령층의 디지털 소외 문제를 해결하기 위한 첫걸음입니다[cite: 4, 5]. [cite_start]3주간의 기간 동안 양방향 번역 모델의 실현 가능성을 검증하고 핵심 기술을 확보하는 것을 목표로 합니다[cite: 6].

## 2. 프로젝트 폴더 구조
프로젝트의 효율적인 협업과 체계적인 관리를 위해 다음과 같은 폴더 구조를 사용합니다.

-   `data/`: 모델 학습에 사용되는 모든 데이터를 관리합니다.
    -   [cite_start]`raw/`: 카카오브레인 JIT 및 AI Hub 데이터 등 원본 데이터가 저장됩니다[cite: 29, 30].
    -   [cite_start]`processed/`: 전처리 과정을 거친 후, 학습/검증/테스트 세트로 분리된 데이터가 저장됩니다[cite: 71].
    -   [cite_start]`augmented/`: 역번역(Back-Translation)과 같은 기법으로 증강된 데이터가 저장됩니다[cite: 35, 36].
-   `models/`: 파인튜닝이 완료된 모델 파일과 토크나이저를 저장합니다.
    -   [cite_start]`jeju_to_std/`: '제주 방언 → 표준어' 번역 모델을 저장합니다[cite: 72].
    -   [cite_start]`std_to_jeju/`: '표준어 → 제주 방언' 번역 모델을 저장합니다[cite: 75].
-   `notebooks/`: 데이터 탐색 및 모델 실험을 위한 Jupyter Notebook 파일들을 보관합니다.
-   `scripts/`: 데이터 전처리, 모델 학습, 평가 등 핵심 로직을 담은 파이썬 스크립트들을 저장합니다.
-   [cite_start]`demo/`: 학습된 모델을 활용한 데모 구현 코드가 저장됩니다[cite: 12].
-   [cite_start]`evaluation/`: 모델 성능 평가를 위한 코드와 정성적 평가 루브릭이 저장됩니다[cite: 49].
-   `requirements.txt`: 프로젝트에 필요한 모든 파이썬 라이브러리 목록이 포함됩니다.

## 3. 기술 스택
-   [cite_start]**언어**: Python, Java (백엔드), JavaScript (프론트엔드) [cite: 21]
-   [cite_start]**프레임워크**: PyTorch, Spring (가정), React (가정) [cite: 22, 23, 24]
-   [cite_start]**라이브러리**: Hugging Face `transformers`, `datasets`, `accelerate`, `peft` [cite: 25]
-   [cite_start]**모델 아키텍처**: Transformer (인코더-디코더 구조) [cite: 26]
-   [cite_start]**사전 학습 모델**: KoBART 또는 XLM-RoBERTa [cite: 27]

## 4. Git 워크플로우
[cite_start]본 프로젝트는 `git-flow`와 유사한 브랜칭 전략을 사용합니다[cite: 52].
-   [cite_start]`main` 브랜치: 배포 가능한 안정적인 코드를 유지합니다[cite: 53].
-   `develop` 브랜치: 개발의 중심이 되는 브랜치입니다. [cite_start]모든 팀원은 이 브랜치를 기반으로 작업합니다[cite: 54].
-   [cite_start]`feature/<task-name>` 브랜치: 개별 태스크를 위해 `develop`에서 분기하여 사용합니다[cite: 55].
-   [cite_start]Pull Request (PR): `feature` 브랜치를 `develop` 브랜치로 병합할 때 코드 리뷰를 요청하는 데 사용합니다[cite: 56].