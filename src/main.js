const characters = [
  { name: "Heidemarie", role: "Psionic", element: "Season 3", accent: "#54d7ff" },
  { name: "Sylvia", role: "Upcoming / Season 3", element: "Void", accent: "#b591ff" },
  { name: "Diana", role: "Vanguard", element: "Justice", accent: "#ffd166" },
  { name: "Rita", role: "Striker", element: "Passion", accent: "#ff6767" },
  { name: "Tiphera", role: "Vanguard", element: "Order", accent: "#7dffb2" },
  { name: "Nine", role: "Vanguard", element: "Instinct", accent: "#ff9f43" },
  { name: "Narja", role: "Hunter", element: "Void", accent: "#be7bff" },
  { name: "Sereniel", role: "Ranger", element: "Order", accent: "#8df4ff" },
  { name: "Chizuru", role: "Controller", element: "Justice", accent: "#ff7bd4" }
];

const tiers = Array.from({ length: 15 }, (_, index) => index + 1);
const state = {
  tier: 8,
  nightmare: false,
  season: "Season 3",
  character: characters[0].name,
  neutral: 2,
  forbidden: 0,
  monster: 0,
  epiphany: 1,
  divine: 0,
  conversions: 0,
  baseRemovals: 0,
  duplications: 0
};

const fields = [
  ["neutral", "Neutral Cards", 20],
  ["forbidden", "Forbidden Cards", 20],
  ["monster", "Monster Cards", 80],
  ["epiphany", "Epiphany", 10],
  ["divine", "Divine Epiphany", 20],
  ["conversions", "Conversions", 10],
  ["baseRemovals", "Base Removals", 20],
  ["duplications", "Duplications", "ladder"]
];

function capForTier(tier, nightmare) {
  return 20 + tier * 10 + (nightmare ? 10 : 0);
}

function ladderCost(count) {
  if (count <= 0) return 0;
  return Array.from({ length: count }, (_, index) => (index === 0 ? 0 : index * 20 - 10)).reduce(
    (sum, value) => sum + value,
    0
  );
}

function calculate() {
  const cards = state.neutral * 20 + state.forbidden * 20 + state.monster * 80;
  const upgrades = state.epiphany * 10 + state.divine * 20;
  const actions =
    state.conversions * 10 + state.baseRemovals * 20 + ladderCost(state.duplications);
  const used = cards + upgrades + actions;
  const cap = capForTier(state.tier, state.nightmare);
  return {
    cards,
    upgrades,
    actions,
    used,
    cap,
    remaining: cap - used,
    status: used <= cap ? "Stable Save Data" : "Overflow Risk"
  };
}

function setState(key, value) {
  state[key] = value;
  render();
}

function numberInput(key, label, hint) {
  return `
    <label class="control">
      <span>${label}</span>
      <small>${hint === "ladder" ? "0, 10, 30, 50..." : `${hint} pts each`}</small>
      <div class="stepper">
        <button type="button" data-step="${key}" data-delta="-1" aria-label="Decrease ${label}">-</button>
        <input inputmode="numeric" min="0" value="${state[key]}" data-input="${key}" aria-label="${label}" />
        <button type="button" data-step="${key}" data-delta="1" aria-label="Increase ${label}">+</button>
      </div>
    </label>
  `;
}

