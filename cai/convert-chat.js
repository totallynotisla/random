(async function () {
    let limit = window.confirm("Take the last 100 messages?");
    let res = "";
    let chats = Array.from(document.querySelectorAll(".chat_content-wrap"));
    chats.slice(limit ? Math.max(chats.length - 100, 0) : 0, chats.length).forEach((e) => {
        let author = e.querySelector("h5");
        let chat = e.querySelector(".message-wrap");
        let node = chat.cloneNode(true);
        let x = document.createElement("div").appendChild(node);
        x.querySelectorAll("span.italic").forEach((el) => el.replaceWith(`*${el.innerText}*`));
        x.querySelectorAll("span.bold").forEach((el) => el.replaceWith(`**${el.innerText}**`));
        x.querySelectorAll("span.bold-italic").forEach((el) => el.replaceWith(`***${el.innerText}***`));
        x.querySelectorAll("br").forEach((el) => el.replaceWith("!enter!"));
        res += `${author.innerText}:\n${x.innerText.trim()}\n\n`;
    });
    res = res.replace(/(\!enter\!)/gi, "\n");
    console.log("Get back to the history chat");
    let blob = new Blob([res], { type: "text/txt" });
    let a = document.createElement("a");
    a.download = "history.txt";
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = ["text/txt", a.download, a.href].join(":");
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(a.href), 10000);
    console.log(res);
})();
