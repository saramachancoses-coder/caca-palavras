// Cria uma lista de palavras que podem aparecer no jogo
const bancoPalavras = ["PYTHON", "FUNCAO", "VARIAVEL", "CODIGO", "DADOS", "LOGICA"];
// Define o tamanho da nossa tabela (8 significa 8x8 letras)
const tamanhoGrid = 8;
// Cria uma lista vazia que vai guardar apenas as palavras do jogo atual
let palavrasAtuais = [];

// Função principal que começa e reseta o jogo
function iniciarJogo() {
    // Mistura o banco de palavras e escolhe aleatoriamente as 4 primeiras
    palavrasAtuais = [...bancoPalavras].sort(() => 0.5 - Math.random()).slice(0, 4);

    // Cria uma tabela vazia (uma lista de listas) preenchida com espaços em branco ('')
    let grid = Array(tamanhoGrid).fill().map(() => Array(tamanhoGrid).fill(''));

    // Passa por cada uma das 4 palavras escolhidas para colocá-las no quadro
    for (let palavra of palavrasAtuais) {
        let colocou = false;
        let tentativas = 0;

        // Tenta encaixar a palavra repetidamente até conseguir (ou até tentar 100 vezes)
        while (!colocou && tentativas < 100) {
            tentativas++;

            // Sorteia se a palavra vai ficar deitada (horizontal) ou em pé (vertical)
            let horizontal = Math.random() > 0.5;

            // Calcula o limite máximo da linha e coluna sem deixar a palavra sair do quadro
            let linhaMax = horizontal ? tamanhoGrid : (tamanhoGrid - palavra.length + 1);
            let colunaMax = horizontal ? (tamanhoGrid - palavra.length + 1) : tamanhoGrid;

            // Sorteia uma linha e uma coluna exata dentro do limite
            let linha = Math.floor(Math.random() * linhaMax);
            let coluna = Math.floor(Math.random() * colunaMax);

            let podeColocar = true;

            // Testa cada letrinha da palavra para ver se há colisão inválida
            for (let i = 0; i < palavra.length; i++) {
                let l = linha + (horizontal ? 0 : i);
                let c = coluna + (horizontal ? i : 0);

                if (grid[l][c] !== '' && grid[l][c] !== palavra[i]) {
                    podeColocar = false;
                }
            }

            // Se o teste passou, escreve as letras da palavra na grade
            if (podeColocar) {
                for (let i = 0; i < palavra.length; i++) {
                    grid[linha + (horizontal ? 0 : i)][coluna + (horizontal ? i : 0)] = palavra[i];
                }
                colocou = true;
            }
        }

        // Se passar das 100 tentativas sem conseguir encaixar, retira a palavra da rodada
        if (!colocou) {
            palavrasAtuais = palavrasAtuais.filter(p => p !== palavra);
        }
    }

    // Pega o espaço do HTML onde a grade vai aparecer
    const gridHtml = document.getElementById('grid');
    gridHtml.innerHTML = '';
    gridHtml.style.gridTemplateColumns = `repeat(${tamanhoGrid}, 1fr)`;

    const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // Percorre cada linha e coluna para criar as letras na tela
    for (let l = 0; l < tamanhoGrid; l++) {
        for (let c = 0; c < tamanhoGrid; c++) {
            if (grid[l][c] === '') {
                grid[l][c] = alfabeto[Math.floor(Math.random() * 26)];
            }

            let celula = document.createElement('div');
            celula.className = 'cell';
            celula.textContent = grid[l][c];

            // Evento de clique na célula (permite clicar mesmo em letras já verdes caso duas palavras se cruzem)
            celula.onclick = () => {
                celula.classList.toggle('selected');
                verificarPalavra();
            };

            gridHtml.appendChild(celula);
        }
    }

    // Atualiza a lista de palavras no HTML
    const listaHtml = document.getElementById('word-list');
    listaHtml.innerHTML = palavrasAtuais.map(p => `<li id="palavra-${p}">${p}</li>`).join('');
}

// Inicia o jogo ao carregar a página
iniciarJogo();
