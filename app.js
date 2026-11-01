/* =========================================================
   KONFIGURATION
   ---------------------------------------------------------
   Zustellung per FormSubmit (https://formsubmit.co), kein Account nötig.
   1. Trage unten deine E-Mail-Adresse ein (oder nach der Aktivierung
      den zufälligen Alias, den FormSubmit dir schickt – dann steht
      deine echte Adresse nicht öffentlich im Repo).
   2. Beim allerersten Absenden schickt FormSubmit dir eine
      Aktivierungs-Mail. Einmal bestätigen, danach kommt alles an.
      -> Am besten einmal selbst testen, BEVOR du den Link verschickst.
   Bleibt das Feld leer, bekommt sie am Ende einen Button
   "Per Mail senden" bzw. "Kopieren" als Fallback.
   ========================================================= */
const CONFIG = {
  formsubmitTarget: "kai.bessler@outlook.com", // z. B. "deine@mail.de" oder "a1b2c3d4e5f6..."
  fallbackMail: "kai.bessler@outlook.com", // Adresse für den mailto-Fallback (optional)
};

/* =========================================================
   DATEVORSCHLÄGE PRO ORT
   ---------------------------------------------------------
   Pro Stadt 3 Vorschläge, jeweils mit Ablauf. Format:

   {
     id: "ma-1",                      // eindeutig
     title: "Kunst & Pasta",          // Name des Vorschlags
     tag: "Chef's Choice",            // optional, kleines Label
     teaser: "Kurze Beschreibung",    // optional
     steps: [                         // der Ablauf (time optional)
       { time: "17:00", text: "Kunsthalle" },
       { text: "Essen bei …" },
     ],
     choices: [                       // optional, erscheint beim Ankreuzen
       { id: "dinner", label: "Dinner",
         options: ["A", "B"], other: "Freitext-Platzhalter" },
     ],
   }

   placeholder(id, titel, tag) erzeugt eine "folgt"-Karte –
   einfach durch ein echtes Objekt im Format oben ersetzen.
   ========================================================= */
const MIN_DATE_PICKS = 1; // wie viele Vorschläge sie mindestens ankreuzen muss

function placeholder(id, title, tag) {
  return {
    id,
    title: `${title} (folgt)`,
    tag,
    teaser: "Platzhalter",
    placeholder: true,
    steps: [{ text: "Ablauf folgt" }],
  };
}

