/* MinBiz app: profil, idé, automatisk plan, tavle, merker og mine data.
   Kjører mot Supabase (me-voteapp) når du er innlogget, eller i minnet med ?demo=1. */
(function () {
  "use strict";

  var CFG = window.MINBIZ_CONFIG || {};
  var DEMO = /(?:^|[?&])demo=1(?:&|$)/.test(location.search);

  /* ---------- Plan-maler (fra prototype v0.2, 18.11.2026) ---------- */
  var PLANS = {
    "24t": { name: "24-timers lansering", len: "24 timer", fits: "Én konkret ting som skal ut: en nettside, et tilbud, en åpningsdag.", steps: [
      { d: 0, t: "09:00", phase: "Forberedelse", title: "Samle det du trenger", list: ["Logo og farger, om du har", "Liste over det du tilbyr", "5 spørsmål kunder ofte stiller, med svar", "3 sitater fra fornøyde kunder, eller skriv «ettersendes»", "Kontaktinfo"] },
      { d: 0, t: "10:00", phase: "Forberedelse", title: "Avklaring, 30 minutter", list: ["Hva skal ut i morgen?", "Hvem er det for?", "Hvilken ene handling skal folk gjøre?"] },
      { d: 0, t: "12:00", phase: "Bygg", title: "Skriv og sett opp", list: ["Overskrift, kort tekst og én knapp", "Tilbud og pris, eller merk pris som ikke satt", "Sjekk at det ser bra ut på mobil"] },
      { d: 0, t: "21:00", phase: "Sjekk", title: "Test alt som skal virke", list: ["Skjema eller bestilling testet", "Alle lenker virker", "Ingen plassholdertekst igjen"] },
      { d: 0, t: "23:00", phase: "Sjekk", title: "Siste gjennomgang", list: ["Les alt én gang høyt", "Be én person se over"] },
      { d: 1, t: "00:00", phase: "Lansering", title: "Gå live", list: ["Publiser", "Sjekk at det virker for andre enn deg"] },
      { d: 1, t: "10:00", phase: "Oppfølging", title: "Si ifra til nettverket", list: ["Fem personlige meldinger", "Ett innlegg der kundene dine er"] },
      { d: 1, t: "22:00", phase: "Oppfølging", title: "Se på resultatet", list: ["Hvor mange så det, og hvor mange tok kontakt?", "Velg ett neste steg"] }
    ] },
    "forste_uke": { name: "Første uke", len: "7 dager", fits: "Test idéen raskt før du bruker mye tid og penger.", steps: [
      { d: 0, phase: "Første uke", title: "Skriv idéen på én side", list: ["Hva, for hvem, hvorfor deg", "Ett løfte i én setning"] },
      { d: 1, phase: "Første uke", title: "Snakk med to mulige kunder", list: ["Spør hva de bruker i dag", "Spør hva som irriterer dem", "Lytt mer enn du snakker"] },
      { d: 2, phase: "Første uke", title: "Snakk med tre til", list: ["Skriv ned ordene de bruker"] },
      { d: 3, phase: "Første uke", title: "Lag en enkel side eller et innlegg", list: ["Ett tilbud", "Én måte å ta kontakt på"] },
      { d: 4, phase: "Første uke", title: "Del det med 20 personer", list: ["Personlige meldinger fungerer best"] },
      { d: 5, phase: "Første uke", title: "Svar alle som tok kontakt", list: ["Noter hvem som vil kjøpe eller vite mer"] },
      { d: 6, phase: "Første uke", title: "Oppsummer og bestem", list: ["Hva lærte du?", "Fortsette, endre eller legge bort?", "Velg neste plan"] }
    ] },
    "6_uker": { name: "6-ukers oppstart", len: "6 uker", fits: "Ny bedrift som skal lanseres skikkelig.", steps: [
      { d: 0, phase: "Fase 0: Grunnmur", title: "Bestem tilbud, løfte og pris", list: ["Ett hovedtilbud", "Pris, eller merk den som ikke satt", "Hvordan folk tar kontakt"] },
      { d: 1, phase: "Fase 0: Grunnmur", title: "Sett opp kontakt og bestilling", list: ["E-post, telefon eller bookingside", "Noter hvor henvendelsene kommer fra"] },
      { d: 3, phase: "Fase 1: Lansering", title: "Publiser første versjon", list: ["Side eller profil med tilbudet", "Sjekk mobil og lenker"] },
      { d: 4, phase: "Fase 1: Lansering", title: "Fortell det til de første", list: ["Personlige meldinger", "To innlegg"] },
      { d: 5, phase: "Fase 1: Lansering", title: "Følg opp alle som svarer", list: ["Svar innen et døgn"] },
      { d: 9, phase: "Fase 2: Bevis", title: "Lag to eksempler på fornøyde kunder", list: ["Før, etter og hva det betydde", "Spør om lov før du bruker navn"] },
      { d: 12, phase: "Fase 2: Bevis", title: "Prøv to versjoner av overskriften", list: ["Behold den som gir flest henvendelser"] },
      { d: 16, phase: "Fase 2: Bevis", title: "Finn samarbeidspartnere", list: ["Hvem har allerede kundene dine?"] },
      { d: 22, phase: "Fase 3: System", title: "Skriv ned hvordan du leverer", list: ["Sjekkliste per kunde"] },
      { d: 28, phase: "Fase 3: System", title: "Tilbud til faste kunder", list: ["Noe som gjør at de kommer tilbake"] },
      { d: 41, phase: "Fase 3: System", title: "Gjennomgang etter seks uker", list: ["Hva virket?", "Hva er neste plan?"] }
    ] },
    "30_60_90": { name: "30/60/90 dager", len: "3 måneder", fits: "Retning og mål for et helt kvartal.", steps: [
      { d: 0, phase: "Dag 1 til 30", title: "Sett tre mål for måneden", list: ["Ett om kunder, ett om tilbud, ett om deg selv"] },
      { d: 3, phase: "Dag 1 til 30", title: "Gjør det enkelt å kjøpe", list: ["Kontakt eller bestilling på plass", "Betaling avklart"] },
      { d: 7, phase: "Dag 1 til 30", title: "20 personlige henvendelser", list: ["Lokalt og i nettverket"] },
      { d: 20, phase: "Dag 1 til 30", title: "Første betalende kunde", list: ["Lever godt, spør om tilbakemelding"] },
      { d: 29, phase: "Dag 1 til 30", title: "Gjennomgang dag 30", list: ["Hva virket?", "Justér målene for neste måned"] },
      { d: 40, phase: "Dag 31 til 60", title: "To eksempler på fornøyde kunder", list: ["Med lov fra kunden"] },
      { d: 45, phase: "Dag 31 til 60", title: "Enkel oppfølging av interesserte", list: ["Tre e-poster eller meldinger over en uke"] },
      { d: 55, phase: "Dag 31 til 60", title: "Prisliste for tillegg", list: ["Hva kan du tilby dem som allerede har kjøpt?"] },
      { d: 59, phase: "Dag 31 til 60", title: "Gjennomgang dag 60", list: ["Egne tall mot målene"] },
      { d: 70, phase: "Dag 61 til 90", title: "Fast avtale for de som vil ha mer", list: ["Noe som gir jevn inntekt"] },
      { d: 80, phase: "Dag 61 til 90", title: "Rydd i det som tar mest tid", list: ["Hva kan gjøres enklere?"] },
      { d: 89, phase: "Dag 61 til 90", title: "Gjennomgang dag 90", list: ["Hva er neste kvartal?"] }
    ] },
    "forretningsplan": { name: "Full forretningsplan", len: "2 uker", fits: "Søknad om støtte eller lån, samtale med bank, partner eller investor.", steps: [
      { d: 0, phase: "Uke 1", title: "Fyll ut profil og idé så godt du kan", list: ["Tomme felt står som [Mangler]"] },
      { d: 2, phase: "Uke 1", title: "Skriv utkastet til forretningsplanen", list: ["Bruk idéen, kundene og løftet ditt som utgangspunkt", "Tall du ikke har, merkes [Mangler]"] },
      { d: 4, phase: "Uke 1", title: "Fyll inn tallene som mangler", list: ["Pris, kostnader, forventet antall kunder"] },
      { d: 7, phase: "Uke 2", title: "Få planen lest av noen du stoler på", list: ["Regnskapsfører, bank eller næringskontakt i kommunen"] },
      { d: 10, phase: "Uke 2", title: "Rett opp og lagre som PDF", list: ["Bruk utskrift i nettleseren og velg PDF"] }
    ] }
  };
  var PLAN_ORDER = ["24t", "forste_uke", "6_uker", "30_60_90", "forretningsplan"];
  var NEXT_LEVEL = { "24t": "forste_uke", "forste_uke": "6_uker", "6_uker": "30_60_90", "30_60_90": "forretningsplan", "forretningsplan": "30_60_90" };
  var KIND_LABEL = { imperium: "Imperium", bedrift: "Bedrift", ekstra_inntekt: "Ekstra inntekt", ide: "Idé" };
  var STATUS = [
    { key: "neste", label: "Neste" },
    { key: "i_dag", label: "I dag" },
    { key: "venter", label: "Venter" },
    { key: "gjort", label: "Gjort" }
  ];

  /* ---------- Støtte: generelle pekere til primærkilder ---------- */
  var SRC = {
    brreg: { name: "Brønnøysundregistrene", url: "https://www.brreg.no/", why: "Enhetsregisteret, Foretaksregisteret og søk etter ledige navn." },
    altinn: { name: "Altinn: starte og drive bedrift", url: "https://info.altinn.no/starte-og-drive/", why: "Veiledning om organisasjonsform, registrering og drift." },
    skatt: { name: "Skatteetaten: bedrift og organisasjon", url: "https://www.skatteetaten.no/bedrift-og-organisasjon/", why: "Skatt, merverdiavgift og hva som gjelder for inntekt." },
    inno: { name: "Innovasjon Norge", url: "https://www.innovasjonnorge.no/", why: "Rådgivning og finansieringsordninger for gründere." }
  };
  var SUPPORT = {
    ekstra_inntekt: ["skatt", "altinn", "brreg"],
    bedrift: ["altinn", "brreg", "skatt", "inno"],
    imperium: ["altinn", "brreg", "skatt", "inno"],
    ide: ["brreg", "altinn", "inno"]
  };

  /* ---------- Hjelpere ---------- */
  function $(id) { return document.getElementById(id); }
  function h(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (attrs[k] == null || attrs[k] === false) return;
      if (k === "class") e.className = attrs[k];
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k] === true ? "" : attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return e;
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function iso(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function today() { return iso(new Date()); }
  function addDays(isoDate, n) { var p = isoDate.split("-"); var d = new Date(+p[0], +p[1] - 1, +p[2]); d.setDate(d.getDate() + n); return iso(d); }
  function fmtDate(isoDate) {
    if (!isoDate) return "Ingen dato";
    var p = isoDate.split("-"); var d = new Date(+p[0], +p[1] - 1, +p[2]);
    try { return d.toLocaleDateString("nb-NO", { weekday: "short", day: "numeric", month: "short" }); } catch (e) { return isoDate; }
  }
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 3 | 8)).toString(16); });
  }
  function store(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { /* lagring ikke tilgjengelig */ } }
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  var toastTimer;
  function toast(msg) {
    var t = $("toast"); t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.hidden = true; }, 3500);
  }
  function missing(v) { return v == null || String(v).trim() === ""; }
  function errText(e) { return (e && (e.message || e.error_description)) || "Ukjent feil"; }

  /* ---------- Stjernetegn (tradisjon og inspirasjon) ---------- */
  /* [måned, første dag i neste tegn, tegnet før den dagen] */
  var SIGNS = [[1, 20, "Steinbukken", "Vannmannen"], [2, 19, "Vannmannen", "Fiskene"], [3, 21, "Fiskene", "Væren"], [4, 20, "Væren", "Tyren"],
    [5, 21, "Tyren", "Tvillingene"], [6, 21, "Tvillingene", "Krepsen"], [7, 23, "Krepsen", "Løven"], [8, 23, "Løven", "Jomfruen"],
    [9, 23, "Jomfruen", "Vekten"], [10, 23, "Vekten", "Skorpionen"], [11, 22, "Skorpionen", "Skytten"], [12, 22, "Skytten", "Steinbukken"]];
  function zodiac(isoDate) {
    if (!isoDate) return null;
    var p = String(isoDate).split("-"), m = +p[1], d = +p[2];
    if (!m || !d || m > 12) return null;
    var s = SIGNS[m - 1];
    return d < s[1] ? s[2] : s[3];
  }

  /* ---------- Datalag: Supabase eller minne (demo) ---------- */
  function check(r) { if (r.error) throw r.error; return r.data; }
  function supaDb(sb, uid) {
    return {
      load: async function () {
        var r = await Promise.all([
          sb.from("minbiz_profiles").select("*").eq("user_id", uid).maybeSingle(),
          sb.from("minbiz_ideas").select("*").order("created_at", { ascending: false }),
          sb.from("minbiz_plans").select("*").order("created_at", { ascending: false }),
          sb.from("minbiz_steps").select("*").order("sort", { ascending: true }),
          sb.from("minbiz_achievements").select("*").order("earned_at", { ascending: false })
        ]);
        return { profile: check(r[0]), ideas: check(r[1]) || [], plans: check(r[2]) || [], steps: check(r[3]) || [], achievements: check(r[4]) || [] };
      },
      member: async function () {
        try {
          var r = await sb.from("members").select("birth_date").eq("id", uid).maybeSingle();
          if (r.error) return null;
          return r.data;
        } catch (e) { return null; }
      },
      saveProfile: async function (row) {
        row.user_id = uid; row.updated_at = new Date().toISOString();
        return check(await sb.from("minbiz_profiles").upsert(row).select().single());
      },
      saveIdea: async function (row) {
        row.user_id = uid;
        if (row.id) { row.updated_at = new Date().toISOString(); return check(await sb.from("minbiz_ideas").update(row).eq("id", row.id).select().single()); }
        return check(await sb.from("minbiz_ideas").insert(row).select().single());
      },
      createPlan: async function (plan, steps) {
        plan.user_id = uid;
        var p = check(await sb.from("minbiz_plans").insert(plan).select().single());
        var rows = steps.map(function (s) { s.user_id = uid; s.plan_id = p.id; return s; });
        var r = await sb.from("minbiz_steps").insert(rows).select();
        if (r.error) { await sb.from("minbiz_plans").delete().eq("id", p.id); throw r.error; }
        return { plan: p, steps: r.data };
      },
      updateSteps: async function (list) {
        var res = await Promise.all(list.map(function (s) {
          return sb.from("minbiz_steps").update({ status: s.status, due_date: s.due_date, done_at: s.done_at, moved_count: s.moved_count }).eq("id", s.id);
        }));
        res.forEach(check);
      },
      addAchievement: async function (row) {
        row.user_id = uid;
        return check(await sb.from("minbiz_achievements").insert(row).select().single());
      },
      deleteAll: async function () {
        var tables = ["minbiz_achievements", "minbiz_steps", "minbiz_plans", "minbiz_ideas", "minbiz_profiles"];
        for (var i = 0; i < tables.length; i++) check(await sb.from(tables[i]).delete().eq("user_id", uid));
      }
    };
  }
  /* Eksempeldata for demoen. Funnene er eksempler, ikke ekte undersøkelser. */
  function demoSeed() {
    var c = function (q, text, fav) { return { id: uuid(), q: q, text: text, fav: !!fav }; };
    return {
      profile: { user_id: "demo", interests: ["Friluftsliv", "Fjorden", "Matlaging"], ambitions: "Ha en ekstra inntekt om sommeren og bli kjent med flere som besøker bygda.", hours_per_week: 8, has_already: "To kajakker, egen bil, bor ved sjøen", skills: "Padling, guiding, lokalkunnskap", use_horoscope: true },
      ideas: [{
        id: uuid(), user_id: "demo", created_at: new Date().toISOString(),
        title: "Kajakkutleie ved fjorden", kind: "ekstra_inntekt",
        description: "Leie ut kajakker og tilby korte guidede turer om sommeren.",
        goal: "At de første gjestene vil anbefale turen til andre.", audience: "Turister og hyttefolk som vil ut på fjorden", promise: null,
        phase: "analyse",
        brainstorm: { done: true, cards: [
          c("muligheter", "Guidede kveldsturer i midnattssola", true),
          c("hvem", "Hyttefolk som har besøk og vil finne på noe"),
          c("vinkler", "Pakke med kajakk og bålkaffe på en holme", true),
          c("risiko", "Dårlig vær store deler av sesongen"),
          c("risiko", "Sikkerhet på sjøen for folk uten erfaring", true),
          c("styrker", "Kjenner fjorden og strømmene godt")
        ] },
        desk_analysis: { keyword: "kajakkutleie", place: "Nordreisa", areas: {
          marked: [{ id: uuid(), text: "Eksempel: søkeinteressen for kajakk ser ut til å være størst om sommeren.", url: "https://trends.google.com/trends/explore?geo=NO&q=kajakk" }],
          pris: [{ id: uuid(), text: "Eksempel: tror folk vil betale omtrent som for sykkelutleie.", url: "" }]
        } }
      }],
      plans: [], steps: [], achievements: []
    };
  }
  function memDb() {
    var M = demoSeed();
    var now = function () { return new Date().toISOString(); };
    var copy = function (o) { return JSON.parse(JSON.stringify(o)); };
    return {
      load: async function () { return copy(M); },
      member: async function () { return null; },
      saveProfile: async function (row) { row.user_id = "demo"; row.updated_at = now(); M.profile = copy(row); return copy(row); },
      saveIdea: async function (row) {
        row.user_id = "demo";
        if (row.id) {
          var out = null;
          M.ideas = M.ideas.map(function (i) { if (i.id !== row.id) return i; out = Object.assign({}, i, copy(row)); return out; });
          return copy(out || row);
        }
        row.id = uuid(); row.created_at = now(); row.phase = row.phase || "brainstorm"; row.brainstorm = row.brainstorm || {}; row.desk_analysis = row.desk_analysis || {};
        M.ideas.unshift(copy(row)); return copy(row);
      },
      createPlan: async function (plan, steps) {
        plan.id = uuid(); plan.user_id = "demo"; plan.created_at = now(); M.plans.unshift(copy(plan));
        steps = steps.map(function (s) { s.id = uuid(); s.plan_id = plan.id; s.user_id = "demo"; s.done_at = null; s.moved_count = 0; s.status = s.status || "neste"; return s; });
        M.steps = M.steps.concat(copy(steps));
        return { plan: copy(plan), steps: copy(steps) };
      },
      updateSteps: async function (list) {
        list.forEach(function (s) { M.steps.forEach(function (x, i) { if (x.id === s.id) M.steps[i] = copy(s); }); });
      },
      addAchievement: async function (row) { row.id = uuid(); row.user_id = "demo"; row.earned_at = now(); M.achievements.unshift(copy(row)); return copy(row); },
      deleteAll: async function () { M = { profile: null, ideas: [], plans: [], steps: [], achievements: [] }; }
    };
  }

  /* ---------- Tilstand ---------- */
  var db, sb, S = { profile: null, ideas: [], plans: [], steps: [], achievements: [] };
  var interests = [];
  var activePlanId = null;
  var memberBirth = null;
  var chosenType = null;

  function idea() { return S.ideas[0] || null; }
  function activePlan() {
    var p = S.plans.filter(function (x) { return x.id === activePlanId; })[0];
    return p || S.plans[0] || null;
  }
  function stepsOf(planId) { return S.steps.filter(function (s) { return s.plan_id === planId; }).sort(function (a, b) { return a.sort - b.sort; }); }
  function phaseOf(plan, step) { var t = PLANS[plan.plan_type]; var s = t && t.steps[step.sort]; return s ? s.phase : ""; }

  /* ---------- Navigasjon ---------- */
  var currentView = "dash";
  function show(view) {
    currentView = view;
    var navKey = (view === "brainstorm" || view === "analyse" || view === "verktoy") ? "ide" : view;
    Array.prototype.forEach.call(document.querySelectorAll("#appnav button"), function (b) {
      if (b.getAttribute("data-view") === navKey) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
    });
    Array.prototype.forEach.call(document.querySelectorAll("#app .view"), function (v) { v.hidden = v.id !== "view-" + view; });
    stopExercise();
    ["idea-cheer", "bs-cheer", "profil-cheer"].forEach(function (id) { $(id).hidden = true; });
    if (view === "plan") renderPlanForm();
    if (view === "profil") renderProfileView();
    if (view === "ide") renderIdeaView();
    if (view === "dash") renderDash();
    if (view === "brainstorm") renderBrainstorm();
    if (view === "analyse") renderAnalyse();
    if (view === "verktoy") renderTools();
    renderFlow();
    var hd = document.querySelector("#view-" + view + " h2");
    if (hd) { hd.setAttribute("tabindex", "-1"); hd.focus(); }
  }

  /* ---------- Profil ---------- */
  function renderInterests() {
    var ul = $("interest-list"); ul.textContent = "";
    if (!interests.length) { ul.appendChild(h("li", { class: "missing" }, ["[Mangler]"])); return; }
    interests.forEach(function (t, i) {
      ul.appendChild(h("li", null, [t, h("button", { type: "button", "aria-label": "Fjern " + t, onclick: function () { interests.splice(i, 1); renderInterests(); $("interest-input").focus(); } }, ["×"])]));
    });
  }
  function addInterest() {
    var inp = $("interest-input"), v = inp.value.trim();
    if (!v) return;
    if (interests.map(function (x) { return x.toLowerCase(); }).indexOf(v.toLowerCase()) === -1 && interests.length < 30) interests.push(v.slice(0, 60));
    inp.value = ""; renderInterests(); inp.focus();
  }
  function fillProfile() {
    var p = S.profile || {};
    interests = (p.interests || []).slice();
    renderInterests();
    $("ambitions").value = p.ambitions || "";
    $("hours").value = p.hours_per_week == null ? "" : p.hours_per_week;
    $("has_already").value = p.has_already || "";
    $("skills").value = p.skills || "";
    $("use_horoscope").checked = !!p.use_horoscope;
    /* Demoen bruker en eksempeldato, så inspirasjonslinjen for stjernetegn kan vises. */
    $("birth_local").value = DEMO ? "1990-07-30" : (load("minbiz_birth_local") || "");
    renderHoroscope();
  }
  function renderHoroscope() {
    var on = $("use_horoscope").checked;
    $("horo-box").hidden = !on;
    if (!on) return;
    var date = memberBirth || $("birth_local").value || null;
    $("horo-birth-field").hidden = !!memberBirth;
    var out = $("horo-out"); out.textContent = "";
    var sign = zodiac(date);
    if (!sign) { out.appendChild(h("span", { class: "muted" }, ["Fødselsdato: ikke satt."])); return; }
    out.appendChild(h("span", null, ["Stjernetegn: ", h("b", null, [sign]), " "]));
    out.appendChild(h("span", { class: "tag trad" }, ["Tradisjon og inspirasjon"]));
    if (HORO_LINE[sign]) out.appendChild(h("span", { class: "horo-line" }, [HORO_LINE[sign]]));
    out.appendChild(h("span", { class: "hint" }, [(memberBirth ? "Hentet fra profilen din i Min dag. " : "") + "Brukes bare til refleksjon, aldri som grunnlag for penger, lån eller avtaler."]));
  }
  /* Lagrer det som står i profilskjemaet nå. Brukes både av skjemaet og av spørsmål-for-spørsmål. */
  async function persistProfile() {
    var hrs = String($("hours").value).trim();
    var n = hrs === "" ? null : Math.max(0, Math.min(168, parseInt(hrs, 10) || 0));
    S.profile = await db.saveProfile({
      interests: interests.slice(), ambitions: $("ambitions").value.trim() || null, hours_per_week: n,
      has_already: $("has_already").value.trim() || null, skills: $("skills").value.trim() || null,
      use_horoscope: $("use_horoscope").checked
    });
    if (!DEMO) store("minbiz_birth_local", $("birth_local").value || null);
    chosenType = null;
    return S.profile;
  }
  async function saveProfile(ev) {
    ev.preventDefault();
    try {
      await persistProfile();
      renderProfileSide();
      toast("Profilen er lagret.");
    } catch (e) { toast("Kunne ikke lagre profilen: " + errText(e)); }
  }

  /* ---------- Idé ---------- */
  function fillIdea() {
    var i = idea() || {};
    $("title").value = i.title || ""; $("description").value = i.description || "";
    $("goal").value = i.goal || ""; $("audience").value = i.audience || ""; $("promise").value = i.promise || "";
    var kind = i.kind || "bedrift";
    Array.prototype.forEach.call(document.querySelectorAll('input[name="kind"]'), function (r) { r.checked = r.value === kind; });
    renderIdeaCard();
  }
  function currentKind() { var r = document.querySelector('input[name="kind"]:checked'); return r ? r.value : "bedrift"; }
  function renderIdeaCard() {
    var dl = $("idea-card"); dl.textContent = "";
    var rows = [["Tittel", $("title").value], ["Type", KIND_LABEL[currentKind()]], ["Beskrivelse", $("description").value], ["Mål", $("goal").value], ["Hvem det er for", $("audience").value], ["Løfte", $("promise").value]];
    rows.forEach(function (r) {
      dl.appendChild(h("dt", null, [r[0]]));
      dl.appendChild(missing(r[1]) ? h("dd", { class: "missing" }, ["[Mangler]"]) : h("dd", null, [String(r[1]).trim()]));
    });
  }
  async function saveIdea(ev) {
    ev.preventDefault();
    var title = $("title").value.trim();
    if (!title) { $("idea-err").textContent = "Skriv en tittel, et arbeidsnavn holder."; $("title").focus(); return; }
    $("idea-err").textContent = "";
    var cur = idea();
    var row = { title: title, description: $("description").value.trim() || null, kind: currentKind(), goal: $("goal").value.trim() || null, audience: $("audience").value.trim() || null, promise: $("promise").value.trim() || null };
    if (cur) row.id = cur.id;
    try {
      var saved = norm(await db.saveIdea(row));
      if (cur) S.ideas[0] = saved; else S.ideas.unshift(saved);
      chosenType = null;
      renderFlow();
      toast("Idéen er lagret. Neste: brainstorming.");
      if (!cur) cheer("idea");
    } catch (e) { toast("Kunne ikke lagre idéen: " + errText(e)); }
  }
  /* Arbeidsnavn fra beskrivelsen, så idéen kan lagres før den har fått et navn. */
  function autoTitle() {
    var d = $("description").value.trim().split(/[.!?\n]/)[0].trim();
    if (!d) return "Uten navn ennå";
    var w = d.split(/\s+/).slice(0, 6).join(" ");
    return w.charAt(0).toUpperCase() + w.slice(1, 80);
  }
  /* Lagrer det som står i idéskjemaet nå, uten krav om tittel. Brukes av spørsmål-for-spørsmål. */
  async function persistIdea() {
    var cur = idea();
    if (!$("title").value.trim()) $("title").value = autoTitle();
    var row = { title: $("title").value.trim().slice(0, 200), description: $("description").value.trim() || null, kind: currentKind(), goal: $("goal").value.trim() || null, audience: $("audience").value.trim() || null, promise: $("promise").value.trim() || null };
    if (cur) row.id = cur.id;
    var saved = norm(await db.saveIdea(row));
    if (cur) S.ideas[0] = saved; else S.ideas.unshift(saved);
    chosenType = null;
    renderIdeaCard();
    if (!cur) cheer("idea");
    return saved;
  }

  /* ---------- Plan ---------- */
  function suggest() {
    var i = idea(), hrs = S.profile ? S.profile.hours_per_week : null, kind = i ? i.kind : "ide";
    if (hrs != null && hrs < 5) return ["forste_uke", "Du har under 5 timer i uka. «Første uke» gir små steg du rekker."];
    if (kind === "ekstra_inntekt") return ["30_60_90", "En ekstra inntekt bygges med jevn rytme. «30/60/90 dager» gir mål for hver måned."];
    if (kind === "bedrift") return ["6_uker", "En ny bedrift trenger en skikkelig start. «6-ukers oppstart» går gjennom grunnmur, lansering, bevis og system."];
    if (kind === "imperium") return ["30_60_90", "Et stort mål trenger retning for et helt kvartal. Etter 90 dager kan du lage en full forretningsplan."];
    return ["forste_uke", "En idé testes best raskt. «Første uke» viser om den er verdt mer tid."];
  }
  /* Ekstra steg fra Verktøy får negativ sortering, så de kommer først og ikke blandes med malens faser. */
  function buildSteps(type, start, extras) {
    extras = extras || [];
    var pre = extras.map(function (s, idx) {
      return { sort: idx - extras.length, title: s.title, detail: s.list.join("\n"), due_date: addDays(start, type === "24t" ? 0 : idx), status: "neste", moved_count: 0, done_at: null };
    });
    return pre.concat(PLANS[type].steps.map(function (s, i) {
      return { sort: i, title: s.t ? s.title + " (kl. " + s.t + ")" : s.title, detail: s.list.join("\n"), due_date: addDays(start, s.d), status: "neste", moved_count: 0, done_at: null };
    }));
  }
  function planExtras() { return usesTools() ? recommend().steps : []; }
  function renderPlanForm() {
    var i = idea();
    $("plan-needs-idea").hidden = !!i;
    $("plan-form").hidden = !i;
    if (!i) return;
    var sg = usesTools() ? (function (r) { return [r.type, r.why]; })(recommend()) : suggest();
    if (!chosenType) chosenType = sg[0];
    var box = $("suggest"); box.textContent = "";
    box.appendChild(h("b", null, ["Forslag: " + PLANS[sg[0]].name + ". "]));
    box.appendChild(document.createTextNode(sg[1] + " Du kan velge en annen under."));
    var fn = $("plan-flow-note"), b = i.brainstorm, a = i.desk_analysis;
    var gaps = [];
    if (!b.done) gaps.push("brainstormingen");
    if (!a.done) gaps.push("skrivebordsanalysen");
    fn.textContent = "";
    if (gaps.length) {
      fn.appendChild(document.createTextNode("[Mangler] " + gaps.join(" og ") + ". Planen kan lages likevel. Den blir bedre når du har vært gjennom "));
      fn.appendChild(h("button", { type: "button", class: "linkish", "data-goto": b.done ? "analyse" : "brainstorm" }, [b.done ? "skrivebordsanalysen" : "brainstormingen"]));
      fn.appendChild(document.createTextNode(" og verktøyene."));
      fn.hidden = false;
    } else fn.hidden = true;
    var wrap = $("ptypes"); wrap.textContent = "";
    PLAN_ORDER.forEach(function (k) {
      var p = PLANS[k];
      var inp = h("input", { type: "radio", name: "ptype", value: k, onchange: function () { chosenType = k; renderPreview(); } });
      inp.checked = k === chosenType;
      wrap.appendChild(h("label", { class: "ptype" }, [inp, h("span", null, [h("b", null, [p.name + (k === sg[0] ? " (foreslått)" : "")]), h("span", { class: "muted small" }, [p.len + ". " + p.fits])])]));
    });
    if (!$("start_date").value) $("start_date").value = today();
    $("plan-exists").hidden = !S.plans.length;
    renderPreview();
  }
  function renderPreview() {
    var ol = $("preview"); ol.textContent = "";
    var start = $("start_date").value || today();
    buildSteps(chosenType, start, planExtras()).forEach(function (s) {
      ol.appendChild(h("li", null, [h("b", null, [s.title]), " ", h("span", { class: "muted small" }, [fmtDate(s.due_date)]), s.sort < 0 ? h("span", { class: "tag idea" }, ["Fra Verktøy"]) : null]));
    });
  }
  async function makePlan(type, start) {
    var i = idea(); if (!i) return false;
    var tools = usesTools();
    try {
      var res = await db.createPlan({ idea_id: i.id, plan_type: type, start_date: start }, buildSteps(type, start, planExtras()));
      S.plans.unshift(res.plan); S.steps = S.steps.concat(res.steps);
      activePlanId = res.plan.id;
      $("celebrate").hidden = true;
      if (tools) await saveFlow({ phase: "plan" });
      await autoMove();
      toast("Planen er laget.");
      show("dash");
      return true;
    } catch (e) { toast("Kunne ikke lage planen: " + errText(e)); return false; }
  }
  async function createPlan(ev) {
    ev.preventDefault();
    var btn = $("plan-btn"); btn.disabled = true;
    await makePlan(chosenType, $("start_date").value || today());
    btn.disabled = false;
  }

  /* ---------- Flytt passerte steg til i dag ---------- */
  async function autoMove() {
    var t = today(), changed = [], moved = 0;
    S.steps.forEach(function (s) {
      if (s.status === "gjort" || !s.due_date) return;
      if (s.due_date < t) {
        s.due_date = t; s.moved_count = (s.moved_count || 0) + 1; moved++;
        if (s.status === "neste") s.status = "i_dag";
        changed.push(s);
      } else if (s.due_date === t && s.status === "neste") {
        s.status = "i_dag"; changed.push(s);
      }
    });
    if (changed.length) { try { await db.updateSteps(changed); } catch (e) { toast("Kunne ikke oppdatere datoene: " + errText(e)); } }
    var m = $("moved-msg");
    if (moved) {
      m.textContent = (moved === 1 ? "Ett steg" : moved + " steg") + " fra tidligere dager er flyttet til i dag. Planer tar ofte litt lengre tid enn tenkt, og det går helt fint. Ta dem i ditt eget tempo.";
      m.hidden = false;
    }
  }

  /* ---------- Oversikt og tavle ---------- */
  function stepCard(s, plan) {
    var li = h("li", { class: "step" });
    li.appendChild(h("p", { class: "t" }, [s.title]));
    var meta = fmtDate(s.due_date);
    var ph = phaseOf(plan, s); if (ph && ph !== PLANS[plan.plan_type].name) meta += " · " + ph;
    if (s.moved_count) meta += " · flyttet " + s.moved_count + (s.moved_count === 1 ? " gang" : " ganger");
    li.appendChild(h("p", { class: "d" }, [meta]));
    if (s.detail) li.appendChild(h("ul", { class: "detail" }, s.detail.split("\n").map(function (x) { return h("li", null, [x]); })));
    var moves = h("div", { class: "moves", role: "group", "aria-label": "Flytt «" + s.title + "»" });
    STATUS.forEach(function (st) {
      if (st.key === s.status) return;
      moves.appendChild(h("button", { type: "button", class: "btn small " + (st.key === "gjort" ? "" : "quiet"), onclick: function () { moveStep(s, st.key); } }, [st.key === "gjort" ? "Merk som gjort" : "Til " + st.label]));
    });
    li.appendChild(moves);
    return li;
  }
  async function moveStep(s, status) {
    var prev = { status: s.status, done_at: s.done_at };
    s.status = status;
    s.done_at = status === "gjort" ? new Date().toISOString() : null;
    try { await db.updateSteps([s]); }
    catch (e) { s.status = prev.status; s.done_at = prev.done_at; toast("Kunne ikke flytte steget: " + errText(e)); return; }
    var lbl = STATUS.filter(function (x) { return x.key === status; })[0].label;
    toast("«" + s.title + "» er flyttet til " + lbl + ".");
    if (status === "gjort") await checkAchievements(activePlan());
    renderDash();
  }
  async function checkAchievements(plan) {
    var steps = stepsOf(plan.id), tpl = PLANS[plan.plan_type];
    var have = S.achievements.filter(function (a) { return a.plan_id === plan.id; }).map(function (a) { return a.title; });
    var phases = [];
    steps.forEach(function (s) { var p = phaseOf(plan, s); if (p && phases.indexOf(p) === -1) phases.push(p); });
    var earned = null;
    if (phases.length > 1) {
      for (var i = 0; i < phases.length; i++) {
        var ph = phases[i];
        var inPh = steps.filter(function (s) { return phaseOf(plan, s) === ph; });
        var title = "Fase fullført: " + ph;
        if (inPh.every(function (s) { return s.status === "gjort"; }) && have.indexOf(title) === -1) {
          try { var a = await db.addAchievement({ plan_id: plan.id, kind: "fase", title: title }); S.achievements.unshift(a); earned = { a: a, phase: ph, next: phases[i + 1] || null }; }
          catch (e) { toast("Kunne ikke lagre merket: " + errText(e)); }
        }
      }
    }
    var ptitle = "Plan fullført: " + tpl.name;
    if (steps.length && steps.every(function (s) { return s.status === "gjort"; }) && have.indexOf(ptitle) === -1) {
      try { var b = await db.addAchievement({ plan_id: plan.id, kind: "plan", title: ptitle }); S.achievements.unshift(b); earned = { a: b, plan: true }; }
      catch (e2) { toast("Kunne ikke lagre merket: " + errText(e2)); }
    }
    if (earned) celebrate(earned, plan);
  }
  function badgeIcon() {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("fill", "none"); svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2.4"); svg.setAttribute("stroke-linecap", "round"); svg.setAttribute("stroke-linejoin", "round");
    var p = document.createElementNS(ns, "path"); p.setAttribute("d", "M5 12.5l4.5 4.5L19 7.5"); svg.appendChild(p);
    return svg;
  }
  function celebrate(e, plan) {
    var box = $("celebrate"); box.textContent = "";
    var badge = h("span", { class: "badge", "aria-hidden": "true" }, [badgeIcon()]);
    var body = h("div", { class: "stack" });
    body.appendChild(h("h3", null, [e.a.title]));
    if (e.plan) {
      var nx = NEXT_LEVEL[plan.plan_type];
      body.appendChild(h("p", null, ["Hele planen «" + PLANS[plan.plan_type].name + "» er gjennomført. Godt arbeid, steg for steg."]));
      body.appendChild(h("p", null, [h("b", null, ["Neste nivå: " + PLANS[nx].name + ". "]), PLANS[nx].fits]));
      body.appendChild(h("div", { class: "btnrow" }, [
        h("button", { type: "button", class: "btn", onclick: function () { chosenType = nx; $("start_date").value = today(); show("plan"); } }, ["Lag neste plan"]),
        h("button", { type: "button", class: "btn quiet", onclick: function () { box.hidden = true; } }, ["Lukk"])
      ]));
    } else {
      body.appendChild(h("p", null, ["Du har fullført fasen «" + e.phase + "». Fint jobbet."]));
      if (e.next) body.appendChild(h("p", null, [h("b", null, ["Neste nivå: "]), "fasen «" + e.next + "» ligger klar på tavlen."]));
      body.appendChild(h("div", { class: "btnrow" }, [h("button", { type: "button", class: "btn quiet", onclick: function () { box.hidden = true; } }, ["Lukk"])]));
    }
    box.appendChild(badge); box.appendChild(body);
    box.hidden = false;
  }
  function renderSupport(plan) {
    var box = $("support"); box.textContent = "";
    var i = idea(), kind = i ? i.kind : "ide";
    var keys = (SUPPORT[kind] || SUPPORT.ide).slice();
    if (plan && plan.plan_type === "forretningsplan" && keys.indexOf("inno") === -1) keys.push("inno");
    box.appendChild(h("h3", null, ["Støtte mens idéen formes"]));
    box.appendChild(h("p", { class: "small" }, ["Offentlige kilder som er verdt å lese for en idé av typen «" + KIND_LABEL[kind] + "». MinBiz gir ikke skatte-, juridiske eller investeringsråd. Les hos kilden, og spør regnskapsfører eller bank når du er usikker."]));
    box.appendChild(h("ul", { class: "sources" }, keys.map(function (k) {
      var s = SRC[k];
      return h("li", null, [h("a", { href: s.url, rel: "noopener noreferrer", target: "_blank" }, [s.name, h("span", { class: "sr-only" }, [" (åpnes i ny fane)"])]), h("br"), h("span", { class: "muted small" }, [s.why])]);
    })));
  }
  function renderDash() {
    var plan = activePlan();
    $("dash-empty").hidden = !!plan;
    $("dash-plan").hidden = !plan;
    if (!plan) return;
    var pick = $("plan-pick");
    $("plan-pick-wrap").hidden = S.plans.length < 2;
    pick.textContent = "";
    S.plans.forEach(function (p) {
      var o = h("option", { value: p.id }, [PLANS[p.plan_type].name + " fra " + fmtDate(p.start_date)]);
      if (p.id === plan.id) o.selected = true;
      pick.appendChild(o);
    });
    var steps = stepsOf(plan.id);
    var done = steps.filter(function (s) { return s.status === "gjort"; }).length;
    var pct = steps.length ? Math.round(done / steps.length * 100) : 0;
    $("progress").value = pct;
    $("progress-text").textContent = PLANS[plan.plan_type].name + ": " + done + " av " + steps.length + " steg gjort (" + pct + " %).";

    var ul = $("today"); ul.textContent = "";
    var tod = steps.filter(function (s) { return s.status === "i_dag"; });
    if (tod.length) tod.forEach(function (s) { ul.appendChild(stepCard(s, plan)); });
    else {
      var nxt = steps.filter(function (s) { return s.status === "neste"; })[0];
      if (nxt) {
        ul.appendChild(h("li", null, [h("p", null, ["Ingen steg står på i dag. Neste steg er «" + nxt.title + "» (" + fmtDate(nxt.due_date) + ")."]),
          h("button", { type: "button", class: "btn small", onclick: function () { moveStep(nxt, "i_dag"); } }, ["Ta det i dag"])]));
      } else if (steps.length && steps.every(function (s) { return s.status === "gjort"; })) {
        ul.appendChild(h("li", null, [h("p", null, ["Alle stegene i denne planen er gjort."])]));
      } else {
        ul.appendChild(h("li", null, [h("p", null, ["Ingen steg står på i dag. Resten venter på noe eller noen."])]));
      }
    }

    var board = $("board"); board.textContent = "";
    STATUS.forEach(function (st) {
      var list = steps.filter(function (s) { return s.status === st.key; });
      var hid = "col-" + st.key;
      var col = h("section", { class: "col", "aria-labelledby": hid }, [h("h4", { id: hid, class: "colh" }, [h("span", null, [st.label]), h("span", { class: "muted", "aria-label": list.length + " steg" }, [String(list.length)])])]);
      var cul = h("ul");
      if (!list.length) cul.appendChild(h("li", { class: "muted small" }, ["Tomt"]));
      list.forEach(function (s) { cul.appendChild(stepCard(s, plan)); });
      col.appendChild(cul);
      board.appendChild(col);
    });

    var merits = $("merits"); merits.textContent = "";
    if (!S.achievements.length) merits.appendChild(h("li", { class: "muted" }, ["Ingen merker ennå. Det første kommer når en fase eller en plan er gjort."]));
    S.achievements.forEach(function (a) {
      var when = a.earned_at ? fmtDate(a.earned_at.slice(0, 10)) : "";
      merits.appendChild(h("li", null, [h("span", { class: "dot", "aria-hidden": "true" }), h("span", null, [a.title, " ", h("span", { class: "muted small" }, [when])])]));
    });
    renderSupport(plan);
  }

  /* ---------- Fremdrift: Min idé, Brainstorming, Skrivebordsanalyse, Verktøy, Plan ---------- */
  var PHASES = ["brainstorm", "analyse", "verktoy", "plan"];
  var FLOW = [
    { view: "ide", name: "Min idé" },
    { view: "brainstorm", name: "Brainstorming" },
    { view: "analyse", name: "Skrivebordsanalyse" },
    { view: "verktoy", name: "Verktøy" },
    { view: "plan", name: "Plan" }
  ];
  var FLOW_LABEL = { done: "Ferdig", skipped: "[Mangler]", active: "Påbegynt", todo: "Ikke startet", locked: "Lagre idéen først" };

  function norm(i) {
    if (!i) return i;
    var b = i.brainstorm && typeof i.brainstorm === "object" ? i.brainstorm : {};
    if (!Array.isArray(b.cards)) b.cards = [];
    i.brainstorm = b;
    var a = i.desk_analysis && typeof i.desk_analysis === "object" ? i.desk_analysis : {};
    if (!a.areas || typeof a.areas !== "object") a.areas = {};
    AREAS.forEach(function (x) { if (!Array.isArray(a.areas[x.k])) a.areas[x.k] = []; });
    i.desk_analysis = a;
    if (PHASES.indexOf(i.phase) === -1) i.phase = "brainstorm";
    return i;
  }
  function usesTools() { var i = idea(); return !!i && PHASES.indexOf(i.phase) >= 2; }
  function hasPlanFor(i) { return !!i && S.plans.some(function (p) { return p.idea_id === i.id; }); }

  async function saveFlow(fields) {
    var i = idea(); if (!i) return false;
    var row = { id: i.id };
    Object.keys(fields).forEach(function (k) { row[k] = JSON.parse(JSON.stringify(fields[k])); });
    try {
      var saved = norm(await db.saveIdea(row));
      S.ideas[0] = saved;
      chosenType = null;
      renderFlow();
      return true;
    } catch (e) { toast("Kunne ikke lagre: " + errText(e)); return false; }
  }
  function phaseAtLeast(p) {
    var i = idea(); if (!i) return {};
    return PHASES.indexOf(i.phase) < PHASES.indexOf(p) ? { phase: p } : {};
  }

  function flowStatus() {
    var i = idea(), st = {};
    st.ide = i ? "done" : "todo";
    if (!i) { st.brainstorm = st.analyse = st.verktoy = st.plan = "locked"; return st; }
    var b = i.brainstorm, a = i.desk_analysis;
    st.brainstorm = b.skipped ? "skipped" : b.done ? "done" : b.cards.length ? "active" : "todo";
    var nf = AREAS.reduce(function (n, x) { return n + a.areas[x.k].length; }, 0);
    st.analyse = a.skipped ? "skipped" : a.done ? "done" : nf ? "active" : "todo";
    var hp = hasPlanFor(i);
    st.verktoy = (i.phase === "plan" || hp) ? "done" : i.phase === "verktoy" ? "active" : "todo";
    st.plan = hp ? "done" : "todo";
    return st;
  }
  function renderFlow() {
    var nav = $("flow");
    var inFlow = FLOW.some(function (f) { return f.view === currentView; });
    nav.hidden = !inFlow;
    if (!inFlow) return;
    var st = flowStatus(), ol = $("flow-steps"); ol.textContent = "";
    FLOW.forEach(function (f, n) {
      var s = st[f.view], cur = f.view === currentView;
      var btn = h("button", { type: "button", "data-goto": f.view, "aria-current": cur ? "step" : null, "aria-label": "Steg " + (n + 1) + ": " + f.name + ", " + FLOW_LABEL[s] }, [
        h("span", { class: "num", "aria-hidden": "true" }, [s === "done" ? "✓" : s === "skipped" ? "!" : String(n + 1)]),
        h("span", { class: "lbl", "aria-hidden": "true" }, [f.name]),
        h("span", { class: "s", "aria-hidden": "true" }, [FLOW_LABEL[s]])
      ]);
      ol.appendChild(h("li", { class: s }, [btn]));
    });
    var idx = 0; FLOW.forEach(function (f, n) { if (f.view === currentView) idx = n; });
    $("flow-now").textContent = "Steg " + (idx + 1) + " av 5: " + FLOW[idx].name + ". " + FLOW_LABEL[st[FLOW[idx].view]] + ".";
  }

  /* ---------- Brainstorming ---------- */
  var QUESTIONS = [
    { k: "muligheter", q: "Hvilke muligheter ser du?", hint: "Hva kan idéen bli til? Én mulighet per kort." },
    { k: "hvem", q: "Hvem kan dette hjelpe?", hint: "Tenk på konkrete personer eller grupper." },
    { k: "vinkler", q: "Hvilke andre vinkler finnes?", hint: "Som tjeneste, som produkt, digitalt eller lokalt." },
    { k: "risiko", q: "Hva kan gå galt?", hint: "Lurt å tenke på før du setter i gang." },
    { k: "styrker", q: "Hva er du god på som passer her?", hint: "Ferdigheter, erfaring, utstyr eller nettverk." }
  ];
  function splitList(t) { return String(t || "").split(/[,;\n]+/).map(function (x) { x = x.trim(); return x.charAt(0).toUpperCase() + x.slice(1); }).filter(function (x) { return x && x.length <= 80; }); }
  function suggestionsFor(k) {
    var p = S.profile || {}, i = idea() || {};
    if (k === "muligheter") return (p.interests || []).slice(0, 4).map(function (t) { return "Koble idéen med " + t.toLowerCase(); });
    if (k === "hvem") return (missing(i.audience) ? [] : [String(i.audience).trim().slice(0, 80)]).concat(["Folk i nærmiljøet ditt"]);
    if (k === "vinkler") return ["Som tjeneste", "Som produkt", "Digitalt, på nett", "Lokalt, der du bor"];
    if (k === "risiko") return ["For lite tid i hverdagen", "Ingen vil betale prisen", "Regler jeg ikke kjenner"];
    if (k === "styrker") return splitList(p.skills).concat(splitList(p.has_already)).slice(0, 6);
    return [];
  }
  function renderBrainstorm() {
    var i = idea();
    $("bs-needs-idea").hidden = !!i; $("bs-body").hidden = !i;
    if (!i) return;
    var p = S.profile || {};
    var ins = $("bs-inspo"); ins.textContent = "";
    ins.appendChild(h("h3", null, ["Fra profilen din"]));
    if (missing(p.ambitions) && !(p.interests || []).length) {
      ins.appendChild(h("p", { class: "small" }, ["Profilen din er tom. ", h("button", { type: "button", class: "linkish", "data-goto": "profil" }, ["Fyll inn interesser og ambisjoner"]), " for å få forslag her."]));
    } else {
      ins.appendChild(h("p", { class: "small" }, [h("b", null, ["Ambisjoner: "]), missing(p.ambitions) ? h("span", { class: "missing" }, ["[Mangler]"]) : String(p.ambitions).trim()]));
      ins.appendChild(h("p", { class: "small" }, [h("b", null, ["Interesser: "]), (p.interests || []).length ? p.interests.join(", ") : h("span", { class: "missing" }, ["[Mangler]"])]));
      ins.appendChild(h("p", { class: "muted small" }, ["Trykk på et forslag under et spørsmål for å bruke det som utgangspunkt."]));
    }
    var wrap = $("bs-questions"); wrap.textContent = "";
    QUESTIONS.forEach(function (Q) { wrap.appendChild(questionBlock(Q)); });
  }
  function questionBlock(Q) {
    var i = idea(), b = i.brainstorm;
    var inId = "bs-in-" + Q.k, hId = "bs-h-" + Q.k;
    var sec = h("section", { class: "card stack", "aria-labelledby": hId });
    sec.appendChild(h("h3", { id: hId }, [Q.q]));
    var list = h("ul", { class: "cards", "aria-label": "Idékort: " + Q.q });
    var mine = b.cards.filter(function (c) { return c.q === Q.k; });
    if (!mine.length) list.appendChild(h("li", { class: "empty muted small" }, ["Ingen kort ennå."]));
    mine.forEach(function (c) {
      list.appendChild(h("li", { class: c.fav ? "fav" : null }, [
        h("span", { class: "tag idea" }, ["Idé"]),
        h("span", { class: "txt" }, [c.text]),
        h("button", { type: "button", class: "iconbtn", "data-fav": c.id, "aria-pressed": c.fav ? "true" : "false", "aria-label": "Favoritt: " + c.text, title: "Favoritt", onclick: function () { toggleFav(c.id, Q.k); } }, [c.fav ? "★" : "☆"]),
        h("button", { type: "button", class: "iconbtn", "aria-label": "Slett: " + c.text, title: "Slett", onclick: function () { deleteCard(c.id, Q.k); } }, ["×"])
      ]));
    });
    sec.appendChild(list);
    var inp = h("input", { type: "text", id: inId, maxlength: "200", autocomplete: "off" });
    inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); addCard(Q.k); } });
    sec.appendChild(h("div", { class: "field" }, [
      h("label", { for: inId }, ["Nytt idékort ", h("span", { class: "hint" }, [Q.hint])]),
      h("div", { class: "inline-add" }, [inp, h("button", { type: "button", class: "btn quiet", onclick: function () { addCard(Q.k); } }, ["Legg til"])])
    ]));
    var sg = suggestionsFor(Q.k);
    if (sg.length) {
      sec.appendChild(h("div", { class: "sugg", role: "group", "aria-label": "Forslag til " + Q.q }, [h("span", { class: "muted small" }, ["Forslag:"])].concat(sg.map(function (t) {
        return h("button", { type: "button", onclick: function () { var el = $(inId); el.value = t; el.focus(); } }, [t]);
      }))));
    }
    return sec;
  }
  async function addCard(k) {
    var el = $("bs-in-" + k), v = el.value.trim();
    if (!v) { el.focus(); return; }
    if (await addCardTexts(k, [v])) { renderBrainstorm(); var n = $("bs-in-" + k); if (n) n.focus(); }
  }
  /* Legger ett eller flere idékort til under et spørsmål og lagrer med en gang. */
  async function addCardTexts(k, texts) {
    var b = JSON.parse(JSON.stringify(idea().brainstorm));
    texts = texts.map(function (t) { return String(t).trim(); }).filter(Boolean);
    if (!texts.length) return false;
    if (b.cards.length + texts.length > 100) { toast("Du har nesten 100 kort. Slett noen før du legger til flere."); return false; }
    /* Feiring bare for det aller første kortet. I demoen: første kort du legger til i økten. */
    var wasEmpty = b.cards.length === 0;
    texts.forEach(function (t) { b.cards.push({ id: uuid(), q: k, text: t.slice(0, 200), fav: false }); });
    var ok = await saveFlow({ brainstorm: b });
    if (ok && (DEMO || wasEmpty)) cheer("card");
    return ok;
  }
  async function toggleFav(id, k) {
    var b = JSON.parse(JSON.stringify(idea().brainstorm));
    b.cards.forEach(function (c) { if (c.id === id) c.fav = !c.fav; });
    if (await saveFlow({ brainstorm: b })) {
      renderBrainstorm();
      var btn = document.querySelector('[data-fav="' + id + '"]');
      if (btn) btn.focus();
    }
  }
  async function deleteCard(id, k) {
    var b = JSON.parse(JSON.stringify(idea().brainstorm));
    b.cards = b.cards.filter(function (c) { return c.id !== id; });
    if (await saveFlow({ brainstorm: b })) { renderBrainstorm(); var n = $("bs-in-" + k); if (n) n.focus(); toast("Kortet er slettet."); }
  }
  async function finishBrainstorm(skip) {
    var b = JSON.parse(JSON.stringify(idea().brainstorm));
    b.done = !skip; b.skipped = !!skip;
    if (await saveFlow(Object.assign({ brainstorm: b }, phaseAtLeast("analyse")))) {
      toast(skip ? "Brainstormingen er hoppet over og merket [Mangler]." : "Brainstormingen er lagret.");
      show("analyse");
    }
  }

  /* ---------- Skrivebordsanalyse ---------- */
  function enc(s) { return encodeURIComponent(s); }
  function g(q) { return "https://www.google.com/search?q=" + enc(q); }
  var AREAS = [
    { k: "marked", name: "Marked og etterspørsel", ask: "Søker folk etter dette, og øker eller synker interessen?", links: function (kw, pl) { return [
      ["Google Trends: interessen for «" + kw + "» i Norge over tid", "https://trends.google.com/trends/explore?geo=NO&q=" + enc(kw)],
      ["Google-søk: «" + kw + "»" + (pl ? " i " + pl : ""), g(kw + (pl ? " " + pl : ""))],
      ["SSB: søk i statistikken etter «" + kw + "»", "https://www.ssb.no/sok?sok=" + enc(kw)],
      ["SSB: statistikk om nye foretak i Norge", "https://www.ssb.no/virksomheter-foretak-og-regnskap/virksomheter-og-foretak/statistikk/foretak"]
    ]; } },
    { k: "malgruppe", name: "Målgruppe", ask: "Hvem er kundene, hvor mange er de, og hva spør de om?", links: function (kw, pl) { return [
      ["SSB Kommunefakta: befolkning og nøkkeltall" + (pl ? " (velg " + pl + ")" : ""), "https://www.ssb.no/kommunefakta"],
      ["SSB Statistikkbanken", "https://www.ssb.no/statbank/"],
      ["Google-søk: hva folk spør om «" + kw + "»", g(kw + " spørsmål erfaringer")]
    ]; } },
    { k: "konkurrenter", name: "Konkurrenter", ask: "Hvem tilbyr noe lignende i dag, og hva lover de?", links: function (kw, pl) { return [
      ["Google-søk: «" + kw + "»" + (pl ? " i " + pl : ""), g(kw + (pl ? " " + pl : ""))],
      ["Google Maps: «" + kw + "»" + (pl ? " i " + pl : ""), "https://www.google.com/maps/search/" + enc(kw + (pl ? " " + pl : ""))],
      ["Enhetsregisteret: søk etter virksomheter med «" + kw + "» i navnet", "https://virksomhet.brreg.no/nb/oppslag/enheter?navn=" + enc(kw)],
      ["Finn.no: lignende tilbud", "https://www.finn.no/recommerce/forsale/search?q=" + enc(kw)]
    ]; } },
    { k: "regler", name: "Regler og registrering", ask: "Må du registrere noe, og finnes det egne regler for dette?", links: function (kw) { return [
      ["Altinn: starte og drive bedrift", "https://info.altinn.no/starte-og-drive/"],
      ["Altinn: søk etter «" + kw + "»", "https://info.altinn.no/sok/?q=" + enc(kw)],
      ["Brønnøysundregistrene", "https://www.brreg.no/"],
      ["Skatteetaten: bedrift og organisasjon", "https://www.skatteetaten.no/bedrift-og-organisasjon/"]
    ]; } },
    { k: "pris", name: "Pris og økonomi", ask: "Hva tar andre betalt, og hva koster det deg å levere?", links: function (kw) { return [
      ["Google-søk: «" + kw + " pris»", g(kw + " pris")],
      ["Finn.no: priser på lignende", "https://www.finn.no/recommerce/forsale/search?q=" + enc(kw)],
      ["Skatteetaten: merverdiavgift", "https://www.skatteetaten.no/bedrift-og-organisasjon/avgifter/mva/"],
      ["Innovasjon Norge: starte bedrift", "https://www.innovasjonnorge.no/seksjon/starte"]
    ]; } }
  ];
  function isUrl(u) { return /^https?:\/\/[^\s]+\.[^\s]+/i.test(String(u || "").trim()); }
  function investigated(k) { var i = idea(); return !!i && i.desk_analysis.areas[k].some(function (f) { return isUrl(f.url); }); }
  function keyword() { var a = idea().desk_analysis; return (a.keyword && String(a.keyword).trim()) || idea().title; }
  function place() { var a = idea().desk_analysis; return (a.place && String(a.place).trim()) || ""; }
  function areaState(k) {
    var f = idea().desk_analysis.areas[k];
    if (f.some(function (x) { return isUrl(x.url); })) return ["ok", "Undersøkt med kilde"];
    if (f.length) return ["ass", "Bare antakelser"];
    return ["miss", "[Mangler]"];
  }
  function renderAnalyse() {
    var i = idea();
    $("an-needs-idea").hidden = !!i; $("an-body").hidden = !i;
    if (!i) return;
    $("an-keyword").value = keyword();
    $("an-place").value = place();
    renderAreas();
  }
  function renderAreas(clearKey) {
    var wrap = $("an-areas"), keep = {};
    Array.prototype.forEach.call(wrap.querySelectorAll("textarea, input"), function (el) { keep[el.id] = el.value; });
    if (clearKey) { delete keep["an-t-" + clearKey]; delete keep["an-u-" + clearKey]; }
    wrap.textContent = "";
    setTimeout(function () { Object.keys(keep).forEach(function (id) { var el = $(id); if (el && keep[id]) el.value = keep[id]; }); }, 0);
    var kw = $("an-keyword").value.trim() || idea().title, pl = $("an-place").value.trim();
    AREAS.forEach(function (A) {
      var hid = "an-h-" + A.k, stt = areaState(A.k);
      var sec = h("section", { class: "card stack area", "aria-labelledby": hid });
      sec.appendChild(h("div", { class: "areah" }, [h("h3", { id: hid }, [A.name]), h("span", { class: "tag " + (stt[0] === "ok" ? "ok" : stt[0] === "ass" ? "ass" : "miss") }, [stt[1]])]));
      sec.appendChild(h("p", { class: "small" }, [A.ask]));
      sec.appendChild(h("p", { class: "small muted" }, ["Ferdige søk i åpne kilder:"]));
      sec.appendChild(linkList(A, kw, pl));
      var fl = h("ul", { class: "cards", "aria-label": "Funn: " + A.name });
      var fs = idea().desk_analysis.areas[A.k];
      if (!fs.length) fl.appendChild(h("li", { class: "empty muted small" }, ["Ingen funn ennå."]));
      fs.forEach(function (f) {
        var src = isUrl(f.url)
          ? h("span", { class: "small" }, ["Kilde: ", h("a", { href: f.url.trim(), target: "_blank", rel: "noopener noreferrer" }, [shortUrl(f.url), h("span", { class: "sr-only" }, [" (åpnes i ny fane)"])])])
          : h("span", { class: "tag ass" }, ["[Antakelse]"]);
        fl.appendChild(h("li", null, [h("span", { class: "txt" }, [f.text, h("br"), src]),
          h("button", { type: "button", class: "iconbtn", "aria-label": "Slett funn: " + f.text, title: "Slett", onclick: function () { deleteFinding(A.k, f.id); } }, ["×"])]));
      });
      sec.appendChild(fl);
      var tId = "an-t-" + A.k, uId = "an-u-" + A.k, eId = "an-e-" + A.k;
      sec.appendChild(h("div", { class: "finding-form" }, [
        h("div", { class: "field" }, [h("label", { for: tId }, ["Hva fant du?"]), h("textarea", { id: tId, maxlength: "500", rows: "2" })]),
        h("div", { class: "field" }, [h("label", { for: uId }, ["Kilde (adresse) ", h("span", { class: "hint" }, ["Lim inn adressen der du fant det. Uten adresse merkes funnet [Antakelse]."])]), h("input", { type: "url", id: uId, inputmode: "url", maxlength: "500", autocomplete: "off", placeholder: "https://" })]),
        h("p", { id: eId, class: "missing small", role: "alert" }),
        h("div", { class: "btnrow" }, [h("button", { type: "button", class: "btn quiet", onclick: function () { addFinding(A.k); } }, ["Legg til funn"])])
      ]));
      wrap.appendChild(sec);
    });
  }
  function linkList(A, kw, pl) {
    return h("ul", { class: "linklist", id: "an-l-" + A.k }, A.links(kw, pl).map(function (L) {
      return h("li", null, [h("a", { href: L[1], target: "_blank", rel: "noopener noreferrer" }, [L[0], h("span", { class: "sr-only" }, [" (åpnes i ny fane)"])])]);
    }));
  }
  /* Oppdaterer bare søkelenkene, så halvskrevne funn ikke forsvinner. */
  function renderAreasKeepFocus() {
    var kw = $("an-keyword").value.trim() || idea().title, pl = $("an-place").value.trim();
    AREAS.forEach(function (A) { var old = $("an-l-" + A.k); if (old) old.parentNode.replaceChild(linkList(A, kw, pl), old); });
  }
  function shortUrl(u) { try { var x = new URL(u.trim()); return x.hostname.replace(/^www\./, "") + (x.pathname.length > 1 ? x.pathname.slice(0, 30) + (x.pathname.length > 30 ? "..." : "") : ""); } catch (e) { return u; } }
  async function addFinding(k) {
    var t = $("an-t-" + k), u = $("an-u-" + k), err = $("an-e-" + k);
    var text = t.value.trim(), url = u.value.trim();
    err.textContent = "";
    if (!text) { err.textContent = "Skriv hva du fant."; t.focus(); return; }
    if (url && !isUrl(url)) { err.textContent = "Adressen må starte med https:// eller http://. La feltet stå tomt hvis du ikke har en kilde."; u.focus(); return; }
    var a = JSON.parse(JSON.stringify(idea().desk_analysis));
    if (a.areas[k].length >= 50) { err.textContent = "Du har 50 funn her. Slett noen før du legger til flere."; return; }
    a.areas[k].push({ id: uuid(), text: text.slice(0, 500), url: url });
    a.keyword = $("an-keyword").value.trim() || null; a.place = $("an-place").value.trim() || null;
    if (await saveFlow({ desk_analysis: a })) { renderAreas(k); var n = $("an-t-" + k); if (n) n.focus(); toast(url ? "Funnet er lagret med kilde." : "Funnet er lagret og merket [Antakelse]."); }
  }
  async function deleteFinding(k, id) {
    var a = JSON.parse(JSON.stringify(idea().desk_analysis));
    a.areas[k] = a.areas[k].filter(function (f) { return f.id !== id; });
    if (await saveFlow({ desk_analysis: a })) { renderAreas(); var n = $("an-t-" + k); if (n) n.focus(); toast("Funnet er slettet."); }
  }
  async function saveSearchTerms() {
    var a = JSON.parse(JSON.stringify(idea().desk_analysis));
    a.keyword = $("an-keyword").value.trim() || null; a.place = $("an-place").value.trim() || null;
    await saveFlow({ desk_analysis: a });
  }
  async function finishAnalyse(skip) {
    var a = JSON.parse(JSON.stringify(idea().desk_analysis));
    a.done = !skip; a.skipped = !!skip;
    a.keyword = $("an-keyword").value.trim() || null; a.place = $("an-place").value.trim() || null;
    if (await saveFlow(Object.assign({ desk_analysis: a }, phaseAtLeast("verktoy")))) {
      toast(skip ? "Analysen er hoppet over og merket [Mangler]." : "Analysen er lagret.");
      show("verktoy");
    }
  }

  /* ---------- Verktøy: regelbasert anbefaling ---------- */
  function recommend() {
    var i = idea(), b = i.brainstorm;
    var base = suggest(), type = base[0], why = base[1];
    var covered = AREAS.filter(function (x) { return investigated(x.k); }).length;
    if (covered < 2 && (type === "6_uker" || type === "30_60_90")) {
      why = "Færre enn to av de fem områdene i analysen har funn med kilde. «Første uke» tester idéen raskt før du bruker mye tid og penger. Etterpå passer «" + PLANS[type].name + "».";
      type = "forste_uke";
    }
    var steps = [];
    if (!investigated("malgruppe")) steps.push({ title: "Snakk med fem mulige kunder", list: ["Spør hva de bruker i dag", "Spør hva som er vanskelig for dem", "Skriv ned ordene de bruker"], why: "Målgruppen har ingen funn med kilde ennå. Samtaler gir svar du ikke finner i statistikken." });
    if (!investigated("konkurrenter")) steps.push({ title: "Se på tre konkurrenter", list: ["Finn tre som tilbyr noe lignende", "Noter hva de lover og hva de tar betalt", "Skriv ned hvor du fant det"], why: "Konkurrentene er ikke undersøkt med kilde." });
    if (!investigated("regler")) steps.push({ title: "Sjekk registrering i Altinn", list: ["Les «Starte og drive» på info.altinn.no", "Finn ut om du må registrere deg i Enhetsregisteret", "Skriv ned spørsmål til regnskapsfører"], why: "Regler og registrering er ikke sjekket." });
    if (!investigated("marked")) steps.push({ title: "Finn ut om noen etterspør dette", list: ["Se på søkeordet ditt i Google Trends", "Spør fem i nettverket om de ville brukt det"], why: "Marked og etterspørsel har ingen funn med kilde." });
    if (!investigated("pris")) steps.push({ title: "Sett en foreløpig pris", list: ["Se hva andre tar for noe lignende", "Regn på hva det koster deg å levere", "Merk prisen som foreløpig"], why: "Pris og økonomi er ikke undersøkt med kilde." });
    var risks = b.cards.filter(function (c) { return c.q === "risiko"; }).sort(function (x, y) { return (y.fav ? 1 : 0) - (x.fav ? 1 : 0); });
    if (risks.length) steps.push({ title: "Bestem hva du gjør hvis noe går galt", list: risks.slice(0, 3).map(function (c) { return "Hvis: " + c.text; }), why: "Du skrev ned risikoer i brainstormingen. En kort plan for dem gjør starten tryggere." });
    var agents = [{ name: "Planlederen", why: "Holder oversikt over planen og foreslår neste steg. Bestemmer aldri for deg." }];
    if (!investigated("marked") || !investigated("konkurrenter") || !investigated("malgruppe")) agents.push({ name: "Markedsforskeren", why: "Kan finne fakta om marked, målgruppe og konkurrenter i åpne kilder, med kilde på hvert funn." });
    if (!investigated("regler")) agents.push({ name: "Forretningsjuristen", why: "Kan forklare registrering og regler med lenke til lovteksten, og si når du bør snakke med en fagperson." });
    if (!investigated("pris")) agents.push({ name: "Økonomen", why: "Kan regne på pris og budsjett med dine egne tall." });
    if (missing(i.promise)) agents.push({ name: "Tekstskriveren", why: "Løftet ditt mangler. Tekstskriveren kan foreslå det, og du godkjenner." });
    agents.push({ name: "Coachen", why: "Følger opp og feirer når du når et mål. Uten press." });
    return { type: type, why: why, steps: steps, agents: agents, covered: covered };
  }
  function renderTools() {
    var i = idea();
    $("vt-needs-idea").hidden = !!i;
    var body = $("vt-body"); body.textContent = ""; body.hidden = !i;
    if (!i) return;
    if (PHASES.indexOf(i.phase) < 2) saveFlow({ phase: "verktoy" });
    var b = i.brainstorm, a = i.desk_analysis, r = recommend();
    var favs = b.cards.filter(function (c) { return c.fav; });

    body.appendChild(h("p", null, ["MinBiz har sett på idéen, brainstormingen og analysen din. Her er verktøyene som passer nå, og hvorfor."]));
    var basis = h("div", { class: "card stack" }, [h("h3", null, ["Grunnlaget"])]);
    var dl = h("dl", { class: "basis" });
    dl.appendChild(h("dt", null, ["Brainstorming"]));
    dl.appendChild(b.skipped ? h("dd", { class: "missing" }, ["[Mangler] Hoppet over."]) : h("dd", null, [b.cards.length + " idékort, " + favs.length + " favoritter" + (b.done ? "." : ". Ikke merket som ferdig.")]));
    dl.appendChild(h("dt", null, ["Skrivebordsanalyse"]));
    dl.appendChild(a.skipped ? h("dd", { class: "missing" }, ["[Mangler] Hoppet over."]) : h("dd", null, [r.covered + " av 5 områder har funn med kilde" + (a.done ? "." : ". Ikke merket som ferdig.")]));
    basis.appendChild(dl);
    if (favs.length) {
      basis.appendChild(h("p", { class: "small" }, [h("b", null, ["Favorittene dine:"])]));
      basis.appendChild(h("ul", { class: "small" }, favs.slice(0, 6).map(function (c) { return h("li", null, [c.text, " ", h("span", { class: "tag idea" }, ["Idé"])]); })));
    }
    body.appendChild(basis);

    var pt = PLANS[r.type];
    body.appendChild(h("div", { class: "card stack" }, [
      h("h3", null, ["Anbefalt plan: " + pt.name]),
      h("p", { class: "muted small" }, [pt.len + ". " + pt.fits]),
      h("p", { class: "why" }, [h("b", null, ["Hvorfor: "]), r.why])
    ]));

    var sc = h("div", { class: "card stack" }, [h("h3", null, ["Steg som legges først i planen"])]);
    if (!r.steps.length) sc.appendChild(h("p", null, ["Ingen ekstra steg. Alle fem områdene har funn med kilde, og du har ingen risikokort."]));
    else sc.appendChild(h("ol", { class: "toolsteps" }, r.steps.map(function (s) {
      return h("li", null, [h("b", null, [s.title]), h("ul", { class: "small" }, s.list.map(function (x) { return h("li", null, [x]); })), h("p", { class: "why" }, [h("b", null, ["Hvorfor: "]), s.why])]);
    })));
    body.appendChild(sc);

    body.appendChild(h("div", { class: "card stack" }, [
      h("h3", null, ["Agenter som kan hjelpe senere"]),
      h("p", { class: "small muted" }, ["Agentene er ikke bygget ennå. De viser hva som kommer, og hvorfor de passer for deg."]),
      h("ul", { class: "agentlist" }, r.agents.map(function (ag) {
        return h("li", null, [h("b", null, [ag.name]), " ", h("span", { class: "tag soon" }, ["Kommer"]), h("p", { class: "why" }, [ag.why])]);
      }))
    ]));

    var mk = h("button", { type: "button", class: "btn", onclick: async function () {
      mk.disabled = true;
      chosenType = r.type;
      await makePlan(r.type, today());
      mk.disabled = false;
    } }, ["Lag planen"]);
    body.appendChild(h("div", { class: "btnrow" }, [mk, h("button", { type: "button", class: "btn quiet", "data-goto": "plan" }, ["Velg plantype og dato selv"])]));
    body.appendChild(h("p", { class: "muted small" }, ["«Lag planen» bruker anbefalt plantype med start i dag. MinBiz gir ikke skatte-, juridiske eller investeringsråd."]));
  }

  /* ---------- Inspirasjon: ett spørsmål om gangen, tale, «Jeg står fast», eksempler, speiling og feiring ---------- */
  /* Én kort, generell linje per stjernetegn. Tradisjon og inspirasjon, aldri spådom, aldri om penger. */
  var HORO_LINE = {
    "Væren": "Tradisjonen forbinder Væren med mot til å begynne. Hva kunne du startet på i det små?",
    "Tyren": "Tyren forbindes med tålmodighet og sans for ting som varer. Hva liker du å bygge sakte og godt?",
    "Tvillingene": "Tvillingene forbindes med nysgjerrighet og gode samtaler. Hvem kunne du fortalt om idéen din?",
    "Krepsen": "Krepsen forbindes med omsorg og trygge rammer. Hvem rundt deg vil du gjøre hverdagen lettere for?",
    "Løven": "Løven forbindes med varme og glede ved å skape. Hva liker du å vise frem av det du lager?",
    "Jomfruen": "Jomfruen forbindes med øye for detaljer og god orden. Hva ser du ofte kunne vært gjort litt bedre?",
    "Vekten": "Vekten forbindes med sans for balanse og samarbeid. Hvem kunne du gjort dette sammen med?",
    "Skorpionen": "Skorpionen forbindes med dybde og utholdenhet. Hvilket tema kunne du gravd deg ned i med glede?",
    "Skytten": "Skytten forbindes med eventyrlyst og læring. Hva har du lyst til å lære mer om?",
    "Steinbukken": "Steinbukken forbindes med stø kurs og ansvar. Hvilket lite steg kunne du tatt hver uke?",
    "Vannmannen": "Vannmannen forbindes med nye tanker og fellesskap. Hva kunne vært gjort på en ny måte der du bor?",
    "Fiskene": "Fiskene forbindes med fantasi og innlevelse. Hvilket bilde dukker opp når du tenker på idéen din?"
  };

  /* Lokale småting (valgt visning, hvor du er i spørsmålene, feiring vist). I demoen bare i minnet. */
  var MEM = {};
  function localGet(k) { return DEMO ? (MEM[k] == null ? null : MEM[k]) : load(k); }
  function localSet(k, v) { if (DEMO) MEM[k] = v; else store(k, v); }

  var PROFILE_Q = [
    { f: "interests", type: "text", q: "Hva gjør du helst en ledig lørdag?", hint: "Skriv det som faller deg inn, gjerne flere ting med komma mellom. Svarene blir til interessene dine." },
    { f: "skills", type: "area", q: "Hva spør folk deg ofte om hjelp til?", hint: "Det sier ofte noe om hva du er god på. Svaret havner under Ferdigheter." },
    { f: "has_already", type: "area", q: "Hva har du fra før som kan komme til nytte?", hint: "Utstyr, et lokale, en bil, et nettverk, kunder eller erfaring fra en jobb." },
    { f: "ambitions", type: "area", q: "Hva drømmer du om å få til? Stort eller lite.", hint: "Det kan være en ekstra inntekt, mer frihet eller noe du har lyst til å skape." },
    { f: "hours", type: "number", q: "Hvor mange timer har du i en vanlig uke?", hint: "Et grovt anslag holder. Du kan endre det når som helst." },
    { f: "horoscope", type: "horo", q: "Vil du ha stjernetegnet ditt med som inspirasjon?", hint: "Helt valgfritt. Det vises som tradisjon og inspirasjon, aldri som grunnlag for penger, lån eller avtaler." }
  ];
  var IDEA_Q = [
    { f: "description", type: "area", q: "Hva har du lyst til å lage, gjøre eller tilby?", hint: "Skriv med dine egne ord, som om du fortalte det til en venn over en kopp kaffe." },
    { f: "audience", type: "area", q: "Hvem ser du for deg at dette hjelper?", hint: "Tenk på en konkret person eller gruppe." },
    { f: "kind", type: "kind", q: "Hvor stort tenker du at dette skal bli?", hint: "Du kan endre det senere." },
    { f: "title", type: "text", q: "Hva vil du kalle idéen?", hint: "Et arbeidsnavn holder. Det kan byttes når som helst." },
    { f: "goal", type: "area", q: "Hvordan vet du at du har lykkes?", hint: "Gjerne noe du kan se eller kjenne på." },
    { f: "promise", type: "area", q: "Hva lover du dem, i én setning?", hint: "Hva blir bedre for dem etter at de har brukt det du tilbyr?" }
  ];
  var KIND_OPTS = [["ekstra_inntekt", "Ekstra inntekt ved siden av"], ["bedrift", "En egen bedrift"], ["imperium", "Et imperium: noe stort, over tid"], ["ide", "Bare en idé foreløpig"]];
  var GUIDE = { profil: { qs: PROFILE_Q, key: "minbiz_guide_profil" }, ide: { qs: IDEA_Q, key: "minbiz_guide_ide" } };

  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }
  function mode() { return localGet("minbiz_mode") === "all" ? "all" : "guide"; }
  function applyMode() {
    var m = mode();
    each(".modebar button", function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-mode") === m ? "true" : "false"); });
    $("profil-guide").hidden = m !== "guide"; $("profile-form").hidden = m === "guide";
    $("ide-guide").hidden = m !== "guide"; $("idea-form").hidden = m === "guide";
    $("profil-gstatus").hidden = $("ide-gstatus").hidden = m !== "guide";
    var pause = m === "guide"
      ? (DEMO ? "Det er helt greit å ta en pause. I demoen lagres svarene bare i minnet, og alt forsvinner når du lukker siden." : "Det er helt greit å ta en pause. Hvert svar lagres med en gang, og neste gang fortsetter du der du slapp.")
      : (DEMO ? "Det er helt greit å ta en pause. I demoen forsvinner alt når du lukker siden." : "Det er helt greit å ta en pause. Trykk Lagre før du går, så ligger alt klart neste gang.");
    $("profil-pause").textContent = pause; $("ide-pause").textContent = pause;
  }

  function uniq(list) { var seen = {}; return list.filter(function (x) { var k = x.toLowerCase(); if (seen[k]) return false; seen[k] = 1; return true; }); }
  function fieldGet(f) {
    if (f === "interests") return interests.join(", ");
    if (f === "kind") return currentKind();
    if (f === "horoscope") return $("use_horoscope").checked;
    return $(f).value;
  }
  function fieldSet(f, v) {
    if (f === "interests") { interests = uniq(splitList(v).map(function (x) { return x.slice(0, 60); })).slice(0, 30); renderInterests(); return; }
    if (f === "kind") { each('input[name="kind"]', function (r) { r.checked = r.value === v; }); return; }
    if (f === "horoscope") { $("use_horoscope").checked = !!v; renderHoroscope(); return; }
    $(f).value = v;
  }
  function gStep(w) {
    var n = parseInt(localGet(GUIDE[w].key), 10);
    return isNaN(n) ? 0 : Math.max(0, Math.min(GUIDE[w].qs.length, n));
  }

  function renderGuide(w, focus) {
    var box = $(w + "-guide"); box.textContent = "";
    var qs = GUIDE[w].qs, n = gStep(w);
    if (n >= qs.length) { renderGuideDone(w, box, focus); return; }
    var Q = qs[n], inId = "g-" + w + "-in", hintId = "g-" + w + "-hint";
    box.appendChild(h("p", { class: "gprog small muted" }, ["Spørsmål " + (n + 1) + " av " + qs.length]));
    box.appendChild(h("progress", { max: String(qs.length), value: String(n), "aria-hidden": "true" }));
    var input = null;
    if (Q.type === "kind") {
      var fs = h("fieldset", { class: "gq", "aria-describedby": hintId }, [h("legend", { class: "q" }, [Q.q]), h("p", { id: hintId, class: "hint" }, [Q.hint])]);
      var cur = currentKind();
      KIND_OPTS.forEach(function (o) {
        var r = h("input", { type: "radio", name: "g-kind", value: o[0], onchange: function () { fieldSet("kind", o[0]); renderIdeaCard(); } });
        r.checked = cur === o[0];
        fs.appendChild(h("label", { class: "check" }, [r, " " + o[1]]));
      });
      input = fs.querySelector("input:checked") || fs.querySelector("input");
      box.appendChild(fs);
    } else if (Q.type === "horo") {
      var fs2 = h("fieldset", { class: "gq", "aria-describedby": hintId }, [h("legend", { class: "q" }, [Q.q]), h("p", { id: hintId, class: "hint" }, [Q.hint])]);
      var cb = h("input", { type: "checkbox", id: "g-" + w + "-horo" }); cb.checked = $("use_horoscope").checked;
      fs2.appendChild(h("label", { class: "check" }, [cb, " Ja, vis stjernetegnet mitt som inspirasjon"]));
      var dt = null, dWrap = null;
      if (!memberBirth) {
        dt = h("input", { type: "date", id: "g-" + w + "-birth" }); dt.value = $("birth_local").value;
        dWrap = h("div", { class: "field" }, [h("label", { for: "g-" + w + "-birth" }, ["Fødselsdato ", h("span", { class: "hint" }, ["Brukes bare i denne nettleseren for å finne stjernetegnet. Den sendes ikke til oss."])]), dt]);
        fs2.appendChild(dWrap);
      }
      var out = h("p", { class: "small", "aria-live": "polite" });
      fs2.appendChild(out);
      var upd = function () {
        $("use_horoscope").checked = cb.checked;
        if (dt) $("birth_local").value = dt.value;
        if (dWrap) dWrap.hidden = !cb.checked;
        renderHoroscope();
        out.textContent = "";
        if (!cb.checked) return;
        var s = zodiac(memberBirth || $("birth_local").value);
        if (!s) { out.appendChild(h("span", { class: "muted" }, ["Skriv inn fødselsdatoen for å se stjernetegnet."])); return; }
        out.appendChild(h("span", { class: "tag trad" }, ["Tradisjon og inspirasjon"]));
        out.appendChild(h("span", { class: "horo-line" }, [s + ": " + HORO_LINE[s]]));
      };
      cb.addEventListener("change", upd); if (dt) dt.addEventListener("change", upd);
      upd();
      input = cb;
      box.appendChild(fs2);
    } else {
      box.appendChild(h("label", { for: inId, class: "q" }, [Q.q]));
      box.appendChild(h("p", { id: hintId, class: "hint" }, [Q.hint]));
      if (Q.type === "area") input = h("textarea", { id: inId, maxlength: Q.f === "promise" ? "1000" : "2000", rows: "4", "aria-describedby": hintId });
      else if (Q.type === "number") input = h("input", { type: "number", id: inId, min: "0", max: "168", step: "1", inputmode: "numeric", "aria-describedby": hintId });
      else input = h("input", { type: "text", id: inId, maxlength: Q.f === "title" ? "200" : "400", autocomplete: "off", "aria-describedby": hintId });
      input.value = fieldGet(Q.f) == null ? "" : fieldGet(Q.f);
      if (Q.type !== "area") input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); guideAnswer(w, false, 1); } });
      box.appendChild(input);
      var mb = Q.type === "number" ? null : micBtn(input);
      if (mb) box.appendChild(h("div", { class: "microw" }, [mb]));
    }
    box.appendChild(h("div", { class: "btnrow" }, [
      n > 0 ? h("button", { type: "button", class: "btn quiet", onclick: function () { guideAnswer(w, false, -1); } }, ["Tilbake"]) : null,
      h("button", { type: "button", class: "btn quiet", onclick: function () { guideAnswer(w, true, 1); } }, ["Vet ikke ennå"]),
      h("button", { type: "button", class: "btn", onclick: function () { guideAnswer(w, false, 1); } }, [n === qs.length - 1 ? "Ferdig" : "Neste"])
    ]));
    box.appendChild(h("div", { class: "btnrow" }, [h("button", { type: "button", class: "linkish", onclick: function () { openStuck(w); } }, ["Jeg står fast"])]));
    if (focus && input) input.focus();
  }

  function renderGuideDone(w, box, focus) {
    var hd = h("h3", { tabindex: "-1" }, [w === "profil" ? "Takk, nå har profilen et grunnlag" : "Idéen din er skrevet ned"]);
    box.appendChild(hd);
    if (w === "profil") {
      var dl = h("dl", { class: "basis" });
      [["Interesser", interests.join(", ")], ["Ferdigheter", $("skills").value], ["Har fra før", $("has_already").value], ["Ambisjoner", $("ambitions").value], ["Timer per uke", $("hours").value]].forEach(function (r) {
        dl.appendChild(h("dt", null, [r[0]]));
        dl.appendChild(missing(r[1]) ? h("dd", { class: "missing" }, ["[Mangler]"]) : h("dd", null, [String(r[1]).trim()]));
      });
      box.appendChild(dl);
      box.appendChild(h("p", { class: "small muted" }, ["Det som står som [Mangler], kan du fylle inn når du vil."]));
      box.appendChild(h("div", { class: "btnrow" }, [
        h("button", { type: "button", class: "btn", "data-goto": "ide" }, ["Gå videre til Min idé"]),
        h("button", { type: "button", class: "btn quiet", onclick: function () { localSet(GUIDE[w].key, "0"); renderGuide(w, true); } }, ["Gå gjennom spørsmålene igjen"])
      ]));
    } else {
      box.appendChild(h("p", null, ["Idékortet ved siden av viser det du har skrevet. Det som står som [Mangler], kan du fylle inn når du vil."]));
      box.appendChild(h("div", { class: "btnrow" }, [
        h("button", { type: "button", class: "btn", "data-goto": "brainstorm" }, ["Neste: brainstorming"]),
        h("button", { type: "button", class: "btn quiet", onclick: function () { localSet(GUIDE[w].key, "0"); renderGuide(w, true); } }, ["Gå gjennom spørsmålene igjen"])
      ]));
    }
    if (focus) hd.focus();
  }

  function ideaHasContent() {
    return ["title", "description", "audience", "goal", "promise"].some(function (f) { return !missing($(f).value); });
  }
  async function guideAnswer(w, unknown, delta) {
    var G = GUIDE[w], n = gStep(w), Q = G.qs[n], st = $(w + "-gstatus");
    var before = fieldGet(Q.f);
    if (Q.type === "kind") { if (unknown) fieldSet("kind", "ide"); }
    else if (Q.type === "horo") { if (unknown) fieldSet("horoscope", false); }
    else {
      var el = $("g-" + w + "-in"), v = unknown ? "" : el.value;
      if (Q.f === "hours" && !unknown && String(v).trim() !== "") {
        var num = Number(v);
        if (isNaN(num) || num < 0 || num > 168) { st.textContent = "Skriv et tall mellom 0 og 168, eller trykk Vet ikke ennå."; el.focus(); return; }
      }
      fieldSet(Q.f, v);
    }
    var changed = unknown || String(before) !== String(fieldGet(Q.f)) || Q.type === "kind" || Q.type === "horo";
    var msg = "";
    if (changed) {
      try {
        if (w === "profil") await persistProfile();
        else if (idea() || ideaHasContent()) await persistIdea();
        if (unknown && Q.f === "title") msg = "Helt greit. Idéen har fått arbeidsnavnet «" + $("title").value + "», så den kan lagres. Du kan bytte det når du vil.";
        else if (unknown) msg = "Helt greit. Det står som [Mangler], og du kan komme tilbake til det når du vil.";
        else msg = DEMO ? "Svaret er lagret i demoen." : "Svaret er lagret.";
      } catch (e) { st.textContent = "Kunne ikke lagre svaret: " + errText(e) + ". Svaret ligger fortsatt her. Prøv igjen om litt."; return; }
    }
    st.textContent = msg;
    localSet(G.key, String(Math.max(0, n + delta)));
    renderGuide(w, true);
    if (w === "profil") renderProfileSide(); else renderIdeaSide();
    renderFlow();
  }

  /* ---------- Tale: nettleserens egen talegjenkjenning ---------- */
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  var rec = null, recBtn = null;
  function micIcon() {
    var ns = "http://www.w3.org/2000/svg", svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("fill", "none"); svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2"); svg.setAttribute("stroke-linecap", "round"); svg.setAttribute("aria-hidden", "true");
    var r = document.createElementNS(ns, "rect"); r.setAttribute("x", "9"); r.setAttribute("y", "3"); r.setAttribute("width", "6"); r.setAttribute("height", "11"); r.setAttribute("rx", "3"); svg.appendChild(r);
    var p = document.createElementNS(ns, "path"); p.setAttribute("d", "M5 11a7 7 0 0 0 14 0M12 18v3"); svg.appendChild(p);
    return svg;
  }
  function micBtn(target) {
    if (!SR) return null;
    var b = h("button", { type: "button", class: "btn small quiet mic", "aria-pressed": "false", title: "Bruker nettleserens egen talegjenkjenning" }, [micIcon(), h("span", null, ["Snakk inn"])]);
    b.addEventListener("click", function () { toggleMic(b, target); });
    return b;
  }
  function stopMic() { if (rec) { try { rec.stop(); } catch (e) { /* allerede stoppet */ } } }
  function toggleMic(btn, el) {
    if (rec) { var same = recBtn === btn; stopMic(); if (same) return; }
    var r;
    try { r = new SR(); } catch (e) { toast("Talegjenkjenningen virker ikke i denne nettleseren. Du kan skrive i stedet."); return; }
    r.lang = "nb-NO"; r.interimResults = false; r.continuous = false; r.maxAlternatives = 1;
    rec = r; recBtn = btn;
    btn.setAttribute("aria-pressed", "true"); btn.lastChild.textContent = "Stopp";
    r.onresult = function (e) {
      var t = "";
      for (var i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) t += e.results[i][0].transcript;
      t = t.trim();
      if (!t) return;
      var cur = el.value.trim();
      el.value = (cur ? cur + (el.tagName === "TEXTAREA" ? "\n" : " ") : "") + t;
      el.dispatchEvent(new Event("input", { bubbles: true }));
    };
    r.onerror = function (e) {
      var er = e && e.error;
      toast(er === "not-allowed" || er === "service-not-allowed" ? "Nettleseren fikk ikke bruke mikrofonen. Du kan skrive i stedet."
        : er === "no-speech" ? "Hørte ingenting. Prøv igjen, eller skriv." : er === "aborted" ? "Opptaket er stoppet." : "Talegjenkjenningen virket ikke nå. Du kan skrive i stedet.");
    };
    r.onend = function () {
      btn.setAttribute("aria-pressed", "false"); btn.lastChild.textContent = "Snakk inn";
      if (rec === r) { rec = null; recBtn = null; }
    };
    try { r.start(); toast("Lytter. Snakk, og trykk Stopp når du er ferdig."); }
    catch (e2) { r.onend(); toast("Talegjenkjenningen virket ikke nå. Du kan skrive i stedet."); }
  }

  /* ---------- Jeg står fast ---------- */
  var SPARKS = [
    "Hva spør folk deg om hjelp til?",
    "Hva savner du i bygda eller nabolaget?",
    "Hva irriterer deg som noen burde løse?",
    "Hva gjorde du som barn som du glemte tiden med?",
    "Hvem kjenner du som trenger noe du kan?"
  ];
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function sparkList() {
    var list = SPARKS.slice();
    var ints = interests.length ? interests : ((S.profile && S.profile.interests) || []);
    if (ints.length >= 2) {
      var two = shuffle(ints).slice(0, 2);
      list.push("Hva skjer hvis du kombinerer " + two[0].toLowerCase() + " og " + two[1].toLowerCase() + "?");
    }
    return shuffle(list).slice(0, 3);
  }
  var stuckSparks = { profil: [], ide: [] };
  var lastField = { profil: "ambitions", ide: "description" };
  function openStuck(w) {
    var box = $(w + "-stuck");
    stuckSparks[w] = sparkList();
    box.textContent = "";
    var hd = h("h3", { tabindex: "-1" }, ["Når tankene står stille"]);
    box.appendChild(hd);
    box.appendChild(h("p", null, ["Det er helt vanlig. Velg ett av spørsmålene og skriv det første som dukker opp. Ingenting er feil her."]));
    box.appendChild(h("div", { id: w + "-sparks", class: "stack" }));
    box.appendChild(h("div", { class: "btnrow" }, [
      h("button", { type: "button", class: "btn quiet", onclick: function () { stuckSparks[w] = sparkList(); renderSparks(w); } }, ["Tre nye spørsmål"]),
      h("button", { type: "button", class: "btn quiet", onclick: function () { openExercise(w); } }, ["En øvelse på fem minutter"]),
      h("button", { type: "button", class: "btn quiet", onclick: function () { stopExercise(); box.hidden = true; var hd2 = $(w === "profil" ? "h-profil" : "h-ide"); hd2.setAttribute("tabindex", "-1"); hd2.focus(); } }, ["Lukk"])
    ]));
    box.appendChild(h("div", { id: w + "-ex", class: "exercise stack", hidden: true }));
    renderSparks(w);
    box.hidden = false;
    hd.focus();
  }
  function renderSparks(w) {
    var wrap = $(w + "-sparks"); wrap.textContent = "";
    stuckSparks[w].forEach(function (q, i) {
      var qId = w + "-sp-q" + i, tId = w + "-sp-t" + i;
      var ta = h("textarea", { id: tId, rows: "2", maxlength: "500", "aria-labelledby": qId });
      var mb = micBtn(ta);
      wrap.appendChild(h("div", { class: "spark stack" }, [
        h("p", { id: qId, class: "q" }, [q]),
        ta,
        h("div", { class: "btnrow" }, [mb,
          h("button", { type: "button", class: "btn small", onclick: function () { textToCards(w, [ta.value]); } }, ["Bruk som idékort"]),
          h("button", { type: "button", class: "btn small quiet", onclick: function () { textToField(w, ta.value); } }, ["Bruk i feltet"])
        ])
      ]));
    });
  }
  /* Feltet svaret havner i: spørsmålet du står på, ellers sist brukte felt i skjemaet. */
  function stuckTarget(w) {
    if (mode() === "guide") { var g = $("g-" + w + "-in"); if (g) return { el: g, guide: true }; }
    return { el: $(lastField[w]), guide: false };
  }
  async function textToField(w, text) {
    text = String(text || "").trim();
    if (!text) { toast("Skriv et svar først."); return; }
    var t = stuckTarget(w), el = t.el;
    var cur = el.value.trim();
    if (el.id === "g-profil-in" && gStep("profil") === 0) el.value = cur ? cur + ", " + text : text;
    else el.value = cur ? cur + (el.tagName === "TEXTAREA" ? "\n" : " ") + text : text;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    if (t.guide) { el.focus(); toast("Lagt inn i svaret ditt. Trykk Neste for å lagre."); return; }
    if (mode() === "all") { el.focus(); toast("Lagt inn i skjemaet. Husk å lagre."); return; }
    try {
      if (w === "profil") await persistProfile(); else await persistIdea();
      var lab = document.querySelector('label[for="' + el.id + '"]');
      toast("Lagt til under «" + (lab ? lab.firstChild.textContent.trim() : "feltet") + "» og lagret.");
      if (w === "profil") renderProfileSide(); else renderIdeaSide();
    } catch (e) { toast("Kunne ikke lagre: " + errText(e)); }
  }
  async function textToCards(w, texts) {
    texts = texts.map(function (x) { return String(x || "").trim(); }).filter(Boolean).slice(0, 20);
    if (!texts.length) { toast("Skriv et svar først."); return; }
    try {
      if (!idea()) {
        if (!$("title").value.trim()) $("title").value = texts[0].split(/\s+/).slice(0, 6).join(" ").slice(0, 80);
        await persistIdea();
      }
    } catch (e) { toast("Kunne ikke lagre idéen: " + errText(e)); return; }
    if (await addCardTexts("muligheter", texts)) {
      toast((texts.length === 1 ? "Idékortet er lagt" : texts.length + " idékort er lagt") + " under «Hvilke muligheter ser du?» i brainstormingen.");
      if (currentView === "ide") renderIdeaView(); else renderFlow();
    }
  }

  /* Fem minutter: nedtelling bare mens øvelsen går. */
  var EX = { w: null, left: 300, timer: null };
  function fmtClock(s) { return Math.floor(s / 60) + ":" + pad(s % 60); }
  function openExercise(w) {
    stopExercise();
    var box = $(w + "-ex"); box.textContent = ""; box.hidden = false;
    EX.w = w; EX.left = 300;
    var hd = h("h4", { tabindex: "-1" }, ["Fem minutter, uten å vurdere"]);
    var ta = h("textarea", { id: w + "-ex-t", rows: "6", maxlength: "4000" });
    var clock = h("p", { class: "clock", role: "timer", "aria-live": "off", id: w + "-ex-clock" }, [fmtClock(300)]);
    var startBtn = h("button", { type: "button", class: "btn", id: w + "-ex-start" }, ["Start"]);
    startBtn.addEventListener("click", function () { if (EX.timer) pauseExercise(); else startExercise(); });
    box.appendChild(hd);
    box.appendChild(h("p", null, ["Skriv alt som dukker opp, én tanke per linje. Ingen andre ser det, og ingenting er for lite eller for rart. Vurderingen tar du etterpå."]));
    box.appendChild(clock);
    box.appendChild(h("div", { class: "field" }, [h("label", { for: w + "-ex-t" }, ["Det som dukker opp"]), ta]));
    box.appendChild(h("div", { class: "btnrow" }, [startBtn, micBtn(ta)]));
    box.appendChild(h("div", { class: "btnrow" }, [
      h("button", { type: "button", class: "btn small", onclick: function () { textToCards(w, ta.value.split("\n")); } }, ["Gjør hver linje til et idékort"]),
      h("button", { type: "button", class: "btn small quiet", onclick: function () { textToField(w, ta.value); } }, ["Bruk i feltet"])
    ]));
    hd.focus();
  }
  function startExercise() {
    var b = $(EX.w + "-ex-start"); if (!b) return;
    if (EX.left <= 0) EX.left = 300;
    b.textContent = "Pause";
    toast("Fem minutter starter nå.");
    var t = $(EX.w + "-ex-t"); if (t) t.focus();
    EX.timer = setInterval(function () {
      EX.left--;
      var c = $(EX.w + "-ex-clock"); if (c) c.textContent = fmtClock(Math.max(0, EX.left));
      if (EX.left <= 0) { pauseExercise(); var bb = $(EX.w + "-ex-start"); if (bb) bb.textContent = "Start på nytt"; toast("Fem minutter er gått. Se over det du skrev, og ta med det du vil."); }
    }, 1000);
  }
  function pauseExercise() {
    if (EX.timer) { clearInterval(EX.timer); EX.timer = null; }
    var b = EX.w && $(EX.w + "-ex-start"); if (b && EX.left > 0) b.textContent = "Fortsett";
  }
  function stopExercise() { if (EX.timer) { clearInterval(EX.timer); EX.timer = null; } stopMic(); }

  /* ---------- Eksempler fra profilen (regelbasert) ---------- */
  var TYPES = [
    { name: "Tjeneste", f: function (a, b) { return "hjelp andre med det du kan innen «" + a + "»" + (b ? ", kombinert med «" + b + "»" : ""); } },
    { name: "Kurs", f: function (a) { return "lær bort «" + a + "» til nybegynnere, i små grupper"; } },
    { name: "Opplevelse", f: function (a, b) { return "en dag med «" + a + "»" + (b ? " og «" + b + "»" : "") + " for besøkende eller naboer"; } },
    { name: "Produkt", f: function (a) { return "noe du lager selv som har med «" + a + "» å gjøre, solgt lokalt"; } },
    { name: "Digitalt", f: function (a) { return "korte videoer eller en enkel nettside der du deler det du kan om «" + a + "»"; } }
  ];
  var COMBOS = [
    [/friluft|tur|fjell|natur|skog/, /mat|kokk|bål|bake/, "Opplevelse", "guidede turer med bålmat"],
    [/padl|kajakk|fjord|sjø|båt|fiske/, /guid|lokal|histori/, "Opplevelse", "guidede turer på sjøen med lokale historier"],
    [/mat|bake|kokk/, /barn|famil/, "Kurs", "matkurs for barn og foreldre"],
    [/hage|plant|dyrk/, /mat|kokk/, "Kurs", "kurs i å dyrke og lage mat av egne grønnsaker"],
    [/strikk|sy|søm|snekr|treverk|håndverk/, /histori|lokal|tradisjon/, "Produkt", "håndlagde ting med lokal historie bak"],
    [/musikk|sang|gitar|piano/, /barn|eldre/, "Tjeneste", "musikkstunder for barn eller eldre"],
    [/foto|bilde|video/, /natur|friluft|fjord|nordlys/, "Digitalt", "bilder og korte videoer fra naturen der du bor"],
    [/data|pc|teknologi|mobil/, /eldre|nabo/, "Tjeneste", "hjelp med PC og mobil for eldre"]
  ];
  var exOffset = 0;
  function profileWords() {
    return uniq(interests.concat(splitList($("skills").value)).map(function (x) { return x.toLowerCase(); }).filter(function (x) { return x.length <= 40; })).slice(0, 8);
  }
  function exampleList() {
    var w = profileWords(), out = [], seen = {};
    var push = function (type, text, key) { key = key || text; if (seen[key]) return; seen[key] = 1; out.push({ type: type, text: text }); };
    for (var i = 0; i < w.length; i++) for (var j = 0; j < w.length; j++) {
      if (i === j) continue;
      COMBOS.forEach(function (c) { if (c[0].test(w[i]) && c[1].test(w[j])) push(c[2], w[i] + " + " + w[j] + ": " + c[3], c[3]); });
    }
    for (var k = 0; k < w.length * TYPES.length && out.length < 12; k++) {
      var a = w[k % w.length], b = w.length > 1 ? w[(k + 1) % w.length] : null, T = TYPES[k % TYPES.length];
      var two = b && T.f.length > 1;
      push(T.name, a + (two ? " + " + b : "") + ": " + T.f(a, two ? b : null));
    }
    return out;
  }
  function renderExamples() {
    var box = $("ide-examples"); box.textContent = "";
    box.appendChild(h("h3", null, ["Eksempler fra profilen din"]));
    var list = exampleList();
    if (!list.length) {
      box.appendChild(h("p", { class: "small" }, ["Når profilen har noen interesser eller ferdigheter, dukker det opp eksempler her. ", h("button", { type: "button", class: "linkish", "data-goto": "profil" }, ["Fyll inn profilen"])]));
      return;
    }
    var start = (exOffset * 3) % list.length, pick = [];
    for (var i = 0; i < Math.min(3, list.length); i++) pick.push(list[(start + i) % list.length]);
    box.appendChild(h("ul", { class: "examples" }, pick.map(function (x) {
      var txt = x.text.charAt(0).toUpperCase() + x.text.slice(1);
      return h("li", null, [
        h("p", null, [h("span", { class: "tag idea" }, ["Eksempel"]), " ", h("span", { class: "muted small" }, [x.type])]),
        h("p", null, [txt]),
        h("button", { type: "button", class: "btn small quiet", onclick: function () { useExample(txt); } }, ["Bruk som utgangspunkt"])
      ]);
    })));
    if (list.length > 3) box.appendChild(h("div", { class: "btnrow" }, [h("button", { type: "button", class: "btn small quiet", onclick: function () { exOffset++; renderExamples(); } }, ["Vis andre eksempler"])]));
    box.appendChild(h("p", { class: "muted small" }, ["Eksemplene er satt sammen av ordene i profilen din, som tankestartere. De sier ingenting om hva noe kan gi i inntekt."]));
  }
  function useExample(txt) {
    var d = $("description"), cur = d.value.trim();
    d.value = cur ? cur + "\n" + txt : txt;
    renderIdeaCard();
    if (mode() === "guide") { localSet(GUIDE.ide.key, "0"); renderGuide("ide", true); toast("Eksempelet står i svaret ditt. Endre det gjerne, og trykk Neste for å lagre."); }
    else { d.focus(); toast("Eksempelet står i beskrivelsen. Endre det gjerne, og husk å lagre."); }
  }

  /* ---------- Speiling: dette har du allerede ---------- */
  function clean(t) { return String(t || "").trim().replace(/\s*\n+\s*/g, ", ").replace(/[.,;:\s]+$/, ""); }
  function renderMirror(id, inIdea) {
    var box = $(id); box.textContent = "";
    box.appendChild(h("h3", null, ["Dette har du allerede"]));
    var has = clean($("has_already").value), sk = clean($("skills").value), hrs = String($("hours").value).trim();
    var lines = [];
    if (has) lines.push(["Du har allerede: ", has + "."]);
    if (sk) lines.push(["Folk kan spørre deg om: ", sk + "."]);
    if (interests.length) lines.push(["Du bryr deg om: ", interests.join(", ").toLowerCase() + "."]);
    if (hrs !== "") lines.push(["Du har satt av omtrent ", hrs + " timer i uka."]);
    if (!lines.length) {
      box.appendChild(h("p", null, ["Hva har du gjort mange ganger, som andre synes er vanskelig?"]));
      box.appendChild(h("p", { class: "small muted" }, ["Svaret kan bli starten på profilen din. Mange har mer å bygge på enn de tror."]));
      if (inIdea) box.appendChild(h("p", null, [h("button", { type: "button", class: "linkish", "data-goto": "profil" }, ["Fyll inn profilen"])]));
      return;
    }
    lines.forEach(function (l) { box.appendChild(h("p", null, [h("b", null, [l[0]]), l[1]])); });
    box.appendChild(h("p", { class: "small muted" }, ["Mye av det som trengs for å starte noe, har du kanskje allerede."]));
  }

  /* ---------- Stjernetegn på idésiden ---------- */
  function renderIdeaHoro() {
    var box = $("ide-horo"); box.textContent = "";
    var s = $("use_horoscope").checked ? zodiac(memberBirth || $("birth_local").value) : null;
    box.hidden = !s;
    if (!s) return;
    box.appendChild(h("h3", null, ["Inspirasjon fra stjernetegnet"]));
    box.appendChild(h("p", null, [h("span", { class: "tag trad" }, ["Tradisjon og inspirasjon"])]));
    box.appendChild(h("p", null, [s + ": " + HORO_LINE[s]]));
    box.appendChild(h("p", { class: "hint" }, ["Brukes bare til refleksjon, aldri som grunnlag for penger, lån eller avtaler."]));
  }

  /* ---------- Feiring: stille, bare første gang ---------- */
  var CHEER = {
    idea: "Idéen din er skrevet ned for første gang. Det er ofte det tyngste steget, og nå har den et sted å vokse.",
    card: "Det første idékortet ditt er på plass. Tanker som blir skrevet ned, er lettere å bygge videre på."
  };
  function cheer(kind) {
    var k = "minbiz_cheer_" + kind;
    if (localGet(k)) return;
    localSet(k, "1");
    var el = $(currentView === "brainstorm" ? "bs-cheer" : currentView === "profil" ? "profil-cheer" : "idea-cheer");
    if (el.hidden) el.textContent = "";
    el.appendChild(h("p", null, [CHEER[kind]]));
    el.hidden = false;
  }

  /* ---------- Visningene ---------- */
  function renderProfileSide() { renderMirror("profil-mirror", false); }
  function renderProfileView() { applyMode(); renderGuide("profil", false); renderProfileSide(); }
  function renderIdeaSide() { renderMirror("ide-mirror", true); renderIdeaHoro(); renderExamples(); }
  function renderIdeaView() { applyMode(); renderGuide("ide", false); renderIdeaCard(); renderIdeaSide(); }

  function wireInspiration() {
    each(".modebar button", function (b) {
      b.addEventListener("click", function () {
        stopMic();
        localSet("minbiz_mode", b.getAttribute("data-mode"));
        if (currentView === "profil") renderProfileView(); else renderIdeaView();
        b.focus();
      });
    });
    each("[data-stuck]", function (b) { b.addEventListener("click", function () { openStuck(b.getAttribute("data-stuck")); }); });
    ["ambitions", "has_already", "skills", "title", "description", "goal", "audience", "promise"].forEach(function (id) {
      var el = $(id), mb = micBtn(el);
      if (mb) el.parentNode.insertBefore(h("div", { class: "microw" }, [mb]), el.nextSibling);
    });
    $("profile-form").addEventListener("focusin", function (e) { if (e.target.tagName === "TEXTAREA") lastField.profil = e.target.id; });
    $("idea-form").addEventListener("focusin", function (e) { if (e.target.tagName === "TEXTAREA" || e.target.id === "title") lastField.ide = e.target.id; });
    $("profile-form").addEventListener("input", function () { renderMirror("profil-mirror", false); });
  }

  /* ---------- Mine data ---------- */
  async function exportData() {
    try {
      var data = await db.load();
      var blob = new Blob([JSON.stringify({ eksportert: new Date().toISOString(), kilde: "MinBiz (my.bizplanpilot.com)", data: data }, null, 2)], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = h("a", { href: url, download: "minbiz-data-" + today() + ".json" });
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
      toast("Filen er lastet ned.");
    } catch (e) { toast("Kunne ikke hente dataene: " + errText(e)); }
  }
  async function deleteAll() {
    if (!window.confirm("Vil du slette alle MinBiz-dataene dine? Profil, idéer, planer, steg og merker slettes for godt. Innloggingen og Min dag blir ikke rørt.")) return;
    try {
      await db.deleteAll();
      S = { profile: null, ideas: [], plans: [], steps: [], achievements: [] };
      activePlanId = null; chosenType = null;
      store("minbiz_birth_local", null);
      localSet(GUIDE.profil.key, null); localSet(GUIDE.ide.key, null);
      $("moved-msg").hidden = true; $("celebrate").hidden = true;
      fillProfile(); fillIdea(); renderDash();
      $("delete-msg").textContent = "Alle MinBiz-dataene dine er slettet.";
    } catch (e) { $("delete-msg").textContent = "Kunne ikke slette: " + errText(e); }
  }

  /* ---------- Oppstart ---------- */
  async function startApp(label) {
    $("loading").hidden = true; $("login").hidden = true; $("app").hidden = false;
    $("who").textContent = label;
    S = await db.load();
    S.ideas.forEach(norm);
    var m = await db.member();
    memberBirth = m && m.birth_date ? m.birth_date : null;
    fillProfile(); fillIdea();
    await autoMove();
    renderDash();
  }
  function showLogin() {
    $("loading").hidden = true; $("app").hidden = true; $("login").hidden = false;
  }
  function redirectUrl() {
    var host = location.hostname;
    if (host === "leamarketing.github.io") return "https://leamarketing.github.io/minbiz/app.html";
    return "https://my.bizplanpilot.com/app.html";
  }
  async function sendLink(ev) {
    ev.preventDefault();
    var email = $("email").value.trim(), msg = $("login-msg");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = "Skriv en gyldig e-postadresse."; $("email").focus(); return; }
    var btn = $("login-btn"); btn.disabled = true; msg.textContent = "Sender ...";
    try {
      var r = await sb.auth.signInWithOtp({ email: email, options: { emailRedirectTo: redirectUrl() } });
      if (r.error) throw r.error;
      msg.textContent = "Lenken er sendt til " + email + ". Åpne e-posten og trykk på lenken. Sjekk søppelpost hvis den ikke kommer.";
    } catch (e) {
      msg.textContent = "Kunne ikke sende lenken: " + errText(e) + ". Prøv igjen om litt.";
    }
    btn.disabled = false;
  }

  function wire() {
    Array.prototype.forEach.call(document.querySelectorAll("#appnav button"), function (b) { b.addEventListener("click", function () { show(b.getAttribute("data-view")); }); });
    document.addEventListener("click", function (e) { var g = e.target.closest && e.target.closest("[data-goto]"); if (g) show(g.getAttribute("data-goto")); });
    $("interest-add").addEventListener("click", addInterest);
    $("interest-input").addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); addInterest(); } });
    $("use_horoscope").addEventListener("change", renderHoroscope);
    $("birth_local").addEventListener("change", renderHoroscope);
    $("profile-form").addEventListener("submit", saveProfile);
    $("idea-form").addEventListener("submit", saveIdea);
    $("idea-form").addEventListener("input", renderIdeaCard);
    $("idea-form").addEventListener("change", renderIdeaCard);
    $("plan-form").addEventListener("submit", createPlan);
    $("to-brainstorm").addEventListener("click", function () {
      if (!idea()) { $("idea-err").textContent = "Lagre idéen først. En tittel holder."; $("title").focus(); return; }
      show("brainstorm");
    });
    $("bs-done").addEventListener("click", function () { finishBrainstorm(false); });
    $("bs-skip").addEventListener("click", function () { finishBrainstorm(true); });
    $("an-done").addEventListener("click", function () { finishAnalyse(false); });
    $("an-skip").addEventListener("click", function () { finishAnalyse(true); });
    $("an-keyword").addEventListener("input", renderAreasKeepFocus);
    $("an-place").addEventListener("input", renderAreasKeepFocus);
    $("an-keyword").addEventListener("change", saveSearchTerms);
    $("an-place").addEventListener("change", saveSearchTerms);
    $("start_date").addEventListener("change", renderPreview);
    $("plan-pick").addEventListener("change", function () { activePlanId = this.value; $("celebrate").hidden = true; renderDash(); });
    $("export").addEventListener("click", exportData);
    $("delete-all").addEventListener("click", deleteAll);
    $("login-form").addEventListener("submit", sendLink);
    wireInspiration();
    $("logout").addEventListener("click", async function () { try { await sb.auth.signOut(); } catch (e) { /* uansett */ } location.href = "app.html"; });
  }

  async function init() {
    wire();
    if (DEMO) {
      $("demo-bar").hidden = false;
      document.title = "Demo · MinBiz-appen";
      db = memDb();
      await startApp("Demo uten konto");
      return;
    }
    if (!window.supabase || !window.supabase.createClient || !CFG.url) {
      $("loading").textContent = "Kunne ikke laste innloggingen. Sjekk nettforbindelsen og last siden på nytt.";
      return;
    }
    sb = window.supabase.createClient(CFG.url, CFG.publishable, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
    var started = false;
    async function go(session) {
      if (started || !session) return;
      started = true;
      db = supaDb(sb, session.user.id);
      $("logout").hidden = false;
      try { await startApp(session.user.email || "Innlogget"); }
      catch (e) { $("loading").hidden = false; $("loading").textContent = "Kunne ikke hente dataene dine: " + errText(e); $("app").hidden = true; }
      if (location.hash && /access_token|error/.test(location.hash)) history.replaceState(null, "", location.pathname + location.search);
    }
    sb.auth.onAuthStateChange(function (_ev, session) { if (session) setTimeout(function () { go(session); }, 0); });
    var r = await sb.auth.getSession();
    if (r.data && r.data.session) await go(r.data.session);
    else if (!started) {
      showLogin();
      if (location.hash && /error_description=/.test(location.hash)) {
        var m = decodeURIComponent(((location.hash.match(/error_description=([^&]+)/) || [])[1] || "").replace(/\+/g, " "));
        $("login-msg").textContent = "Innloggingslenken virket ikke (" + m + "). Be om en ny lenke.";
      }
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
