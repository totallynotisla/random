(async () => {
    const HOOK_KEY = "webhook-url";
    let hook = localStorage.getItem(HOOK_KEY);

    if (!URL.canParse(hook) || new URL(hook).hostname != "discord.com" || !(await fetch(hook)).ok) {
        console.error("Invalid webhook key");
        console.log("Please enter a valid Webhook url and run the script again");
        let key = window.prompt("Enter Webhook URL");
        return localStorage.setItem(HOOK_KEY, key);
    }

    const limit = window.confirm("Take all messages?");
    const charID = window.location.pathname.match(/(?<=^\/chat\/).+$/)[0];
    const token = document.querySelector("[cai_token]").getAttribute("cai_token");
    const opt = {
        headers: {
            Authorization: token,
        },
    };

    const chatInfo = await (await fetch(`https://neo.character.ai/chats/recent/${charID}`, opt)).json();
    const chatID = chatInfo.chats[0].chat_id;
    const recentHistory = await (await fetch(`https://neo.character.ai/turns/${chatID}`, opt)).json();
    let res = recentHistory.turns.map((turn) => `[${turn.author.name}]\n<---- BEGIN ---->\n${turn.candidates[0].raw_content}\n<---- END ---->`);

    let nextToken = recentHistory.meta.next_token;
    while (limit && nextToken) {
        const history = await (await fetch(`https://neo.character.ai/turns/${chatID}?next_token=${nextToken}`, opt)).json();
        history.turns.forEach((turn) => {
            res.push(`[${turn.author.name}]\n<---- BEGIN ---->\n${turn.candidates[0].raw_content}\n<---- END ---->`);
        });
        nextToken = history.meta.next_token;
    }

    res = res.reverse().map((message) => message.replace(/(\[-\])\(#-\s\"Memory:\s.+\"\)/g, ""));
    let webhookPayload = new FormData();
    const blob = new Blob([res.join("\n\n")], { type: "text/plain" });

    webhookPayload.append(
        "payload_json",
        JSON.stringify({
            embeds: [
                {
                    title: `Chat history [${chatID}]`,
                    color: 0xae98ff,
                    author: {
                        name: chatInfo.chats[0].character_name,
                        icon_url: `https://characterai.io/i/80/static/avatars/${chatInfo.chats[0].character_avatar_uri}`,
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
    fetch(hook, {
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

    console.log("Completed");
})();
