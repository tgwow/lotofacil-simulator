export function elt(tag, attributes, args) {
    const elt = document.createElement(tag);
    // se tiver atributos para serem adicionados ao elemento
    if (attributes)
        // pra cada atributo seta sua chave e valor
        for (let atrr in attributes)
            // formato: arg = atributes / attr[arg] = value
            // class="active"
            if (attributes.hasOwnProperty(atrr))
                elt.setAttribute(atrr, attributes[atrr]);
    // terceiro parametro para adicionar um valor de texto ao nó
    // let child = args;
    if (args) {
        let child = args;
        if (typeof args === 'string')
            child = document.createTextNode(args);
        elt.appendChild(child);
    }
    return elt;
}
export function convertToArr(arrayLike) {
    // retorna um array com todos valores de um array like
    return Array.prototype.map.call(arrayLike, (item) => {
        return item;
    });
}

// gera numeros unicos e coloca em um array
export function generateRandomNumbers(numbers, qtd, range) {
    for (let i = 1; i <= qtd ; i++) {
        let number = randomNumber(range);
        // enquanto já existir o numero no array,
        // gera outro numero e testa até encontrar um numero unico
        while (numbers.indexOf(number) !== -1)
            number = randomNumber(range);

        numbers.push(number);
    }
}
// gera um random entre 1 e range
function randomNumber(range) {
    return Math.floor(Math.random() * range + 1);
}

// funcao para ordernacao crescente no sort()
export function compare(a, b) {
    return a - b;
}
