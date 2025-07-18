---
title: 구글 애드센스 승인 및 세팅 기록
category: programming
tags:
  - google-adsense
created_at: 2024-11-25 05:26:56 -05:00
last_modified_at: 2025-07-05 10:08:48 -05:00
excerpt: 구글 애드센스 승인까지 필요했던 과정들과, 애드센스 승인 후 커스텀 및 자동 광고 세팅 과정을 정리합니다.
published: true
---

개인 블로그를 시작하고 운영하는 데는 많은 이유가 있겠지만, **수익화**를 전혀 생각하지 않는 경우는 많지 않을 거라고 생각합니다.  어쨌든 좋아하는 주제로 글을 쓰는데 돈까지 된다고 하면 그만큼 좋은 게 또 없을 테니까요🤑.

저도 어찌저찌 블로그를 만들고 하나씩 둘씩 글을 올리면서 막연히 수익화에 대한 기대를 가지고 있었습니다.  수익화를 위해 가장 간단하게 시도할 수 있었던 방법 중 하나가 바로 **구글 애드센스** 승인을 받아 구글 광고를 게재하는 것이었는데요, ChatGPT로 쓴 글을 가지고 승인을 받았다는 분이 있을 정도로 허들이 낮은 것처럼 보이기도 하는 반면 어떤 분들은 기존에 없었던 양질의 글을 열심히 올리는데도 승인을 받지 못해 스트레스를 받는 경우도 많이 보였습니다.

저의 경우는 여섯 번 고배를 마신 뒤 승인에 성공했는데요, 승인 거절의 이유는 6번 모두 **가치가 별로 없는 컨텐츠**였습니다.  심지어 여섯 번째 거절부터는 바로 애드센스 검토를 다시 제출하지도 못 하고 세 달 정도 보류 기간을 가진 뒤 다시 검토를 요청할 수 있다는 안내를 받아서 굉장히 우울했던 기억이 나네요😥.

6번째 거절 이후 몇 가지 지점을 보완하기 전까지는 다시 애드센스 신청을 하지 않기로 마음을 먹었었습니다🏋️‍♂️.

## 애드센스 승인을 위한 노력

### 컨텐츠 분량 최소기준 충족

애드센스와 관련한 글들을 살펴보면, **가치가 있는 컨텐츠**가 되기 위하여 개별 포스트에 얼마나 많은 분량의 텍스트가 필요한지에 대한 논의가 굉장히 분분합니다.  어떤 포스트에서는 500-600단어 이상, 어떤 포스트에서는 1000-2000단어 이상을 제시하는 등 통일된 기준을 찾기가 어렵습니다.  게다가 영어 등 외국어는 한글로 썼을 때와 단어 수 차이가 제법 나기 때문에, 외국 블로거의 포스팅을 보고 어느 정도 분량이 적절한지 가늠하기도 쉽지가 않지요.

저는 한국어-영어의 두 가지 언어를 지원하는 **다국어 블로그**로 이 블로그를 운영하고 있습니다 (다국어 블로그 구현 과정은 [**다른 포스트**]({{ site.baseurl }}/posts/github-blog-multiple-language-support-with-jekyll-theme-minimal-mistakes/)를 참고하세요).  제가 애드센스 승인에 성공한 **2024년 11월 24**일을 기준으로 제 블로그 글들의 평균 단어 숫자가 어느 정도인지 확인해 보았습니다.

- 총 **27개 포스트** (각각 한국어/영어 버전이 있습니다)
- **한국어** 포스트 평균 **2,333** 단어
	- 가장 짧은 포스트 **845** 단어
	- 가장 긴 포스트 **4,211** 단어
- **영어** 포스트 평균 **1,315** 단어
	- 가장 짧은 포스트 **1,001** 단어
	- 가장 긴 포스트 **3,857** 단어

영어 포스트의 단어 수 기준 길이가 한국어 포스트에 비해 확연히 짧은 것을 알 수 있습니다 (약 **56%** 수준).

6번째 애드센스 거절 이후로는 반드시 일정 길이 이상의 포스팅을 해야겠다고 마음을 먹었는데, 처음에는 **한글 기준 1,000단어 이상**을 목표로 했다가, 영어로 번역을 하고 나면 단어수가 뚝 떨어지는 걸 보고 **영어 기준 1,000단어 이상** 쓰는 걸로 목표를 바꾸었습니다 (1,000자가 안 되는 한글 포스트는 것은 승인 성공 전에 썼던 포스트입니다).

이 과정에서 단어 수 체크에 **옵시디언**을 매우 유용하게 썼습니다.  `Novel Word Count` 플러그인을 이용하면 단순한 단어 수 체크만이 아니라 **YAML Front Matter**, **주석** 등 부수적인 요소들을 배제한 순수 포스팅 본문 단어 수를 확인할 수 있는 점이 훌륭합니다.

{% include img-gdrive alt="옵시디언의 Novel Word Count 플러그인" id="1pU8lWAgKxxq1cB4rp0V9MpK43JZ98iUV" %}

{% include img-gdrive alt="Novel Word Count 플러그인 옵션" id="1-1UaV85lx-g1oMJMA5n129zClpg5YPo0" %}

