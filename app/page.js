"use client";

import { useMemo, useState } from "react";

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

const initialBuild = {
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

function calculate(build) {
  const cards = build.neutral * 20 + build.forbidden * 20 + build.monster * 80;
  const upgrades = build.epiphany * 10 + build.divine * 20;
  const actions = build.conversions * 10 + build.baseRemovals * 20 + ladderCost(build.duplications);
  const used = cards + upgrades + actions;
  const cap = capForTier(build.tier, build.nightmare);

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

export default function Home() {
  const [build, setBuild] = useState(initialBuild);
  const selected = characters.find((character) => character.name === build.character) || characters[0];
  const result = useMemo(() => calculate(build), [build]);
  const pct = Math.min((result.used / result.cap) * 100, 140);

  const update = (key, value) => {
    setBuild((current) => ({ ...current, [key]: value }));
  };

  const updateNumber = (key, value) => {
    update(key, Math.max(0, Number(value) || 0));
  };

  return (
    <main className="shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Chaos Zero Nightmare fan tool</p>
          <h1>CZN Save Data Lab</h1>
          <p className="lead">
            เครื่องคำนวณ Save Data แบบเร็ว พร้อมฉาก 3D เคลื่อนไหวสำหรับลองจัด deck budget,
            tier cap และ action cost จากข้อมูล community ล่าสุด.
          </p>
          <div className="hero-actions" aria-label="Quick stats">
            <span>Season: {build.season}</span>
            <span>
              Tier {build.tier}
              {build.nightmare ? " Nightmare" : ""}
            </span>
            <span>{selected.name}</span>
          </div>
        </div>

        <div className="stage" style={{ "--accent": selected.accent }}>
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="combatant">
            <div className="halo" />
            <div className="head" />
            <div className="body" />
            <div className="blade blade-left" />
            <div className="blade blade-right" />
          </div>
          <div className="card-fan">
            <span>20</span>
            <span>80</span>
            <span>EX</span>
          </div>
        </div>
      </section>

      <section className="workspace">
        <aside className="panel setup">
          <div className="panel-heading">
            <p>Build Setup</p>
            <strong>{result.status}</strong>
          </div>

          <label className="select-control">
            <span>Combatant</span>
            <select value={build.character} onChange={(event) => update("character", event.target.value)}>
              {characters.map((character) => (
                <option value={character.name} key={character.name}>
                  {character.name} - {character.role}
                </option>
              ))}
            </select>
          </label>

          <label className="select-control">
            <span>Season Buff</span>
            <select value={build.season} onChange={(event) => update("season", event.target.value)}>
              {["No Season", "Season 1", "Season 2", "Season 3"].map((season) => (
                <option value={season} key={season}>
                  {season}
                </option>
              ))}
            </select>
          </label>

          <div className="tier-grid" aria-label="Save Data tiers">
            {tiers.map((tier) => (
              <button
                className={tier === build.tier ? "active" : ""}
                key={tier}
                onClick={() => update("tier", tier)}
                type="button"
              >
                {tier}
              </button>
            ))}
          </div>

          <label className="toggle">
            <input
              checked={build.nightmare}
              onChange={(event) => update("nightmare", event.target.checked)}
              type="checkbox"
            />
            <span>Nightmare / Deep Trauma +10 cap</span>
          </label>
        </aside>

        <section className="panel calculator">
          <div className="panel-heading">
            <p>Save Data Calculator</p>
            <strong>
              {result.used} / {result.cap}
            </strong>
          </div>

          <div className={`meter ${result.remaining < 0 ? "danger" : result.remaining <= 20 ? "warn" : ""}`}>
            <div style={{ width: `${pct}%` }} />
          </div>

          <div className="score-row">
            <div>
              <span>Used</span>
              <strong>{result.used}</strong>
            </div>
            <div>
              <span>Cap</span>
              <strong>{result.cap}</strong>
            </div>
            <div>
              <span>Remaining</span>
              <strong>{result.remaining}</strong>
            </div>
          </div>

          <div className="controls">
            {fields.map(([key, label, hint]) => (
              <label className="control" key={key}>
                <span>{label}</span>
                <small>{hint === "ladder" ? "0, 10, 30, 50..." : `${hint} pts each`}</small>
                <div className="stepper">
                  <button type="button" onClick={() => updateNumber(key, build[key] - 1)}>
                    -
                  </button>
                  <input
                    aria-label={label}
                    inputMode="numeric"
                    min="0"
                    onChange={(event) => updateNumber(key, event.target.value.replace(/\D/g, ""))}
                    value={build[key]}
                  />
                  <button type="button" onClick={() => updateNumber(key, build[key] + 1)}>
                    +
                  </button>
                </div>
              </label>
            ))}
          </div>

          <button className="reset" onClick={() => setBuild({ ...initialBuild, neutral: 0, epiphany: 0 })} type="button">
            Reset Build
          </button>
        </section>

        <aside className="panel intel">
          <div className="panel-heading">
            <p>Latest Notes</p>
            <strong>May 2026</strong>
          </div>
          <div className="character-card" style={{ "--accent": selected.accent }}>
            <span>{selected.element}</span>
            <h2>{selected.name}</h2>
            <p>{selected.role}</p>
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
  );
}
