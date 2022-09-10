import cheddarIcon from "../../assets/cheddar-icon.svg";

export function isPushNotificationSupported() {
  return "serviceWorker" in navigator && "PushManager" in window;
}

export function registerServiceWorker() {
  return navigator.serviceWorker.register("/sw.js");
}

export function isNotificationSupported() {
  return "Notification" in window;
}

export async function askUserPermission() {
  return await Notification.requestPermission().then((resp) =>
    console.log(resp)
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
