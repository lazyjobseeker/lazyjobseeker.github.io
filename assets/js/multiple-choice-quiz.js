var currentQuestion = 0;
var correctAnswers = 0;

async function loadJson() {
  return fetch(jsonpath)
  .then((response) => response.json());
}

function showQuiz() {
  const quizForms = document.querySelectorAll(".quiz-container");
  loadJson()
  .then((json) => {
    quizForms.forEach((quizForm, qIdx) => {
      quizForm.querySelector(".quiz-text").textContent = json[qIdx].question;
      var quizId = "quiz"+qIdx;
      var choices = document.getElementById(quizId).querySelectorAll(".choice");
      choices.forEach((choice, cIdx) => {
        choice.textContent = json[qIdx].choices[cIdx];
      });
    });
  });
  /*
  const questionText = document.getElementById("question-text");
  const choices = document.querySelectorAll(".choice");
  const feedback = document.getElementById("feedback");
  loadJson()
  .then((json) => {
    questionText.textContent = json[currentQuestion].question;
    choices.forEach((choice, index) => {
      choice.textContent = json[currentQuestion].choices[index];
    });
  });
  */
}

function checkAnswer(quizNum, selected) {
  var quizId = "quiz"+quizNum;
  var explanation = "";
  const feedback = document
  .getElementById(quizId)
  .querySelector('.feedback');
  loadJson()
  .then((json) => {
    if (selected === json[quizNum].correct) {
      feedback.innerHTML = "<b>정답!</b><br>" + json[quizNum].explanations[selected];
    } else {
      feedback.innerHTML = "<b>오답!</b><br>" + json[quizNum].explanations[selected];
    }
    /*
    setTimeout(() =>{
      currentQuestion++;
      if (currentQuestion < json.length) {
        showQuestion();
      } else {
        const quizContainer = document.querySelector(".quiz-container");
        quizContainer.innerHTML = `<p>You got ${correctAnswers} out of ${json.length} questions.</p>`;        
      }
    }, 2000);
    */
  });
}

try {
  showQuiz();
} catch (err) {
  window.alert(err.stack);
}