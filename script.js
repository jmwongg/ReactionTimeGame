
console.log("Hello 🌎");


let correctAnswerCount = 0;
let wrongAnswerCount = 0;
let isGameRunning = false;
let correctAns; 

const trueButton = document.getElementById("true");
const falseButton = document.getElementById("false");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");

const correctCount = document.getElementById("correctAnswerCount");
const wrongCount = document.getElementById("wrongAnswerCount");


const experimentState = {
  experimentActive: false,
  testActive: false,
  lastEquation:-1,
  times: [],
  timeoutId: -1,
};

const startExperiment = function () {
  //start the experiment, remove the data stats
  experimentState.experimentActive = true; //indicate start of experiment

  document.querySelector("#time").textContent = ""; //clear the values from prior runs
  document.querySelector("#mean").textContent = "";
  document.querySelector("#sd").textContent = "";
  document.querySelector("#totalCount").textContent = "";
  document.querySelector("#correctAnswerCount").textContent ="";
  document.querySelector("#wrongAnswerCount").textContent ="";
  //start the first trial
  startTrial();
};

const startTrial = function () {
  const randomDelay = Math.floor(Math.random() * 4 + 2); // 2 - 5s
  experimentState.timeoutId = window.setTimeout(
    randomDelay * 1000,
    showStimulus
  ); //setTimeout runs in milliseconds
  console.info(
    "INFO: Trial",
    experimentState.times.length,
    " started. Random delay:",
    randomDelay
  );
  evaluateAnswer();
};

//show stimulus means print question
//so how to start trial

const showStimulus = function () {
  console.info("INFO: Stimulus shown.");
  experimentState.testActive = true;
  printQuestion();
};

const stopTest = function () {
  console.info("INFO: User reaction captured.");
  let currTime = Date.now();
  let deltaTime = currTime - experimentState.lastEquation;
  experimentState.times.push(deltaTime);
  document.querySelector("#time").textContent ="Time: "+ deltaTime + " ms";
  experimentState.testActive = false;
  startTrial();
};

const printQuestion = function () {
  let question = document.getElementById("question");
  let firstNumber = Math.floor(Math.random() * 11 + 1);
  let secondNumber = Math.floor(Math.random() * 21 + 1);

  correctAns = firstNumber + secondNumber; // Update correctAns
  let wrongAns = Math.floor(Math.random() * 10 + 1) + Math.floor(Math.random() * 10 + 1);

  const answers = [correctAns, wrongAns];
  const randomIndex = Math.floor(Math.random() * 2); // Randomly select 0 or 1
  answer = answers[randomIndex]; // Update the answer variable
  question.innerHTML = firstNumber + " + " + secondNumber + " = " + answer;
  experimentState.lastEquation = Date.now();
};

const evaluateAnswer = function () {
  trueButton.onclick = function () {
    if (answer === correctAns) {
      correctAnswerCount++;
    } else {
      wrongAnswerCount++;
    }
    updateAnswerCounts();
    showStimulus();
  };

  falseButton.onclick = function () {
    if (answer !== correctAns) {
      correctAnswerCount++;
    } else {
      wrongAnswerCount++;
    }
    updateAnswerCounts();
    showStimulus();
  };
};

function updateAnswerCounts() {
  correctCount.textContent = "Correct Answer Count: " + correctAnswerCount;
  wrongCount.textContent = "Wrong Answer Count: " + wrongAnswerCount;
}


startButton.addEventListener("click", function () {
  //probably need to make this clean
  if (!isGameRunning) {
    isGameRunning = true;
    experimentState.experimentActive = true;
    enableGameButtons();
    printQuestion();
    evaluateAnswer();
  }
});

stopButton.addEventListener("click", stopExperiment);

function enableGameButtons() {
  trueButton.removeAttribute("disabled");
  falseButton.removeAttribute("disabled");
  startButton.setAttribute("disabled", true);
  stopButton.removeAttribute("disabled");
}

function disableGameButtons() {
  trueButton.setAttribute("disabled", true);
  falseButton.setAttribute("disabled", true);
  startButton.removeAttribute("disabled");
  stopButton.setAttribute("disabled", true);
}

let arr=[];

const stopExperiment = function () {
  clearTimeout(experimentState.timeoutId); //stop the timer
  //changeTextColor("gray"); //indicate stop
  isGameRunning = false;
  disableGameButtons();
  experimentState.testActive = false;

  let stats = computeStatistics(experimentState.times);

  document.querySelector("#count").textContent = "Count: " + stats.cnt;
  document.querySelector("#mean").textContent =
    "Mean: " + stats.mean.toFixed(2) + "ms";
  document.querySelector("#sd").textContent =
    "SD: " + stats.sd.toFixed(2) + "ms";

  //document.querySelector("#correctAnswerCount").textContent = "Correct Answer Count: " + correctAnswerCount;
  //document.querySelector("#wrongAnswerCount").textContent = "Wrong Answer Count: " + wrongAnswerCount;

  document.querySelector("#instruction").innerHTML = "Press SPACE to start!";
  arr = experimentState.times;
  experimentState.times = [];
  experimentState.experimentActive = false;
  };

const computeStatistics = function (timeArr) {
  //to get mean, get sum of all trials and divide by number of trials m = sum(x)/cnt(x)
  const sums = timeArr.reduce((acc, num) => acc + num, 0);
  const meanDeltaTime = sums / timeArr.length;

  //standard deviation is  sqrt(sum(x-mean)^2/cnt(x))
  const squaredDiffs = timeArr.reduce(
    (acc, num) => (num - meanDeltaTime) ** 2 + acc,
    0
  );
  const standardDeviationTime = Math.sqrt(squaredDiffs / timeArr.length);

  return {
    sd: standardDeviationTime,
    mean: meanDeltaTime,
    cnt: timeArr.length,
  };
};



const onKey = function (evt) {
  if (evt == null) {
    evt = window.event;
  }
  switch (evt.which || evt.charCode || evt.keyCode) {
    case 32: //space
      if (!experimentState.experimentActive) {
        startExperiment();
      } else {
        if (experimentState.testActive) {
          stopTest();
        }
      }
      break;
    case 65: //a
      if (experimentState.experimentActive) {
        stopExperiment();
      }
      break;
    //if here, it is not handled, you can extend as needed
    default:
      console.warn(
        "TBD?: Key down, unhandled",
        evt.which,
        evt.charCode,
        evt.keyCode
      );
  }
};