### ALT 태그를 갖는 이미지 넣기

6번의 애드센스 승인 고배 이후 시작한 다른 노력은 반드시 포스팅에 하나 이상의, **대체 텍스트(ALT 태그)**를 갖는 이미지를 삽입하는 것이었습니다.  단순히 이미지만 넣는 것이 아니라, 크롤러나 봇이 검색 가능한 텍스트를 포함해야 한다는 점이 중요합니다.  ALT 태그와 관련해서는 이미 온라인들에 많은 글들이 있어 이 정도로만 정리하겠습니다.

## 애드센스 광고 커스터마이징

애드센스 승인을 받은 뒤에는 **광고 커스터마이징**을 했습니다.  구글이 제공하는 자동 광고 삽입 기능을 이용해 광고를 넣을 수도 있지만, 구조가 정형화되지 않은 개인 블로그에서는 블로그 레이아웃을 손상시키는 보기 싫은 광고가 들어가는 경우가 생길 수 있습니다.  수익화가 가능한 광고를 게재하는 것도 중요하지만, 광고가 포스트들의 가독성을 지나치게 해치지 않도록 하는 것이 중요합니다.

제가 시행착오를 거치면서 적용한 몇 가지 설정들을 정리해 보겠습니다✏️.

### 수동 광고 삽입

- **인아티클 광고**, **멀티플렉스 광고** 1개씩 광고 단위 작성하여 노출

### 자동 광고 설정

- **인페이지 형식 광고** 중 **배너 광고**만 적용
- **오버레이 형식 광고**를 적용하지 않음: 오버레이 형식 광고들이 화면 가독성을 해치고 페이지 로딩 속도를 느리게 한다는 의견이 있어 적용하지 않았습니다.

### CSS 설정

#### 애드센스 요소의 `clear` 속성 변경하기 (실패)

자동 광고를 넣는 경우, 애드센스가 자동으로 추가하는 광고는 `google-auto-placed`와 `ap_container` 클래스를 갖는 `<div>`요소에 내장됩니다.  문제는 이 `<div>`요소가 인라인 스타일 형식으로 강제 지정된 `clear: both` 속성을 가지고 있는데, 이것 때문에 페이지 내 다른 요소들과 상호작용 중에 불필요한 여백을 만드는 등 페이지 레이아웃을 손상시키는 경우가 발생합니다.

`clear: none !important;`와 같이 강제 오버라이딩을 시도해 보았지만 잘 되지 않아서, `display` 속성을 `inline-block`으로 바꾸어 보았습니다.  일부 잘 동작하는 경우가 있었지만, 지속적으로 신뢰성 있게 동작하는 것처럼 보이지는 않았습니다.

```css
/*
  Adsense elements in pages
  ========================================================================== */

div {
  &.google-auto-placed {
    &.ap_container {
      display: inline-block !important;
    }
  }
}
```
{: file="_adsense.scss"}

#### 애드센스 요소의 `clear` 속성 변경하기 (성공)

구글 애드센스의 광고 추가 과정이 동적으로 이루어지기 때문에, 위와 같이 `.scss` 파일을 이용하여 스타일을 변경하려는 시도는 실패할 경우가 있을 것으로 생각됩니다.  구체적으로는, 스타일시트는 페이지를 렌더링하는 과정에서 적용되는데, 애드센스 로직이 페이지 렌더링 완료 후 광고 요소를 주입해 버리면 스타일시트에 의한 스타일 변경 시도는 이미 끝난 이후라서 원하는대로 `clear=None` 스타일을 적용할 수가 없게 됩니다.

`MutationObserver`를 이용하여 `google-auto-placed` 혹은 `adsbygoogle` 클래스명을 갖는 DOM 객체가 발생하는 것을 감지하여 해당 객체가 발생한 **이후에** 해당 객체 스타일의 `clear` 속성을 조작하도록 하는 것으로 문제가 완전히 해결되었습니다 (03-07-2025).

```javascript
const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => {
        if (
          node.nodeType === 1 && // ELEMENT_NODE
          (node.classList.contains('google-auto-placed') || node.classList.contains('adsbygoogle'))
        ) {
          // ✅ Your logic to run after ad is inserted
          console.log('Ad inserted:', node);
          node.style.clear = 'none'; // Example: remove AdSense float-clear style
        }
      });
    }
  }
});

// Start observing the whole document
observer.observe(document.body, {
  childList: true,
  subtree: true
});
```
{: file="asset/js/adsensestyler.js"}
## 승인 및 광고 세팅 후기

애드센스 승인 거절 메일을 받을 때는 스트레스도 받았지만, 반복적으로 거절이 된다고 해서 영영 승인이 되지 않는 것은 아니고, 적절한 목표를 세우고 꾸준히 포스팅을 이어가다 보면 어느 시점에는 승인이라는 목표를 이룰 수 있는 것 같습니다.  이제는 최적의 광고 레이아웃을 찾고 지속적으로 포스팅의 양과 질을 늘려 가면서 광고 수익 늘리기에 도전해 보겠습니다🤗.