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
last_modified_at: 2024-03-13 18:11:26 +09:00
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

{% assign jxgNo = 0 %}
{% include jsx-graph.html jxgNo=jxgNo width=300 height=300 %}
<script>
function draw() {
  var brd = JXG.JSXGraph.initBoard('{{ "jxg" | append: jxgNo }}', {boundingbox: [-4.5, 4, 4.5, -0.5], axis:false, showCopyright:false, showNavigation:false});
  var kO = 0.5;
  var kR = 0.5;
  var qO = -1.5;
  var qR = 1.5;
  var GO = 0.8;
  var GR = 0.5;
  var offset = 0.2;
  var pivot = -0.23;
  var left = pivot-offset;
  var right = pivot+offset;
  function marcusO(x) {return (kO/2)*parabola(x-qO) + GO;}
  function marcusR(x) {return (kR/2)*parabola(x-qR) + GR;}
  var intersect = marcusO(pivot) - 0.05;
  brd.create('functiongraph', [function(x){return marcusO(x);}, -5.5, 5.5],{strokeColor:'red', dash:2});
  brd.create('functiongraph', [function(x){return marcusR(x);}, -5.5, 5.5],{strokeColor:'red', dash:2});
  brd.create('point', [0, 0]);
  brd.create('functiongraph', [function(x){return marcusO(x);}, -5.5, left],{strokeColor:'red', strokeWidth:3});
  brd.create('functiongraph', [function(x){return marcusR(x);}, right, 5.5],{strokeColor:'red', strokeWidth:3});
  var p = brd.create('point', [pivot, intersect], {visible:false});
  var pO = brd.create('point', [left, marcusO(left)], {visible:false});
  var pR = brd.create('point', [right, marcusR(right)], {visible:false});
  brd.create('spline', [pO, p, pR], {strokeColor:'red', strokeWidth:3});
  brd.create('line', [[qO, 0], [qO, marcusO(qO)]], {straightFirst:false, straightLast:false, fixed:true, strokeWidth:1, dash:2});
  brd.create('line', [[qR, 0], [qR, marcusO(qR)]], {straightFirst:false, straightLast:false, fixed:true, strokeWidth:1, dash:2});
  brd.create('line', [[pivot, 0], p], {straightFirst:false, straightLast:false, fixed:true, strokeWidth:1, dash:2});
  brd.create('line', [[qO-1, marcusO(qO)], [qR+1, marcusO(qO)]], {straightFirst:true, straightLast:false, fixed:true, strokeWidth:1, dash:2});
  brd.create('line', [[qR-1, marcusR(qR)], [qR, marcusR(qR)]], {straightFirst:true, straightLast:false, fixed:true, strokeWidth:1, dash:2});
  brd.create('line', [[pivot-1, intersect], [qR+1, intersect]], {straightFirst:true, straightLast:false, fixed:true, strokeWidth:1, dash:2});
  brd.create('line', [[qR-0.3, marcusO(qR)], [qR+0.3, marcusO(qR)]], {straightFirst:false, straightLast:false, fixed:true, strokeWidth:1, dash:2});
  
  brd.create('arrow', [[qO-0.5, marcusO(qO)], [qO-0.5, marcusR(qR)]], {fixed:true, strokeWidth:2});
  brd.create('arrow', [[qR+0.5, marcusO(qR)], [qR+0.5, marcusO(qO)]], {fixed:true, strokeWidth:2});
  brd.create('arrow', [[qO, marcusO(qO)], [qO, intersect]], {fixed:true, strokeWidth:2});
  brd.create('arrow', [[qR, marcusR(qR)], [qR, intersect]], {fixed:true, strokeWidth:2});
  
  brd.create('text', [-1.66, -0.27, "q<sub>O</sub>"], {fontSize:16, fixed:true});
  brd.create('text', [1.38, -0.27, "q<sub>R</sub>"], {fontSize:16, fixed:true});
  brd.create('text', [-0.23, -0.27, "q<sub>&#8225;</sub>"], {fontSize:16, fixed:true});
  brd.create('text', [-4.3, 1.25, "G<sup>&#8225</sup>"], {fontSize:16, fixed:true});
  brd.create('text', [-4.3, 0.95, "G<sub>O</sub><sup>0</sup>(q<sub>O</sub>)"], {fontSize:16, fixed:true});
  brd.create('text', [-4.3, 0.65, "G<sub>R</sub><sup>0</sup>(q<sub>R</sub>)"], {fontSize:16, fixed:true});
  brd.create('text', [-1.7, 1.26, "ΔG<sub>f</sub><sup>&#8225</sup>"], {fontSize:16, fixed:true});
  brd.create('text', [1.06, 1.26, "ΔG<sub>b</sub><sup>&#8225</sup>"], {fontSize:16, fixed:true});
  brd.create('text', [-2.8, 0.4, "ΔG<sub>0</sub>"], {fontSize:16, fixed:true});
  brd.create('text', [-3, 1.6, "O + e"], {fontSize:16, fixed:true});
  brd.create('text', [3.2, 1.6, "R"], {fontSize:16, fixed:true});
  brd.create('text', [1.76, 1.82, "λ"], {fontSize:16, fixed:true});
}
draw();
</script>

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

