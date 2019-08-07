// Obtendo os elementos
var uploader = document.getElementById('uploader');
var fileButton = document.getElementById('fileButton');


//obter autenticação user*******
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
    } else {
        // No user is signed in.
    }
});


// Ouvir o evento change
fileButton.addEventListener('change', function(e) {
    // Obter o arquivo
    var file = e.target.files[0];

    //user ***
    var user = firebase.auth().currentUser;

    // Referenciar o Storage
    var storageRef = firebase.storage().ref('arquivos/' + user.displayName + '_' + user.uid + '/' + file.name);

    // Enviar o arquivo
    var task = storageRef.put(file);

    // Atualizar o Progress Bar
    task.on('state_changed',
        function progress(snapshot) {
            var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploader.value = percentage;
        },
        function error(err) {
            console.log(err);
        },
        function complete() {
            alert('Envio completo!')
        }
    )
});