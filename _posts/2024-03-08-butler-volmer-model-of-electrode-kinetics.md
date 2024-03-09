---
toc: true
toc_sticky: true
title: 버틀러-볼머 식의 이해
category: Electrochemistry
tags:
  - Butler-Volmer
  - Electrode
  - kinetics
published: true
created_at: 2024-03-05 23:43:24 +09:00
last_modified_at: 2024-03-09 15:35:12 +09:00
header:
  teaser: /assets/images/uncategorized-teaser-7.png
excerpt: 속도상수와 반응좌표-자유에너지 도식을 통한 버틀러-볼머 식(Butler-Volmer Equation)의 유도 과정 및 이해
---

## 개요

전기화학 속도론에서 **버틀러-볼머(Butler-Voler) 식**은 작동전극(working electrode)의 전위가 높아지거나 낮아질 때 반응 전류의 크기 변화를 기술하는 식입니다.  간단한 산화환원 반응에서 반응좌표(reaction coordinate)에 따른 자유에너지 변화를 도시해 보고, 그래프로부터 버틀러-볼머 식을 유도해 보도록 하겠습니다.

## 아레니우스형 속도 상수

많은 화학반응의 속도 상수가 아래와 같은 **아레니우스 식**을 따른다는 사실이 실험적으로 잘 알려져 있습니다.

$$ k = Ae^{-E_A/RT} \tag{1}$$

$e^{-E_A/RT}$항은 특정 온도 $T$에서 반응물 입자가 에너지 장벽 $E_A$를 넘는 에너지를 가질 확률로 해석됩니다.  $A$는 반응물 입자가 에너지 장벽을 넘으려 시도하는 시간 당 횟수로 해석됩니다.  시도가 잦고($A\uparrow$) 에너지 장벽이 작을수록($E_A\downarrow$) 속도상수는 커집니다.

## 반응 좌표와 자유에너지

속도상수를 위와 같이 쓸 수 있다는 사실을 기억하고, 아래와 같은 가장 간단한 형태의 전극 과정을 생각해 봅시다.  산화종($\ce{O}$)과 환원종($\ce{R}$)이 전자 하나를 교환하는 반응이며, 다른 반응은 관여하지 않습니다.  정반응(환원)과 역반응(산화)의 속도상수는 각각 ${k_f}$와 ${k_b}$로 주어집니다.

$$\ce{O + e <=>[k_f][k_b] R} \tag{2}$$

이 반응에서 반응 좌표(reaction coordinate)에 따른 자유에너지의 변화를 도시해 보겠습니다.  산화종과 환원종 모두, 안정 상태에서 이탈함에 따라 자유에너지는 점차 상승하고, 특정 반응 좌표에 도달했을 때 (그림 1, 점 $A$)) 산화 혹은 환원 반응이 발생합니다.

{% assign jxgNo = 0 %}
{% include jsx-graph.html jxgNo=jxgNo width=300 height=300 %}

<script>
  var board = JXG.JSXGraph.initBoard('{{ "jxg" | append: jxgNo }}', {boundingbox: [-4, 4, 4, -1], axis:false, showCopyright:false, showNavigation:false});
  var gibbsO = board.create('functiongraph', [function(x){return gibbs(1.5, x+2);}, -3.5, 3.5],{name:'Gibbs', withLabel:false, strokeColor:'red'});
  var gibbsR = board.create('functiongraph', [function(x){return gibbs(1.5, -1*(x-2));}, -3.5, 3.5],{name:'Gibbs', withLabel:false, strokeColor:'blue'});
  var textR = board.create('text', [2.3, -0.5, "R"], {fontSize:16, fixed:true});
  var textO = board.create('text', [-3, -0.5, "O+e<sup>-</sup>"], {fontSize:16, fixed:true});
  var textG0c = board.create('text', [-3.7, 1, "ΔG<sup>&#8225;</sup><sub>0c</sub>"], {fontSize:16, fixed:true});
  var textG0a = board.create('text', [2.6, 1, "ΔG<sup>&#8225;</sup><sub>0a</sub>"], {fontSize:16, fixed:true});
  var p2 = board.create('point', [0, 1.91], {name: 'A', size:2, fixed:true});
  var p3 = board.create('point', [-3, 1.91], {visible:false, fixed:true});
  var p4 = board.create('point', [3, 1.91], {visible:false, fixed:true});
  var line1 = board.create('line', [p3, p4], {straightFirst:false, straightLast: false, dash:2});
  var p5 = board.create('point', [-2.5, 0], {visible:false, fixed:true});
  var p6 = board.create('point', [-2.5, 1.91], {visible:false, fixed:true});
  var line2 = board.create('arrow', [p5, p6], {straightFirst:false, straightLast: false, dash:2});
  var p7 = board.create('point', [2.5, 0], {visible:false, fixed:true});
  var p8 = board.create('point', [2.5, 1.91], {visible:false, fixed:true});
  var line3 = board.create('arrow', [p7, p8], {straightFirst:false, straightLast: false, dash:2});
