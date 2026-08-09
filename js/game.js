(() => {
  "use strict";

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  const screens = {
    home: $("#homeScreen"),
    setup: $("#setupScreen"),
    battle: $("#battleScreen")
  };

  const state = {
    party: [
      ["yusha", 25],
      ["pink", 24],
      ["sand", 23],
      ["nyoro", 23],
      ["nekoku", 22]
    ],
    enemy: [
      ["hawk", 24],
      ["mira", 24],
      ["guardian", 25]
    ],
    allies: [],
    enemies: [],
    turn: 1,
    auto: false,
    busy: false,
    finished: false
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function showScreen(name) {
    Object.entries(screens).forEach(([key, screen]) => {
      screen.classList.toggle("active", key === name);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function attachImageFallbacks(root = document) {
    $$("img", root).forEach((img) => {
      if (img.dataset.fallbackBound === "1") return;
      img.dataset.fallbackBound = "1";

      const markMissing = () => img.classList.add("asset-missing");
      img.addEventListener("error", markMissing);

      if (!img.getAttribute("src")) {
        markMissing();
      }
    });
  }

  function getPlayer(id) {
    return MOB_DATA.players.find((unit) => unit.id === id);
  }

  function getMonster(id) {
    return MOB_DATA.monsters.find((unit) => unit.id === id);
  }

  function characterMarkup(unit, leader = false) {
    const image = unit.image || "";
    return `
      <div class="home-member ${leader ? "leader" : ""}">
        <div class="home-sprite">
          <img src="${image}" alt="${unit.name}">
          <div class="fallback-character" aria-hidden="true">${unit.symbol}</div>
        </div>
        <div class="home-member-name">${unit.name}</div>
      </div>
    `;
  }

  function renderHomeParty() {
    const holder = $("#homeParty");
    holder.innerHTML = state.party
      .slice(0, 5)
      .map(([id, level], index) => {
        const unit = getPlayer(id);
        if (!unit) return "";
        return `
          <div class="home-member ${index === 0 ? "leader" : ""}">
            <div class="home-sprite">
              <img src="${unit.image}" alt="${unit.name}">
              <div class="fallback-character" aria-hidden="true">${unit.symbol}</div>
            </div>
            <div class="home-member-name">${unit.name}</div>
            <div class="home-member-level">Lv ${level}</div>
          </div>
        `;
      })
      .join("");

    attachImageFallbacks(holder);
  }

  function createOptions(list, selected) {
    const empty = `<option value="">なし</option>`;
    const body = list
      .map((unit) => {
        const isSelected = unit.id === selected ? "selected" : "";
        return `<option value="${unit.id}" ${isSelected}>${unit.name} / ${unit.attribute}</option>`;
      })
      .join("");
    return empty + body;
  }

  function renderSetup() {
    const playerHolder = $("#playerSetup");
    const enemyHolder = $("#enemySetup");

    playerHolder.innerHTML = "";
    enemyHolder.innerHTML = "";

    for (let index = 0; index < 5; index += 1) {
      const playerSlot = state.party[index] || ["", 20];
      const enemySlot = state.enemy[index] || ["", 20];

      playerHolder.insertAdjacentHTML(
        "beforeend",
        `
          <div class="setup-slot">
            <div>
              <label class="field-label" for="playerSelect${index}">枠 ${index + 1}</label>
              <select id="playerSelect${index}" class="player-select" data-index="${index}">
                ${createOptions(MOB_DATA.players, playerSlot[0])}
              </select>
            </div>
            <div>
              <label class="field-label" for="playerLevel${index}">Lv</label>
              <input
                id="playerLevel${index}"
                class="player-level"
                data-index="${index}"
                type="number"
                min="1"
                max="99"
                value="${playerSlot[1]}"
              >
            </div>
          </div>
        `
      );

      enemyHolder.insertAdjacentHTML(
        "beforeend",
        `
          <div class="setup-slot">
            <div>
              <label class="field-label" for="enemySelect${index}">枠 ${index + 1}</label>
              <select id="enemySelect${index}" class="enemy-select" data-index="${index}">
                ${createOptions(MOB_DATA.monsters, enemySlot[0])}
              </select>
            </div>
            <div>
              <label class="field-label" for="enemyLevel${index}">Lv</label>
              <input
                id="enemyLevel${index}"
                class="enemy-level"
                data-index="${index}"
                type="number"
                min="1"
                max="99"
                value="${enemySlot[1]}"
              >
            </div>
          </div>
        `
      );
    }
  }

  function syncSetupToState() {
    const party = [];
    const enemy = [];

    $$(".player-select").forEach((select) => {
      const index = Number(select.dataset.index);
      const levelInput = $(`.player-level[data-index="${index}"]`);
      const level = clamp(Number(levelInput?.value || 1), 1, 99);
      if (select.value) {
        party.push([select.value, level]);
      }
    });

    $$(".enemy-select").forEach((select) => {
      const index = Number(select.dataset.index);
      const levelInput = $(`.enemy-level[data-index="${index}"]`);
      const level = clamp(Number(levelInput?.value || 1), 1, 99);
      if (select.value) {
        enemy.push([select.value, level]);
      }
    });

    state.party = party.length ? party : [["yusha", 20]];
    state.enemy = enemy.length ? enemy : [["hawk", 20]];
    renderHomeParty();
  }

  function buildBattleUnit(base, level, enemy) {
    const maxHp = Math.round((enemy ? 127 : 112) * level + 380);
    const maxMp = Math.round(80 + level * 2);
    const attack = Math.round((enemy ? 8.9 : 9.5) * level + 38);
    const defense = Math.round((enemy ? 5.9 : 6.2) * level + 28);
    const speed = Math.round(6.2 * level + 20);

    return {
      ...base,
      level,
      enemy,
      maxHp,
      hp: maxHp,
      maxMp,
      mp: maxMp,
      attack,
      defense,
      speed,
      dead: false
    };
  }

  function unitMarkup(unit, index) {
    return `
      <article
        class="battle-unit"
        data-side="${unit.enemy ? "enemy" : "ally"}"
        data-index="${index}"
      >
        <div class="battle-sprite-wrap">
          <img class="battle-sprite" src="${unit.image || ""}" alt="${unit.name}">
          <div class="battle-fallback" aria-hidden="true">${unit.symbol}</div>
        </div>
        <div class="battle-unit-name">${unit.name}</div>
        <div class="battle-unit-level">Lv ${unit.level}</div>
        <div class="gauge" aria-label="HP">
          <div class="gauge-fill hp-fill" style="width:${(unit.hp / unit.maxHp) * 100}%"></div>
        </div>
        <div class="gauge" aria-label="MP">
          <div class="gauge-fill mp-fill" style="width:${(unit.mp / unit.maxMp) * 100}%"></div>
        </div>
      </article>
    `;
  }

  function renderBattleUnits() {
    $("#enemyUnits").innerHTML = state.enemies.map(unitMarkup).join("");
    $("#allyUnits").innerHTML = state.allies.map(unitMarkup).join("");
    $("#turnLabel").textContent = `TURN ${state.turn}`;
    attachImageFallbacks($("#battleField"));
    refreshUnitStates();
  }

  function refreshUnitStates() {
    $$(".battle-unit").forEach((element) => {
      const side = element.dataset.side;
      const index = Number(element.dataset.index);
      const unit = side === "enemy" ? state.enemies[index] : state.allies[index];

      if (!unit) return;

      const hpFill = $(".hp-fill", element);
      const mpFill = $(".mp-fill", element);

      if (hpFill) hpFill.style.width = `${(unit.hp / unit.maxHp) * 100}%`;
      if (mpFill) mpFill.style.width = `${(unit.mp / unit.maxMp) * 100}%`;

      element.classList.toggle("down", unit.dead);
    });
  }

  function getUnitElement(unit) {
    const list = unit.enemy ? state.enemies : state.allies;
    const index = list.indexOf(unit);
    const side = unit.enemy ? "enemy" : "ally";
    return $(`.battle-unit[data-side="${side}"][data-index="${index}"]`);
  }

  function livingUnits(list) {
    return list.filter((unit) => !unit.dead);
  }

  function randomTarget(list) {
    const candidates = livingUnits(list);
    if (!candidates.length) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  function battleLog(html) {
    const log = $("#battleLog");
    log.insertAdjacentHTML("beforeend", `<div>${html}</div>`);
    log.scrollTop = log.scrollHeight;
  }

  function playMessage(text) {
    const element = $("#centerMessage");
    element.textContent = text;
    element.classList.remove("play");
    void element.offsetWidth;
    element.classList.add("play");
  }

  function playSkillBanner(text) {
    const element = $("#skillBanner");
    element.textContent = text;
    element.classList.remove("play");
    void element.offsetWidth;
    element.classList.add("play");
  }

  function playFx(type) {
    const element = type === "magic" ? $("#magicFx") : $("#slashFx");
    element.classList.remove("play");
    void element.offsetWidth;
    element.classList.add("play");
  }

  function showDamageNumber(target, amount) {
    const unitElement = getUnitElement(target);
    if (!unitElement) return;

    const fieldRect = $("#battleField").getBoundingClientRect();
    const unitRect = unitElement.getBoundingClientRect();

    const damage = document.createElement("div");
    damage.className = "damage-number";
    damage.textContent = `-${amount}`;
    damage.style.left = `${unitRect.left - fieldRect.left + unitRect.width / 2 - 18}px`;
    damage.style.top = `${unitRect.top - fieldRect.top + 16}px`;

    $("#battleField").appendChild(damage);
    window.setTimeout(() => damage.remove(), 900);
  }

  function calculateDamage(attacker, target, multiplier = 1) {
    const variance = 0.88 + Math.random() * 0.24;
    const raw = Math.round(
      (attacker.attack * multiplier - target.defense * 0.28) * variance
    );
    return Math.max(1, raw);
  }

  function applyDamage(attacker, target, multiplier = 1) {
    const damage = calculateDamage(attacker, target, multiplier);
    target.hp = Math.max(0, target.hp - damage);

    const targetElement = getUnitElement(target);
    if (targetElement) {
      targetElement.classList.remove("hit-motion");
      void targetElement.offsetWidth;
      targetElement.classList.add("hit-motion");
    }

    showDamageNumber(target, damage);

    if (target.hp <= 0) {
      target.dead = true;
      window.setTimeout(() => refreshUnitStates(), 220);
    } else {
      refreshUnitStates();
    }

    return damage;
  }

  function evaluateBattleResult() {
    if (state.finished) return true;

    if (!livingUnits(state.enemies).length) {
      state.finished = true;
      state.auto = false;
      $("#autoBtn").classList.remove("auto-on");
      $("#autoBtn").textContent = "AUTO";
      playMessage("VICTORY!");
      battleLog(`<span class="log-win">VICTORY!</span>`);
      return true;
    }

    if (!livingUnits(state.allies).length) {
      state.finished = true;
      state.auto = false;
      $("#autoBtn").classList.remove("auto-on");
      $("#autoBtn").textContent = "AUTO";
      playMessage("DEFEAT...");
      battleLog(`<span class="log-lose">DEFEAT...</span>`);
      return true;
    }

    return false;
  }

  async function performAction(attacker, forceSkill = false) {
    const targets = attacker.enemy ? state.allies : state.enemies;
    if (attacker.dead || !livingUnits(targets).length) return;

    const target = randomTarget(targets);
    if (!target) return;

    const attackerElement = getUnitElement(attacker);
    if (!attackerElement) return;

    const shouldUseSkill =
      forceSkill ||
      (attacker.enemy ? Math.random() < 0.34 : Math.random() < 0.22);

    const canUseSkill = shouldUseSkill && attacker.mp >= 20;

    if (canUseSkill) {
      attacker.mp -= 20;
      refreshUnitStates();

      attackerElement.classList.remove("cast-motion");
      void attackerElement.offsetWidth;
      attackerElement.classList.add("cast-motion");

      playSkillBanner(`${attacker.name}　「${attacker.skill}」`);
      battleLog(
        `<span class="log-skill">${attacker.name} の「${attacker.skill}」！</span>`
      );

      await sleep(260);

      playFx(attacker.skillType === "magic" ? "magic" : "slash");
      await sleep(300);

      const damage = applyDamage(attacker, target, attacker.skillPower || 1.55);
      battleLog(`${target.name} に ${damage} ダメージ`);

      await sleep(310);
      attackerElement.classList.remove("cast-motion");
      return;
    }

    attackerElement.classList.remove("attack-motion");
    void attackerElement.offsetWidth;
    attackerElement.classList.add("attack-motion");

    battleLog(`${attacker.name} の攻撃！`);

    await sleep(210);
    playFx("slash");

    const damage = applyDamage(attacker, target, 1);
    battleLog(`${target.name} に ${damage} ダメージ`);

    await sleep(300);
    attackerElement.classList.remove("attack-motion");
  }

  async function runTurn(forcePlayerSkill = false) {
    if (state.busy || state.finished) return;

    state.busy = true;
    battleLog(`<span class="log-turn">TURN ${state.turn}</span>`);

    const queue = [
      ...livingUnits(state.allies),
      ...livingUnits(state.enemies)
    ].sort((a, b) => {
      const aScore = a.speed + Math.random() * 18;
      const bScore = b.speed + Math.random() * 18;
      return bScore - aScore;
    });

    for (const unit of queue) {
      if (unit.dead || evaluateBattleResult()) break;
      await performAction(unit, forcePlayerSkill && !unit.enemy);
    }

    if (!evaluateBattleResult()) {
      state.turn += 1;
      $("#turnLabel").textContent = `TURN ${state.turn}`;
    }

    state.busy = false;

    if (state.auto && !state.finished) {
      window.setTimeout(() => runTurn(false), 520);
    }
  }

  function resetBattle() {
    state.allies = state.party.map(([id, level]) =>
      buildBattleUnit(getPlayer(id), level, false)
    );

    state.enemies = state.enemy.map(([id, level]) =>
      buildBattleUnit(getMonster(id), level, true)
    );

    state.turn = 1;
    state.busy = false;
    state.auto = false;
    state.finished = false;

    $("#autoBtn").classList.remove("auto-on");
    $("#autoBtn").textContent = "AUTO";
    $("#battleLog").innerHTML =
      `<div class="log-turn">BATTLE START</div>` +
      `<div>画面フラッシュ無し / 移動・揺れ・斬撃・魔法弾・ダメージ数字で演出します。</div>`;

    renderBattleUnits();
  }

  function randomizeSetup() {
    const partyPool = [...MOB_DATA.players];
    const enemyPool = [...MOB_DATA.monsters];

    partyPool.sort(() => Math.random() - 0.5);
    enemyPool.sort(() => Math.random() - 0.5);

    state.party = partyPool.slice(0, 5).map((unit) => [
      unit.id,
      10 + Math.floor(Math.random() * 70)
    ]);

    const enemyCount = 3 + Math.floor(Math.random() * 3);
    state.enemy = enemyPool.slice(0, enemyCount).map((unit) => [
      unit.id,
      10 + Math.floor(Math.random() * 70)
    ]);

    renderSetup();
  }

  function bindEvents() {
    $$("[data-home-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.homeAction;

        if (action === "test" || action === "party") {
          renderSetup();
          showScreen("setup");
          return;
        }

        if (action === "adventure") {
          playMessage("冒険は今後接続予定");
          return;
        }

        if (action === "castle") {
          playMessage("お城は今後接続予定");
        }
      });
    });

    $("#setupBackBtn").addEventListener("click", () => {
      syncSetupToState();
      showScreen("home");
    });

    $("#randomBtn").addEventListener("click", randomizeSetup);

    $("#startBattleBtn").addEventListener("click", () => {
      syncSetupToState();
      resetBattle();
      showScreen("battle");
    });

    $("#battleBackBtn").addEventListener("click", () => {
      state.auto = false;
      renderSetup();
      showScreen("setup");
    });

    $("#restartBtn").addEventListener("click", resetBattle);

    $("#attackBtn").addEventListener("click", () => {
      runTurn(false);
    });

    $("#skillBtn").addEventListener("click", () => {
      runTurn(true);
    });

    $("#nextTurnBtn").addEventListener("click", () => {
      runTurn(false);
    });

    $("#autoBtn").addEventListener("click", () => {
      if (state.finished) return;

      state.auto = !state.auto;
      $("#autoBtn").classList.toggle("auto-on", state.auto);
      $("#autoBtn").textContent = state.auto ? "AUTO ON" : "AUTO";

      if (state.auto && !state.busy) {
        runTurn(false);
      }
    });
  }

  attachImageFallbacks();
  renderHomeParty();
  bindEvents();
})();
