() => {
    (this.wsRetryAttemps = 0),
        this.onChatEventCallback(E.qN.websocket_status, { status: E.$3.open }),
        this.sendQueue.forEach((e) => {
            this.sendInternal(e);
        }),
        (this.sendQueue = []);
    let e = (0, eu.YW)();
    e > 0 &&
        (this.heartbeatInterval = setInterval(() => {
            this.sendInternal({ command: H.OY.ping });
        }, e));
};

/**
 * TODO: Implement this on chrome extension
 */
(() => {
    "use-strict";
    const sockets = [];
    const openEvents = [];
    const nativeWebSocket = window.WebSocket;
    window.WebSocket = class extends nativeWebSocket {
        constructor(...args) {
            super(...args);
            sockets.push(this);
        }

        addEventListener(...args) {
            openEvents.push(args);
            super.addEventListener(...args);
        }
    };

    window._sockets = sockets;
    window._openEvents = openEvents;

    window._sockets[0].addEventListener("message", (e) => console.log(JSON.parse(e.data)));
})();

(e, t) => {
    if (l.current[e]) for (let s in l.current[e]) l.current[e][s] && l.current[e][s](e, t);
};
