---
title: 머신러닝 기반 배터리 수명 예측 논문 리뷰
category: programming
tags:
  - programming
  - battery
  - machine-learning
created_at: 2025-03-03 04:06:10 -05:00
last_modified_at: 2025-03-04 01:30:27 -05:00
excerpt: 머신러닝 기반 배터리 수명 예측 논문 정리
published: true
---
## KA Severson, PM Attia et al. (2019)[^1]

잔존유효수명(Remaining Useful Life; RUL) 예측에 데이터기반 접근 및 머신러닝을 동원하는 시도는 이전부터도 시도되어 오고 있었지만, 이 논문은 -배터리 수명 예측 분야의 관점에서는- 유의미한 대규모 데이터셋을 직접 구축하고 데이터기반 모델링을 통해 유의미한 수명 예측 성능을 얻어 큰 주목을 받게 된 연구입니다.  다양한 충전 프로토콜로 124개의 18650 원통형 배터리를 수명 종말점(End of Life; EOL) 까지 충방전하여 데이터를 확보하고, 최종적으로 최초 100사이클 이내의 데이터를 이용하여 수명 종말점을 예측하는 문제를 해결하고자 하였습니다.

저자들이 제안하는 바 이 예측 문제에 있어 가장 유의미한 설명력을 보인 지표들은 $\Delta Q_{100-10}$라는 변수를 가공하여 얻은 것입니다.  이 변수는 배터리 방전 전압의 함수로서, 서로 다른 충/방전 사이클에서 얻은 두 개의 서로 다른 방전 프로파일(용량-전압 곡선)을 비교하여 특정 전압에서 두 방전 프로파일의 누적 용량의 차이를 계산합니다.  저자들은 특히 $\Delta Q_{100-10}$의 분산 값인 $\text{Var}(\Delta Q_{100-10})$이 수명 종말점과 강한 음의 상관관계를 보인다는 것을 **발견**하고 이 변수를 모델 구성에 적극적으로 이용했습니다.  이 논문 이후 많은 다른 후속 연구들도 이와 같이 특정한 두 사이클 사이의 방전 프로파일에서 전압에 따른 용량 차분 등을 계산하고 이로부터 설명력 있는 인자를 도출하는 작업을 수행하였습니다.

저자들이 복잡한 심층신경망 구조 대신 규제를 갖는 선형모델(Elastic Net)을 선택한 것도 주목할 만 합니다.  저자들은 보다 해석이 용이한 경량 모델을 구축하는 관점에서 엘라스틱넷 모형을 선택했다고 밝히고 있고, 뒤에 다루겠지만 2025년 초의 최고 성능 모델인 칭화대-스탠포드대-마이크로소프트 리서치의 **BatLiNet** 역시 CNN을 도입하기는 했지만 최종 레이어에서 선형 모델을 추가하는 방식으로 여전히 선형 모델을 아키텍처의 중요한 일부로 포함하고 있습니다.

[^1]: KA Severson, PM Attia, N Jin, N Perkins, B Jiang, Z Yang, MH Chen, M Aykol, PK Herring, D Fraggedakis, MZ Bazant, SJ Harris, WC Chueh, and RD Braatz, "Data-Driven Prediction of Battery Cycle Life Before Capacity Degradation," *Nature Energy* **4**, 383-391 (2019)

## H Zhang, Y Li et al. (2025) - BatLiNet[^2]

2025년 초 출판된 논문으로 2025년 3월 현재까지 SOTA 모델입니다.  배터리 수명 예측 분야는 아직 여러 모델들을 일관성 있게 평가할 수 있는 잘 정의된 대규모 데이터셋이 존재한다고 하기 어렵고 연구팀마다 각자 다양한 공개 데이터셋 혹은 자체 생산한 데이터셋에 대해 몇 가지 모델들의 성능을 평가하고 자신들의 모델이 SOTA라고 주장하는 형태로 구성되는 경우가 대부분이지만, 그러한 점을 고려하더라도 현재까지 **BatLiNet**은 다양한 배터리 조성과 충방전 및 환경조건들에 대한 커버리지를 고려할 때 SOTA 모델이라고 할 만 합니다.

저자들은 Severson 등에 의해 주목받은 피쳐 기반 연구를 특정한 셀의 열화 과정만을 고려하는 **Intra-cell learning**이라고 구분하고, 서로 다른 셀들 사이의 열화 특성 차이를 별도로 학습하는 **Inter-cell learning**을 제안합니다.  Severson의 $\Delta Q_{100-10}$으로 대표되는 intra-cell learning이 특정 셀의 충방전 데이터 중 **서로 다른 두 사이클**에서 얻어진 방전 프로파일을 비교한다면, inter-cell learning에서는 **서로 다른 두 셀**을 가지고 동일한 사이클에서 얻은 방전 프로파일을 비교합니다.  따라서 inter-cell learning에서는 수명을 예측하고자 하는 셀(target cell)과 비교 대상이 되는 기준 셀(reference cell)이 존재하게 됩니다.

최종적으로 BatLiNet은 intra-cell learning을 수행하는 CNN 모듈과 inter-cell learning을 수행하는 CNN 모듈을 가집니다.   각 CNN 모듈은 주어진 배터리 데이터에 대해 같은 형태를 갖는 임베딩 벡터를 출력하고, 이 두 출력을 마지막 선형 레이어에서 결합하여 수명 예측값을 출력합니다.