{% assign jxgNo = 1 %}
{% include jsx-graph.html jxgNo=jxgNo width=300 height=300 %}
<script>
function draw2() {
  var brd = JXG.JSXGraph.initBoard('{{ "jxg" | append: jxgNo }}', {boundingbox: [-4.5, 4, 4.5, -0.5], axis:false, showCopyright:false, showNavigation:false});
  var kO = 0.4;
  var kR = 0.4;
  var qO = -1.2;
  var qR = 1.2;
  var GO = brd.create('slider', [[-3.5, 0],[-3.5, 3.2], [0, 0, 3.2]]);
  var GR = 0.5;
  var offset = 0.3;
  function marcusO(x) {return (kO/2)*parabola(x-qO) + GO.Value();}
  function marcusR(x) {return (kR/2)*parabola(x-qR) + GR;}
  function pX() {return (qR+qO)/2 + (GR-GO.Value())/(kO*(qR-qO));}
  function lX() {return pX();}
  function lY() {return Math.min(marcusO(lX()), marcusR(lX()));}
  function rX() {return pX();}
  function rY() {return Math.min(marcusO(rX()), marcusR(rX()));}
  function bY() {return lY()+(rY()-lY())*(pX()-lX())/(rX()-lX());}
  function pY() {return 0.7*marcusO(pX())+0.3*bY(); }
  var p = brd.create('point', [function(){ return pX();}, function(){return pY();}], {visible:false});
  var pO = brd.create('point', [function(){return lX();}, function(){return lY();}], {visible:false});
  var pR = brd.create('point', [function(){return rX();}, function(){return rY();}], {visible:false});
  brd.create('functiongraph', [function(x){return marcusO(x);}, -5.5, 5.5],{strokeColor:'red', dash:2});
  brd.create('functiongraph', [function(x){return marcusR(x);}, -5.5, 5.5],{strokeColor:'red', dash:2});
  brd.create('functiongraph', [function(x){return marcusO(x);}, -5.5, function() { return lX() ;}],{strokeColor:'red', strokeWidth:2});
  brd.create('functiongraph', [function(x){return marcusR(x);}, function() { return rX() ;}, 5.5],{strokeColor:'red', strokeWidth:2});
  
  function O_eq_left() {return Math.min(qO, pX());}
  function O_eq_right() {return Math.max(qO, pX());}
  function R_eq_left() {return Math.min(qR, pX());}
  function R_eq_right() {return Math.max(qR, pX());}
  
  brd.create('functiongraph', [function(x){return marcusO(x);}, function() { return O_eq_left() ;}, function() { return O_eq_right() ;}],{strokeColor:'blue', strokeWidth:3});
  brd.create('functiongraph', [function(x){return marcusR(x);}, function() { return R_eq_left() ;}, function() { return R_eq_right() ;}],{strokeColor:'blue', strokeWidth:3});
  brd.create('line', [[-1, function() {return marcusO(pX());}], [1, function() {return marcusO(pX());}]], {straightFirst:true, straightLast:true, fixed:true, strokeWidth:1, dash:2});
  brd.create('line', [[-1, function() {return marcusO(qO);}], [1, function() {return marcusO(qO);}]], {straightFirst:true, straightLast:true, fixed:true, strokeWidth:1, dash:2});
  brd.create('line', [[-1, function() {return marcusR(qR);}], [1, function() {return marcusR(qR);}]], {straightFirst:true, straightLast:true, fixed:true, strokeWidth:1, dash:2});
  brd.create('arrow', [[qO, function() {return marcusO(qO);}], [qO, function() {return marcusO(pX());}]], { fixed:true, strokeWidth:2});
  brd.create('arrow', [[qR, function() {return marcusR(qR);}], [qR, function() {return marcusR(pX());}]], { fixed:true, strokeWidth:2});
  
  brd.create('text', [qR+0.3, function() {return (marcusR(pX())+marcusR(qR))/2;}, "ΔG<sub>b</sub><sup>&#8225</sup>"], {fontSize:16, fixed:true});
  brd.create('text', [qO-1, function() {return (marcusO(pX())+marcusO(qO))/2;}, "ΔG<sub>f</sub><sup>&#8225</sup>"], {fontSize:16, fixed:true});
}
draw2();  
</script>

전극 반응의 관점에서 생각하면, 슬라이더를 끌어올리는 것은 과전압을 가하여 작동전극의 전자들이 갖는 에너지를 높이는 것과 같습니다.  에너지가 높은 전자들이 산화종의 빈 에너지 준위를 찾아 들어가 산화종을 환원시킬 것이므로, 전압을 높여 줄수록 정반응이 가속될 것이라는 예상에 정합한 것 같습니다.

하지만 슬라이더를 끌어올리다 보면, 어느 시점부터는 정반응의 활성화 에너지가 오히려 다시 증가하기 시작합니다.  즉, 어떤 반응을 가속하기 위해 작동전극의 전위를 한 방향으로 조절할 때, 반응속도가 전위 변화에 따라 무한히 가속될 것으로 기대할 수 없으며, 어느 시점 이후로는 오히려 속도상수의 감소가 관찰되는 반전 영역(inverted region)에 진입하게 됩니다.  이러한 구간을 **마커스 반전 영역(Marcus inverted region)**이라고 합니다.