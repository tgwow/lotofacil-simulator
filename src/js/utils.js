export function elt(tag, attributes, ...args) {
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
        for(let i = 0; i < args.length; i++) {
            let child = args[i];
            if (typeof child === 'string')
                child = document.createTextNode(args[i]);
            elt.appendChild(child);
        }
    }
    return elt;
}
export function convertArrayLikeToArray(arrayLike) {
    return Array.prototype.map.call(arrayLike, (item) => {
        return item;
    });
}

// gera numeros unicos e coloca em um array
export function generateRandomNumbers(numbers, qtd, range) {
    for (let i = 1; i <= qtd ; i++) {
        let number = randomNumber(range);
        while (numbers.indexOf(number) !== -1)
            number = randomNumber(range);

        numbers.push(number);
    }
}
function randomNumber(range) {
    return Math.floor(Math.random() * range + 1);
}

export function compare(a, b) {
    return a - b;
}
