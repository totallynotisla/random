(async () => {
    const regexID = new RegExp(/(?<=^(https?:\/\/|www\.)?nhentai\.net\/g\/)(\d+)(?=\/$)?/, "i");
    const code = window.location.href.match(regexID);

    if (!code) {
        console.log("It must be on /g/:id path");
        return;
    }

    //Import jspdf
    if (!("jsPDF" in window)) {
        eval(await (await fetch("https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js")).text());
    }

    const CORS_KEY = "jc-url";

    let cors = localStorage.getItem(CORS_KEY);
    let regex = /^(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])$/gi;

    try {
        (await fetch(cors).catch(() => null)).status;
    } catch (err) {
        console.error("Invalid Justcors url");
        console.log("Please enter a valid JustCors url and run the script again");
        console.log("https://justcors.com");
        let key = window.prompt("Enter JustCors URL");
        return localStorage.setItem(CORS_KEY, key);
    }

    if (!regex.test(cors) || new URL(cors).hostname != "justcors.com") {
        console.error("Invalid Justcors url");
        console.log("Please enter a valid JustCors url and run the script again");
        console.log("https://justcors.com");
        let key = window.prompt("Enter JustCors URL");
        return localStorage.setItem(CORS_KEY, key);
    }

    let gallery = await (await fetch(`https://nhentai.net/api/gallery/${code[0]}`)).json();
    let doc = new jsPDF({
        unit: "px",
        format: [gallery.images.pages[0].w, gallery.images.pages[0].h],
    });

    for (let i = 1; i < gallery.images.pages.length; i++) {
        doc.addPage([gallery.images.pages[0].w, gallery.images.pages[0].h], "p");
    }

    let completion = 0;
    let images = await queue(gallery.images.pages, async (image, i) => {
        let img = await (
            await fetch(`${cors}https://i3.nhentai.net/galleries/${gallery.media_id}/${i + 1}.${image.t == "j" ? "jpg" : "png"}`, {
                headers: {
                    accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                },
            })
        ).blob();

        toDataURI(img, (base64) => {
            if (i != 0) {
                doc.setPage(i + 1).addImage(base64, "jpeg", 0, 0, image.w, image.h, i, "FAST", 0);
            } else doc.setPage(i + 1).addImage(base64, "jpeg", 0, 0, image.w, image.h, i, "FAST", 0);

            completion++;
            tryToSave();
        });
        console.log(`Downloading page ${i}`);
    });

    function tryToSave() {
        if (completion < gallery.images.pages.length) return;
        let outpdf = doc.output("blob");
        let a = document.createElement("a");
        a.download = `[NHENTAI] ${gallery.title.english} - ${gallery.id}.pdf`;
        a.href = URL.createObjectURL(outpdf);
        a.dataset.downloadurl = ["file/pdf", a.download, a.href].join(":");
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(a.href), 60000);
    }

    function toDataURI(blob, cb) {
        let file = new FileReader();
        file.addEventListener(
            "load",
            (e) => {
                cb(e.target.result);
            },
            { once: true }
        );
        file.readAsDataURL(blob);
    }

    async function queue(arr, callback, chunk = 2) {
        let queues = [];
        let res = [];
        for (let i = 0; i < arr.length; i += chunk) {
            queues.push(arr.slice(i, Math.min(i + chunk, arr.length)));
        }

        for (let index = 0; index < queues.length; index++) {
            res = res.concat(await Promise.all(queues[index].map((e, i) => callback(e, i + chunk * index))));
        }

        return res;
    }
})();
