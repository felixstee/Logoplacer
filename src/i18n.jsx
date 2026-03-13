import { createContext, useContext, useState } from "react";

export const LanguageContext = createContext({ lang: "en", setLang: () => { } });

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("lp_lang") || "en");
  const setLangPersist = (l) => {
    setLang(l); localStorage.setItem("lp_lang", l);
  };
  return (
    <LanguageContext.Provider value={{ lang, setLang: setLangPersist }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() { return useContext(LanguageContext); }

export function useT() {
  const { lang } = useLang();
  return (key) => {
    const entry = TRANSLATIONS[key];
    if (!entry) return key;
    return entry[lang] || entry["en"] || key;

  };
}

export const TRANSLATIONS = {
  // ── Navigation ───────────────────────────────────────────────────────────
  "nav.blog": { en: "Blog", sv: "Blogg" },
  "nav.pricing": { en: "Pricing", sv: "Priser" },
  "nav.features": { en: "Features", sv: "Funktioner" },
  "nav.how_it_works": { en: "How it works", sv: "Hur det funkar" },
  "nav.try": { en: "Use the tool", sv: "Prova verktyget" },

  // ── Hero ─────────────────────────────────────────────────────────────────
  "hero.sub": { en: "Personal demo images at scale", sv: "Personaliserade demobilder i skala" },
  "hero.cta_primary": { en: "Start free — no credit card", sv: "Börja gratis — inget kreditkort" },

  // ── App – Header ─────────────────────────────────────────────────────────
  "app.base_image": { en: "Base image", sv: "Basbild" },
  "app.download": { en: "Download", sv: "Ladda ner" },
  "app.feedback": { en: "Feedback", sv: "Feedback" },
  "app.preview": { en: "Preview", sv: "Förhandsgranska" },
  "app.saved": { en: "Saved", sv: "Sparat" },
  "app.saving": { en: "Saving…", sv: "Sparar…" },
  "app.send": { en: "Send", sv: "Skicka" },
  "app.sign_out": { en: "Sign out", sv: "Logga ut" },
  "app.packing": { en: "Packing…", sv: "Packar…" },
  "app.macbook_video": { en: "Laptop Demo", sv: "Laptop Demo" },
  "app.product_mockup": { en: "Mockup", sv: "Mockup" },

  // ── App – Tabs ────────────────────────────────────────────────────────────
  "app.image_mode": { en: "Image", sv: "Bild" },
  "app.video_mode": { en: "Video", sv: "Video" },

  // ── App – Sidebar ─────────────────────────────────────────────────────────
  "app.remove_image": { en: "Remove image", sv: "Ta bort bild" },
  "app.background_color": { en: "Background colour", sv: "Bakgrundsfärg" },
  "app.match_brand": { en: "Match brand colour", sv: "Matcha varumärkesfärg" },
  "app.match_brand_sub": { en: "Replace a colour with recipient's brand", sv: "Ersätt en färg med mottagarens varumärke" },
  "app.replace_label": { en: "Replace:", sv: "Ersätt:" },
  "app.pick_color": { en: "Click image to pick", sv: "Klicka på bilden för att välja" },
  "app.recipient_logo": { en: "Recipient logo", sv: "Mottagarens logotyp" },
  "app.new": { en: "+ New", sv: "+ Ny" },
  "app.text_layers": { en: "Text layers", sv: "Textlager" },
  "app.templates_section": { en: "Templates", sv: "Mallar" },
  "app.templates_hide": { en: "Hide", sv: "Dölj" },
  "app.templates_saved": { en: "Saved", sv: "Sparade" },
  "app.save": { en: "Save", sv: "Spara" },
  "app.load": { en: "Load", sv: "Ladda" },
  "app.symbols": { en: "Symbols", sv: "Symboler" },
  "app.contacts": { en: "Contacts", sv: "Kontakter" },
  "app.extract_contacts": { en: "Extract contacts", sv: "Extrahera kontakter" },
  "app.add_manually": { en: "Or add manually", sv: "Eller lägg till manuellt" },
  "app.clear_all": { en: "Clear all", sv: "Rensa allt" },
  "app.click_drag": { en: "Click or drag here", sv: "Klicka eller dra hit" },
  "app.template_name": { en: "Template name…", sv: "Mallnamn…" },
  "app.person_name": { en: "Person name (optional)", sv: "Personnamn (valfritt)" },
  "app.company_placeholder": { en: "Company name or domain", sv: "Företagsnamn eller domän" },
  "app.email_placeholder": { en: "Email (optional)", sv: "E-post (valfritt)" },

  // ── Landing – How it works benefits ───────────────────────────────────────
  "landing.benefit_replies": { en: "Reply rates up to 3x higher", sv: "Upp till 3x fler svar" },
  "landing.benefit_demos": { en: "100 demos in 8 minutes", sv: "100 demos på 8 minuter" },
  "landing.benefit_design": { en: "Zero design skills needed", sv: "Inga designkunskaper krävs" },
  "landing.benefit_gmail": { en: "Sends from your own Gmail", sv: "Skickar från ditt eget Gmail" },

  // ── Landing – Features section ─────────────────────────────────────────────
  "landing.features_label": { en: "Features", sv: "Funktioner" },
  "landing.features_heading": { en: "Everything you need to stand out in the inbox.", sv: "Allt du behöver för att sticka ut i inkorgen." },
  "landing.feat1_title": { en: "One-click personalisation", sv: "Personalisering med ett klick" },
  "landing.feat1_desc": { en: "Upload once. Logoplacers auto-fetches your prospect's logo and places it perfectly on your demo — every single time.", sv: "Ladda upp en gång. Logoplacers hämtar automatiskt din prospekts logotyp och placerar den perfekt på din demo — varje gång." },
  "landing.feat2_title": { en: "Send directly from Gmail", sv: "Skicka direkt från Gmail" },
  "landing.feat2_desc": { en: "Connected to your Gmail. Send personalised demos to your entire prospect list without ever leaving the tool.", sv: "Ansluten till ditt Gmail. Skicka personaliserade demos till hela din prospektlista utan att lämna verktyget." },
  "landing.feat3_title": { en: "Pixel-perfect placement", sv: "Pixelperfekt placering" },
  "landing.feat3_desc": { en: "Drag, resize and position every element with precision. Your demo looks exactly how you intended for every recipient.", sv: "Dra, ändra storlek och placera varje element med precision. Din demo ser exakt ut som du tänkt för varje mottagare." },
  "landing.feat4_title": { en: "Smart logo detection", sv: "Smart logotypdetektering" },
  "landing.feat4_desc": { en: "Type a company name and Logoplacers automatically finds and fetches the correct brand logo. No manual searching.", sv: "Skriv ett företagsnamn och Logoplacers hittar och hämtar automatiskt rätt varumärkeslogotyp. Ingen manuell sökning." },
  "landing.feat5_title": { en: "Bulk export in seconds", sv: "Bulkexport på sekunder" },
  "landing.feat5_desc": { en: "Generate personalised images for 50 prospects in the time it used to take to do one. ZIP download or direct send.", sv: "Generera personaliserade bilder för 50 prospekter på den tid det brukade ta att göra en. ZIP-nedladdning eller direktutskick." },
  "landing.feat6_title": { en: "Secure & private", sv: "Säkert & privat" },
  "landing.feat6_desc": { en: "Your Gmail credentials and prospect data never leave your browser. No server-side storage of any kind.", sv: "Dina Gmail-uppgifter och prospektdata lämnar aldrig din webbläsare. Ingen lagring på server överhuvudtaget." },

  // ── Landing – Testimonials ─────────────────────────────────────────────────
  "landing.testi_label": { en: "What people say", sv: "Vad folk säger" },
  "landing.testi_heading": { en: "Sales teams love it.", sv: "Säljteam älskar det." },

  // ── Landing – Comparison table ─────────────────────────────────────────────
  "landing.cmp_feature_col": { en: "Feature", sv: "Funktion" },
  "landing.cmp_youre_here": { en: "← you're here", sv: "← du är här" },
  "landing.cmp_row1": { en: "Auto logo detection", sv: "Automatisk logotypdetektering" },
  "landing.cmp_row2": { en: "Send directly from Gmail", sv: "Skicka direkt från Gmail" },
  "landing.cmp_row3": { en: "Bulk personalisation", sv: "Bulkpersonalisering" },
  "landing.cmp_row4": { en: "Under 30 seconds per prospect", sv: "Under 30 sekunder per prospekt" },
  "landing.cmp_row5": { en: "No design skills needed", sv: "Inga designkunskaper krävs" },
  "landing.cmp_row6": { en: "Visual demo (not just text)", sv: "Visuell demo (inte bara text)" },
  "landing.cmp_row7": { en: "Free to start", sv: "Gratis att börja" },
  "landing.cmp_row8": { en: "Works on any screenshot", sv: "Fungerar på valfri skärmbild" },

  // ── Landing – Live demo panel ──────────────────────────────────────────────
  "landing.demo_sub": { en: "Type a company name and watch their logo appear on the demo — then drag it anywhere.", sv: "Skriv ett företagsnamn och se deras logotyp dyka upp på demon — dra den sedan vart du vill." },
  "landing.demo_personalise": { en: "Personalise this demo", sv: "Personalisera den här demon" },
  "landing.demo_company": { en: "Company", sv: "Företag" },
  "landing.demo_name_lbl": { en: "Name", sv: "Namn" },
  "landing.demo_email_lbl": { en: "Email", sv: "E-post" },
  "landing.demo_fetching": { en: "Fetching logo…", sv: "Hämtar logotyp…" },
  "landing.demo_no_logo": { en: "No logo found — try exact company name", sv: "Ingen logotyp hittades — prova exakt företagsnamn" },
  "landing.demo_hint": { en: "Type a company above to auto-fetch their logo", sv: "Skriv ett företag ovan för att hämta deras logotyp" },
  "landing.demo_drag": { en: "Drag the logo on the canvas", sv: "Dra logotypen på canvasen" },
  "landing.demo_brand_color": { en: "Brand colour detected — applied to demo automatically", sv: "Varumärkesfärg upptäckt — tillämpas på demon automatiskt" },
  "landing.demo_full_tool": { en: "Full tool: drag anywhere · add text layers · bulk export · send via Gmail", sv: "Hela verktyget: dra var som helst · lägg till textlager · bulkexport · skicka via Gmail" },

  // ── Landing – Early access ─────────────────────────────────────────────────
  "landing.early_label": { en: "Early access", sv: "Tidig åtkomst" },
  "landing.early_heading": { en: "Be first in line.", sv: "Var först i kön." },
  "landing.early_sub": { en: "Logoplacers is rolling out to early users now. Drop your email and we will reach out as soon as your spot opens.", sv: "Logoplacers rullar nu ut till tidiga användare. Skriv din e-post och vi hör av oss så snart din plats öppnas." },
  "landing.early_no_spam": { en: "No spam. No credit card. Just early access.", sv: "Inget spam. Inget kreditkort. Bara tidig åtkomst." },

  // ── Landing – FAQ ──────────────────────────────────────────────────────────
  "landing.faq_heading": { en: "Common questions.", sv: "Vanliga frågor." },
  "landing.faq1_q": { en: "Does Logoplacers store my Gmail credentials?", sv: "Lagrar Logoplacers mina Gmail-uppgifter?" },
  "landing.faq1_a": { en: "No. Your Gmail connection uses Google's official OAuth flow entirely in the browser. We never see or store your credentials or email content.", sv: "Nej. Din Gmail-anslutning använder Googles officiella OAuth-flöde helt i webbläsaren. Vi ser eller lagrar aldrig dina uppgifter eller e-postinnehåll." },
  "landing.faq2_q": { en: "How many prospects can I personalise at once?", sv: "Hur många prospekter kan jag personalisera på en gång?" },
  "landing.faq2_a": { en: "There is no hard limit. Logoplacers generates images for every prospect in your list and exports them as a ZIP, or sends them directly via Gmail with anti-spam delays.", sv: "Det finns ingen hård gräns. Logoplacers genererar bilder för varje prospekt i din lista och exporterar dem som en ZIP, eller skickar dem direkt via Gmail med anti-spam-fördröjningar." },
  "landing.faq3_q": { en: "What image formats does it support?", sv: "Vilka bildformat stöds?" },
  "landing.faq3_a": { en: "PNG, JPG, WEBP and HEIC (iPhone photos). HEIC files are automatically converted in the browser — no external tool needed.", sv: "PNG, JPG, WEBP och HEIC (iPhone-foton). HEIC-filer konverteras automatiskt i webbläsaren — inget externt verktyg behövs." },
  "landing.faq4_q": { en: "How does automatic logo detection work?", sv: "Hur fungerar automatisk logotypdetektering?" },
  "landing.faq4_a": { en: "Type a company name or domain and Logoplacers queries multiple logo databases simultaneously. It validates each result and falls back gracefully if a logo cannot be found.", sv: "Skriv ett företagsnamn eller domän och Logoplacers söker i flera logotypdatabaser samtidigt. Det validerar varje resultat och faller tillbaka elegant om ingen logotyp hittas." },
  "landing.faq5_q": { en: "Is there a free trial?", sv: "Finns det en gratis provperiod?" },
  "landing.faq5_a": { en: "Yes — the Free plan gives you 4 credits per day with no credit card required. Paid plans start at $19/month for 300 credits. Credits are spent when you generate personalised images or send emails.", sv: "Ja — gratisplanen ger dig 4 krediter per dag utan kreditkort. Betalplaner börjar på $19/månad för 300 krediter. Krediter förbrukas när du genererar personaliserade bilder eller skickar mejl." },

  // ── App – Canvas ─────────────────────────────────────────────────────────
  "canvas.hint": { en: "Drag elements to position · Scroll to zoom", sv: "Dra element för att placera · Scrolla för att zooma" },
  "canvas.empty": { en: "Upload a base image to get started", sv: "Ladda upp en basbild för att komma igång" },
  "canvas.no_image": { en: "No image selected", sv: "Ingen bild vald" },
  "canvas.no_image_sub": { en: "Upload a base image on the left", sv: "Ladda upp en basbild till vänster" },
  "tag.first_name": { en: "+ first name", sv: "+ förnamn" },
  "tag.full_name": { en: "+ full name", sv: "+ fullständigt namn" },
  "tag.company": { en: "+ company", sv: "+ företag" },
  "email.default_subject": { en: "A personal demo for ((company))", sv: "En personlig demo för ((company))" },
  "email.default_body": { en: "Hi ((name)),\n\nHere's a personalised demo we put together for ((company)).\n\nLet us know what you think!\n\nBest regards", sv: "Hej ((name)),\n\nHär är en personaliserad demo vi satte ihop för ((company)).\n\nHör gärna av er!\n\nMed vänliga hälsningar" },
  "video.title": { en: "Laptop Demo Video", sv: "Laptop Demo Video" },

  // ── App – Companies list ──────────────────────────────────────────────────
  "companies.count": { en: "{n} companies · {m} ready", sv: "{n} företag · {m} klara" },
  "contact.name_label": { en: "Name", sv: "Namn" },
  "contact.email_label": { en: "Email", sv: "E-post" },

  // ── App – Preview modal ───────────────────────────────────────────────────
  "modal.close": { en: "Close", sv: "Stäng" },
  "modal.download": { en: "Download", sv: "Ladda ner" },
  "modal.prev": { en: "Prev", sv: "Föregående" },
  "modal.next": { en: "Next", sv: "Nästa" },
  "modal.cancel": { en: "Cancel", sv: "Avbryt" },
  "modal.back": { en: "← Back", sv: "← Tillbaka" },

  // ── App – Credits info ────────────────────────────────────────────────────
  "app.credits_info": {
    en: "Credits are spent when you generate personalised images or send emails. Free plan: 10/day. Upgrade anytime for more.",
    sv: "Krediter förbrukas när du genererar personaliserade bilder eller skickar mejl. Gratisplan: 10/dag. Uppgradera när som helst för fler."
  },

  // ── Manual modal ─────────────────────────────────────────────────────────
  "manual.title": { en: "How to use Logoplacers", sv: "Hur du använder Logoplacers" },
  "manual.step1.title": { en: "Upload a base image", sv: "Ladda upp en basbild" },
  "manual.step1.body": {
    en: "Drag or click to upload a screenshot of your product. Supports PNG, JPG, WEBP, and HEIC (iPhone photos).",
    sv: "Dra eller klicka för att ladda upp en skärmbild av din produkt. Stöder PNG, JPG, WEBP och HEIC (iPhone-foton)."
  },
  "manual.step2.title": { en: "Position the logo", sv: "Placera logotypen" },
  "manual.step2.body": {
    en: "Drag the logo placeholder to where you want the recipient's logo to appear on your image.",
    sv: "Dra logotypplatshållaren dit du vill att mottagarens logotyp ska visas på din bild."
  },
  "manual.step3.title": { en: "Add text layers", sv: "Lägg till textlager" },
  "manual.step3.body": {
    en: "Click '+ New' under Text Layers. Use ((name)) and ((company)) as placeholders — they're replaced automatically per contact.",
    sv: "Klicka '+ Ny' under Textlager. Använd ((name)) och ((company)) som platshållare — de ersätts automatiskt per kontakt."
  },
  "manual.step4.title": { en: "Add contacts", sv: "Lägg till kontakter" },
  "manual.step4.body": {
    en: "Paste a list of company names from your CRM, or add them manually. Logos are fetched automatically.",
    sv: "Klistra in en lista med företagsnamn från ditt CRM, eller lägg till dem manuellt. Logotyper hämtas automatiskt."
  },
  "manual.step5.title": { en: "Preview", sv: "Förhandsgranska" },
  "manual.step5.body": {
    en: "Click Preview to see a watermarked version of each personalised image. Watermarks are removed on download and send.",
    sv: "Klicka Förhandsgranska för att se en vattenstämplad version av varje personaliserad bild. Vattenstämplar tas bort vid nedladdning och utskick."
  },
  "manual.step6.title": { en: "Send or download", sv: "Skicka eller ladda ner" },
  "manual.step6.body": {
    en: "Click Send to email each contact directly from your Gmail, or Download to get a ZIP with all images.",
    sv: "Klicka Skicka för att mejla varje kontakt direkt från ditt Gmail, eller Ladda ner för att få en ZIP med alla bilder."
  },

  // ── Feedback modal ────────────────────────────────────────────────────────
  "feedback.title": { en: "Send feedback", sv: "Skicka feedback" },
  "feedback.placeholder": { en: "What can we improve?", sv: "Vad kan vi förbättra?" },
  "feedback.attach": { en: "Attach a screenshot (optional)", sv: "Bifoga en skärmbild (valfritt)" },
  "feedback.send_btn": { en: "Send feedback", sv: "Skicka feedback" },
  "feedback.sent_title": { en: "Thanks for your feedback!", sv: "Tack för din feedback!" },
  "feedback.sent_body": { en: "We read every message.", sv: "Vi läser varje meddelande." },

  // ── Upgrade modal ─────────────────────────────────────────────────────────
  "upgrade.title": { en: "Upgrade your plan", sv: "Uppgradera din plan" },
  "upgrade.sub": {
    en: "Get more credits and unlock bulk sending for your whole prospect list.",
    sv: "Få fler krediter och lås upp bulkutskick för hela din prospektlista."
  },
  "upgrade.current": { en: "Current plan", sv: "Nuvarande plan" },
  "upgrade.per_month": { en: "/mo", sv: "/mån" },
  "upgrade.upgrade_btn": { en: "Upgrade", sv: "Uppgradera" },
  "upgrade.manage": { en: "Manage subscription", sv: "Hantera prenumeration" },

  // ── Send modal ────────────────────────────────────────────────────────────
  "send.title": { en: "Send email", sv: "Skicka mejl" },
  "send.compose": { en: "Compose message", sv: "Skriv meddelande" },
  "send.sending": { en: "Sending…", sv: "Skickar…" },
  "send.done": { en: "Done!", sv: "Klart!" },
  "send.approve_btn": { en: "Send {n} email{s}", sv: "Skicka {n} mejl" },
  "send.preview_btn": { en: "Preview ({n}) →", sv: "Förhandsgranska ({n}) →" },
  "send.no_contacts": { en: "No contacts with email addresses yet.", sv: "Inga kontakter med e-postadresser ännu." },
  "send.no_contacts_hint": { en: "Add emails in the contacts panel on the left.", sv: "Lägg till e-post i kontaktpanelen till vänster." },
  "send.connect_gmail": { en: "Connect Gmail to send", sv: "Anslut Gmail för att skicka" },
  "send.reconnect": { en: "Reconnect Gmail →", sv: "Återanslut Gmail →" },
  "send.reconnect_msg": { en: "Gmail session expired. Reconnect and try again.", sv: "Gmail-session har löpt ut. Återanslut och försök igen." },
  "send.recipients": { en: "Recipients", sv: "Mottagare" },
  "send.subject": { en: "Subject", sv: "Ämnesrad" },
  "send.body": { en: "Message body", sv: "Meddelandetext" },
  "send.video_link": { en: "Video link (optional)", sv: "Videolänk (valfritt)" },
  "send.delay_note": { en: "Sending with natural delays to protect deliverability.", sv: "Skickar med naturliga fördröjningar för att skydda leveransbarhet." },
  "send.gmail_info": {
    en: "Logoplacers sends via your Gmail. We only request gmail.send — we never read your inbox.",
    sv: "Logoplacers skickar via ditt Gmail. Vi begär bara gmail.send — vi läser aldrig din inkorg."
  },

  // ── Laptop Demo modal ─────────────────────────────────────────────────────
  "video.select_company": { en: "Company", sv: "Företag" },
  "video.animation": { en: "Animation", sv: "Animation" },
  "video.anim_zoom": { en: "Slow zoom", sv: "Långsam zoom" },
  "video.anim_pan": { en: "Pan left→right", sv: "Pan vänster→höger" },
  "video.anim_tilt": { en: "3D tilt", sv: "3D-lutning" },
  "video.anim_full": { en: "Full presentation", sv: "Full presentation" },
  "video.duration": { en: "Duration (seconds)", sv: "Längd (sekunder)" },
  "video.record": { en: "Record", sv: "Spela in" },
  "video.recording": { en: "Recording…", sv: "Spelar in…" },
  "video.download": { en: "Download video", sv: "Ladda ner video" },
  "video.preview": { en: "Preview", sv: "Förhandsvisa" },
  "video.no_image": { en: "Upload a base image first", sv: "Ladda upp en basbild först" },
  "video.loading": { en: "Rendering…", sv: "Renderar…" },
  "video.webm_note": { en: "WebM format. Convert to MP4 with any video converter.", sv: "WebM-format. Konvertera till MP4 med valfri videokonverterare." },

  // ── Product Mockup modal ──────────────────────────────────────────────────
  "mockup.title": { en: "Product Mockup", sv: "Produktmockup" },
  "mockup.template": { en: "Template", sv: "Mall" },
  "mockup.company": { en: "Company", sv: "Företag" },
  "mockup.exposure": { en: "Exposure", sv: "Exponering" },
  "mockup.opacity": { en: "Opacity", sv: "Opacitet" },
  "mockup.blend": { en: "Blend mode", sv: "Blandningsläge" },
  "mockup.mesh_size": { en: "Mesh points", sv: "Nätpunkter" },
  "mockup.reset_mesh": { en: "Reset mesh", sv: "Återställ nät" },
  "mockup.drag_corners": { en: "Drag corners to adjust", sv: "Dra i hörnen för att justera" },
  "mockup.drag_mesh": { en: "Drag mesh points to warp", sv: "Dra nätpunkter för att forma" },
  "mockup.download": { en: "Download mockup", sv: "Ladda ner mockup" },
  "mockup.upload_bg": { en: "Upload product photo", sv: "Ladda upp produktfoto" },
  "mockup.or_use_template": { en: "or use a template", sv: "eller använd en mall" },

  // ── Legal ─────────────────────────────────────────────────────────────────
  "legal.privacy_title": { en: "Privacy Policy", sv: "Integritetspolicy" },
  "legal.terms_title": { en: "Terms of Service", sv: "Användarvillkor" },
  "legal.back": { en: "Back", sv: "Tillbaka" },

  // ── Blog ──────────────────────────────────────────────────────────────────
  "blog.read_more": { en: "Read more", sv: "Läs mer" },
  "blog.cta_btn": { en: "Try free", sv: "Prova gratis" },
  "blog.back": { en: "← All posts", sv: "← Alla inlägg" },
  "blog.min_read": { en: "min read", sv: "min läsning" },
  "blog.title": { en: "Insights for modern sales teams", sv: "Insikter för moderna säljteam" },
  "blog.sub": { en: "Strategy, playbooks, and tools for B2B outreach.", sv: "Strategi, spelböcker och verktyg för B2B-outreach." },
  "blog.lang_en": { en: "🇬🇧 English", sv: "🇬🇧 English" },
  "blog.lang_sv": { en: "🇸🇪 Svenska", sv: "🇸🇪 Svenska" },
  "blog.all_posts": { en: "← All posts", sv: "← Alla inlägg" },
  "blog.cta_title": { en: "Ready to personalise your outreach?", sv: "Redo att personalisera din outreach?" },
  "blog.cta_sub": { en: "Try Logoplacers free — no credit card required.", sv: "Prova Logoplacers gratis — inget kreditkort krävs." },
  "blog.footer_tagline": { en: "Personalised sales demos that convert.", sv: "Personaliserade säljdemos som konverterar." },
  "blog.back_home": { en: "Back to home", sv: "Tillbaka till startsidan" },

  // ── Footer ────────────────────────────────────────────────────────────────
  "footer.privacy": { en: "Privacy", sv: "Integritet" },
  "footer.terms": { en: "Terms", sv: "Villkor" },

  // ── Trust badges ──────────────────────────────────────────────────────────
  "trust.ssl": { en: "SSL encrypted", sv: "SSL-krypterat" },
  "trust.stripe": { en: "Stripe payments", sv: "Stripe-betalningar" },
  "trust.gdpr": { en: "GDPR compliant", sv: "GDPR-kompatibelt" },
  "trust.oauth": { en: "Google OAuth", sv: "Google OAuth" },

  // ── Pricing ───────────────────────────────────────────────────────────────
  "pricing.title": { en: "Simple, transparent pricing", sv: "Enkel, transparent prissättning" },
  "pricing.sub": { en: "Start free. No credit card required.", sv: "Börja gratis. Inget kreditkort krävs." },

};
