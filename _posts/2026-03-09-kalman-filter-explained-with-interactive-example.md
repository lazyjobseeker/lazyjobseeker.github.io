---
title: "칼만 필터 (Kalman Filter) 이해하기: 이론 및 인터랙티브 예제"
category: programming
tags:
  - algorithm
created_at: 2026-03-08 03:07:08 -05:00
last_modified_at: 2026-03-11 11:33:02 -05:00
excerpt: 선형 상태공간계의 상태 추정에 사용되는 칼만 필터 알고리즘에 대한 단계별 설명 및 인터랙티브 웹앱 예제.
published: true
---
## 들어가기 - 마우스 커서 트래커

**칼만 필터**는 선형 상태공간 시스템의 알려지지 않은 상태 변수(state variable)들을 정확하게 추정하기 위한 알고리즘입니다. 구체적으로는, 상태 전이 모델(state transition model)에 의해 예측되는 다음 상태를 센서 측정값(measurement)과 결합하여 시스템의 상태를 정확히 추적하는 것을 목표로 합니다.

본론으로 들어가기 전에, 아래에 칼만필터를 이용하여 작동하는 간단한 마우스 커서 추적 예제가 있습니다 (모바일의 경우 터치-드래그로 테스트할 수 있습니다).

{% include apps/kalman-filter-position-tracker.html %}

**빨간색** 궤적은 마우스 커서 혹은 터치 궤적이 움직이는 정확한 경로이며, 칼만필터를 이용해 알아내고자 하는 실제 경로, 칼만필터가 알아내고자 하는 상태 변수가 나타내는 자취입니다.

**노란색 궤적**은 빨간색 궤적에 임의 노이즈를 섞어 표시한 것입니다. 모든 센서와 측정 도구는 노이즈(잡음)를 갖기 때문에, 칼만필터를 이용하는 데 있어 우리가 실제로 사용 가능한 입력값은 이 궤적이 됩니다. 캔버스 안의 **Meas. Error** 값을 조정하여 키우거나 줄일 수 있습니다.

**하늘색** 궤적은 칼만필터를 이용해 추정된 위치들의 자취입니다.

위 웹앱 캔버스에 입력할 수 있는 $Q$와 $R$에 대해서는 건너뛰어 보도록 하겠습니다. 이미 칼만필터에 대해 알고 있다면 바로 숫자를 바꾸어 보면서 이해하시는 바와 같이 작동하는지 확인해 보아도 좋고, 포스트의 나머지 내용들을 읽고 난 뒤 다시 돌아와서 숫자들을 조정해 보는 것도 괜찮습니다.

## 단계별 해설

### 모델 기반 예측 (Prediction)

가장 먼저, 임의의 단계 $k$에서 상태변수 $x_k$를 우리가 가진 모델에 기반해 예측하는 것을 생각해 봅시다. 이전 단계의 상태변수 $x_{k-1}$에 더하여 상태 변화 과정을 시뮬레이션하는 모델 $F$가 주어지면, 단계 $k$에 대해 다음

$$ x_{k \mid k-1} = F_k x_{k-1} \tag{1}$$

과 같이 쓸 수 있습니다. 이 때 $F$를 상태전이모델(행렬)이라고 합니다. $x_k$ 대신 $x_{k \mid k-1}$과 같이 쓴 것은 이 값이 우리가 칼만필터를 적용하여 최종적으로 얻고자 하는 보정된 추정치가 아닌, 상태모델 $F$와 직전 상태 $x_{k-1}$에만 의존하여 추정된 값이라는 점을 나타내기 위한 것입니다.

## 상태추정 공분산

칼만필터를 이해하는데 있어서 필수적인 요소 중 하나가 바로 상태추정과 관련된 각종 **공분산(행렬)** 들입니다. 칼만필터에서 공분산은 상태변수 $x$에 대한 불확실성을 나타내는 공분산($P$), 전이모델이 상태변수의 변화를 완벽하게 설명할 수 없는 데에서 오는 공분산($Q$), 그리고 어떤 측정도구도 우리가 원하는 상태변수를 완벽하게 측정할 수는 없다는 사실로부터 오는 공분산($R$)의 세 가지 범주로 구분됩니다.

단계 $k$의 예측 수행 시점에서 상태변수 자체에 대한 예측뿐만 아니라 이들에 대한 공분산 $P_{k \mid k-1}$ 에 대한 예측 역시 수행되며, 다음과 같이 기술합니다:

