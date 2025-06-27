---
title: "Making Multiple-Choice Quiz using JavaScript"
category: programming
tags:
  - minimal-mistakes
  - jekyll
  - github-blog
  - javascript
created_at: 2024-12-02 05:21:48 -05:00
last_modified_at: 2025-06-26 11:32:23 -05:00
excerpt: "How to embed 4-choices quiz inside blog post generated using Jekyll."
quiz_file: /assets/json/quiz_example.json
---

Adding some interactive features may boost visitors' attention to the contents of your website.  One of such feature could be simple **multiple-choice-quiz** content.  I searched for some posts[^1] detailing how to implement this and made adjusted version for my website.  Now I can embed 4-choices quiz like below using some liquid syntax,

```html
{% raw %}{% include multiple-choice-quiz.html jsonIdx=0 quizNum=1 %}{% endraw %}
```

Which is rendered as follows.

[^1]: <https://webdesign.tutsplus.com/multiple-choice-quiz-app-with-javascript--cms-107756t>

{% include multiple-choice-quiz.html jsonIdx=2 quizNum=1 %}

This is how the concept works.

1. A set of quizzes is stored in JSON file.  To include specific set of quizzes, first specify quiz file path in page front matter:

   ```yaml
   quiz_file: /assets/json/quiz_example.json
   ```
   
2. Prepare UI form of quiz panel and store it in `_include` folder.  At any line of a post, use a liquid syntax to include the UI form.

   ```html
   {% raw %}{% include multiple-choice-quiz.html jsonIdx=1 quizNum=2 %}{% endraw %}
   ```

[^2]: <https://blog.sverrirs.com/2016/10/jekyll-passing-post-variables-to-includes.html>

Note that there are extra parameters[^2] `jsonIdx` and `quizNum`.  The former designates the index of JSON array loaded from `quiz_example.json` which I would like to refer.  By passing 1, I specify that I will refer to the second element of the JSON array.  `quizNum` is to give numberings for quizzes in same page, irrespective of the index of the question from the JSON array.

{% include multiple-choice-quiz.html jsonIdx=3 quizNum=2 %}

To implement this, three items are needed.  All the implementations are based on a Jekyll theme of this post *Minimal Mistakes*.

  1. JSON-formatted quiz info.
  2. HTML + CSS files defining quiz UI.
  3. JavaScript files handling user click event and responsively altering html content based on the given answer(click) is correct or not.

## 1. Create JSON File with Quizzes

First of all, we need a problem set to be used.  I prepared `example_quiz.json` file under `/assets/json/`.  This file contains a JSON array, each element of which consists of below keys and values:

- `question`: Main text of a quiz.
- `choices`: List of length 4 and contains possible choices(string) that user can make.
- `correct`: Index of correct answer among elements of `choices`
- `explanations`: List of length 4 and contains explanations which will be given to user according to the choice they make.

```json
[
  {
    "question": "Who does belong to different category?",
    "choices": ["Lionel Messi", "Kylian Mbappe", "Patrick Mahomes", "Robin van Persie"],
    "correct": 2,
    "explanations": ["", "", "Patrick Mahomes is American football player, while others are soccer players.", ""] 
  },
  {
    "question": "The early bird catches the ______",
    "choices": ["shark", "worm", "Floyd Mayweather Jr.", "zebra"],
    "correct": 1,
    "explanations": ["Maybe some birds could, but...", "", "Maybe some birds could, but...", "Maybe some birds could, but..."] 
  }
]
```

## 2. UI Design and Styling (HTML + CSS)

### 2.1. Write HTML Form

Now we need UI frames where question and text choices will be displayed.