function render() {
  const selected = characters.find((character) => character.name === state.character) || characters[0];
  const result = calculate();
  const pct = Math.min((result.used / result.cap) * 100, 140);
  const app = document.querySelector("#app");

  app.innerHTML = `
    <main class="shell">
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">Chaos Zero Nightmare fan tool</p>
          <h1>CZN Save Data Lab</h1>
          <p class="lead">
            เครื่องคำนวณ Save Data แบบเร็ว พร้อมฉาก 3D เคลื่อนไหวสำหรับลองจัด deck budget,
            tier cap และ action cost จากข้อมูล community ล่าสุด.
          </p>
          <div class="hero-actions" aria-label="Quick stats">
            <span>Season: ${state.season}</span>
            <span>Tier ${state.tier}${state.nightmare ? " Nightmare" : ""}</span>
            <span>${selected.name}</span>
          </div>
        </div>

        <div class="stage" style="--accent:${selected.accent}">
          <div class="orbit orbit-one"></div>
          <div class="orbit orbit-two"></div>
          <div class="combatant">
            <div class="halo"></div>
            <div class="head"></div>
            <div class="body"></div>
            <div class="blade blade-left"></div>
            <div class="blade blade-right"></div>
          </div>
          <div class="card-fan">
            <span>20</span>
            <span>80</span>
            <span>EX</span>
          </div>
        </div>
      </section>

      <section class="workspace">
        <aside class="panel setup">
          <div class="panel-heading">
            <p>Build Setup</p>
            <strong>${result.status}</strong>
          </div>

          <label class="select-control">
            <span>Combatant</span>
            <select data-select="character">
              ${characters
                .map(
                  (character) =>
                    `<option value="${character.name}" ${
                      character.name === state.character ? "selected" : ""
                    }>${character.name} - ${character.role}</option>`
                )
                .join("")}
            </select>
          </label>

          <label class="select-control">
            <span>Season Buff</span>
            <select data-select="season">
              ${["No Season", "Season 1", "Season 2", "Season 3"]
                .map(
                  (season) =>
                    `<option value="${season}" ${season === state.season ? "selected" : ""}>${season}</option>`
                )
                .join("")}
            </select>
          </label>

          <div class="tier-grid" aria-label="Save Data tiers">
            ${tiers
              .map(
                (tier) => `
                <button type="button" class="${tier === state.tier ? "active" : ""}" data-tier="${tier}">
                  ${tier}
                </button>`
              )
              .join("")}
          </div>

          <label class="toggle">
            <input type="checkbox" data-toggle="nightmare" ${state.nightmare ? "checked" : ""} />
            <span>Nightmare / Deep Trauma +10 cap</span>
          </label>
        </aside>

        <section class="panel calculator">
          <div class="panel-heading">
            <p>Save Data Calculator</p>
            <strong>${result.used} / ${result.cap}</strong>
          </div>

          <div class="meter ${result.remaining < 0 ? "danger" : result.remaining <= 20 ? "warn" : ""}">
            <div style="width:${pct}%"></div>
          </div>

          <div class="score-row">
            <div><span>Used</span><strong>${result.used}</strong></div>
            <div><span>Cap</span><strong>${result.cap}</strong></div>
            <div><span>Remaining</span><strong>${result.remaining}</strong></div>
          </div>

          <div class="controls">
            ${fields.map(([key, label, hint]) => numberInput(key, label, hint)).join("")}
          </div>

          <button type="button" class="reset" data-reset>Reset Build</button>
        </section>

        <aside class="panel intel">
          <div class="panel-heading">
            <p>Latest Notes</p>
            <strong>May 2026</strong>
          </div>
          <div class="character-card" style="--accent:${selected.accent}">
            <span>${selected.element}</span>
            <h2>${selected.name}</h2>
            <p>${selected.role}</p>
          </div>
          <ul>
            <li>Global launch: October 22, 2025, mobile and PC.</li>
            <li>Community calculator v3.0.4 references Season 3 and Heidemarie.</li>
            <li>Guide data lists tier 1-15 caps from 30 to 170, Nightmare up to 180.</li>
            <li>Overflow may drop saved effects/cards or return removed cards.</li>
          </ul>
        </aside>
      </section>
    </main>
  `;

  bindEvents();
}

function bindEvents() {
  document.querySelectorAll("[data-step]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.step;
      const next = Math.max(0, Number(state[key]) + Number(button.dataset.delta));
      setState(key, next);
    });
  });

  document.querySelectorAll("[data-input]").forEach((input) => {
    input.addEventListener("input", () => {
      const key = input.dataset.input;
      state[key] = Math.max(0, Number(input.value.replace(/\D/g, "")) || 0);
      render();
    });
  });

  document.querySelectorAll("[data-tier]").forEach((button) => {
    button.addEventListener("click", () => setState("tier", Number(button.dataset.tier)));
  });

  document.querySelectorAll("[data-select]").forEach((select) => {
    select.addEventListener("change", () => setState(select.dataset.select, select.value));
  });

  document.querySelector("[data-toggle='nightmare']").addEventListener("change", (event) => {
    setState("nightmare", event.target.checked);
  });

  document.querySelector("[data-reset]").addEventListener("click", () => {
    Object.assign(state, {
      neutral: 0,
      forbidden: 0,
      monster: 0,
      epiphany: 0,
      divine: 0,
      conversions: 0,
      baseRemovals: 0,
      duplications: 0
    });
    render();
  });
}

render();