const PROGRAM = {
  mannheim: [
    {
      id: "ma-classic",
      title: "Classic",
      tag: "Chef's Choice",
      steps: [
        { text: "Schlendern durch die Stadt, ggf. ein wenig Shopping" },
        { text: "Stop bei Thalia für ein Buch (Liebe geht durch das Hardcover)" },
        { text: "Danach aufwärmen im Thalia-Café oder Dinner" },
      ],
      choices: [
        {
          id: "dinner",
          label: "Aufwärmen / Dinner",
          options: ["Thalia-Café", "Pizzeria Papi", "Saigon District (Sushi)"],
          other: "Oder eigene kulinarische Richtung …",
        },
      ],
    },
    {
      id: "ma-park",
      title: "Park & Kultur",
      teaser: "Abhängig vom Wetter",
      steps: [
        { text: "Schlendern durch den Luisenpark, inklusive Pinguine und Tropenhäuser" },
        { text: "Bei gutem Wetter ein kleines Picknick, sonst ins Chinesische Teehaus" },
        { text: "Alternativ: Kunsthalle oder Technoseum" },
        { text: "Anschließend findet sich ein gemütlicher Spot in der Stadt" },
      ],
      choices: [
        {
          id: "culture",
          label: "Falls Kultur statt Park",
          options: ["Kunsthalle", "Technoseum", "Egal"],
        },
      ],
    },
    {
      id: "ma-cozy",
      title: "Cozy",
      tag: "Ideal für ein Follow-up-Date",
      steps: [
        { text: "Vorab-Lektüre: das Buch „Sunrise on the Reaping“ (Sprache nach Wahl), wird rechtzeitig bereitgestellt" },
        { text: "Dann die Verfilmung im Kino: „Sunrise on the Reaping“, der neue Tribute-von-Panem-Film" },
        { text: "Gemeinsam kochen (Gericht nach Wahl) oder Essen bestellen" },
        { text: "Dabei: Analyse der Unterschiede zwischen Buch und Film" },
      ],
      choices: [
        {
          id: "lang",
          label: "Lektüre-Sprache",
          options: ["Deutsch", "Englisch"],
        },
        {
          id: "food",
          label: "Essen",
          options: ["Gemeinsam kochen", "Bestellen"],
          other: "Gericht nach Wahl …",
        },
      ],
    },
  ],
  pforzheim: [
    {
      id: "pf-wildpark",
      title: "Wildpark into Seehaus",
      steps: [
        { text: "Schlendern durch den Wildpark" },
        { text: "Auf die süßen Wildkatzen (alternativ die Otter) zeigen und „du“ sagen" },
        { text: "Abendessen im Seehaus" },
        { text: "(Optional) An der Hochschule kurz einem gewissen Professor ans Büro pinkeln" },
      ],
    },
    {
      id: "pf-light",
      title: "Date Light",
      steps: [
        { text: "Karaoke bei Kenny mit der Gang" },
        { text: "Wir beginnen mit „Griechischer Wein“, danach ist mir eigentlich alles egal" },
        { text: "Wir singen immer flirtigere Lieder, mit dem Ziel, dass es dem anderen so unangenehm wie möglich ist" },
      ],
    },
    {
      id: "pf-flucht",
      title: "Flüchten",
      teaser: "Wir entscheiden uns gegen Pforzheim und gehen irgendwo hin. Hauptsache nicht Pforzheim.",
      steps: [
        { text: "Treffen in Pforzheim" },
        { text: "Zügiges Verlassen von Pforzheim" },
        { text: "Programm wird on the go erstellt (ich weiß, das ist langweilig, aber Pforzheim isses einfach nicht)" },
      ],
    },
  ],
  middle: [
    {
      id: "mid-classic",
      title: "Classic",
      where: "Karlsruhe oder Stuttgart",
      tag: "Chef's Choice",
      steps: [
        { text: "Schlendern durch die Stadt bzw. Shopping auf der Königstraße (Stuttgart)" },
        { text: "Stop bei Thalia für ein Buch (Liebe geht durch das Hardcover)" },
        { text: "Danach aufwärmen im Thalia-Café oder Dinner" },
      ],
      choices: [
        {
          id: "city",
          label: "Stadt",
          options: ["Karlsruhe", "Stuttgart", "Egal"],
        },
        {
          id: "dinner",
          label: "Aufwärmen / Dinner",
          options: ["Thalia-Café", "Dinner"],
          other: "Kulinarische Richtung …",
        },
      ],
    },
    {
      id: "mid-park",
      title: "Park",
      where: "Karlsruhe",
      teaser: "Abhängig vom Wetter",
      steps: [
        { text: "Schlendern durch den Schlosspark" },
        { text: "Bei gutem Wetter ein kleines Picknick" },
        { text: "Anschließend findet sich ein gemütlicher Spot in der Stadt" },
      ],
    },
    {
      id: "mid-dino",
      title: "Dinos & Dinner",
      where: "Stuttgart",
      steps: [
        { text: "Naturkundemuseum am Löwentor, weil ich Dinos mag 🦕" },
        { text: "Anschließend findet sich ein gemütlicher Spot in der Stadt für Dinner" },
      ],
      choices: [
        {
          id: "dinner",
          label: "Dinner",
          other: "Kulinarische Richtung …",
        },
      ],
    },
  ],
};

/* =========================================================
   TERMINVORSCHLÄGE
   ---------------------------------------------------------
   Platzhalter – später durch echte Termine ersetzen.
   { id, title, note }
   ========================================================= */
const DATES = [
  { id: "d1", title: "Donnerstag, 5.11.", note: "Uhrzeit nach Absprache" },
  { id: "d2", title: "Freitag, 6.11.", note: "Uhrzeit nach Absprache" },
];

const LABELS = {
  style: {
    princess: "Princess Treatment 💅",
    independent: "Strong Independent Woman 💪",
  },
  location: {
    mannheim: "Mannheim",
    pforzheim: "Pforzheim",
    middle: "Karlsruhe / Stuttgart",
  },
};

/* ========================================================= */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const steps = $$(".step");
const state = {
  step: 0,
  style: null,
  location: null,
  program: new Set(),
  choices: {},
  dates: new Set(),
};

