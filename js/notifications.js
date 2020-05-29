
function requestNotificationPermission() {
    Notification.requestPermission().then((response) => {
        console.log(response);
    });
}

function createNotification() {
    const icon = 'images/apple-icon.png';
    
    const notification = new Notification('INnsta', { body: Text, icon: icon });

    notification.addEventListener('click', (event) => {
        window.open('https://localhost:443/');
    });
}

export { requestNotificationPermission, createNotification }