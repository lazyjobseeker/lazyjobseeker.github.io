var currentQuestion = 0;
var correctAnswers = 0;

async function loadJson() {
  return fetch(jsonpath)
  .then((response) => response.json());
}

function showQuestion() {
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
}

function checkAnswer(selected) {
  const feedback = document.getElementById("feedback");
  loadJson()
  .then((json) => {
    if (selected === json[currentQuestion].correct) {
      feedback.textContent = "Correct!";
      correctAnswers++;
    } else {
      feedback.textContent = "Incorrect!";
    }
    setTimeout(() =>{
      currentQuestion++;
      if (currentQuestion < json.length) {
        showQuestion();
      } else {
        const quizContainer = document.querySelector(".quiz-container");
        quizContainer.innerHTML = `<p>You got ${correctAnswers} out of ${json.length} questions.</p>`;        
      }
    }, 2000);
  });
}

try {
  showQuestion();
} catch (err) {
  window.alert(err.stack);
}