/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!************************!*\
  !*** ./src/content.ts ***!
  \************************/

var _a;
const caiTools = document.querySelector(".cai_tools");
const cBody = document.querySelector(".cait-body");
const outerCait = document.querySelector(".cai_tools-cont");
const mutation = new MutationObserver((entries) => {
    console.log(entries);
});
mutation.observe(outerCait, { attributeFilter: ["class"], attributes: true });
const head = document.createElement("h6");
const list = document.createElement("ul");
head.innerText = "Addon";
const hookBtn = document.createElement("li");
const cohereBtn = document.createElement("li");
const sumBtn = document.createElement("li");
const hookModal = document.createElement("div");
hookBtn.innerText = "Webhook";
cohereBtn.innerText = "Cohere";
sumBtn.innerText = "Summarize";
hookModal.classList.add("cait_addons");
hookModal.dataset["tool"] = "cai_tools";
hookModal.innerHTML = `
<div class="">
    <div class="cait_addons-header">
        <h4>Webhook Settings</h4><span onclick="closeHookModal()" class="x-svg"></span>
    </div>
    <div class="cait_addons-body">
        
    </div>
</div>`;
hookBtn.addEventListener("click", openHookModal);
(_a = hookModal.querySelector(".x-svg")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", closeHookModal);
list.append(hookBtn, cohereBtn, sumBtn);
cBody === null || cBody === void 0 ? void 0 : cBody.append(head, list);
document.body.append(hookModal);
function closeHookModal() {
    hookModal.classList.remove("active");
}
function openHookModal() {
    closeTools();
    hookModal.classList.add("active");
}
function closeTools() {
    outerCait.classList.remove("active");
}

/******/ })()
;
//# sourceMappingURL=content.js.map