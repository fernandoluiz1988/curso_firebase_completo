/* TODO: Add SDKs for Firebase products that you want to use
https: //firebase.google.com/docs/web/setup#config-web-app */


// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBHHF4nC_5WwPAuNidDG9a6KjlYklAZ5yg",
    authDomain: "techmanagexml.firebaseapp.com",
    databaseURL: "https://techmanagexml.firebaseio.com",
    projectId: "techmanagexml",
    storageBucket: "techmanagexml.appspot.com",
    messagingSenderId: "976299793311",
    appId: "1:976299793311:web:63c53c6697046b22"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var homeButton = document.getElementById('homeButton');
var logOutButton = document.getElementById('logOutButton');
var photo = document.getElementById('photo');

// Carregar os dados do centro da página

var linkStorage = document.getElementById('linkStorage');
var linkDatabase = document.getElementById('linkDatabase');
var logInButton = document.getElementById('logInButton');
var linkChat = document.getElementById('linkChat');

linkStorage.addEventListener('click', function() {
    carregarPagina("storage.html");
});

linkDatabase.addEventListener('click', function() {
    carregarPagina("real-time-database.html");
});


logInButton.addEventListener('click', function() {
    carregarPagina("authentication.html");
});


function carregarPagina(pagina) {
    $("#container1").load(pagina);
}



// Logout
logOutButton.addEventListener('click', function() {
    firebase
        .auth()
        .signOut()
        .then(function() {
            displayName.innerText = 'Você não está autenticado';
            photo.style.display = 'none';
            //Ir para a home
            homeButton.click();
        }, function(error) {
            console.error(error);
        });
});


// Observable de usuário *****
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        photo.setAttribute("src", user.photoURL);
        photo.style.display = 'block';
        logOutButton.style.display = 'block';
        logInButton.style.display = 'none';
        linkStorage.style.display = 'block';
        linkDatabase.style.display = 'block';
        linkChat.style.display = 'block';


        displayName.innerText = 'Bem vindo, ' + user.displayName;

        //Carrega a tela inicial


    } else {
        photo.style.display = 'none';
        logOutButton.style.display = 'none';
        logInButton.style.display = 'block';
        linkStorage.style.display = 'none';
        linkDatabase.style.display = 'none';
        linkChate.style.display = 'none';


    }
});