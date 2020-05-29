
//Public Key:
//BJryqSywWgjuhkfZk3x5Q9YySuvneR-6th7R_AyInaIpXFy1hinIANfocJyB_GZvUzjiFlbAMexHvjHgbiKpLC4
//Private Key:
//qTeqQ8it1RxNxGjid_hYJ9KR-twJ33q0ORGud3KP34s



export default () => {
    let servicew;
    //Generate on server with node push
    const publicKey = 'BJryqSywWgjuhkfZk3x5Q9YySuvneR-6th7R_AyInaIpXFy1hinIANfocJyB_GZvUzjiFlbAMexHvjHgbiKpLC4';

    if ('serviceWorker' in navigator && 'PushManager' in window) {
        //Hämta våran service worker och sedan kolla om vi redan har en subscription
        navigator.serviceWorker.ready.then((SW) => {
            servicew = SW;
            SW.pushManager.getSubscription().then((subscription) => {
                console.log('Is subscribed: ', subscription);
            });
        });
    }

    const urlB64ToUint8Array = (base64String) => {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
        const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
        const rawData = atob(base64)
        const outputArray = new Uint8Array(rawData.length)

        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i)
        }

        return outputArray
    }

    // Sends our enpoint to use on the server Skickar 
    async function saveSubscription(subscription) {
        const url = 'http://localhost:3000/notifications/save';

        const response = await fetch(url, { 
            method: 'POST', 
            body: JSON.stringify(subscription), 
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
    }

    document.querySelector('#test').addEventListener('click', (event) => {
        event.srcElement.disabled = true;

        // get the subscriptions /unsubscribed
        //our subscription
        servicew.pushManager.getSubscription().then(async (subscription) => {
            if (subscription) {
                subscription.unsubscribe(); //Sluta prenumerera på push notiser
                event.srcElement.disabled = false;
            } else {
                try {
                    //Börja prenumerera på push notiser och returnerar en subscription med en endpoint 
                    //som vi sparar på servern
                    const subscribed = await servicew.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlB64ToUint8Array(publicKey)
                    });
                    saveSubscription(subscribed);
                    console.log(subscribed);
                    event.srcElement.disabled = false;
                } catch (error) {
                    
                }
            }
        });
    });

}