</script>

**그림 1**
{: .text-center}

안정 상태에 있는 산화종과 환원종의 자유에너지가 동일하다면, 정반응이 일어나기 위해 필요한 자유에너지 변화량($\Delta G^\Dagger_{0c}$)과 역반응이 일어나기 위해 필요한 자유에너지 변화량($\Delta G^\Dagger_{0a}$)이 동일합니다.

정반응과 역반응이 일어나기 위해 극복해야 하는 에너지 차이가 동일하기 때문에, 두 반응의 속도는 동일합니다.

{% assign jxgNo = 1 %}
{% include jsx-graph.html jxgNo=jxgNo width=300 height=300 %}

<script>
  var board = JXG.JSXGraph.initBoard('{{ "jxg" | append: jxgNo }}', {boundingbox: [-4, 4, 4, -1], axis:false, showCopyright:false, showNavigation:false});
  var gibbsO = board.create('functiongraph', [function(x){return gibbs(1.5, x+2)+0.5;}, -3.5, 3.5],{name:'Gibbs', withLabel:false, strokeColor:'red'});
  var gibbsR = board.create('functiongraph', [function(x){return gibbs(1.5, -1*(x-2));}, -3.5, 3.5],{name:'Gibbs', withLabel:false, strokeColor:'blue'});
  var textR = board.create('text', [2.3, -0.5, "R"], {fontSize:16, fixed:true});
  var textO = board.create('text', [-3, -0.5, "O+e<sup>-</sup>"], {fontSize:16, fixed:true});
  var textG0c = board.create('text', [-3.7, 1, "ΔG<sup>&#8225;</sup><sub>0c</sub>"], {fontSize:16, fixed:true});
  var textG0a = board.create('text', [2.6, 1, "ΔG<sup>&#8225;</sup><sub>0a</sub>"], {fontSize:16, fixed:true});
  var p2 = board.create('point', [-0.15, 2.15], {name: 'A', size:2, fixed:true});
  var p3 = board.create('point', [-3, 2.15], {visible:false, fixed:true});
  var p4 = board.create('point', [3, 2.15], {visible:false, fixed:true});
  var line1 = board.create('line', [p3, p4], {straightFirst:false, straightLast: false, dash:2});
  var p5 = board.create('point', [-2.5, 0.5], {visible:false, fixed:true});
  var p6 = board.create('point', [-2.5, 2.15], {visible:false, fixed:true});
  var line2 = board.create('arrow', [p5, p6], {straightFirst:false, straightLast: false, dash:2});
  var p7 = board.create('point', [2.5, 0], {visible:false, fixed:true});
  var p8 = board.create('point', [2.5, 2.15], {visible:false, fixed:true});
  var line3 = board.create('arrow', [p7, p8], {straightFirst:false, straightLast: false, dash:2});
</script>

**그림 2**
{: .text-center}

## 버틀러-볼머 식 유도

앞의 예시에서는 반응물과 생성물이 안정 상태에서 갖는 자유에너지가 동일했습니다.  그렇지 않은 경우에는 상황이 조금 달라집니다.  예를 들어 위 **그림 2**와 같은 경우, 정반응(산화)가 역반응(환원)보다 일어나기 쉽습니다.

아래와 같이 써 주면, 정반응이 역반응보다 빠르다는 것을 표현할 수 있습니다.