/* ---------- Navigation ---------- */
function go(index) {
  state.step = Math.max(0, Math.min(steps.length - 1, index));
  steps.forEach((s, i) => s.classList.toggle("active", i === state.step));
  const total = steps.length - 1;
  $("#folio").textContent =
    state.step === total ? "Urteil" : `Blatt ${state.step + 1} / ${total}`;
  const name = steps[state.step].dataset.step;
  if (name === "program") renderProgram();
  if (name === "sign") renderSummary();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
$$("[data-next]").forEach((b) => b.addEventListener("click", () => go(state.step + 1)));
$$("[data-back]").forEach((b) => b.addEventListener("click", () => go(state.step - 1)));

/* ---------- Intro: Einspruch ---------- */
const objections = [
  "Einspruch abgelehnt.",
  "Einspruch erneut abgelehnt. Vgl. § 3 (Salvatorische Klausel).",
  "Das Gericht hat Ihren Einspruch zur Kenntnis genommen und ignoriert.",
  "Einspruch wird als „Ja, aber schüchtern“ gewertet.",
];
let objectionCount = 0;
$("#objection").addEventListener("click", (e) => {
  const msg = $("#objection-msg");
  msg.hidden = false;
  msg.textContent = objections[Math.min(objectionCount, objections.length - 1)];
  objectionCount++;
  e.currentTarget.classList.remove("shake");
  void e.currentTarget.offsetWidth;
  e.currentTarget.classList.add("shake");
});

/* ---------- Modal ---------- */
const faces = ["🤨", "😵‍💫", "🧐", "🫠"];
let faceIndex = 0;
function openModal(face, title = "?", text = "") {
  $("#modal-face").textContent = face || faces[faceIndex++ % faces.length];
  $("#modal-title").textContent = title;
  $("#modal-title").classList.toggle("small", title !== "?");
  $("#modal-text").textContent = text;
  $("#modal").hidden = false;
  $("#modal-close").focus();
}
$("#future").addEventListener("click", () => {
  state.futureClicks = (state.futureClicks || 0) + 1;
  openModal("⏳", "Geduld.", "Erst das Kennenlernen, dann die Routine.");
});
function closeModal() { $("#modal").hidden = true; }
$("#modal-close").addEventListener("click", closeModal);
$("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

/* ---------- Stil ---------- */
$$(".tile").forEach((tile) => {
  tile.addEventListener("click", () => {
    if (tile.classList.contains("disabled")) return openModal();
    state.style = tile.dataset.style;
    $$(".tile").forEach((t) => t.classList.toggle("selected", t === tile));
    $$('[data-step="style"] .extra').forEach((x) => (x.hidden = x.dataset.extra !== state.style));
    $("#style-next").disabled = false;
  });
});

/* ---------- Ort ---------- */
function updateLocation() {
  const loc = $('input[name="location"]:checked')?.value ?? null;
  state.location = loc;
  $$('[data-step="location"] .extra').forEach((x) => (x.hidden = x.dataset.extra !== loc));
  let ok = !!loc;
  if (loc === "other") ok = $("#other-location").value.trim().length > 0;
  $("#location-next").disabled = !ok;
}
$$('input[name="location"]').forEach((i) => i.addEventListener("change", updateLocation));
$("#other-location").addEventListener("input", updateLocation);

function cityKeys() {
  return [state.location];
}
function locationText() {
  if (state.location === "other") return `Vorschlag: ${$("#other-location").value.trim()}`;
  return LABELS.location[state.location] ?? "–";
}

/* ---------- Programm ---------- */
let renderedFor = null;
function renderProgram() {
  const keys = cityKeys();
  const sig = keys.join("+");
  if (renderedFor !== sig) {
    state.program.clear();
    renderedFor = sig;
  }
  const custom = state.location === "other";
  $("#program-title").textContent = custom ? "Programmpunkte" : "Datevorschläge";
  $("#program-hint").textContent = custom
    ? `Trag mindestens zwei ein. Ort: ${locationText()}`
    : `Kreuz an, was dir gefällt. Ort: ${locationText()}`;
  $("#program-preset").hidden = custom;
  $("#program-custom").hidden = !custom;
  state.dealWithIt = false;
  if (custom) return updateProgramCount();

  const list = $("#program-list");
  list.innerHTML = "";
  keys.forEach((key) => {
    (PROGRAM[key] || []).forEach((item) => list.appendChild(renderProposal(item)));
  });
  updateProgramCount();
}

function renderProposal(item) {
  const wrap = document.createElement("div");
  wrap.className = "proposal-wrap";
  const label = document.createElement("label");
  label.className = "option proposal" + (item.placeholder ? " placeholder" : "");
  label.innerHTML = `
    <input type="checkbox">
    <span><em class="mono city"></em><strong></strong><b class="mono tag"></b><small></small><ol class="timeline"></ol></span>`;
  const fill = (sel, text) => {
    const el = label.querySelector(sel);
    text ? (el.textContent = text) : el.remove();
  };
  fill(".city", item.where);
  fill("strong", item.title);
  fill(".tag", item.tag);
  fill("small", item.teaser);
  const ol = label.querySelector("ol");
  (item.steps || []).forEach((st) => {
    const li = document.createElement("li");
    if (st.time) {
      li.className = "timed";
      const t = document.createElement("span");
      t.className = "mono time";
      t.textContent = st.time;
      li.appendChild(t);
    }
    const tx = document.createElement("span");
    tx.textContent = st.text;
    li.appendChild(tx);
    ol.appendChild(li);
  });
  wrap.appendChild(label);

  const choicesBox = document.createElement("div");
  choicesBox.className = "choices";
  const saved = (state.choices[item.id] ||= {});
  (item.choices || []).forEach((c) => {
    const box = document.createElement("div");
    box.className = "choice";
    box.innerHTML = `<span class="mono label"></span><div class="segmented"></div>`;
    box.querySelector(".label").textContent = c.label;
    const seg = box.querySelector(".segmented");
    const cur = (saved[c.id] ||= { option: "", text: "" });
    (c.options || []).forEach((opt) => {
      const l = document.createElement("label");
      l.innerHTML = `<input type="radio"><span></span>`;
      const r = l.querySelector("input");
      r.name = `${item.id}-${c.id}`;
      r.checked = cur.option === opt;
      r.addEventListener("change", () => (cur.option = opt));
      l.querySelector("span").textContent = opt;
      seg.appendChild(l);
    });
    if (c.other) {
      const inp = document.createElement("input");
      inp.type = "text";
      inp.placeholder = c.other;
      inp.value = cur.text;
      inp.addEventListener("input", () => (cur.text = inp.value));
      box.appendChild(inp);
    }
    choicesBox.appendChild(box);
  });

  const cb = label.querySelector("input");
  cb.checked = state.program.has(item.id);
  choicesBox.hidden = !cb.checked || !item.choices?.length;
  cb.addEventListener("change", () => {
    cb.checked ? state.program.add(item.id) : state.program.delete(item.id);
    choicesBox.hidden = !cb.checked || !item.choices?.length;
    updateProgramCount();
  });
  wrap.appendChild(choicesBox);
  return wrap;
}
function customValues() {
  return $$("#custom-fields input").map((i) => i.value.trim()).filter(Boolean);
}
function programCount() {
  if (state.location === "other") return customValues().length;
  return state.program.size + ($("#program-own").value.trim() ? 1 : 0);
}
function addCustomField() {
  const n = $$("#custom-fields input").length + 1;
  const label = document.createElement("label");
  label.className = "field";
  label.innerHTML = `<span class="mono label">Programmpunkt ${n}</span><input type="text">`;
  const input = label.querySelector("input");
  input.placeholder = ["z. B. Essen beim Italiener", "z. B. Spaziergang am Rhein", "z. B. Cocktails", "Noch was?"][Math.min(n - 1, 3)];
  input.addEventListener("input", updateProgramCount);
  $("#custom-fields").appendChild(label);
  return input;
}
for (let i = 0; i < 3; i++) addCustomField();
$("#add-field").addEventListener("click", () => addCustomField().focus());
$("#deal").addEventListener("click", () => {
  state.dealWithIt = true;
  go(state.step + 1);
});
function updateProgramCount() {
  const n = programCount();
  const custom = state.location === "other";
  const min = custom ? 2 : MIN_DATE_PICKS;
  $("#program-count").textContent = `${n} von mind. ${min} eingetragen`;
  $("#program-count").hidden = !custom;
  $("#program-next").disabled = n < min;
}
$("#program-own").addEventListener("input", updateProgramCount);

function programTitles() {
  if (state.location === "other") {
    return state.dealWithIt ? ["Planung ist deine Sache, deal with it 😎"] : customValues();
  }
  const titles = Object.entries(PROGRAM).flatMap(([city, items]) =>
    items
      .filter((i) => state.program.has(i.id))
      .map((i) => {
        let t = `${i.title} (${i.where || LABELS.location[city]})`;
        const extras = (i.choices || [])
          .map((c) => {
            const v = state.choices[i.id]?.[c.id] || {};
            const parts = [v.option, v.text.trim()].filter(Boolean);
            return parts.length ? `${c.label}: ${parts.join(", ")}` : "";
          })
          .filter(Boolean);
        if (extras.length) t += ` [${extras.join("; ")}]`;
        return t;
      })
  );
  const own = $("#program-own").value.trim();
  if (own) titles.push(`Eigene Idee: ${own}`);
  return titles;
}

/* ---------- Zusammenfassung ---------- */
function collect() {
  const v = (id) => $(id).value.trim();
  const data = {
    "Stil": LABELS.style[state.style] ?? "–",
  };
  if (state.style === "princess") data["Blumenwünsche"] = v("#flowers") || "überrasch mich (→ sprießende Kartoffeln)";
  if (state.style === "independent") data["Treffpunkt"] = v("#pickup") || "–";
  data["Ort"] = locationText();
  data["Programm"] = programTitles().join(" | ");
  data["Termine"] = DATES.filter((d) => state.dates.has(d.id)).map((d) => d.title).join(" | ") || "–";
  data["Andere Terminvorschläge"] = v("#when") || "–";
  data["Telefon"] = v("#phone") || "–";
  data["Anmerkungen"] = v("#notes") || "–";
  data["Einsprüche eingelegt"] = String(objectionCount);
  data["Low Effort angeklickt"] = `${faceIndex}x`;
  data["Datenight-Feature angeklickt"] = `${state.futureClicks || 0}x`;
  return data;
}
function renderSummary() {
  const dl = $("#summary");
  dl.innerHTML = "";
  const data = collect();
  ["Stil", "Blumenwünsche", "Treffpunkt", "Ort", "Programm"].forEach((k) => {
    if (!(k in data)) return;
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = k;
    dd.textContent = k === "Programm" ? programTitles().join(", ") : data[k];
    dl.append(dt, dd);
  });
}

/* ---------- Unterschrift & Absenden ---------- */

/* ---------- Termine ---------- */
function updateSubmit() {
  $("#submit").disabled = state.dates.size === 0 && !$("#when").value.trim();
}
DATES.forEach((d) => {
  const label = document.createElement("label");
  label.className = "option" + (d.note === "Platzhalter" ? " placeholder" : "");
  label.innerHTML = `<input type="checkbox"><span><strong></strong><small></small></span>`;
  label.querySelector("strong").textContent = d.title;
  label.querySelector("small").textContent = d.note;
  const cb = label.querySelector("input");
  cb.addEventListener("change", () => {
    cb.checked ? state.dates.add(d.id) : state.dates.delete(d.id);
    updateSubmit();
  });
  $("#date-list").appendChild(label);
});
$("#when").addEventListener("input", updateSubmit);

function asText(data) {
  return Object.entries(data).map(([k, v]) => `${k}: ${v}`).join("\n");
}

$("#submit").addEventListener("click", async () => {
  const btn = $("#submit");
  const err = $("#submit-error");
  const data = collect();
  btn.disabled = true;
  btn.textContent = "Wird zugestellt …";
  err.hidden = true;

  let delivered = false;
  if (CONFIG.formsubmitTarget) {
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(CONFIG.formsubmitTarget)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: "📜 Az. EV-2026/001 – Antwort von Partei B",
          _template: "table",
          _captcha: "false",
          ...data,
        }),
      });
      const json = await res.json().catch(() => ({}));
      delivered = res.ok && String(json.success) !== "false";
    } catch (_) {
      delivered = false;
    }
  }

  if (!delivered) {
    const text = asText(data);
    $("#fallback").hidden = false;
    $("#fallback-text").value = text;
    $("#mailto").href =
      `mailto:${CONFIG.fallbackMail}?subject=${encodeURIComponent("Az. EV-2026/001 – Antwort")}&body=${encodeURIComponent(text)}`;
  }
  go(steps.length - 1);
});

$("#copy").addEventListener("click", async () => {
  const ta = $("#fallback-text");
  try {
    await navigator.clipboard.writeText(ta.value);
  } catch (_) {
    ta.select();
    document.execCommand("copy");
  }
  $("#copy").textContent = "Kopiert ✓";
});

go(0);
