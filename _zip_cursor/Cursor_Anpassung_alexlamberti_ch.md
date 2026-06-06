# Cursor-Anweisung: alexlamberti.ch mit Elementen aus `Alex_Lamberti_3_Welten_FINAL` anpassen

Ziel: Die aktuelle Webseite `alexlamberti.ch` soll mit den gewünschten Elementen aus `Alex_Lamberti_3_Welten_FINAL` aktualisiert werden. Bitte **nicht die ganze Seite neu bauen**, sondern die bestehende Struktur der aktuellen Webseite behalten und die folgenden Bereiche übernehmen bzw. ergänzen.

## Referenzdatei
Nutze als Design- und Inhaltsreferenz die Datei:
`Alex_Lamberti_3_Welten_FINAL_DIRECT_FIXED_PRO_START_NO_NEXORA_ARROWS.html`

Darin sind alle drei Welten enthalten:
- NEXORA
- PROFESSIONAL / BUSINESS
- FREIRAUM

Die Anpassungen müssen in **allen drei Welten** und für **alle Bildschirmgrössen** funktionieren.

---

## 1. Kontakt-Unterseite angleichen

Die Unterseite/Section **Kontakt** der aktuellen Webseite soll wieder so aussehen wie in `Alex_Lamberti_3_Welten_FINAL`.

Bitte aus der FINAL-Version übernehmen:
- Layout `contact-layout`
- Textkarte links als `glass-card`
- Kontaktbild rechts als `contact-visual glass-card`
- Kontaktaktionen als `contact-actions`
- E-Mail, Telefon und Adresse als klickbare Action-Rows
- Responsive Verhalten: ab ca. `800px` einspaltig untereinander

Wichtige Referenzklassen aus FINAL:
```css
.contact-layout
.contact-actions
.contact-visual
.contact-photo
```

Inhalt Kontakt übernehmen:
```html
<p class="chapter-label">Kontakt</p>
<h2 class="section-title">Bereit für den nächsten Schritt.</h2>
<p class="prose">Ich freue mich auf Möglichkeiten, bei denen ich meine Erfahrung in Markeninszenierung, Kundenkommunikation und digitalem Marketing gezielt einbringen kann. Besonders spannend sind für mich Unternehmen, die Wert auf Qualität, klare Kommunikation, kreative Ideen und eine starke digitale Präsenz legen.</p>
<p class="prose">Ob Website, Content, Kampagne, Projektkoordination oder Markenauftritt – ich möchte meine Fähigkeiten dort einsetzen, wo sie Wirkung erzeugen und weiter wachsen können.</p>
<p class="prose" style="font-weight:600;margin-top:0.75rem;">Lassen Sie uns ins Gespräch kommen.</p>
<p class="prose">Ob Website, Markenauftritt, digitale Sichtbarkeit oder ein konkretes Kundenprojekt: Ich freue mich über den Austausch und reagiere schnell, verbindlich und unkompliziert.</p>
<p class="prose">Für mich beginnt gute Zusammenarbeit mit Zuhören, Verstehen und einer klaren Einordnung der nächsten Schritte. Deshalb ist der erste Kontakt bewusst einfach gehalten: kurz schreiben, anrufen oder direkt die Adresse öffnen.</p>
```

Kontaktlinks:
```html
<a href="mailto:alex.lamberti@hotmail.ch"><span>E-Mail: alex.lamberti@hotmail.ch</span><span>→</span></a>
<a href="tel:+41796678211"><span>Telefon: 079 667 82 11</span><span>→</span></a>
<a href="https://www.google.com/maps/search/?api=1&query=Schulweg%20603%2C%205324%20Full-Reuenthal%2C%20Schweiz" target="_blank" rel="noopener noreferrer"><span>Adresse: Schulweg 603, 5324 Full-Reuenthal, Schweiz</span><span>→</span></a>
```

---

## 2. Zeitstrahl bei Erfahrung ergänzen

Auf der aktuellen Webseite soll der **Zeitstrahl aus der FINAL-Version** eingebaut werden, aber **nicht als komplett neue Unterseite**. Bitte den Zeitstrahl als Zusatz in die bestehende Unterseite/Section **Erfahrung** integrieren, dort wo er gestalterisch am besten passt.

Bitte aus FINAL übernehmen:
- CSS für `.timeline`, `.tl-item`, `.tl-item::before`, `.tl-item time`
- Blöcke: Berufserfahrung, Bildungsweg, Schulbildung
- Titelklasse `.exp-block-title`

Inhalt:

### Berufserfahrung
- 07 / 2024 – heute — DIGITAL PLUS GmbH, Dietikon — Key-Account- und Marketing-Spezialist
- 09 / 2011 – 12 / 2023 — Ledergerber.mode, Baden & Zürich — Polydesigner 3D / Koordination Warenpräsentation
- 11 / 2010 – 08 / 2011 — Tommy Hilfiger, CH / A — Koordination Warenpräsentation im Einzelhandel
- 08 / 2007 – 11 / 2010 — Hennes & Mauritz — Polydesigner 3D / Koordination Warenpräsentation
- 08 / 2002 – 08 / 2004 — Boutique Clochard, Zug — Mitarbeiter Detailhandel

