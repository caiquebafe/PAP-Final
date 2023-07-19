// Seleciona o elemento HTML com o ID "IconAlbum" e atribui à variável $IconAlbum
const $IconAlbum = document.querySelector('#IconAlbum');

// Seleciona o elemento HTML com o ID "playIcon" e atribui à variável $PlayIcon
const $PlayIcon = document.querySelector('#playIcon');

// Define a função InputMusicAlbums
function InputMusicAlbums() {
    // Define a função shuffleArray para embaralhar um array
    function shuffleArray(array) {
        // Percorre o array a partir do último elemento
        for (let i = array.length - 1; i > 0; i--) {
            // Gera um índice aleatório entre 0 e i
            const j = Math.floor(Math.random() * (i + 1));
            // floor arrendonda os números pra baixo
            // Troca os elementos de posição no array usando a técnica de desestruturação
            [array[i], array[j]] = [array[j], array[i]];
        }
        // Retorna o array embaralhado
        return array;
    }

    // Define o caminho para a pasta de imagens de músicas
    const path = "/static/images/songs/";

    // Define um array de nomes de álbuns de música
    const Albums = [
        "californication.jpg",
        "beatles.jpg",
        "damn.jpg",
        "tameImpala.jpg",
        "californication.jpg",
        "nirvana.jpg",
        "thriller.png",
        "blurryface.png",
        "graduation.jpg",
        "AM.jpeg",
    ];
    
    // Embaralha o array de álbuns e seleciona o primeiro álbum embaralhado
    const Album = shuffleArray(Albums)[0];

    // Define a imagem de fundo do elemento $IconAlbum usando o álbum selecionado
    $IconAlbum.style.backgroundImage = `url("${path}${Album}")`;

    // Remove a borda do elemento $IconAlbum
    $IconAlbum.style.border = 'none';

    // Define a opacidade do elemento $PlayIcon como 0.75
    $PlayIcon.style.opacity = '.75';
}
