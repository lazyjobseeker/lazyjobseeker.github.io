---
translated: true
title: "자바스크립트로 객관식 문제 만들기"
category: Programming
redirect_from:
  - /programming/jekyll-static-blog-multiple-question-quiz-implementation/
tags:
  - "Minimal Mistakes"
  - Jekyll
  - "Github Blog"
  - Javascript
created_at: 2024-03-05 23:43:24 +09:00
last_modified_at: 2024-04-09 17:45:47 +09:00
header:
  teaser: /assets/images/uncategorized-teaser-1.png
excerpt: "Javascript를 이용하여 Github Pages 및 Jekyll 기반 정적 블로그 포스트의 원하는 위치에 사지선다형 객관식 문제를 추가해 봅니다"
quiz_file: /assets/json/quiz_example.json
---

아래와 같은 사지선다 문제를 만들어 보는 예제입니다.  몇 가지 포스트들을 참고하여 입맛에 맞게 적당히 수정하였습니다.[^1]

[^1]: <https://webdesign.tutsplus.com/multiple-choice-quiz-app-with-javascript--cms-107756t>

{% include multiple-choice-quiz.html jsonIdx=0 quizNum=1 %}

포스트의 Front Matter에 문제들이 저장된 `.json` 파일의 위치를 명시합니다.  마크다운으로 포스트를 작성할 때는 Liquid 문법의 `include`를 이용해 원하는 위치에 문제를 배치합니다.

포스트 본문에 사지선다 퀴즈를 노출하려면, 우선 문제들이 포함된 `.json` 파일을 작성하고 파일 경로를 `quiz_file` 변수로 YAML Front Matter에 제공합니다.

```yaml
quiz_file: /assets/json/quiz_example.json
```

그리고 포스트 본문에 아래와 같은 태그[^2]를 입력하면, 입력한 위치에 퀴즈 정보를 담은 폼이 생성되고, 선택지 버튼을 클릭하여 풀어볼 수 있습니다. `quizNum`은 JSON 파일에 정의된 문제들 중 몇 번 문제를 표시할지를 지정합니다.

[^2]: <https://blog.sverrirs.com/2016/10/jekyll-passing-post-variables-to-includes.html>

```html
{% raw %}{% include multiple-choice-quiz.html jsonIdx=1 quizNum=2 %}{% endraw %}
```

위의 Liquid 태그는 브라우저에서 아래와 같이 렌더링됩니다.  `jsonIdx`는 JSON 파일에 저장된 퀴즈들 중 몇 번째 퀴즈를 표시할지를, `quizNum`은 JSON 파일 내에서의 순서와 무관하게 퀴즈를 렌더링하는 페이지 내에서 표시할 퀴즈 번호를 나타내기 위해 사용된 추가 변수입니다.

{% include multiple-choice-quiz.html jsonIdx=1 quizNum=2 %}

JSON 형식을 이용해 문제 정보를 담은 파일을 만들고, HTML 및 CSS로 문제 정보를 표시할 폼을 만들고, Javascript로 사용자 클릭 이벤트를 받아 정답 및 오답에 따른 처리를 구현해야 합니다.  필요한 내용들을 하나씩 살펴보도록 하겠습니다.

작성될 스크립트들의 위치는 Jekyll 테마 Minimal Mistakes를 기준으로 설명합니다.

## 1. 문제 만들기 (JSON)

문제는 `.json` 형식으로, `/assets` 폴더에 `/json` 하위 폴더를 추가하여 저장해 주었습니다.  파일은 하나의 JSON 배열을 포함하고 있으며 배열의 원소들은 질문(question), 선택지(choices), 정답(correct), 각 선택지를 클릭하면 보여질 설명(explanations)으로 구성된 JSON 데이터들입니다.

아래 파일을 `/assets/json/example_quiz.json`으로 저장합니다.

```json
[
  {
    "question": "다음 중 성격이 다른 하나는?",
    "choices": ["손흥민", "리오넬 메시", "오타니 쇼헤이", "위르겐 클린스만"],
    "correct": 2,
    "explanations": ["", "", "손흥민과 메시, 클린스만은 모두 축구 선수입니다. 오타니는 야구 선수입니다.", ""] 
  },
  {
    "question": "반짝반짝 ______",
    "choices": ["피 땀 눈물", "작은 별", "톰과 제리", "마동석"],
    "correct": 1,
    "explanations": ["반짝반짝 <b>피 땀 눈물</b>은 조금 이상한 것 같아요...", "반짝반짝은 <b>작은 별</b>이죠", "반짝반짝 <b>톰과 제리</b>는 조금 이상한 것 같아요...", "반짝반짝 <b>마동석</b>은 조금 이상한 것 같아요..."] 
  }
]
```

