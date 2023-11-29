function handleNotification(event) {
  console.log(event);
  console.log("Notification click Received.", event.notification.data);
  event.notification.close();
  if (event.action === "open") {
    event.waitUntil(
      clients.openWindow("https://tic-tac-toe-omega-pearl.vercel.app/")
    );
  }
}
self.addEventListener("notificationclick", handleNotification);
