(function () {

    const CONFIG = [
        {
            id: "printer_on",
            url: "http://192.168.2.9:5455/printer/on",
            header: "",
            password: "",
            message: "Enter password to start the printer"
        },
        {
            id: "printer_force_off",
            url: "http://192.168.2.9:5455/printer/off",
            header: "",
            password: "",
            message: "Enter password to FORCE stop the printer"
        },
        {
            id: "server_on",
            url: "http://192.168.2.9:5454/start",
            header: "",
            password: "",
            message: "Enter password to start the server"
        },
        {
            id: "server_force_off",
            url: "http://192.168.2.9:5454/force_stop",
            header: "",
            password: "",
            message: "Enter password to FORCE stop the server"
        }
    ];
 // ---- Modal Creation ----------------------------------------------------

    function createModal() {
        if (document.getElementById("custom-modal")) return;

        const modal = document.createElement("div");
        modal.id = "custom-modal";
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.65);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            backdrop-filter: blur(3px);
        `;

        modal.innerHTML = `
            <div id="modal-box" style="
                background: #1e1e1e;
                padding: 26px 30px;
                border-radius: 14px;
                width: 340px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.7);
                font-family: sans-serif;
                text-align: center;
                color: #e5e5e5;
                border: 1px solid #333;
            ">
                <h2 id="modal-title" style="
                    margin: 0 0 16px;
                    font-size: 18px;
                    font-weight: 600;
                    color: #fafafa;
                "></h2>

                <input id="modal-password" 
                       type="password"
                       autocomplete="current-password"
                       style="
                           width: 100%;
                           padding: 10px;
                           border: 1px solid #555;
                           background: #111;
                           color: #f2f2f2;
                           border-radius: 6px;
                           font-size: 15px;
                           margin-bottom: 20px;
                           outline: none;
                       " />

                <div style="display: flex; gap: 12px; justify-content: center;">
                    <button id="modal-cancel" style="
                        flex: 1;
                        padding: 10px;
                        background: #333;
                        color: #ccc;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        transition: background 0.2s;
                    ">Cancel</button>

                    <button id="modal-ok" style="
                        flex: 1;
                        padding: 10px;
                        background: #2f7df6;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        transition: background 0.2s;
                    ">Go</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Hover styling
        const btnCancel = modal.querySelector("#modal-cancel");
        const btnOk = modal.querySelector("#modal-ok");

        btnCancel.onmouseenter = () => btnCancel.style.background = "#444";
        btnCancel.onmouseleave = () => btnCancel.style.background = "#333";

        btnOk.onmouseenter = () => btnOk.style.background = "#3b86ff";
        btnOk.onmouseleave = () => btnOk.style.background = "#2f7df6";
    }

    // ---- Modal logic --------------------------------------------------------

    function showModal(message, type) {
        return new Promise((resolve) => {
            const modal = document.getElementById("custom-modal");
            const title = document.getElementById("modal-title");
            const pw = document.getElementById("modal-password");
            const btnCancel = document.getElementById("modal-cancel");
            const btnOk = document.getElementById("modal-ok");

            if(type == "response"){
                btnCancel.style.display = "none"
                pw.style.display = "none"
                btnOk.innerHTML = "OK"
            }
            else {
                btnCancel.style.display = "block"
                pw.style.display = "block"
                btnOk.innerHTML = "Go"
            }

            title.textContent = message;
            pw.value = "";

            modal.style.display = "flex";
            pw.focus();

            btnCancel.onclick = () => {
                modal.style.display = "none";
                resolve(null);
            };

            btnOk.onclick = () => {
                const val = pw.value;
                modal.style.display = "none";
                resolve(val);
            };

            pw.onkeydown = (e) => {
                if (e.key === "Enter") {
                    btnOk.click();
                }
            };
        });
    }

    // ---- Action runner ------------------------------------------------------

    async function runAction(cfg) {
        var entered = await showModal(cfg.message);
        if (entered === null) return;
        // if cfg.password is empty, we just use entered
        // if cfg.password exists, use cfg.header (if password was entered correctly)
        if (cfg.password !== "") {
            if (entered !== cfg.password) {
                showModal("Incorrect password");
                return;
            }
            else {
                entered = cfg.header
            }
        }
        try {
            const response = await fetch(cfg.url, {
                method: "POST",
                headers: { "X-Auth-Token": entered }
            });

            if (response.ok) {
                showModal("Success.", "response");
            } else {
                showModal("Failed: " + response.status, "response");
            }

        } catch (err) {
            console.error(err);
            showModal("Connection error", "response");
        }
    }

    // ---- Attach to DOM ------------------------------------------------------

    function patchOne(cfg) {
        const li = document.getElementById(cfg.id);
        if (!li) return;

        const a = li.querySelector("a");
        if (!a || a.dataset.patched === "1") return;

        a.removeAttribute("href");
        a.style.cursor = "pointer";
        a.dataset.patched = "1";

        a.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            runAction(cfg);
        });
    }

    function applyAll() {
        CONFIG.forEach(cfg => patchOne(cfg));
    }

    // ---- Init ---------------------------------------------------------------

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            createModal();
            applyAll();
        });
    } else {
        createModal();
        applyAll();
    }

    new MutationObserver(() => applyAll())
        .observe(document.documentElement, { childList: true, subtree: true });

})();
