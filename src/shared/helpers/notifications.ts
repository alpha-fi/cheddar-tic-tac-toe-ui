import cheddarIcon from "../../assets/cheddar-icon.svg";

export function isPushNotificationSupported() {
  return "serviceWorker" in navigator && "PushManager" in window;
}

export async function registerServiceWorker() {
  return navigator.serviceWorker
    .register("/sw.js")
    .then((registration) => {
      let serviceWorker;
      if (registration.installing) {
        serviceWorker = registration.installing;
      } else if (registration.waiting) {
        serviceWorker = registration.waiting;
      } else if (registration.active) {
        serviceWorker = registration.active;
      }
      if (serviceWorker) {
        console.log(`SW: ${serviceWorker.state}`);
        serviceWorker.addEventListener("statechange", (e) => {
          console.log(e.target);
        });
      }
    })
    .catch((error) => {
      console.log("Something went wrong during service worker registration.");
    });
}

export function isNotificationSupported() {
  return "Notification" in window;
}

export async function askUserPermission() {
  return await Notification.requestPermission().then((resp) =>
    console.log("Notification Permission: " + resp)
  );
}

export function hasUserPermission() {
  return Notification.permission === "granted";
}

export function addNotification(msg: string) {
  new Notification("Cheddar TicTacToe", {
    body: msg,
    icon: cheddarIcon,
    vibrate: [200, 100, 200],
    tag: "new-product",
    badge: cheddarIcon,
    requireInteraction: true,
  }).addEventListener("click", () => window.focus());
}

export function addSWNotification(msg: string) {
  // on Mac notifications doesn't work, thus showing alert
  var isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  if (isMac) {
    alert(msg);
  } else {
    if (hasUserPermission()) {
      navigator.serviceWorker.getRegistration().then((sw) => {
        if (sw) {
          sw.showNotification("Cheddar TicTacToe", {
            body: msg,
            icon: cheddarIcon,
            vibrate: [200, 100, 200],
            tag: "new-product",
            badge: cheddarIcon,
            requireInteraction: true,
            //actions: [{ action: "open", title: "Open", icon: cheddarIcon }],
          });
        }
      });
    }
  }
}
