import { elt, generateRandomNumbers, compare } from './utils.js'
import DOM from './DOM.js';

((window, document, $) => {
    'use strict';

    const MAX = 15;
    const $gameBoard = $('section[data-js="game-board"]').get();
    const $betList = $('ul[data-js="bet-list"]').get();
    const $hitsList = $('div[data-js="hits-list"]').get();

    const $completeGame = $('button[data-js="button-complete"]');
    const $saveGame = $('button[data-js="button-save"]');
    const $clearGame = $('button[data-js="button-clear"]');
    const $championBtn = $('button[data-js="btn-champion"]');
    const $championInput = $('input[data-js="input-champion"]').get();

    let $gameNumbers;
    let selectedNumbers = [];
    let games = [];
    let hits = [];
    let id = 1;

    function init() {
        initNumbers();
        $gameNumbers = getGameNumbers();
        registerEvents();
    }

    function initNumbers() {
        for(let i = 0; i < 25; i++) {
            if (i % 7 === 0) {
                const row = elt('div', { class: 'game__bet__row'});
                $gameBoard.appendChild(row);
            }
            let btnNumberAttributes = { class: 'btn-number','data-js': 'button-number', value: i + 1};
            const btnNumber = elt('button', btnNumberAttributes , String(i + 1));
            $gameBoard.lastElementChild.appendChild(btnNumber);
        }
    }

    function getGameNumbers() {  return $('.btn-number') }

    function registerEvents() {
        $gameNumbers.forEach((button) => {
            button.addEventListener('click', handleButtonClick);
        });
        $clearGame.on('click', handleClearGame);
        $saveGame.on('click', handleSaveGame);
        $completeGame.on('click', handleCompleteGame);
        $championBtn.on('click', handleChampionResult);

    }
    function handleClearGame() {
        selectedNumbers = [];
        clearNumbers();
    }
    function clearNumbers() {
        $gameNumbers.forEach((item) => {
            item.classList.remove('active');
        });
    }

    function handleSaveGame() {
        if (selectedNumbers.length < MAX) {
            alert(`Voce deve selecionar ${MAX} números!`);
            return;
        }
        games.push({numbers:selectedNumbers, id});
        addGameToList(selectedNumbers.sort(compare), games.length, id);
        id++;
        handleClearGame();
    }
    function addGameToList(numbers, index, id) {
        const bet = createBetItem(numbers, index, id);
        $betList.appendChild(bet);
    }
    function createBetItem(numbers, index, id) {
        const betGameNumber = elt('div', {class: 'bet__list__item__game'}, String('#'+index));
        const betNumbers = elt('div', {class: 'bet__list__item__numbers'}, numbers.toString());
        const btnClose = elt('span', {class: 'bet__close', 'data-js': id}, 'x');
        btnClose.addEventListener('click', handleRemoveBet);
        const bet = elt('li', {class: 'bet__list__item'}, betGameNumber, betNumbers, btnClose);

        return bet;
    }
    function updateBetList() {
        for (let i = 0; i < $betList.childNodes.length; i++)
            $betList.childNodes[i].firstChild.textContent = `#${i + 1}`;
    }
    function handleRemoveBet(button) {
        const id = this.getAttribute('data-js');
        removeBetFromGamesArray(id);
        removeBetFromGamesList(button);
        updateBetList();
    }

    function removeBetFromGamesArray(id) {
        games = games.filter(game => game.id !== +id);
    }
    function removeBetFromGamesList(button) {
        button.target.parentNode.remove();
    }

    function handleCompleteGame() {
        const amount = selectedNumbers.length
        generateRandomNumbers(selectedNumbers, MAX - amount, 25);
        fillSelectedNumbersOnBoard();
    }

    function fillSelectedNumbersOnBoard(){
        selectedNumbers.forEach(number => {
            const item = $gameNumbers.find(gameNumber => {
                return +gameNumber.value === number;
            })
            item.classList.add('active');
        });
    }

    function handleChampionResult() {
        const splitedValue = $championInput.value.split(',').map(item => +item);
        if (splitedValue.length < MAX) {
            alert(`Entre com ${MAX} números, separados por virgula`);
            return
        }
        if (games.length < 1){
            $hitsList.innerHTML = 'Faça uma aposta e veja o resultado';
            return
        }
        getHitsPerGame(splitedValue);
        showHitsList();
        resetArrays();
    }

    function resetArrays() {
        selectedNumbers = [];
        hits = [];
    }

    function getHitsPerGame(splitedValue) {
        games.forEach((game, index) => {
            hits.push(game.numbers.filter((number) => {
                return splitedValue.indexOf(number) !== -1;
            }));
        });
    }
    // 1,2,3,4,5,6,7,8,9,10,11,12,13,14,MAX
    function showHitsList() {
        $hitsList.innerHTML = '';
        hits.forEach((hit, index) => {
            const hitsParagraph = elt('p', {class: 'bet__result__game'},`O jogo #${index + 1}, teve ${hit.length} acertos` );
            $hitsList.appendChild(hitsParagraph);
        })
    }

    function handleButtonClick() {
        let index = selectedNumbers.indexOf(+this.value);

        if (index !== -1) {
            selectedNumbers = selectedNumbers.filter((item, i) => {
                return index !== i;
            });
            this.classList.toggle('active');

        } else if (selectedNumbers.length >= MAX)
                alert(`Quantidade máxima: ${MAX} números`);
            else {
                selectedNumbers.push(+this.value);
                this.classList.toggle('active');
        }
    }
    init();

})(window, document, DOM);