$$\ce{O + e <=>>[k_f][k_b] R} \tag{3}$$

한편 아래의 **그림 3**은 반대의 경우를 나타냅니다.

{% assign jxgNo = 2 %}
{% include jsx-graph.html jxgNo=jxgNo width=300 height=300 %}

<script>
  var board = JXG.JSXGraph.initBoard('{{ "jxg" | append: jxgNo }}', {boundingbox: [-4, 4, 4, -1], axis:false, showCopyright:false, showNavigation:false});
  var gibbsO = board.create('functiongraph', [function(x){return gibbs(1.5, x+2);}, -3.5, 3.5],{name:'Gibbs', withLabel:false, strokeColor:'red'});
  var gibbsR = board.create('functiongraph', [function(x){return gibbs(1.5, -1*(x-2))+0.5;}, -3.5, 3.5],{name:'Gibbs', withLabel:false, strokeColor:'blue'});
  var textR = board.create('text', [2.3, -0.5, "R"], {fontSize:16, fixed:true});
  var textO = board.create('text', [-3, -0.5, "O+e<sup>-</sup>"], {fontSize:16, fixed:true});
  var textG0c = board.create('text', [-3.7, 1, "ΔG<sup>&#8225;</sup><sub>0c</sub>"], {fontSize:16, fixed:true});
  var textG0a = board.create('text', [2.6, 1, "ΔG<sup>&#8225;</sup><sub>0a</sub>"], {fontSize:16, fixed:true});
  var p2 = board.create('point', [0.15, 2.15], {name: 'A', size:2, fixed:true});
  var p3 = board.create('point', [-3, 2.15], {visible:false, fixed:true});
  var p4 = board.create('point', [3, 2.15], {visible:false, fixed:true});
  var line1 = board.create('line', [p3, p4], {straightFirst:false, straightLast: false, dash:2});
  var p5 = board.create('point', [-2.5, 0], {visible:false, fixed:true});
  var p6 = board.create('point', [-2.5, 2.15], {visible:false, fixed:true});
  var line2 = board.create('arrow', [p5, p6], {straightFirst:false, straightLast: false, dash:2});
  var p7 = board.create('point', [2.5, 0.5], {visible:false, fixed:true});
  var p8 = board.create('point', [2.5, 2.15], {visible:false, fixed:true});
  var line3 = board.create('arrow', [p7, p8], {straightFirst:false, straightLast: false, dash:2});
</script>

**그림 3**
{: .text-center}

반응속도의 크기가 다르다는 것을 표시하기 위해 아래와 같이 쓸 수 있습니다.

$$\ce{O + e <<=>[k_f][k_b] R} \tag{4}$$

## 버틀러-볼머 식

아래 **그림 4**에서, 외부에서 전압을 인가하기 이전 산화종의 포텐셜이 <font color='red'>빨간색 점선</font>이었다고 하겠습니다.  이 경우 전체 반응은 정반응(환원)이 우세한 상태로 그림 2의 경우와 같습니다.

이제 어떠한 방법, 예를 들어 외부 전원을 이용하여 $ \Delta E $만큼의 기전력을 가하여, 산화종의 포텐셜을 $F\Delta E$만큼 (-) 방향으로 움직였다고 합시다.  이에 따라 반응좌표에서 산화종의 포텐셜 곡선은 <font color='red'>빨간색 실선</font>이 되었고,정반응과 역반응의 활성화에너지는 각각 $\Delta G^\Dagger_{0c} \rightarrow \Delta G^\Dagger_{c}$, $\Delta G^\Dagger_{0a} \rightarrow \Delta G^\Dagger_{a}$로 변동하였습니다.

**주의!**  일반적으로 자유에너지가 화학종 1몰에 대한 값으로 기술되기 때문에, 자유에너지의 총 변화량을 나타내기 위해 $\Delta E$에 패러데이 상수($F$)를 곱해 주었습니다.
{: .notice--info}

버틀러-볼머 식은 $\Delta E$만큼의 전기적 포텐셜 변화에 의한 정반응과 역반응의 속도상수 변화를 위의 자유에너지 항들로부터 계산하고, 이를 이용하여 특정 크기의 포텐셜 변화가 반응 전류의 크기에 미치는 영향을 공식화합니다.

