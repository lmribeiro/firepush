// Initialises firebase

var config = {
    apiKey: "AIzaSyDSVbwKA3kcF5Omjz8N7G6qJ97JqKcXLx0",
    authDomain: "push-demo-52a39.firebaseapp.com",
    databaseURL: "https://push-demo-52a39.firebaseio.com",
    projectId: "push-demo-52a39",
    storageBucket: "push-demo-52a39.appspot.com",
    messagingSenderId: "618087357750"
};

firebase.initializeApp(config);
var messaging = firebase.messaging();
var database = firebase.database();

// On load register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/firebase-messaging-sw.js').then((registration) => {
            // Successfully registers service worker
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
            console.log(registration);
        })
                .then(() => {
                    // Requests user browser permission
                    return messaging.requestPermission();
                })
                .then(() => {
                    // Gets token
                    return messaging.getToken();
                })
                .then((token) => {
                    writeUserData(makeid(), getBrowser(), token);
                    console.log(token);
                    $('body').css({'background': '#2ECC40'});
                    $('h1').text('OK');
                    $('h2').text(token);

                })
                .catch((err) => {
                    console.log('ServiceWorker registrationw failed: ', err);
                    $('body').css({'background': '#FF4136'});
                    $('h1').text('Error');
                    $('h2').text('ServiceWorker registration failed: ' + err);
                });
    });

    function writeUserData(id, browser, token) {
        firebase.database().ref('users/' + id).set({
            token: token,
            client: browser,
            created_at: new Date().toDateString()
        }, function (error) {
            if (error) {
                console.log(error);
            } else {
                console.log('ok');
            }
        });
    }

    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    function getBrowser() {
        return  navigator ? navigator.userAgent.toLowerCase() : "other";
    }

}
