---
toc: true
toc_sticky: true
title: 마커스 전자 교환 모델
category: Electrochemistry
tags:
  - "electron transfer"
  - "Marcus model"
  - kinetics
published: true
created_at: 2024-03-05 23:43:24 +09:00
last_modified_at: 2024-03-13 18:36:33 +09:00
header:
  teaser: /assets/images/uncategorized-teaser-8.png
excerpt: 구조불변성 전자 교환 반응의 반응속도를 자유에너지 관점에서 설명하는 마커스 모델 (Marcus model) 정리
---

## 요약

등에너지성(isoenergetic), 비방사성(radiationless), 구조불변성(outer-space)을 갖는 전자 교환 반응의 반응속도를 설명하는 **마커스 모델(Marcus Microscopic Model)**에 대해 설명합니다.  마커스 모델은 반응물과 생성물의 자유에너지가 이차함수 형태를 가지는 것으로 보고, 이로부터 정반응과 역반응의 활성화 에너지를 설명하는 구체적인 공식을 유도합니다.  이 과정에서 재구성 에너지(reorganization energy; $\lambda$)가 중요한 개념으로 제시됩니다.  또한 마커스 모델은 마커스 반전 영역(Marcus Inverted Region)의 존재를 예측하는데, 이는 어떤 반응에 대해 단순히 과전위를 계속 높이거나 낮추는 것만으로 반응속도를 무한히 높일 수 없음을 알려 줍니다.

## 반응좌표 - 자유에너지 도식

마커스 모델의 반응좌표 - 자유에너지 도식을 살펴봅시다.  산화종과 환원종이 전자 하나를 교환하는 단순한 반응을 생각합니다.

$$\ce{O + e -> R} \tag{1}$$

이 때, 반응물(산화종)과 생성물(환원종)의 자유에너지를 반응좌표상에 아래와 같은 이차함수 꼴로 각각 나타낼 수 있다고 합시다.

$$G^{0}_{O}(q)=(k/2)(q-q_O)^2 \tag{2}$$

$$G^{0}_{R}(q)=(k/2)(q-q_R)^2+\Delta G^0 \tag{3}$$

그러면 전체적인 반응 도식을 아래와 같이 그릴 수 있습니다.

{% include jsxgraph.html graphName="240314-marcus-0" jxgNo=0 width=300 height=300 caption="반응좌표-자유에너지 도식"%}

주요 변수들의 의미는 다음과 같습니다.

- $q_O$ : 반응물의 안정 상태 좌표
- $q_R$ : 생성물의 안정 상태 좌표
- $q^\Dagger$ : 반응 발생 좌표
- $\Delta G^\Dagger_f$ : 정반응의 활성화에너지
- $\Delta G^\Dagger_b$ : 역반응의 활성화에너지

정반응($\ce{O + e -> R}$)의 진행 경로를 생각해 봅시다.  반응물은 안정 상태($q_O$)에서 출발하여, $\Delta G^\Dagger_f$만큼의 에너지 장벽을 넘고 나면 $q^\Dagger$에 도달할 수 있습니다.  이후 전자를 획득하여 반응물($R$)이 되고, 반응물 안정 상태($q_R$)에 도달합니다.

가장 먼저, 전자 교환이 발생하는 반응 좌표 $q^\Dagger$의 위치는 아래와 같이 계산됩니다.

$$q^\Dagger =\frac{q_R+q_O}{2}+\frac{\Delta G_0}{k(q_R-q_O)}\tag{4}$$ 

$G_O(q_O)=0$으로 약속하면, 정반응의 활성화에너지를 다음과 같이 쓸 수 있게 됩니다.

$$\Delta G^\Dagger_f=\frac{k(q_R-q_O)^2}{8}\left[1+\frac{2\Delta G_0}{k(q_R-q_O)
^2}\right]^2 \tag{5}$$

## 재구성 에너지

재구성 에너지(reorganization energy)를 아래와 같이 정의합니다.

$$\lambda = \frac{k}{2}(q_R-q_O)^2\tag{6}$$

그러면 **식 5**는 아래와 같이 정리됩니다.

$$\Delta G^\Dagger_f=\frac{\lambda}{4}\left(1+\frac{\Delta G_0}{\lambda}\right)^2 \tag{7}$$

재구성 에너지는 안정한 상태에 있는 반응물의 구조($q_O$)를 **전자 이동 없이** 안정한 상태의 생성물($q_R$)과 같은 형태로 왜곡하기 위해 필요한 에너지의 크기입니다.

## 마커스 반전 영역

아래 그림을 살펴 봅시다.  초기 상태에서 이 반응은 정반응의 활성화 에너지가 역반응의 활성화 에너지보다 높습니다.

정반응의 속도상수를 높이고 싶다고 생각해 봅시다.  슬라이더를 살짝 위로 끌어 보면, 정반응의 활성화 에너지($\Delta G^\Dagger_{f}$)가 낮아지는 것을 알 수 있습니다.  정반응의 활성화에너지가 낮아졌으므로, 정반응의 속도상수가 증가하며 정반응이 가속됩니다.

{% include jsxgraph.html graphName="240314-marcus-1" jxgNo=1 width=300 height=300 caption="반응물 자유에너지 상승에 따른 $\Delta G^\Dagger_f$ 변화"%}

전극 반응의 관점에서 생각하면, 슬라이더를 끌어올리는 것은 과전압을 가하여 작동전극의 전자들이 갖는 에너지를 높이는 것과 같습니다.  에너지가 높은 전자들이 산화종의 빈 에너지 준위를 찾아 들어가 산화종을 환원시킬 것이므로, 전압을 높여 줄수록 정반응이 가속될 것이라는 예상에 정합한 것 같습니다.

하지만 슬라이더를 끌어올리다 보면, 어느 시점부터는 정반응의 활성화 에너지가 오히려 다시 증가하기 시작합니다.  즉, 어떤 반응을 가속하기 위해 작동전극의 전위를 한 방향으로 조절할 때, 반응속도가 전위 변화에 따라 무한히 가속될 것으로 기대할 수 없으며, 어느 시점 이후로는 오히려 속도상수의 감소가 관찰되는 반전 영역(inverted region)에 진입하게 됩니다.  이러한 구간을 **마커스 반전 영역(Marcus inverted region)**이라고 합니다.