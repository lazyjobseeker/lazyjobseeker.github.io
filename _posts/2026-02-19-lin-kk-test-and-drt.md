---
title: Lin-KK 검정과 이완시간분포법(DRT) 비교
category: electrochemistry
tags:
  - electrochemistry
created_at: 2026-02-19 01:52:55 -05:00
last_modified_at: 2026-02-19 02:45:59 -05:00
excerpt: 임피던스 측정결과의 크라머스-크로니히(KK) 관계 만족 여부를 판정하기 위해 사용하는 Lin-KK 검정법과 이완시간분포(DRT) 분석의 유사점과 차이점을 살펴봅니다.
published: true
---

## Lin-KK 검정법

Lin-KK 검정은 임의의 전기화학임피던스(EIS) 스펙트럼이 [크라머스-크로니히(KK) 관계식](https://lazyjobseeker.github.io/posts/kramers-kronig-relations/)을 만족하는지를 신속하게 판별하기 위한 검정 방법입니다. 단일 RC 병렬회로는 KK 관계식을 만족하며 이들의 선형결합 또한 KK 관계식을 만족한다는 점을 이용하여, 주어진 임피던스 데이터가 다수의 유한개 RC회로의 선형결합을 통해 얼마나 잘 근사될 수 있는지를 확인합니다. 이 때, 각 RC 회로의 시상수는 필요한 시간 도메인 내에서 로그 균등하게 분포하도록 강제하여서 최적화 자유도를 하나 줄여 줍니다 (각 RC 회로에서 R값만 피팅하면 됩니다).

## DRT와의 비교

그런데, [이완시간분포법(DRT)](https://lazyjobseeker.github.io/posts/distribution-of-relaxation-time/)의 개념을 생각하면 Lin-KK 검정의 원리는 마치 DRT 분석에서 해제하는 적분방정식의 급수형 버전 (항 개수가 유한한) 처럼 보입니다.

$$Z(\omega) = R_0 + \sum_{i=1}^M \frac{R_i}{1+j\omega\tau_i} \tag{\text{Lin-KK}}$$


$$Z(\omega) = R_0 + \int_{0}^{\infty} \frac{g(\tau)}{1+j\omega\tau_i} d\tau \tag{DRT}$$

Lin-KK 검정을 기술할 때 우변 맨 끝에 리만적분에 필요한 0으로 수렴하는 $\Delta\tau$항이 곱해져 있지 않다는 아주 큰 차이가 있지만 (...) 어쨌든 그런 생각이 들 수 있습니다.

이 차이를 무시한다면, 이런 생각을 해 볼 수 있을 것입니다.

> Lin-KK 검정에서 얻어지는 $R_i$의 분포와 DRT에서 얻어지는 $\gamma(\tau)$의 분포가 사실 거의 동일한 것 아닐까?

## 차이점

{% include video id="XYSGHabtTvM" provider="youtube" %}

정말로 Lin-KK 검정에 사용하는 RC 서킷의 개수 ($M$)를 무한히 늘리면 $R_i$의 분포가 $\gamma(\tau)$에 접근하는지 실제로 테스트를 해 보면 그렇지 않다는 것을 알 수 있습니다. 그냥 '다르다'는 정도로 끝나는 것이 아니고, $M$값이 커지면 어느 순간부터 $R_i$ 값들은 양수와 음수가 교대로 나타나며 발산합니다.

이러한 발산은 Lin-KK 검정법의 경우 DRT에서 물리적으로 유의미한 결과를 얻기 위해 사용하는 규제(regularization)가 적용되지 않기 때문에 발생합니다. DRT 분석의 경우 이와 같은 발산을 막고 유의미한 분석결과를 도출하기 위한 수학적 수단으로서 리지(Ridge) 규제 (Tikhonov 규제라고도 합니다)를 적용합니다.