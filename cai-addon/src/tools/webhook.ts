import { Chats } from "./cai";

export const HOOK_KEY = "webhook-url";

export async function validateHook(hook?: string): Promise<boolean> {
    if (!hook) hook = <string | undefined>localStorage.getItem(HOOK_KEY);
    if (!hook) return false;

    let regex = /^(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])$/gi;
    if (!regex.test(hook) || new URL(hook).hostname != "discord.com" || !(await fetch(hook)).ok) {
        console.log("Webhook url is invalid");
        return false;
    }

    return true;
}

export async function saveHook(hook: string): Promise<void> {
    return localStorage.setItem(HOOK_KEY, hook);
}

export function getHook() {
    return localStorage.getItem(HOOK_KEY);
}

export async function sendSummaryData(summaries: string[], chatData: Chats) {
    let webhookPayload = new FormData();
    const blob = new Blob([summaries.join("\n\n")], { type: "text/plain" });
    let hook = getHook();
    if (!hook) throw new Error("Invalid webhook url!");

    webhookPayload.append(
        "payload_json",
        JSON.stringify({
            embeds: [
                {
                    title: `Chat history [${chatData.chats[0].chat_id}]`,
                    color: 0xae98ff,
                    author: {
                        name: chatData.chats[0].character_name,
                        icon_url: `https://characterai.io/i/80/static/avatars/${chatData.chats[0].character_avatar_uri}`,
                    },
                    footer: {
                        text: "Character AI",
                        icon_url: "https://raw.githubusercontent.com/mangadi3859/random/main/cai/images/cai.jpeg",
                    },
                    timestamp: new Date().toISOString(),
                },
            ],
            username: "History",
        })
    );

    webhookPayload.append("file[0]", blob, "history.txt");
    let res = await fetch(hook, {
        headers: {
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
        },
        referrer: "https://discohook.org/",
        referrerPolicy: "strict-origin",
        body: webhookPayload,
        method: "POST",
        mode: "cors",
        credentials: "omit",
    });

    return res;
}