이 관계를 계산하기 위해 **그림 4**를 한 번 더 관찰해 보면, 다음과 같은 사실을 알 수 있습니다:

- $ F\Delta E + \Delta G^\Dagger_{0c} = \Delta G^\Dagger_c + (1-\alpha)F\Delta E $
- $ \Delta G^\Dagger_{a} + (1-\alpha)F\Delta E =  \Delta G^\Dagger_{0a} $

각각을 아래와 같이 다시 정리할 수 있습니다.

- $ \Delta G^\Dagger_{0c} -\Delta G^\Dagger_c = -F\alpha\Delta E  $
- $ \Delta G^\Dagger_{0a} - \Delta G^\Dagger_a = (1-\alpha)F\Delta E $

{% assign jxgNo = 3 %}
{% include jsx-graph.html jxgNo=jxgNo width=300 height=300 %}

<script>
  var board = JXG.JSXGraph.initBoard('{{ "jxg" | append: jxgNo }}', {boundingbox: [-4, 4, 4, -1], axis:false, showCopyright:false, showNavigation:false});
  var textR = board.create('text', [2.3, -0.5, "R"], {fontSize:16, fixed:true});
  var textO = board.create('text', [-3, -0.5, "O+e<sup>-</sup>"], {fontSize:16, fixed:true});
  var graph1 = board.create('functiongraph', [function(x){return gibbs(1.5, x+2);}, -3.5, 3.5],{name:'Gibbs', withLabel:false, strokeColor:'red'});
  var graph2 = board.create('functiongraph', [function(x){return gibbs(1.5, x+2)+1;}, -3.5, 3.5],{name:'Gibbs', withLabel:false, strokeColor:'red', dash:2});
  var graph3 = board.create('functiongraph', [function(x){return gibbs(1.5, -1*(x-2));}, -3.5, 3.5],{name:'Gibbs', withLabel:false, strokeColor:'blue'}); 
  var line1 = board.create('line', [[-3.5, 2.38], [3.5, 2.38]], {straightFirst:false, straightLast: false, strokeWidth:1, dash:2})
  var line2 = board.create('line', [[-2.4, 1.88], [2.4, 1.88]], {straightFirst:false, straightLast: false, strokeWidth:1,  dash:2})
  var line3 = board.create('line', [[-1.5, 1.38], [1.5, 1.38]], {straightFirst:false, straightLast: false, strokeWidth:1,  dash:2})
  var arrow1 = board.create('arrow', [[-2.8, 1], [-2.8, 2.38]], {fixed:true, strokeWidth:1});
  var textG0c = board.create('text', [-3.95, 1.5, "ΔG<sup>&#8225;</sup><sub>0c</sub>"], {fontSize:16, fixed:true});
  var arrow2 = board.create('arrow', [[-2.2, 0], [-2.2, 1.88]], {fixed:true, strokeWidth:1});
  var textGc = board.create('text', [-3.2, 0.3, "ΔG<sup>&#8225;</sup><sub>c</sub>"], {fontSize:16, fixed:true});
  var arrow3 = board.create('arrow', [[2.6, 0], [2.6, 2.38]], {fixed:true, strokeWidth:1});
  var textG0a = board.create('text', [2.65, 1.5, "ΔG<sup>&#8225;</sup><sub>0a</sub>"], {fontSize:16, fixed:true});
  var arrow4 = board.create('arrow', [[2.2, 0], [2.2, 1.88]], {fixed:true, strokeWidth:1});
  var textGa = board.create('text', [1.2, 1, "ΔG<sup>&#8225;</sup><sub>a</sub>"], {fontSize:16, fixed:true});
  var arrow5 = board.create('arrow', [[-0.34, 2.39], [-0.34, 1.39]], {fixed:true, strokeColor:'red', strokeWidth:2});
  var textDeltaE = board.create('text', [-0.22, 1.1, "FΔE"], {color: 'red', fontSize:16, fixed:true});
  var points1 = [[0,1.38],[0,1.88],[2.2,1.88],[2.2,1.38]];
  var poly1 = board.create('polygon', points1, {color:'pink', hasInnerPoints:true, withLines:false, vertices:{visible:false}});
  var points2 = [[0,1.88],[0,2.38],[2.2,2.38],[2.2,1.88]];
  var poly2 = board.create('polygon', points2, {hasInnerPoints:true, withLines:false, vertices:{visible:false}});
  var textAlpha = board.create('text', [0.4, 2.13, "(1-α)FΔE"], {fontSize:16, fixed:true});
  var textOneMinusAlpha = board.create('text', [0.4, 1.64, "αFΔE"], {fontSize:16, fixed:true});
  // var p1 = board.create('point', [-2.8, 1]);
