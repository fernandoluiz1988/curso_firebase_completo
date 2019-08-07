// Buttons
var authEmailPassButton = document.getElementById('authEmailPassButton');
var authFacebookButton = document.getElementById('authFacebookButton');
var authTwitterButton = document.getElementById('authTwitterButton');
var authGoogleButton = document.getElementById('authGoogleButton');
var authGitHubButton = document.getElementById('authGitHubButton');
var authAnonymouslyButton = document.getElementById('authAnonymouslyButton');
var createUserButton = document.getElementById('createUserButton');


// Inputs
var emailInput = document.getElementById('emailInput');
var passwordInput = document.getElementById('passwordInput');

// Displays
var displayName = document.getElementById('displayName');




// Criar novo usuário
createUserButton.addEventListener('click', function() {
    firebase
        .auth()
        .createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
        .then(function() {
            alert('Bem vindo ' + emailInput.value);
        })
        .catch(function(error) {
            console.error(error.code);
            console.error(error.message);
            alert('Falha ao cadastrar, verifique o erro no console.')
        });
});

// Autenticar com E-mail e Senha
authEmailPassButton.addEventListener('click', function() {
    firebase
        .auth()
        .signInWithEmailAndPassword(emailInput.value, passwordInput.value)
        .then(function(result) {
            console.log(result);
            displayName.innerText = 'Bem vindo, ' + emailInput.value;
            alert('Autenticado ' + emailInput.value);
        })
        .catch(function(error) {
            console.error(error.code);
            console.error(error.message);
            alert('Falha ao autenticar, verifique o erro no console.')
        });
});





// Autenticar com Google
authGoogleButton.addEventListener('click', function() {
    // Providers
    var provider = new firebase.auth.GoogleAuthProvider();
    signIn(provider);
});

// Autenticar com Facebook
authFacebookButton.addEventListener('click', function() {
    // Providers
    var provider = new firebase.auth.FacebookAuthProvider();
    signIn(provider);
});



function signIn(provider) {
    firebase.auth()
        .signInWithPopup(provider)
        .then(function(result) {
            console.log(result);
            var token = result.credential.accessToken;
            //Ir para a home
            homeButton.click();
        }).catch(function(error) {
            console.log(error);
            alert('Falha na autenticação');
        });
}





/*
// Autenticar Anônimo
authAnonymouslyButton.addEventListener('click', function() {
    firebase
        .auth()
        .signInAnonymously()
        .then(function(result) {
            console.log(result);
            displayName.innerText = 'Bem vindo, desconhecido';
            alert('Autenticado Anonimamente');
        })
        .catch(function(error) {
            console.error(error.code);
            console.error(error.message);
            alert('Falha ao autenticar, verifique o erro no console.')
        });
});

// Autenticar com GitHub
authGitHubButton.addEventListener('click', function() {
    // Providers
    var provider = new firebase.auth.GithubAuthProvider();
    signIn(provider);
});

// Autenticar com Twitter
authTwitterButton.addEventListener('click', function() {
    // Providers
    var provider = new firebase.auth.TwitterAuthProvider();
    signIn(provider);
});

*/