## 2. UI 작성 및 스타일링 (HTML + CSS)

### 2.1. HTML 프레임 작성 

이제 브라우저에서 문제와 선택지를 보여줄 UI의 뼈대를 HTML로 작성해 줍니다.

```html
{% raw %}{% assign qId = "quiz" | append: include.jsonIdx %}{% endraw %}
<div class="quiz-container" id="{{ qId }}" >
  <div class="quiz">
  <div class="quiz-title"> Sample Quiz {% raw %}{{ include.quizNum }}{% endraw %} </div>
    <p class="quiz-text">Quiz Text</p>
    <div class="choices">
      <button class="choice" onclick="checkAnswer({% raw %}{{ include.jsonIdx }}{% endraw %}, 0)">1st Option</button>
      <button class="choice" onclick="checkAnswer({% raw %}{{ include.jsonIdx }}{% endraw %}, 1)">2nd Option</button>
      <button class="choice" onclick="checkAnswer({% raw %}{{ include.jsonIdx }}{% endraw %}, 2)">3rd Option</button>
      <button class="choice" onclick="checkAnswer({% raw %}{{ include.jsonIdx }}{% endraw %}, 3)">4th Option</button>
    </div>
    <div class="feedback-container">
      <p class="feedback"></p>
    </div>
  </div>
</div>
```
{: file="_include/multiple-choice-quiz.html"}

- 첫 줄의 `assign` Liquid 구문은 퀴즈 UI를 구성하는 각 요소들에 유일한 `id` 태그를 `quiz0`,`quiz1`... 와 같은 꼴로 부여하기 위해 `qId`라는 문자열을 생성합니다.
- {% raw %}{% include %}{% endraw %} 수행 시 넘겨준 추가 파라미터 `jsonIdx`와 `quizNum`은 `include`에 의해 호출되는 html 문서 내에서 `include` 네임스페이스에 존재하게 됩니다.  즉, `include.jsonIdx`및 `include.quizNum`을 참조하여 사용할 수 있습니다.

### 2.2. CSS 스타일 작성

```css
.quiz-container{
  box-sizing: border-box;
  width: 100%;
  margin: 1em 0 1em 0;
  padding: 0.1em 1em 0.1em 1em;
  background-color: #cccccc;
  border-radius: 10px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
}

.quiz-title{
  margin: 1em 0 0.5em 0;
  font-size: $type-size-4; // 환경에 맞게 바꾸어 줍니다.
  font-family: $page-h2-title; // 환경에 맞게 바꾸어 줍니다.
}

.choices{
  display: block;
}

.choice {
  font-size: 1em;
  display: block;
  margin: 5px 5px;
  padding: .5em .75em;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.choice:hover {
  background-color: #2980b9;
}

.feedback-container {
  width: 100%;
  margin: 1em 0 1em 0;
  padding: 0 0.5em 0 0.5em;

  p {
    margin: 0 0 0 0;
  }
}

```
{: file="_sass/custom/quiz.sass"}

위 파일은 **메인 CSS 파일** (/assets/css/main.css)에 임포트하여야 블로그 빌드 시에 정상 적용됩니다.

```css
/* 아래 내용 추가 */
@import "custom/quiz";
```

## 3. 문제 불러오고 정답 처리하기 (Javascript)

이제 문제를 불러들이고, UI에 표시하고, 마우스 클릭 입력을 처리할 자바스크립트 파일(`.js`)이 필요합니다.  `/assets/js/multiple-choice-quiz.js`파일을 만들고 아래와 같이 작성하도록 하겠습니다.

### 3.1. JSON 파일 읽기

JSON 파일을 읽기 위해, `fetch` 함수를 사용하여`loadJson()` 사용자 정의 함수를 아래와 같이 작성했습니다.

```javascript
async function loadJson() {
  return fetch(jsonpath)
  .then((response) => response.json());
}
```

**주의!** 읽어들일 JSON 파일의 경로를 나타내는 `jsonpath` 변수는 **선언 없이** 사용되었습니다.  `jsonpath` 자리에 실제 파일 경로인 `/assets/json/example_quiz.json`를 사용할 수도 있지만, 그렇게 하면 필요에 따라 서로 다른 문제 세트 (다른 json 파일)을 사용하기가 어렵기 때문에, 아직 정의하지 않은 변수 `jsonpath`를 설정해 두었습니다.
{: .notice--danger}

