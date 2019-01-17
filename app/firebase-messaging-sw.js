importScripts('https://www.gstatic.com/firebasejs/4.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.10.1/firebase-messaging.js');

// TODO: fill in messaging sender id
firebase.initializeApp({
    'messagingSenderId': '618087357750'
});

const messaging = firebase.messaging();

// Installs service worker
self.addEventListener('install', (event) => {
    console.log('Service worker installed');
});

self.addEventListener('notificationclick', (event) => {
    // Event actions derived from event.notification.data from data received
    var eventURL = event.notification.data;
    console.log(eventURL);
    event.notification.close();
    if (event.action === 'ok') {
        clients.openWindow(eventURL.ok);
    } else {
        clients.openWindow(eventURL.cancel);
    }
}, false);

messaging.setBackgroundMessageHandler((payload) => {
    // Parses data received and sets accordingly
    const data = JSON.parse(payload.data.notification);
    const notificationTitle = data.title;
    const notificationOptions = {
        body: data.body,
        icon: 'https://avatars1.githubusercontent.com/u/4492981',
        actions: [
            {action: 'ok', title: '👍 Sim'},
            {action: 'cancel', title: '👎 Não'}

        ],
        // For additional data to be sent to event listeners, needs to be set in this data {}
        data: {ok: data.actions.ok, cancel: data.actions.cancel}
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});
