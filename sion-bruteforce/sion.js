// ["https://sion.stikom-bali.ac.id/kuesionerform/TI212307/BA244/II/1/2024"].forEach(async (c) => {

//COPY ke DEV CONSOLE SION

Array.from(document.querySelectorAll("#demo-foo-addrow .btn"))
    .map((e) => e.href)
    .forEach(async (c) => {
        const htmlForm = await (await fetch(c)).text();

        const $form = $(htmlForm);

        const arr = $form
            .find("form table#demo-foo-addrow tbody tr:has(td input)")
            .map((_, row) => {
                const input = $(row).find("input").attr("name");
                return input;
            })
            .get();

        const hidden = $form
            .find("form input[type=hidden]")
            .map((_, el) => [[el.name, el.value]])
            .get();

        const komentar = $form
            .find("form table textarea[name^=komentar]")
            //Ini itu komen saran
            .map((_, el) => [[el.name, "Yaya saya setuju"]])
            .get();

        const xform = new URLSearchParams();
        hidden.forEach(([k, v]) => xform.append(k, v));
        komentar.forEach(([k, v]) => xform.append(k, v));

        //2 itu rating
        arr.forEach((name) => xform.append(name, "2"));

        console.log(xform.toString());
        // console.log(komentar);
        // console.log(hidden);

        await fetch("https://sion.stikom-bali.ac.id/kuesioneract", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: xform.toString(),
        });
    });
