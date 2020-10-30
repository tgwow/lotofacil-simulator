import { elt, generateRandomNumbers, compare } from './utils.js'
import DOM from './DOM.js';

((window, document, $) => {
    'use strict';

    const MAX = 25;
    const $gameBoard = $('section[data-js="game-board"]').get();
    const $betList = $('ul[data-js="bet-list"]').get();

    const $completeGame = $('button[data-js="button-complete"]');
    const $saveGame = $('button[data-js="button-save"]');
    const $clearGame = $('button[data-js="button-clear"]');

    const $hitsList = $('div[data-js="hits-list"]').get();
    const $championBtn = $('button[data-js="btn-champion"]')
    const $championInput = $('input[data-js="input-champion"]').get();

    let $gameNumbers
    let selectedNumbers = [];
    let games = [];
    let hits = [];
    let id = 1;

    function init() {
        initNumbers();
        $gameNumbers = getGameNumbers();
        registerEvents();
    }
    function initNumbers($gameNumbers) {
        for(let i = 0; i < MAX; i++) {
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
        $championBtn.on('click', handleChampionResult)

    }
    function handleClearGame() {
        selectedNumbers = [];
        clearNumbers();
    }
    function clearNumbers() {
        $gameNumbers.forEach((item) => {
            item.classList.remove('active');
        })
    }

    function handleSaveGame() {
        if (selectedNumbers.length < 5) {
            alert('Voce deve selecionar 15 números!');
            return;
        }

        games.push({numbers:selectedNumbers, id});
        addGameToList(selectedNumbers.sort(compare), games.length, id);
        id++
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
        $betList.innerHTML='';
        games.forEach((game, index) => {
            const bet = createBetItem(game.numbers,index+1, game.id)
            $betList.appendChild(bet);
        })
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
        generateRandomNumbers(selectedNumbers, 15 - amount, 25);
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
        getHitsPerGame(splitedValue);
        showHitsList();
        console.log('hits> ', hits);
        console.log('game >', games);
        console.log('selected >', selectedNumbers);
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
    // 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15
    function showHitsList() {
        $hitsList.innerHTML = '';
        hits.forEach((hit, index, arr) => {
            const hitsParagraph = elt('p', {class: 'bet__result__game'},`O jogo #${index + 1}, teve ${hit.length} acertos` );
            $hitsList.appendChild(hitsParagraph);
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
                selectedNumbers.push(+this.value);
            else{
                this.classList.remove('active');
                alert('Quantidade máxima: 15 números');
            }
        }
    }
    init();
})(window, document, DOM);
