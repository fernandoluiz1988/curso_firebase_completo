$(document).ready(function() {
    // Este código foi escrito de forma a ser fácil de ser explicado
    // por isso as coisas podem parecer fora do lugar, mas é para ser
    // apresentado mais facilmente

    //****************** Auth ******************

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


    var photo = document.getElementById('photo');
    var div_users = document.getElementById('div-users');
    var div_chat = document.getElementById('div-chat');



    var loggedUser;

    firebase.auth().onAuthStateChanged(function(user) {
        loggedUser = user;

        console.log('firebase.auth.onAuthStateChanged > user', user);
        if (user == null) {
            $('#div-must-auth').show(400);
        } else {
            photo.setAttribute("src", user.photoURL);
            photo.style.display = 'block';
            $('#div-must-auth').hide(200);
            loggedIn(user);
        }
    });

    /*
    $('#buttton-auth').click(function() {
        var provider = new firebase.auth.GithubAuthProvider();
        provider.addScope('user');
        firebase.auth().signInWithPopup(provider).then(function(result) {
            console.log('firebase.auth.signInWithPopup > user', result.user);
            loggedIn(result.user);
        }).catch(function(error) {
            console.log('error', error);
            alert(error.message);
        });
    });
    */

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

                $('#div-users').hide();
            }).catch(function(error) {
                console.log(error);
                alert('Falha na autenticação');
            });
    }



    function loggedIn(user) {
        writeUserData(user.uid, user.displayName, user.photoURL);
        startChat();
        setPresence(user);
    }

    function writeUserData(userId, displayName, photoUrl) {
        firebase.database().ref('users/' + userId).set({
            displayName: displayName,
            photoUrl: photoUrl
        });
    }

    function setPresence(user) {
        var presenceRef = firebase.database().ref('users/' + user.uid + '/connections');
        var lastOnlineRef = firebase.database().ref('users/' + user.uid + '/lastOnline');
        var connectedRef = firebase.database().ref('.info/connected');

        connectedRef.on('value', function(snap) {
            //setSendEnabled(snap.val() === true);
            setSendEnabled(true);
            if (snap.val() === true) {
                console.log('connectedRef.on > value', 'conected');
                var con = presenceRef.push(true);
                con.onDisconnect().remove();
                lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
            } else if (snap.val() === false) {
                console.log('connectedRef.on > value', 'disconected');
            }
        });


        $('#button-users').show();
        $('#button-users').click(function() {
            if (usersRef == undefined)
                listenUsers();
            if (div_users.style.display == 'block') {
                div_users.style.display = 'none';
                div_chat.style.display = 'block';
            } else {
                div_users.style.display = 'block';
                div_chat.style.display = 'none';
            }
        });


        // Logout
        $('#button-logout').show();
        $('#button-logout').click(function() {
            firebase
                .auth()
                .signOut()
                .then(function() {
                    photo.style.display = 'none';
                    //Ir para a home
                    homeButton.click();
                }, function(error) {
                    console.error(error);
                });
            div_users.style.display = 'none';
            div_chat.style.display = 'none';
        });



    }

    //****************** Messages ************************
    var messagesRef;

    function startChat() {
        $('#div-chat').show();
        $('#button-send').click(function() {
            sendMessage();
        });
        $(document).keypress(function(e) {
            if (e.which == 13)
                sendMessage();
        });

        if (messagesRef != undefined)
            return;

        setSendEnabled(true);
        // return;

        function addMessage(key, message) {
            if ($('#li-message-' + key).length) return;
            var template = $('#message-template').html();
            template = template.replace('{key}', key);
            template = template.replace('{user-name}', message.userDisplayName);
            template = template.replace('{photo-url}', message.userPhotoUrl);
            template = template.replace('{body}', message.body);
            $('#ul-messages').prepend(template);
            $('#div-loading').hide();
        }

        function delMessage(key) {
            $('#li-message-' + key).hide(1000);
        }

        messagesRef = firebase.database().ref('messages/');

        messagesRef.limitToFirst(1).on('value', function(snapshot) {
            console.log('messagesRef.limitToFirst(1).on > value', snapshot.val());
        });

        messagesRef.on('child_added', function(data) {
            console.log('messagesRef.on > child_added', data.val());
            addMessage(data.key, data.val());
        });
        messagesRef.on('child_removed', function(data) {
            console.log('messagesRef.on > child_removed', data);
            delMessage(data.key);
        });
    }

    function sendMessage() {
        var message = $('#input-message').val();
        if (message.trim() == '') return;
        $('#input-message').attr("disabled", true);
        var data = {
            userDisplayName: loggedUser.displayName,
            userPhotoUrl: loggedUser.photoURL,
            uid: loggedUser.uid,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            body: message
        };
        var newMessageKey = firebase.database().ref('messages/').push(data, function(data) {
            console.log('database.ref.push >', data);
        });
        $('#input-message').attr("disabled", false);
        $('#input-message').val('');
        $('#input-message').focus();
    }


    function setSendEnabled(enabled) {
        $('#div-send').show(200);
        $('#input-message').attr("disabled", !enabled);
        $('#button-send').attr("disabled", !enabled);
    }


    //****************** Users ************************
    var usersRef;

    function listenUsers() {

        function addUser(key, user) {
            var template = $('#user-template').html();
            template = template.replace('{key}', key);
            template = template.replace('{class}', '');
            template = template.replace('{user-name}', user.displayName);
            template = template.replace('{photo-url}', user.photoUrl);
            $('#ul-users-online').prepend(template);
            setUserStatus(key, user);
        }

        function setUserStatus(key, user) {
            if (user.lastOnline != undefined) {
                $('#li-user-' + key).removeClass('online').addClass('offline');
            } else {
                $('#li-user-' + key).removeClass('offline').addClass('online');
            }
        }

        usersRef = firebase.database().ref('users/');

        usersRef.on('child_added', function(data) {
            console.log('usersRef.on > child_added', data.val());
            addUser(data.key, data.val());
        });
        usersRef.on('child_changed', function(data) {
            console.log('usersRef.on > child_changed', data.val());
            setUserStatus(data.key, data.val());
        });
    }


    //**************** About ********************
    var dialog = document.querySelector('dialog');
    var showDialogButton = document.querySelector('#a-about');
    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    console.log($('.about'));
    $('.about').click(function(e) {
        e.preventDefault();
        dialog.showModal();
    });
    dialog.querySelector('.close').addEventListener('click', function() {
        dialog.close();
    });


});