### Bildungsweg
- 2026 — Weiterbildung Online Marketing Fachmann — MBSZ Zürich
- 2026 — Weiterbildung KI und Multimedia — HSO Zürich
- 2012 — Ausbildung Lehrmeister — EBZ
- 2007 – 2008 — Ausbildung als Dekorationsgestalter und Warenpräsentation — Interne Ausbildung H&M, Luzern
- 2002 – 2004 — Detailhandel Ausbildung EFZ — Kaufmännisches Bildungszentrum Zug

### Schulbildung
- 07 / 1999 – 07 / 2002 — Oberstufe Oberarth
- 08 / 1993 – 07 / 1999 — Primarschule Goldau

---

## 3. Home-Bereich unter dem Hero übernehmen

Auf der aktuellen Startseite soll der Bereich **unter den Hero-Bereichen** aus `Alex_Lamberti_3_Welten_FINAL` übernommen werden:

- Textblock
- Bildkarte
- Titel
- Lead-Text
- zusätzlicher Beschreibungstext
- Liste mit Stärken/Fokusbereichen
- zwei Buttons

Wichtig: Der Bereich soll **für alle drei Welten** funktionieren und auf allen Displaygrössen sauber brechen.

Referenzklassen aus FINAL:
```css
.home-main-block
.home-layout
.home-layout--intro
.home-copy
.home-portrait-card
.cta-row
.btn
.btn-primary
```

Referenzstruktur:
```html
<div class="home-main-block">
  <div class="home-layout home-layout--intro">
    <div class="home-copy">
      <p class="world-intro" id="worldIntro">NEXORA · Strategie · Technologie · Zukunft</p>
      <h1>Digital Marketing zwischen Strategie, Technologie und Zukunft.</h1>
      <p class="lead">Strategie wird sichtbar. Technologie wird menschlich. Marketing wird wirksam.</p>
      <p class="more">Ich verbinde kreatives Marketing mit digitalem Systemdenken. Mein Fokus liegt auf Markenauftritten, Websites, Content-Strukturen und digitalen Kampagnen, die nicht nur gut aussehen, sondern Orientierung, Vertrauen und messbare Wirkung schaffen.</p>
      <p class="more">NEXORA steht für meine zukunftsorientierte Seite: analytisch, digital, neugierig und offen für neue Technologien. Ich denke Marketing nicht isoliert, sondern als intelligentes Zusammenspiel aus Strategie, Design, Daten, Nutzerführung, Automatisierung und klarer Kommunikation.</p>
      <ul class="prose">
        <li>Digitale Markenauftritte mit klarer Positionierung</li>
        <li>Websites mit Fokus auf Nutzerführung, Struktur und Conversion</li>
        <li>SEO-orientierte Inhalte, die gefunden und verstanden werden</li>
        <li>Kampagnen, die Strategie, Design und Umsetzung verbinden</li>
        <li>Offenheit für KI, Automatisierung und moderne Marketingprozesse</li>
        <li>Verständnis für digitale Customer Journeys und Nutzerverhalten</li>
        <li>Kombination aus Kreativität, Technologie und analytischem Denken</li>
      </ul>
      <div class="cta-row">
        <button type="button" class="btn btn-primary" data-go="projects">Projekte ansehen</button>
        <button type="button" class="btn" data-go="about">Mehr über mich</button>
      </div>
    </div>
    <figure class="home-portrait-card glass-card" aria-label="Alex Lamberti">
      <img class="portrait-photo" alt="Alex Lamberti" />
    </figure>
  </div>
</div>
```

Bitte in den drei Welten den `worldIntro`-Text passend setzen:
- NEXORA: `NEXORA · Virtuell · AI · Zukunft`
- PROFESSIONAL / BUSINESS: `BUSINESS · Klar · Professionell · Vertrauensvoll`
- FREIRAUM: `FREIRAUM · Kreativ · Emotional · Nahbar`

---

## 4. Responsive Anforderungen

Bitte besonders testen:
- Desktop breit
- Laptop
- Tablet
- Mobile hochkant
- Mobile quer

Keine horizontalen Scrollbars.
Kontaktbild darf auf Mobile unter dem Text stehen.
Home-Bereich soll auf Mobile einspaltig werden.
Timeline soll auf Mobile gut lesbar bleiben, ohne abgeschnittene Punkte oder Linien.

---

## 5. Wichtig

Bitte die aktuelle Webseite nicht komplett ersetzen. Besser:
1. Bestehende aktuelle Website als Basis behalten.
2. Nur Kontakt, Erfahrung-Zeitstrahl und Home-Unter-Hero-Bereich aus FINAL übernehmen.
3. Gemeinsame CSS-Klassen konsolidieren, damit keine doppelten oder widersprüchlichen Styles entstehen.
4. Danach alle drei Welten testen.
