import { getHook, HOOK_KEY, saveHook, validateHook } from "./tools/webhook";
import { getToken, saveToken, validateToken } from "./tools/cohere";

const caiTools = <HTMLDivElement>document.querySelector(".cai_tools");
const cBody = <HTMLDivElement>document.querySelector(".cait-body");
const outerCait = <HTMLDivElement>document.querySelector(".cai_tools-cont");

async function main() {
    const head = document.createElement("h6");
    const list = document.createElement("ul");
    head.innerText = "Addon";

    const hookBtn = document.createElement("li");
    const cohereBtn = document.createElement("li");
    const sumBtn = document.createElement("li");
    const hookModal = document.createElement("div");
    const cohereModal = document.createElement("div");
    const summaryModal = document.createElement("div");

    hookBtn.innerText = "Webhook";
    cohereBtn.innerText = "Cohere";
    sumBtn.innerText = "Summarize";

    hookModal.classList.add("cait_addons");
    hookModal.dataset["tool"] = "cai_tools";
    hookModal.innerHTML = `
<div class="cait_addons-cont">
    <div class="cait_addons-header">
        <h3>Webhook Settings</h3><span class="x-svg"></span>
    </div>
    <div class="cait_addons-body" style="display: flex;gap:.5rem;flex-direction:column;">
    </div>
    <div style="justify-content: center;" class="cait_addons-footer">
        <button id="caitHookSave" style="background-color: var(--btn-primary);" class="btn">Save</button>
    </div>
</div>`;

    hookBtn.addEventListener("click", openHookModal);
    hookModal.querySelector(".x-svg")?.addEventListener("click", closeHookModal);
    hookModal.addEventListener("click", (e) => e.target == hookModal && closeHookModal());
    hookModal.querySelector("#caitHookSave")?.addEventListener("click", async (e) => {
        let input = <HTMLTextAreaElement>hookModal.querySelector("#caitHookInput");
        saveHook(input.value);
        closeHookModal();
    });

    list.append(hookBtn, cohereBtn, sumBtn);
    cBody?.append(head, list);
    document.body.append(hookModal);

    function closeHookModal() {
        hookModal.classList.remove("active");
    }

    async function openHookModal() {
        closeTools();
        hookModal.classList.add("active");
        let hookBody = hookModal.querySelector(".cait_addons-body");
        if (!hookBody) return;
        hookBody.innerHTML = `
        <label for="caitHookInput">Webhook URL</label>
        <textarea id="caitHookInput" class="text-input" data-cait="hookInput" style="width:100%;resize:vertical;" row="5">${getHook()}</textarea>
        <div style="${(await validateHook()) ? "display:none;" : ""} color: var(--btn-danger);">Invalid webhook, please enter a valid discord webhook url</div>
        
`;
    }

    cohereModal.classList.add("cait_addons");
    cohereModal.dataset["tool"] = "cai_tools";
    cohereModal.innerHTML = `
<div class="cait_addons-cont">
    <div class="cait_addons-header">
        <h3>Cohere Settings</h3><span class="x-svg"></span>
    </div>
    <div class="cait_addons-body" style="display: flex;gap:.5rem;flex-direction:column;">
    </div>
    <div style="justify-content: center;" class="cait_addons-footer">
        <button id="caitCohereSave" style="background-color: var(--btn-primary);" class="btn">Save</button>
    </div>
</div>`;

    cohereBtn.addEventListener("click", openCohereModal);
    cohereModal.querySelector(".x-svg")?.addEventListener("click", closeCohereModal);
    cohereModal.addEventListener("click", (e) => e.target == cohereModal && closeCohereModal());
    cohereModal.querySelector("#caitCohereSave")?.addEventListener("click", async (e) => {
        let input = <HTMLTextAreaElement>cohereModal.querySelector("#caitCohereInput");
        let isValid = await validateToken(input.value);
        if (!isValid) return alert("Invalid cohere token. try again.");
        saveToken(input.value);
        closeCohereModal();
    });

    document.body.append(cohereModal);
    function closeCohereModal() {
        cohereModal.classList.remove("active");
    }

    async function openCohereModal() {
        closeTools();
        cohereModal.classList.add("active");
        let hookBody = cohereModal.querySelector(".cait_addons-body");
        if (!hookBody) return;
        hookBody.innerHTML = `
        <label for="caitHookInput">Cohere API Key</label>
        <textarea id="caitCohereInput" class="text-input" data-cait="cohereInput" style="width:100%;resize:vertical;" row="5">${getToken()}</textarea>
        <div style="${(await validateToken()) ? "display:none;" : ""} color: var(--btn-danger);">Invalid cohere ai TOKEN</div>
        
`;
    }

    function closeTools() {
        outerCait.classList.remove("active");
    }
}

main();
