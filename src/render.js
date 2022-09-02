const { ipcRenderer } = require('electron');
let score = 0;
// fetch("https://opentdb.com/api.php?amount=1&type=multiple").then(result => result.json()).then(data => console.log(data));

const render = async () => {
    clear();
    renderSpinner();
    const { results } = await (await fetch("https://opentdb.com/api.php?amount=1&type=multiple")).json();
    const [quiz] = results;
    const options = createOptionsArray(quiz);
    clear();
    renderScore();
    renderQuestion(quiz.question);
    options.forEach(option => renderOption(option));
};

const renderQuestion = (question) => {
    const element = document.createElement('div');
    element.classList.add('question');
    element.innerHTML = question;
    return document.body.appendChild(element);
}

const renderOption = (option) => {
    const element = document.createElement('li');
    element.classList.add('option');
    element.innerHTML = option.answer;
    element.addEventListener('click', (e) => answerHandler(e, option.isCorrect));
    return document.body.appendChild(element);
}

const renderSpinner = () => {
    const element = document.createElement('div');
    element.classList.add('lds-dual-ring');
    return document.body.appendChild(element);
}

const renderScore = () => {
    const element = document.createElement('h1');
    element.classList.add('score');
    element.innerHTML = `Score: ${score}`;
    return document.body.appendChild(element);
}

const answerHandler = (e, isCorrect) => {
    if (isCorrect) {
        score++;
        render();
    } else {
        alert(`Nie no, tyle to nie. Twój wynik: ${score}`);

        if (confirm('Chcesz spróbować jeszcze raz?')) {
            score = 0;
            render();
        } else {
            ipcRenderer.invoke('QUIT');
        }
    }
}

const createOptionsArray = ({ correct_answer, incorrect_answers }) => {
    const options = [];
    incorrect_answers.forEach(answer => options.push({ answer, isCorrect: false }));
    options.push({ answer: correct_answer, isCorrect: true });
    return shuffle(options);

}

const shuffle = (array) => {
    let currentIndex = array.length, randomIndex;

    while (currentIndex != 0) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

const clear = () => {
    document.body.innerHTML = "";
}

render();