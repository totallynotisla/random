/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/tools/cohere.ts":
/*!*****************************!*\
  !*** ./src/tools/cohere.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   COHERE_KEY: () => (/* binding */ COHERE_KEY),
/* harmony export */   getToken: () => (/* binding */ getToken),
/* harmony export */   saveToken: () => (/* binding */ saveToken),
/* harmony export */   validateToken: () => (/* binding */ validateToken)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const COHERE_KEY = "cohere-token";
const getHeaders = () => ({
    Authorization: `bearer ${getToken()}`,
    "Content-Type": "application/json",
    Accept: "application/json",
});
function validateToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!token)
            token = localStorage.getItem(COHERE_KEY);
        if (!token)
            return false;
        if (!token || !(yield (yield fetch("https://api.cohere.ai/v1/check-api-key", { headers: Object.assign(Object.assign({}, getHeaders()), { Authorization: `bearer ${token}` }), method: "POST" })).json()).valid) {
            console.log("Invalid API key");
            console.log("Please enter a valid API key");
            return false;
        }
        return true;
    });
}
function saveToken(hook) {
    return __awaiter(this, void 0, void 0, function* () {
        return localStorage.setItem(COHERE_KEY, hook);
    });
}
function getToken() {
    return localStorage.getItem(COHERE_KEY);
}


/***/ }),

/***/ "./src/tools/webhook.ts":
/*!******************************!*\
  !*** ./src/tools/webhook.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HOOK_KEY: () => (/* binding */ HOOK_KEY),
/* harmony export */   getHook: () => (/* binding */ getHook),
/* harmony export */   saveHook: () => (/* binding */ saveHook),
/* harmony export */   sendSummaryData: () => (/* binding */ sendSummaryData),
/* harmony export */   validateHook: () => (/* binding */ validateHook)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const HOOK_KEY = "webhook-url";
function validateHook(hook) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!hook)
            hook = localStorage.getItem(HOOK_KEY);
        if (!hook)
            return false;
        let regex = /^(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])$/gi;
        if (!regex.test(hook) || new URL(hook).hostname != "discord.com" || !(yield fetch(hook)).ok) {
            console.log("Webhook url is invalid");
            return false;
        }
        return true;
    });
}
function saveHook(hook) {
    return __awaiter(this, void 0, void 0, function* () {
        return localStorage.setItem(HOOK_KEY, hook);
    });
}
function getHook() {
    return localStorage.getItem(HOOK_KEY);
}
function sendSummaryData(summaries, chatData) {
    return __awaiter(this, void 0, void 0, function* () {
        let webhookPayload = new FormData();
        const blob = new Blob([summaries.join("\n\n")], { type: "text/plain" });
        let hook = getHook();
        if (!hook)
            throw new Error("Invalid webhook url!");
        webhookPayload.append("payload_json", JSON.stringify({
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
        }));
        webhookPayload.append("file[0]", blob, "history.txt");
        let res = yield fetch(hook, {
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
    });
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!************************!*\
  !*** ./src/content.ts ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _tools_webhook__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tools/webhook */ "./src/tools/webhook.ts");
/* harmony import */ var _tools_cohere__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tools/cohere */ "./src/tools/cohere.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const caiTools = document.querySelector(".cai_tools");
const cBody = document.querySelector(".cait-body");
const outerCait = document.querySelector(".cai_tools-cont");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
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
        (_a = hookModal.querySelector(".x-svg")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", closeHookModal);
        hookModal.addEventListener("click", (e) => e.target == hookModal && closeHookModal());
        (_b = hookModal.querySelector("#caitHookSave")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
            let input = hookModal.querySelector("#caitHookInput");
            (0,_tools_webhook__WEBPACK_IMPORTED_MODULE_0__.saveHook)(input.value);
            closeHookModal();
        }));
        list.append(hookBtn, cohereBtn, sumBtn);
        cBody === null || cBody === void 0 ? void 0 : cBody.append(head, list);
        document.body.append(hookModal);
        function closeHookModal() {
            hookModal.classList.remove("active");
        }
        function openHookModal() {
            return __awaiter(this, void 0, void 0, function* () {
                closeTools();
                hookModal.classList.add("active");
                let hookBody = hookModal.querySelector(".cait_addons-body");
                if (!hookBody)
                    return;
                hookBody.innerHTML = `
        <label for="caitHookInput">Webhook URL</label>
        <textarea id="caitHookInput" class="text-input" data-cait="hookInput" style="width:100%;resize:vertical;" row="5">${(0,_tools_webhook__WEBPACK_IMPORTED_MODULE_0__.getHook)()}</textarea>
        <div style="${(yield (0,_tools_webhook__WEBPACK_IMPORTED_MODULE_0__.validateHook)()) ? "display:none;" : ""} color: var(--btn-danger);">Invalid webhook, please enter a valid discord webhook url</div>
        
`;
            });
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
        (_c = cohereModal.querySelector(".x-svg")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", closeCohereModal);
        cohereModal.addEventListener("click", (e) => e.target == cohereModal && closeCohereModal());
        (_d = cohereModal.querySelector("#caitCohereSave")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
            let input = cohereModal.querySelector("#caitCohereInput");
            let isValid = yield (0,_tools_cohere__WEBPACK_IMPORTED_MODULE_1__.validateToken)(input.value);
            if (!isValid)
                return alert("Invalid cohere token. try again.");
            (0,_tools_cohere__WEBPACK_IMPORTED_MODULE_1__.saveToken)(input.value);
            closeCohereModal();
        }));
        document.body.append(cohereModal);
        function closeCohereModal() {
            cohereModal.classList.remove("active");
        }
        function openCohereModal() {
            return __awaiter(this, void 0, void 0, function* () {
                closeTools();
                cohereModal.classList.add("active");
                let hookBody = cohereModal.querySelector(".cait_addons-body");
                if (!hookBody)
                    return;
                hookBody.innerHTML = `
        <label for="caitHookInput">Cohere API Key</label>
        <textarea id="caitCohereInput" class="text-input" data-cait="cohereInput" style="width:100%;resize:vertical;" row="5">${(0,_tools_cohere__WEBPACK_IMPORTED_MODULE_1__.getToken)()}</textarea>
        <div style="${(yield (0,_tools_cohere__WEBPACK_IMPORTED_MODULE_1__.validateToken)()) ? "display:none;" : ""} color: var(--btn-danger);">Invalid cohere ai TOKEN</div>
        
`;
            });
        }
        function closeTools() {
            outerCait.classList.remove("active");
        }
    });
}
main();

/******/ })()
;
//# sourceMappingURL=content.js.map