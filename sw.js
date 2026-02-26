// This script runs in the background
self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : { title: 'Trading Alert', body: 'Time for your session!' };
    
    const options = {
        body: data.body,
        icon: 'https://cdn-icons-png.flaticon.com/512/2972/2972531.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/2972/2972531.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '1'
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Logic for when the user clicks the notification
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('https://github.com/') // Opens your project or specific link
    );
});