$$P_{k \mid k-1} = {F_k}P_{k-1 \mid k-1}{F_k}^T + Q_k \tag{2}$$

이 때 $Q_k$는 모델 $F_k$가  

Note that we have a priori knowledge of transition model and process covariance at step $k$ -  we assume we know the transition model at step $k$ ($F_k$) and the extent of inaccuracy involved with the model's capability of predicting the next step ($Q_k$).

### 센서 측정

기술적으로는 식 (1)만으로도 상태 추정 알고리즘이 구성된다고 말할 수 있습니다. 다만 이 경우 이 알고리즘의 다음 단계 추정 정확도는 상태전이모델 $F$가 얼마나 정확한지에 의해서만 결정될 것이며, 실질적으로는 모델의 오류가 단계마다 누적됨에 따라 높은 확률로 실제 상태변수로부터 크게 벗어나게 될 것입니다.

이 지점에서 적당한 측정도구(센서)가 있다고 합시다. 이 센서가 스텝 $k$에서 상태변수 $x_k$를 측정한 결과는 $z_k$이며, 상태변수와 측정결과를 연관짓는 또 다른 모델 (관측 모델) $H_k$를 알고 있다고 하겠습니다.

$$z_k = H_kx_k + v_k \tag{3}$$

$v_k$는 측정 잡음(노이즈)으로, 측정잡음에 대한 공분산(행렬) $R_k$에 대해 $\mathcal{N}(0, R_k)$를 따르는 것으로 가정합니다.

### 이노베이션 (Innovation)

상기한 내용들을 바탕으로, 이노베이션(innovation) $S_k$를 다음

$$y_k = z_k - H_k x_{k \mid k-1} \tag{4}$$
과 같이 계산합니다.

식 (4)를 관찰해 보면, $z_k$는 우리가 알고자 하는 실제 상태변수 $x_k$를 직접 관측한 결과이며, $H_k x_{k \mid k-1}$는 상태전이모델만을 이용해 추정했던 사전추정결과를 이용해 모사된 측정치입니다. 따라서 이노베이션 $y_k$는

> 현재 상태변수 $x_{k-1}$를 가지고 상태전이모델 $F$와 관측모델 $H$를 이용하여 재구성한 모사 측정값이 실제 측정값 $z_k$와 얼마나 다른가?

를 정량화한 것입니다.

이노베이션 $y_k$에 대해서도 공분산 $S_k$를 생각할 수 있으며, 아래와 같이 정리할 수 있습니다.

$$S_k = \text{cov}(y_k) = E \left[ y_k y_k^T\right] = H_k P_{k \mid k-1} H_k^T + R_k \tag{5}$$

### 칼만 이득

이제 상태전이모델 $F$를 이용하여 느슨하게 추측했던 상태변수 $x_{k \mid k-1}$를 보정하는 작업까지 한 단계만이 남았습니다. 이 작업을 위해서 먼저 이노베이션 공분산 $S_k$를 이용하여 칼만 이득 (Kalman gain; $K_k$)을 다음과 같이 계산합니다.

$$K_k = P_{k \mid k-1}{H_k^T}S_k^{-1} \tag{6}$$

## 상태변수 업데이트

이제 사전(a priori) 추정에 의해 얻었던 상태변수($x_{k \mid k-1}$)와 이 상태변수의 공분산($P_{k \mid k-1}$) 을 관측값에 의해 보정된 사후 (a posteriori)추정값으로 다음과 같이 업데이트할 수 있습니다.

$$x_{k \mid k} = x_{k \mid k-1} + K_k y_k \tag{7}$$
$$P_{k \mid k} = \left( I - K_k H_k \right) P_{k \mid k-1} \tag{8}$$

## 기타

- Kalman filter is effectively a low-pass filter.
- If noise covariance $R$ increases, Kalman gain $K$ reduces. It makes the posterior state estimate depends more on the model-driven estimate than sensor measurement. Increasing $P$ works the opposite way.
- Relying solely on the model leads to drift issue.  Relying solely on the sensor measurement leads to accuracy issue. Kalman filter is a Bayesian estimator correcting model prediction with sensor measurements.
- If there is no observability for a state, Kalman filter cannot find that state correctly.
- In practical implementation, often the Joseph form $P = (I-KH)P(I-KH)^T + KRK^T$ is used.
