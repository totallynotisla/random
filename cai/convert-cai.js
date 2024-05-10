(async () => {
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
    if (window.confirm("Save as txt file?")) {
        const blob = new Blob([res.join("\n\n")], { type: "text/plain" });
        const a = document.createElement("a");
        a.download = "history.txt";
        a.href = URL.createObjectURL(blob);
        a.dataset.downloadurl = ["text/plain", a.download, a.href].join(":");
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(a.href), 10000);
    }
    console.log(res.join("\n\n"));
})();
