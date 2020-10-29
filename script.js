import { elt, convertToArr, generateRandomNumbers, compare } from './utils.js'

((window, document) => {
    'use strict';

    const MAX = 25;

    const $loto = document.querySelector('.loto__numbers');
    const $spanCounter = document.querySelector('span');
    const $checkResult = document.querySelector('button[data-js="button-result"]');
    const $newGame = document.querySelector('button[data-js="button-new"]');
    const $lotoResults = document.querySelector('.loto__result');
    const $lotoConcurso = document.querySelector('.loto__concurso');
    // preciso utlizar esse método, pois, neste ponto do código, os botoes não foram criados ainda
    const $lotoNumbers = document.getElementsByClassName('button-number');

    let numbersArr = [];
    let selectedNumbers = [];
    let correctNumbers = [];
    let games = [];
    let hits = [];

    function init() {
        initNumbers();
        generateRandomNumbers(correctNumbers, 15, MAX);
        numbersArr = convertToArr($lotoNumbers);
        registerEvents();
        console.log(numbersArr)
    }
    function initNumbers() {
        for(let i = 0; i < MAX; i++) {
            if (i % 5 === 0) {
                const row = elt('div', { class: 'loto__row'})
                $loto.appendChild(row);
            }
            const number = elt('button', { class: 'button-number','data-js': 'button-number', value: i + 1}, String(i + 1));
            $loto.lastElementChild.appendChild(number);
        }
    }

    function registerEvents() {
        numbersArr.forEach((button) => {
            button.addEventListener('click', handleButtonClick);
        });
        $checkResult.addEventListener('click', handleResult);
        $newGame.addEventListener('click', handleNewGame);

    }

    function handleNewGame() {
        if (selectedNumbers.length < 15) {
            alert('Voce deve selecionar 15 números!');
            return;
        }
        games.push(selectedNumbers);
        clearButtonsNumbers();
        selectedNumbers = [];
    }

    function clearButtonsNumbers() {
        $spanCounter.textContent = 'Números selecionados: 0';
        numbersArr.forEach((item) => {
            item.classList.remove('active');
        })
    }
    function handleResult() {
        if (selectedNumbers.length < 15) {
            alert('Voce deve selecionar 15 números!');
            return;
        }
        games.push(selectedNumbers);
        checkHitsPerGame();
        showHitsResult();
        showCorrectNumbers();
        clearButtonsNumbers();
        resetArrays();
        generateRandomNumbers(correctNumbers, 15, MAX);
    }
    function resetArrays() {
        selectedNumbers = [];
        games = [];
        hits = [];
        correctNumbers = [];
    }

    function showCorrectNumbers() {
        const p = elt('p', null, 'Resultado do concurso');
        const span = elt('p', {'class': 'loto__concurso__result'}, correctNumbers.sort(compare).join(', '));
        $lotoConcurso.textContent = '';
        $lotoConcurso.appendChild(p);
        $lotoConcurso.appendChild(span);
    }

    function checkHitsPerGame() {
        games.forEach((game, index) => {
            hits.push(game.filter((number) => {
                return correctNumbers.indexOf(+number) !== -1;
            }));
        });
    }

    function showHitsResult() {
        $lotoResults.textContent = '';
        hits.forEach((hit, index, arr) => {
            const result = elt('span', null,`O jogo ${index + 1}, teve ${hit.length} acertos` );
            result.appendChild(elt('span', {'class': 'loto__result__numbers'}, `[${hit.sort(compare)}]`));
            $lotoResults.appendChild(elt(
                'div',
                {'class': 'loto__result__row'},
                result
            ));
        })
    }

    function handleButtonClick() {
        let index = selectedNumbers.indexOf(this.value);
        this.classList.toggle('active');
        // já tem, preciso retirar;
        if (index !== -1) {
            selectedNumbers = selectedNumbers.filter((item, i) => {
                return index !== i;
            })
        } else {
            // n chegou no limite
            if (selectedNumbers.length < 15)
                selectedNumbers.push(this.value);
            else{
                this.classList.remove('active');
                alert('Quantidade máxima: 15 números');
            }
        }
        $spanCounter.textContent = `Números selecionados: ${selectedNumbers.length}`;
    }

    init();
})(window, document);
