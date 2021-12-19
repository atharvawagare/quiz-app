const question = document.getElementById("question");
const choices = document.getElementsByClassName("choice-text");

// Variabes
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let totalQuestions = 0;
let questions = [];
let availableQuestions = [];

// Constants
const CORRECT_BONUS = 10;
let MAX_QUESTIONS = 3;

// You need to learn this portion of code fetching

// fetch("./questions/questions.json")
//     .then(res => {
//         console.log(res);
//         return res.json();
//     })
//     .then(loadedQuestions => {
//         questions = loadedQuestions;
//         console.log(questions);
//         startGame();
//     })
//     .catch(err => {
//         console.log(err);
//     });


fetch("https://opentdb.com/api.php?amount=10&category=9&type=multiple")
    .then(res => {
        console.log(res);
        return res.json();
    })
    .then(loadedQuestions => {

        questions = loadedQuestions.results.map(loadedQuestion => {
            var raw_list = loadedQuestion.incorrect_answers.concat(loadedQuestion.correct_answer);
            
            for(let i = raw_list.length - 1; i>0; i--){
                var j = Math.floor(Math.random() * (i + 1));
                [raw_list[i], raw_list[j]] = [raw_list[j], raw_list[i]];
            }
            const formattedQuestion = {
                "que": loadedQuestion.question,
                "choice_list":raw_list,
                "ans":raw_list.indexOf(loadedQuestion.correct_answer)+1
            };

            return formattedQuestion;
        });
        startGame();
    })
    .catch(err => {
        console.log(err);
    });


startGame = () =>{
    availableQuestions=[ ... questions];
    totalQuestions = availableQuestions.length;
    getNewQuestion();
}

getNewQuestion = () => {
    questionCounter++;
    document.getElementById("score").innerHTML = "Score: "+score;

    if(availableQuestions.length == 0){
        document.getElementById("instruction-area").innerHTML = "Submit the Quiz";
        document.getElementById("submit-btn").disabled=false;
        // document.getElementById("next-btn").disabled=true;
    }else{
        document.getElementById("counter").innerHTML = "Question Counter: "+questionCounter+"/"+totalQuestions;
    }

    const questionIndex = Math.floor(Math.random()*availableQuestions.length);
    currentQuestion=availableQuestions[questionIndex];
    document.getElementById("question").innerHTML = currentQuestion.que;

    let j = 0;
    for(j=0; j<4; j++){
        choices[j].innerHTML = currentQuestion.choice_list[j];
    }

    addClicker();

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers=true;
}



function addClicker (){
    Array.prototype.forEach.call(choices, choice => {
        // console.log("Hi");
        choice.addEventListener("click", e => {
            if(!acceptingAnswers) return;
    
            acceptingAnswers = false;
            const selectedChoice = e.target;
            const selectedAnswer = selectedChoice.dataset["number"];
    
            // const classToApply = selectedAnswer == currentQuestion.ans ? "correct" : "incorrect";
    
            let classToApply = "incorrect";
            if(selectedAnswer == currentQuestion.ans){
                classToApply = "correct";
                score = score + 1;
            }
            console.log("Score: "+score);

            selectedChoice.classList.add(classToApply);
            setTimeout(() => {
                selectedChoice.classList.remove(classToApply);
                getNewQuestion();
            }, 1000);
        });
    });
}

function submit(){
    window.location.href = "https://atharvawagare.github.io/";
}