(async (token) => {
    let history = await promptHistory();
    if (history.length < 100) return console.log("Too short");
    let templateSummary = `Summarize this story, dont make anything up. Only use fact provided by the story. Use third person perspective, Make it into multiple paragraphs. Anything inside * or () is OOC, Out of character. Means, the character didnt actually say it.\nFor example *smile* means the character is smiling:`;
    let preamble = "You are ordinary man you happened to like interesting story\n\nYou got a job to summarize a story with the provided requirements without any questions";

    let summary = await (
        await fetch("https://api.cohere.ai/v1/chat", {
            body: JSON.stringify({
                preamble,
                temperature: 0.2,
                message: `${templateSummary}\n\n${history}`,
            }),
            method: "POST",
            headers: {
                Authorization: `bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
    ).json();

    console.log(summary.text);
    console.log("Come back to c.ai to copy the summary");
    window.addEventListener(
        "focus",
        () => {
            navigator.clipboard.writeText(summary.text).then(() => console.log("copied"));
        },
        { once: true }
    );

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
})(localStorage.getItem("cohere-token"));
