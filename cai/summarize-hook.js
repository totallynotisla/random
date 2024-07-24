(async () => {
    const COHERE_KEY = "cohere-token";
    const HOOK_KEY = "webhook-url";
    const MAX_PARTS = 3;

    let token = localStorage.getItem(COHERE_KEY);
    let headers = {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
    };

    if (!token || !(await (await fetch("https://api.cohere.ai/v1/check-api-key", { headers, method: "POST" })).json()).valid) {
        console.error("Invalid API key");
        console.log("Please enter a valid API key and run the script again");
        let key = window.prompt("Enter API key");
        return localStorage.setItem(COHERE_KEY, key);
    }

    let regex = /^(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])$/gi;
    let hook = localStorage.getItem(HOOK_KEY);
    if (!regex.test(hook) || new URL(hook).hostname != "discord.com" || !(await fetch(hook)).ok) {
        console.error("Invalid webhook key");
        console.log("Please enter a valid Webhook url and run the script again");
        let key = window.prompt("Enter Webhook URL");
        return localStorage.setItem(HOOK_KEY, key);
    }

    let history = await promptHistory();
    console.log("Please wait...");
    if (history.length < 100) return console.log("Too short");

    await generateSummary(history, (text, index) => sendWebhook(text, { index: index, multiples: !!index }), { parts: window.confirm(`Multiple Parts? (max ${MAX_PARTS})`) ? 1 : null });

    async function generateSummary(text, callback, { parts, history = [] } = {}) {
        const MAX_TOKEN = 4090;
        let percentage = Math.floor((1 / MAX_PARTS) * 100);
        let templateSummary = `Summarize the ${
            !parts ? "" : parts == 1 ? `first ${percentage}% of the` : `next ${percentage}% of the`
        } story from this document, don't make anything up. Only use fact provided by the story. Use third person perspective, Make it into multiple paragraphs. Don't use more than characters including whitespaces. Anything inside * or () is OOC, Out of character. Means, the character didnt actually say it.\nFor example *smile* means the character is smiling:`;
        let preamble = "You are an ordinary man. you happened to like an interesting story\n\nYou got a job to summarize a story with the provided requirements without any questions";

        console.log("Request to cohere ai");
        let docs = [
            {
                title: "Story",
                text,
            },
        ];
        let summary = await (
            await fetch("https://api.cohere.ai/v1/chat", {
                body: JSON.stringify({
                    preamble,
                    chat_history: history,
                    documents: docs,
                    max_tokens: MAX_TOKEN,
                    temperature: 0.2,
                    message: `${templateSummary}`,
                }),
                method: "POST",
                headers,
            })
        ).json();

        callback(summary.text, parts);
        if (parts == null || parts == 0 || parts >= MAX_PARTS) return;
        return await generateSummary(text, callback, { parts: parts + 1, history: summary.chat_history });
    }

    async function sendWebhook(msg, { multiples = false, index = 0, max = MAX_PARTS } = {}) {
        let webhookPayload = new FormData();
        const blob = new Blob([msg], { type: "text/plain" });

        webhookPayload.append(
            "payload_json",
            JSON.stringify({
                embeds: [
                    {
                        title: `Chat Summary`,
                        color: 0x98ffbe,
                        author: { name: multiples ? `Part (${index}/${max})` : "" },
                        description: msg.slice(0, 4090),
                        footer: {
                            text: "Cohere AI",
                            icon_url: "https://raw.githubusercontent.com/mangadi3859/random/main/cai/images/cohere.png",
                        },
                        timestamp: new Date().toISOString(),
                    },
                ],
                username: "Summary",
            })
        );

        webhookPayload.append("file[0]", blob, `summary${multiples ? `-part-${index}` : ""}.txt`);
        await fetch(hook, {
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
    }

    function promptHistory() {
        return new Promise((resolve, reject) => {
            document.querySelectorAll("[data-spopup]").forEach((e) => e.remove());
            let popup = document.createElement("form");
            let input = document.createElement("textarea");
            let submitBtn = document.createElement("button");
            let cancelBtn = document.createElement("button");
            let title = document.createElement("h1");
            title.innerHTML = "Paste you C.AI history here";
            submitBtn.innerHTML = "Send";
            submitBtn.type = "submit";
            cancelBtn.innerHTML = "Cancel";
            cancelBtn.type = "reset";
            popup.dataset.spopup = "";

            title.style.textAlign = "center";
            title.style.fontWeight = "bold";
            title.style.fontSize = "1.3rem";

            popup.style.display = "flex";
            popup.style.flexDirection = "column";
            popup.style.padding = "1rem";
            popup.style.zIndex = "100";
            popup.style.gap = ".5rem";
            popup.style.position = "fixed";
            popup.style.left = "50%";
            popup.style.top = "50%";
            popup.style.transform = "translate(-50%, -50%)";
            popup.style.minWidth = "25rem";
            popup.style.borderRadius = ".5rem";
            popup.style.border = "2px solid white";
            popup.style.backgroundColor = "#1f1f1f";

            input.style.width = "100%";
            input.style.padding = "1rem";
            input.rows = 6;

            submitBtn.style.width = "100%";
            submitBtn.style.padding = "0.5rem 1rem";
            submitBtn.style.borderRadius = ".25rem";
            submitBtn.style.border = "1px solid white";

            cancelBtn.style.width = "100%";
            cancelBtn.style.padding = "0.5rem 1rem";
            cancelBtn.style.borderRadius = ".25rem";
            cancelBtn.style.border = "1px solid white";

            popup.append(title, input, submitBtn, cancelBtn);
            popup.addEventListener(
                "submit",
                (e) => {
                    e.preventDefault();
                    popup.remove();
                    resolve(input.value);
                },
                { once: true }
            );
            popup.addEventListener(
                "reset",
                (e) => {
                    popup.remove();
                    reject("Cancelled");
                },
                { once: true }
            );

            document.body.appendChild(popup);
            console.log("Come back to the c.ai page");
            window.addEventListener("focus", () => input.focus(), {
                once: true,
            });
        });
    }
})();
