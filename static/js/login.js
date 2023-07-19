// Seleciona o elemento com o ID 'icon' e o armazena na variável $icon
const $icon = document.querySelector('#icon');

// Seleciona o elemento com o ID 'InputSenha' e o armazena na variável $InputSenha
const $InputSenha = document.querySelector('#InputSenha');

// Variável que controla se a senha está visível ou não
let invi = false;

// Define uma função de clique para o elemento $icon
$icon.onclick = function() {
    // Verifica se a senha está invisível
    if (invi === false) {
        // Remove a classe 'fa-eye' e adiciona a classe 'fa-eye-slash' e 'minor' ao elemento $icon
        $icon.classList.remove('fa-eye');
        $icon.classList.add('fa-eye-slash');
        $icon.classList.add('minor');
        // Remove a classe 'masked' do elemento $InputSenha, tornando a senha visível
        $InputSenha.classList.remove('masked');
        // Atualiza o valor da variável invi para indicar que a senha está visível
        invi = true;
    } else {
        // Adiciona a classe 'fa-eye' e remove as classes 'fa-eye-slash' e 'minor' do elemento $icon
        $icon.classList.add('fa-eye');
        $icon.classList.remove('fa-eye-slash');
        $icon.classList.remove('minor');
        // Adiciona a classe 'masked' ao elemento $InputSenha, ocultando a senha
        $InputSenha.classList.add('masked');
        // Atualiza o valor da variável invi para indicar que a senha está invisível
        invi = false;
    }
};