```html
<!-- File path: _include/multiple-choice-quiz.html -->
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

- First line in liquid syntax creates `qId` characters.  This is to provide `quiz-container` div elements unique IDs.  These unique IDs are formatted like `quiz0`, `quiz1`...
- `jsonIdx` and `quizNum` variables are available under namespace `include`.  So, `include.jsonIdx` and `include.quizNum` are available without definition inside `multiple-choice-quiz.html`, as long as the `include` tag passes those two parameters as I did above.

### 2.2. CSS Styling

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
  font-size: $type-size-4; // Alter according to your environment
  font-family: $page-h2-title; // Alter according to your environment
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

After completed, above sass file needs to be imported to **main CSS** (/assets/css/main.css)

```css
/* Add below line to your main.css */
@import "custom/quiz";
```

## 3. Displaying Quizzes and Handling Answers (Javascript)

Now we need JavaScript file (`js`) which will throw quiz texts to proper places and handle user input to check whether correct answer is clicked or not.  I created `/assets/js/multiple-choice-quiz.js` file and implemented some features.

### 3.1. Loading JSON File

`fetch` function is used to define `loadJson()` custom function.

```javascript
async function loadJson() {
  return fetch(jsonpath)
  .then((response) => response.json());
}
```

**Warning!** Please note that a variable `jsonpath`, which is to designate the path of target JSON file to read is used **without declaration**.  By this I could change the JSON file I refer my quizzes from, rather than relying on a single file.  But the variable `jsonpath` should be defined elsewhere, which I will explain further.
{: .notice--danger}

### 3.2. Display Quiz Texts

With `loadJson` custom function now I am ready to define another function `showQuiz()`, which is to modify text elements of our quiz frame (`multiple-choice-quiz.html`) to corresponding ones read from quiz object.

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

This function loops the JSON array read from my JSON-formatted quiz file.  As I designed `multiple-choice-quiz.html` so that there is unique `quiz#` style id, I can check in the loop whether current JSON object will be used in current page or not.

### 3.3. Handle User Click Event and Check Answer

Finally, I defined `checkAnswer()` function to handle the event where user clicks one of the multiple choices and responsibly display whether the given answer is correct or not.  Please not that this function is used in `multiple-choice-quiz.html`, bound to `onclick` paramemter of button elements.

`checkAnswer` receives two arguments of `jsonIdx` and `selected`.  The former is to specify which one among the JSON array should be referred, and the latter is to specify which choice among the 4 choices the user clicked. 

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
      feedback.innerHTML = "<b>Correct!</b><br>" + json[jsonIdx].explanations[selected];
    } else {
      feedback.innerHTML = "<b>Incorrect!</b><br>" + json[jsonIdx].explanations[selected];
    }
  });
}
```

Finally everything is over in JavaScript side.  But I need to execute `showQuiz` once at the end of all the definitions.  This execution makes the default texts in `multiple-choice-quiz.html` (for example, 4 choice buttons have initial texts of "A1", "A2", "A3", and "A4") be replaced with those in from JSON file.

```javascript
showQuiz();
```

### 3.4. Modify Header and Footer

After I had completed the `.js` file implementing all above features, there remained only two steps more: 1) including finished `.js` file and 2) define some variables I used without defining it.  To do this, I changed custom header file (`_includes/head/custom.html`) and custom footer file (`_includes/footer/custom.html`).

#### Header Modification

When I defined `loadJson()` function, it relied on a variable `jsonpath` without declaration.  This variable must be declared somewhere if I am to use the `.js` file or it will fail with undefined variable error.

So I added below lines in `_includes/head/custom.html`.  `page.quiz_title` is available if I write the path of JSON file containing quizzes in YAML front matter under variable name of `quiz_file`.

```html
{% raw %}{% if page.quiz_file %}{% endraw %}
  <script> var jsonpath = '{{ page.quiz_file }}'; </script>
{% raw %}{% endif %}{% endraw %}
```

#### Footer Modification

I could finish all those implementations by adding below lines to `_includes/footer/custom.html`.

```html
{% raw %}{% if page.quiz_file %}{% endraw %}
  <script src='/assets/js/multiple-choice-quiz.js'></script>
{% raw %}{% endif %}{% endraw %}
```

**Warning!** Note that if `multiple-choice-quiz.js` is included before  `jsonpath` is defined, **undefined variable** error rise.
{: .notice--warning}