var currentQuestion = 0;
var correctAnswers = 0;

async function loadJson() {
  return fetch(jsonpath)
  .then((response) => response.json());
}

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

function checkAnswer(jsonIdx, selected) {
  var quizId = "quiz"+jsonIdx;
  var explanation = "";
  const feedback = document
  .getElementById(quizId)
  .querySelector('.feedback');
  loadJson()
  .then((json) => {
    if (selected === json[jsonIdx].correct) {
      feedback.innerHTML = "<b>" + quiz_pass + "</b><br>" + json[jsonIdx].explanations[selected];
    } else {
      feedback.innerHTML = "<b>" + quiz_fail + "</b><br>" + json[jsonIdx].explanations[selected];
    }
  });
}

try {
  showQuiz();
} catch (err) {
  window.alert(err.stack);
}