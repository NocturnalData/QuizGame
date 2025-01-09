// Fetch Anagrams from JSON
async function loadAnagrams() {
    const response = await fetch('anagrams.json');
    const data = await response.json();
    return data;
}

let anagrams = [];

// Fetch the anagrams when the page loads
loadAnagrams().then((loadedAnagrams) => {
    anagrams = loadedAnagrams;
    console.log("Anagrams loaded:", anagrams); // For debugging purposes
});

// Filter anagrams based on selected word length
function filterAnagramsByLength(length) {
    return anagrams.filter(anagram => anagram.length === length);
}

// Start the anagram game with a specific length
function startAnagramGame(length) {
    const filteredAnagrams = filterAnagramsByLength(length);
    const randomAnagram = filteredAnagrams[Math.floor(Math.random() * filteredAnagrams.length)];
    const anagramWord = randomAnagram.word;
    const scrambledWord = scrambleWord(anagramWord);

    // Store the correct word in the currentAnagramWord variable
    window.currentAnagramWord = anagramWord;  // This will store the correct word

    // Show the scrambled word to the player
    document.getElementById('anagram-letters').textContent = scrambledWord;
    document.getElementById('game-screen').classList.remove('hide');  // Show the game screen
    document.getElementById('anagram-input').value = '';
    document.getElementById('give-up-button').disabled = false;  // Enable the Give Up button
    document.getElementById('anagram-feedback').textContent = '';  // Clear any previous feedback
}

// Scramble word
function scrambleWord(word) {
    return word.split('').sort(() => Math.random() - 0.5).join('');
}

// Handle anagram submission
document.getElementById('submit-anagram').addEventListener('click', () => {
    const input = document.getElementById('anagram-input').value;
    const word = window.currentAnagramWord;  // Get the correct word from storage
    if (input.toLowerCase() === word.toLowerCase()) {
        alert('Correct!');
    } else {
        alert('Incorrect!');
    }
});

// Handle Give Up button
document.getElementById('give-up-button').addEventListener('click', () => {
    const word = window.currentAnagramWord;  // Retrieve the correct word
    if (word) {
        alert(`The correct word is: ${word}`);  // Show the correct word
    } else {
        alert('No anagram game is currently active!');
    }

    document.getElementById('game-screen').classList.add('hide');  // Hide the game screen
    document.getElementById('anagram-feedback').textContent = `The correct word was: ${word}`;
    document.getElementById('give-up-button').disabled = true;  // Disable Give Up button after use
});

// Fetch Quiz Questions from JSON
async function loadQuizQuestions() {
    const response = await fetch('quiz-questions.json');
    const data = await response.json();
    return data;
}

let quizQuestions = [];
let score = 0;

// Fetch the quiz questions when the page loads
loadQuizQuestions().then((loadedQuestions) => {
    quizQuestions = shuffleArray(loadedQuestions);
    console.log("Quiz questions loaded and shuffled:", quizQuestions); // For debugging purposes
});

// Shuffle the array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];  // Swap elements
    }
    return array;
}

// Display a random quiz question
function displayQuizQuestion() {
    if (quizQuestions.length === 0) {
        document.getElementById('quiz-feedback').textContent = 'No more questions!';
        return;
    }

    const randomIndex = Math.floor(Math.random() * quizQuestions.length);
    const questionData = quizQuestions.splice(randomIndex, 1)[0];  // Remove the question once used
    document.getElementById('question').textContent = questionData.question;
    
    const answerButtons = document.getElementById('answer-buttons');
    answerButtons.innerHTML = '';  // Clear previous answers

    // Shuffle answers and display them
    const shuffledAnswers = shuffleAnswers(questionData.answers);
    shuffledAnswers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer.text;
        button.classList.add('btn');
        button.style.marginBottom = '10px'; // Add space between buttons for better UI
        button.onclick = () => handleAnswer(answer, questionData, button);
        answerButtons.appendChild(button);
    });
}

// Shuffle answers randomly
function shuffleAnswers(answers) {
    for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];  // Swap elements
    }
    return answers;
}

// Handle answer click
function handleAnswer(selectedAnswer, questionData, selectedButton) {
    const feedback = document.getElementById('quiz-feedback');

    // Iterate over all answer buttons
    const allButtons = document.querySelectorAll('#answer-buttons .btn');
    
    allButtons.forEach(button => {
        // Get the associated answer object for each button
        const answer = questionData.answers.find(ans => ans.text === button.textContent);

        if (answer.correct) {
            button.style.backgroundColor = 'green';  // Correct answer turns green
        } else {
            button.style.backgroundColor = 'red';  // Incorrect answers turn red
        }
    });

    if (selectedAnswer.correct) {
        score++;
        feedback.textContent = 'Correct!';
        feedback.classList.add('correct');
        feedback.classList.remove('wrong');
    } else {
        feedback.textContent = 'Wrong!';
        feedback.classList.add('wrong');
        feedback.classList.remove('correct');
    }

    // Disable all answer buttons after selection
    allButtons.forEach(button => {
        button.disabled = true;
    });

    // Show "Next" button
    document.getElementById('next-button').style.display = 'block';
}

// Next question
document.getElementById('next-button').addEventListener('click', () => {
    if (quizQuestions.length > 0) {
        displayQuizQuestion();  // Display the next random question
    } else {
        document.getElementById('quiz-feedback').textContent = `Quiz Over! Your score is: ${score}`;
    }
    document.getElementById('next-button').style.display = 'none'; // Hide next button again
});

// Handle Anagram game flow
document.getElementById('anagram-button').addEventListener('click', () => {
    document.querySelector('.main-menu').classList.add('hide');
    document.getElementById('anagram-game').classList.remove('hide');
});

// Handle Quiz game flow
document.getElementById('quiz-button').addEventListener('click', () => {
    document.querySelector('.main-menu').classList.add('hide');
    document.getElementById('quiz-game').classList.remove('hide');
    displayQuizQuestion();  // Display the first randomized question when quiz starts
});

// Length selectors for anagram game
document.getElementById('length-8').addEventListener('click', () => {
    startAnagramGame(8);
});

document.getElementById('length-9').addEventListener('click', () => {
    startAnagramGame(9);
});

document.getElementById('length-10').addEventListener('click', () => {
    startAnagramGame(10);
});

document.getElementById('length-11').addEventListener('click', () => {
    startAnagramGame(11);
});

document.getElementById('length-12').addEventListener('click', () => {
    startAnagramGame(12);
});