</script>

**그림 4**
{: .text-center}

즉, 반응물에 가한 $\Delta E$만큼의 전기 포텐셜 변화는 특정 비율($\alpha$)만큼은 반응물의 자유에너지 변화에 기여하고, 나머지($1-\alpha$)만큼의 비율은 생성물의 자유에너지 변화에 기여합니다. 이것이 버틀러-볼머 식의 공식화로 연결되는 주요한 관찰입니다.

이제, 전기적 포텐셜 변화 $\Delta E$가 가해진 상태에서의 정반응과 역반응의 속도상수를 각각 아래와 같이 정리할 수 있습니다.

정반응:

$$ k_f = A_f e^{-{\Delta G^\Dagger_{c}}/{RT}} $$

$$ = A_f e^{-{(\Delta G^\Dagger_{0c} - \alpha F\Delta E)}/{RT}} $$

$$ = A_f e^{-\Delta G^\Dagger_{0c}/{RT}} e^{\alpha F\Delta E/{RT}} \tag{5} $$

역반응:

$$ k_b = A_b e^{-{\Delta G^\Dagger_{a}}/{RT}} $$

$$ = A_b e^{-(\Delta G^\Dagger_{0a} + {(1-\alpha)}F\Delta E)} $$

$$ = A_b e^{-\Delta G^\Dagger_{0a}/{RT}} e^{-{(1-\alpha) F\Delta E}/{RT}} \tag{6} $$

이제 반응물과 생성물의 농도를 각각 $ C_O $와 $ C_R $로 쓰기로 하고, 반응전류의 크기를 나타내는 아래 식에 위에서 구한 $ k_f $와 $ k_b $를 대입하면 버틀러-볼머 식이 완성됩니다.

$$ i = FA({C_O}{k_f}-{C_R}{k_b}) \tag{7} $$

간략한 표기를 위해, 반응물과 생성물의 농도가 $ C_{O, eq} = C_{R, eq} $ 로 동일한 특정 상황에서 반응물의 포텐셜이 $ E_{eq} $ 이고, 이 때 반응물의 반응좌표-자유에너지 그래프가 사실 우리가 처음 논의를 시작한 빨간 점선과 같았다고 생각해 봅시다.

그러면, 평형 상태에서는 반응전류가 0이어야 하므로 $ k_f = k_b $ 가 성립해야 합니다.  이렇게 정반응과 역반응의 속도가 동일할 때의 반응속도를 $ k_0 $ 이라고 쓰기로 하면, $ E_{eq} $ 에서 벗어난 어떤 포텐셜 $ E $ 에서의 속도상수는 각각 아래와 같이 쓸 수 있게 됩니다.

$$ k_f = k_0 e^{-{\alpha F(E-E_{eq})}/{RT}} \tag{8} $$

$$ k_b = k_0 e^{-{(1-\alpha) F(E-E_{eq})}/{RT}} \tag{9} $$

**식 8**과 **식 9**를 **식 7**에 대입하고 정리하면, 일반적으로 알려진 버틀러-볼머 식을 얻게 됩니다.

$$ i = FAk_0(C_O e^{\alpha F(E-E_{eq})/{RT}} - C_R e^{-{(1-\alpha) F(E- E_{eq})}/{RT}}) \tag{10} $$

$ f = F/{RT} $ 로 놓고 아래와 같이 축약할 수 있습니다. 

$$ i = FAk_0(C_O e^{\alpha f(E-E_{eq})} - C_R e^{-(1-\alpha) f(E- E_{eq})}) \tag{11} $$
