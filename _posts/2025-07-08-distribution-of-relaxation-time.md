---
title: 이완시간분포 (Distribution of Relaxation Time; DRT) 분석법
category: electrochemistry
tags:
  - EIS
created_at: 2025-07-08 10:41:59 -05:00
last_modified_at: 2025-07-09 12:30:09 -05:00
excerpt: 이완시간분포 (Distribution of Relaxation Time; DRT) 분석법에 대한 설명과 시각적 이해를 돕기 위한 애니메이션
published: true
---
**이완시간분포 (Distribution of Relaxation time; DRT) 분석법**은 전기화학 임피던스 분석 시 등가회로모형에 의한 분석을 대신할 수 있는 방법입니다.  등가회로 모형을 사용하는 경우 시스템의 전기화학 반응들에 대한 어느 정도의 선험적 (a priori) 지식을 가정하여 회로요소들의 개수와 연결 상태를 선택한 뒤 만들어진 최종 회로의 파라미터들을 실험 데이터에 피팅하지만, DRT 방법은 모든 특성 반응 시간(characteristic response time)이 시스템의 전기화학 반응에 부분적으로나마 기여할 수 있다고 생각하고 이들의 분포를 연속함수 형태로 추정하는 방식을 사용합니다.

첨부된 애니메이션은 오픈소스 파이썬 라이브러리 **pyDRTtools**[^1]를 이용하여  Y Zhang, Q Tang (2020)[^2]의 공개 데이터셋을 DRT 방법으로 분석한 것입니다.  저자들은 사이클 진행에 따른 용량 감소를 측정하고 매 사이클마다 EIS 분석을 실시하였으며 이를 통해 EIS 데이터로부터 SOH를 추정하는 머신러닝 기반 예측 모델을 만들고자 하였습니다.  첨부 애니메이션은 사이클 진행에 따라 Nyquist Plot이 어떻게 변하는지, 각 사이클에서의 임피던스 데이터를 DRT 분석한 결과 스펙트럼은 어떻게 변하는지 보여줍니다.  사이클 진행에 따라 어떤 Peak들은 거의 변화를 보이지 않지만 어떤 Peak들은 크기와 위치가 서서히 변동하는 것을 확인할 수 있으며, 이를 통해 사이클 진행 과정에서 시스템 내부의 전기화학적 특성 변화를 추적할 수 있습니다.
 
{% include video id="_whehd7xsAA" provider="youtube" %}

[^1]: [ciuccislab/pyDRTtools: An intuitive python GUI to compute the DRT](https://github.com/ciuccislab/pyDRTtools)
[^2]: Y Zhang, Q Tang et. al., Nat. Commun. (2020); 10.1038/s41467-020-15235-7