### 3.2. 문제 불러오기

이제 읽어들인 JSON 파일을 참조하여 문제 및 선택지에 해당하는 HTML 요소의 텍스트들을 변경해 주는 `showQuiz()` 함수를 작성합니다.

```javascript
function showQuiz() {
  loadJson()
  .then((json) => {
    for (idx=0; idx<json.length; idx++) {
      var quizId = "quiz"+idx;
      var target = document.getElementById(quizId);
      if (!target) { continue; }
      var quizForm = target.querySelector(".quiz-container");
      target.querySelector(".quiz-text").textContent = json[idx].question;
      var choices = target.querySelectorAll(".choice");
      choices.forEach((choice, cIdx) => {
        choice.textContent = json[idx].choices[cIdx];
      });
    }
  });
}
```

### 3.3. 정답 처리하기

클릭이 발생했을 때 정답 여부를 판정하는 `checkAnswer`함수를 아래와 같이 작성해 줍니다.  앞서 작성한 HTML 파일을 다시 살펴보면, 각 선택지 버튼에 `onclick` 파라미터로 `checkAnswer`의 호출 결과가 바인딩되고 있습니다.

HTML을 작성할 때 최상위 컨테이너인 `quiz_container` 요소에 유일한 id 값을 제공하였었는데, 한 포스트에 여러 퀴즈가 있으면 클릭된 퀴즈가 어떤 퀴즈인지 알아야 하기 때문입니다.  어떤 문제에 클릭이 발생했는지 특정하기 위해 `checkAnswer`는 몇 번째 선택지(selected)가 클릭되었는지 이외에도 몇 번째 문제(jsonIdx)가 클릭되었는지에 대한 정보를 추가 인자로 받도록 구성되었습니다.

```javascript
function checkAnswer(jsonIdx, selected) {
  var quizId = "quiz"+jsonIdx;
  var explanation = "";
  const feedback = document
  .getElementById(quizId)
  .querySelector('.feedback');
  loadJson()
  .then((json) => {
    if (selected === json[jsonIdx].correct) {
      feedback.innerHTML = "<b>정답!</b><br>" + json[jsonIdx].explanations[selected];
    } else {
      feedback.innerHTML = "<b>오답!</b><br>" + json[jsonIdx].explanations[selected];
    }
  });
}
```

마지막으로 아래와 같이 `showQuiz()`를 한 번 실행하여, HTML 파일의 기본 텍스트들이 JSON 파일에서 불러온 첫 번째 문제들에 대한 텍스트들로 교체되도록 합니다.

```javascript
showQuiz();
```

### 3.4. &lt;src&gt; 태그로 .js 파일 포함하기

작성된 `.js` 파일은 페이지 빌드 과정의 어딘가에서 &lt;src&gt; 태그에 의해 포함되지 않으면 작동하지 않습니다.  저는 커스텀 헤더 (`_includes/head/custom.html`) 및 푸터 파일 (`_includes/footer/custom.html`)에 아래 내용을 추가했습니다.

#### header 수정

헤더 파일에는 앞서 `loadJson()` 함수에서 정의 없이 사용된 `jsonpath` 변수를 정의하도록 했습니다.  Liquid 구문의 `if page.quiz_file`은 YAML Front Matter에 `quiz_file`이라는 변수가 선언된 적이 있는지 체크합니다.  선언된 적이 있을 때에만, `jsonpath` 변수에 해당 값(json 파일 경로)을 넣어 줍니다.

`_includes/head/custom.html`에 아래 내용을 추가해 줍니다.

```html
{% raw %}{% if page.quiz_file %}{% endraw %}
  <script> var jsonpath = '{{ page.quiz_file }}'; </script>
{% raw %}{% endif %}{% endraw %}
```

#### footer 수정

`jsonpath`로 어떤 값을 사용할지에 대한 정보가 헤더 부분에 기록되었기 때문에, 이제 푸터 부분에서 `.js` 파일을 호출하면 `loadJson()` 함수를 호출할 때 정의되지 않은 변수 사용 에러가 발생하지 않습니다.

`_includes/footer/custom.html`에 아래 내용을 추가해 줍니다.

```html
{% raw %}{% if page.quiz_file %}{% endraw %}
  <script src='/assets/js/multiple-choice-quiz.js'></script>
{% raw %}{% endif %}{% endraw %}
```

**주의!** jsonpath 변수를 정의하는 스크립트가 `multiple-choice-quiz.js` 파일보다 뒤에 호출되면 **정의되지 않은 변수** 에러가 발생합니다.
{: .notice--warning}