Severson 논문과 비교하여 설명하면, 우선 Severson이 제안한 방식(각 방전전압에서 $\Delta Q$를 계산)은 사용하지 않고 누적 용량이 같은 점에서 $\Delta V$를 계산합니다.  Intra-cell learning의 경우, Severson의 연구에서는 10사이클과 100사이클만을 비교했지만 논문 구현상의 BatLiNet은 10사이클에서의 방전 프로파일을 1사이클 - 100사이클까지의 모든 프로파일과 비교합니다.  한편 Inter-cell learning의 경우 서로 다른 두 셀에 대해 1-100사이클까지 100개 사이클을 각각 비교합니다.

최종적으로 데이터셋은 $(B, 6, H, W)$ 크기의 텐서가 되는데,  $B$는 배치 크기, $H$는 비교대상이 되는 사이클의 갯수로 100이 되며 $W$는 두 개의 서로 다른 충방전 프로파일을 비교하기 위해 측정된 원본 데이터를 내삽할 때 내삽을 얼마나 조밀하게 수행할지에 따라 변경되는 값입니다.  또한 1) 충전 전압 프로파일, 2) 방전 전압 프로파일, 3) 충전 전류 프로파일, 4) 방전 전류 프로파일, 5) $\Delta V(Q)$ 프로파일, 6) 내부저항 프로파일 (전압차분과 전류차분의 비율로 계산)의 6가지 특성을 추출하여 사용하기 때문에 2번째 항은 6이 되었습니다.  즉 100개 사이클($H$)마다 각각 $W$의 크기로 내삽된 전압 및 전류 프로파일을 사용하여 6개의 서로 다른 피쳐를 계산하고 이것이 하나의 텐서 입력이 됩니다.

{% include img-gdrive alt="BatLiNet architecture (2025)" id="1CY0l9iWSknQ7EFof368LthmiLIHiSLCS" %}

두 개의 CNN 브랜치에서 얻어진 임베딩 벡터를 선형 모델 $\text{w}$에 입력하여 최종 사이클 수명 출력을 얻게 되는데, 마지막 레이어를 이와 같이 선형 레이어로 적용한 이유를 살펴볼 필요가 있습니다.

Intra-cell 학습을 위한 특성벡터 하나를 $\text{x}$라 하고, 이에 대응하는 EOL 수명 값을 $y$, 수명예측을 수행하는 모델을 $f_\theta$라고 합시다 ($\theta$ 는 모델 $f$를 구성하는 내부 파라미터 세트입니다).  그러면 모델 $f$를 학습하는 것은 아래와 같은 문제가 됩니다.

$$ \operatorname*{min}\limits_{\theta}\Bbb{E}_{(\textbf{x},y)\in D}{\lVert f_\theta(\textbf{x}) - y \rVert}^2_2 \tag{ZL1}$$

이 때 저자들은 배터리 수명 예측에 있어 고질적인 데이터 부족의 문제로 인해 $f$를 순수 신경망 모델로 작성하는 것에는 과적합 이슈가 있다고 말합니다.  이를 위해 도입되는 Inter-cell learning은 서로 다른 두 배터리 데이터에서 얻은 특성벡터의 차이($\Delta\textbf{x}$)를 가지고 그 EOL 수명의 차이($\Delta y$)를 예측하는 문제입니다.

$$ \operatorname*{min}\limits_{\phi}\Bbb{E}_{(\Delta\textbf{x},\Delta y)\in D}{\lVert g_\phi(\Delta\textbf{x}) - \Delta y \rVert}^2_2 \tag{ZL2}$$

저자들은 문제 $\text{(ZL2)}$의 최적해를 찾는 데 있어 우선 데이터 전처리를 통해 $\Delta y$의 기대값이 0이 되도록 처리하면, $f$와 $g$가 모두 선형함수로 모델링하는 경우 두 함수가 동일한 최적 파라미터를 가진다는 점을 이용하여 intra-cell learning과 inter-cell learning을 결합합니다.

간단한 버전의 증명은 $f_{\theta ^{*}}(x)={\text{w}_f^*}^T \textbf{x}$  and $g_{\phi ^{*}}(x)={\text{w}_g^*}^T \textbf{x}$ 이라고 두고, 아래 등식을 이용하는 것입니다.  아래 등식은 $\Delta y$의 기대값이 0이 되지 않으면 성립하지 않습니다.

$$ \begin{aligned}
   &\Bbb{E}_{(\Delta\textbf{x},\Delta y)\in D}{\lVert {\text{w}_g^*}^T\Delta\textbf{x} - \Delta y \rVert}^2_2 = \newline
   &\Bbb{E}_{(\textbf{x},y)\in D}{\lVert{\text{w}_g^*}^T\textbf{x} - y \rVert}^2_2 
   +\Bbb{E}_{(\textbf{x}',y')\in D}{\lVert{\text{w}_g^*}^T\textbf{x}' - y' \rVert}^2_2
   = \newline
   &2 \times \Bbb{E}_{(\textbf{x},y)\in D}{\lVert{\text{w}_g^*}^T\textbf{x} - y \rVert}^2_2   \end{aligned} 
   \tag{ZL3} $$

$\textbf{w}_g^*$는 모델 $g$의 최적 파라미터로서 $(\text{ZL3})$의 좌변을 최소값이 되게 하는 값인데, 가장 우변을 살펴보면 이 값은 모델 $f$의 목적함수 값의 절반과 같다는 것을 알 수 있습니다.  등식이 성립하고 있기 때문에 $\textbf{w}_g^*$가 모델 $f$의 목적함수 또한 최소화하는 최적 파라미터가 되는 것을 알 수 있습니다.

[^2]: H Zhang, Y Li, S Zheng, Z Lu, X Gui, W Xu, and J Bian, "Battery Lifetime Prediction Across Diverse Ageing Conditions with Inter-Cell Deep Learning," *Nature Machine Intelligence* **7**, 270-277 (2025)