// ── Logoplacers i18n ─────────────────────────────────────────────────────────
// Usage: import { useT, LanguageProvider } from "./i18n";
//        const t = useT();  then  t("key")
import { createContext, useContext, useState } from "react";

export const LanguageContext = createContext({ lang: "en", setLang: () => {} });

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("lp_lang") || "en");
  const set = (l) => { localStorage.setItem("lp_lang", l); setLang(l); };
  return <LanguageContext.Provider value={{ lang, setLang: set }}>{children}</LanguageContext.Provider>;
}

export function useT() {
  const { lang } = useContext(LanguageContext);
  return (key) => {
    const entry = TRANSLATIONS[key];
    if (!entry) return key;
    return entry[lang] || entry.en || key;
  };
}

export function useLang() {
  return useContext(LanguageContext);
}

// ── All translations ──────────────────────────────────────────────────────────
const TRANSLATIONS = {
  // NAV
  "nav.blog": { en: "Blog", sv: "Blogg" },
  "nav.pricing": { en: "Pricing", sv: "Priser" },
  "nav.try_free": { en: "Try free", sv: "Prova gratis" },
  "nav.sign_in": { en: "Sign in", sv: "Logga in" },

  // HERO
  "hero.badge": { en: "AI-powered sales personalisation", sv: "AI-driven saljpersonalisering" },
  "hero.title1": { en: "Your logo.", sv: "Er logotyp." },
  "hero.title2": { en: "Their brand.", sv: "Deras varumarke." },
  "hero.title3": { en: "Every deal.", sv: "Varje affar." },
  "hero.sub": { en: "Create personalised sales demos with your prospect's logo automatically placed. Send 100 unique images from Gmail in under 10 minutes.", sv: "Skapa personaliserade saljdemos med mottagarens logotyp automatiskt inplacerad. Skicka 100 unika bilder fran Gmail pa under 10 minuter." },
  "hero.cta_primary": { en: "Start for free", sv: "Borja gratis" },
  "hero.cta_secondary": { en: "See how it works", sv: "Se hur det funkar" },
  "hero.social_proof": { en: "Join 500+ sales teams already using Logoplacers", sv: "Gat med 500+ saljteam som redan anvander Logoplacers" },

  // STATS
  "stats.reply_rate": { en: "Average reply rate lift", sv: "Genomsnittlig okning av svarsfrekvens" },
  "stats.time_saved": { en: "Time saved per 50 demos", sv: "Tid sparad per 50 demos" },
  "stats.setup": { en: "Minutes to first send", sv: "Minuter till forsta utskick" },
  "stats.credits": { en: "Free credits daily", sv: "Gratiskrediter dagligen" },

  // HOW IT WORKS
  "how.label": { en: "How it works", sv: "Hur det funkar" },
  "how.title": { en: "Three steps to a personalised pipeline.", sv: "Tre steg till en personaliserad pipeline." },
  "how.step1.title": { en: "Upload your screenshot", sv: "Ladda upp din skärmbild" },
  "how.step1.body": { en: "Drop any product screenshot or image. Drag logo and text placeholders to position.", sv: "Ladda upp valfri produktskärmbild. Dra logotyp- och textplatshallare till ratt position." },
  "how.step2.title": { en: "Add your prospects", sv: "Lagg till dina prospekter" },
  "how.step2.body": { en: "Paste your list. Logoplacers auto-fetches every company logo instantly.", sv: "Klistra in din lista. Logoplacers hamtar automatiskt varje foretagslogotyp direkt." },
  "how.step3.title": { en: "Send from Gmail", sv: "Skicka fran Gmail" },
  "how.step3.body": { en: "Connect Gmail in one click. Send 100 personalised emails with natural delays.", sv: "Anslut Gmail med ett klick. Skicka 100 personaliserade mejl med naturliga forsenjingar." },

  // FEATURES
  "features.label": { en: "Features", sv: "Funktioner" },
  "features.title": { en: "Everything you need to close more deals.", sv: "Allt du behover for att stanga fler affarer." },
  "features.autofetch.title": { en: "Auto logo fetch", sv: "Automatisk logohämtning" },
  "features.autofetch.body": { en: "Type a company name or domain. Logo appears in seconds.", sv: "Skriv ett foretagsnamn eller doman. Logotypen visas pa sekunder." },
  "features.bulk.title": { en: "Bulk personalisation", sv: "Masspersonalisering" },
  "features.bulk.body": { en: "50 unique personalised images generated in under 2 minutes.", sv: "50 unika personaliserade bilder genereras pa under 2 minuter." },
  "features.gmail.title": { en: "Gmail integration", sv: "Gmail-integration" },
  "features.gmail.body": { en: "Send directly from your own Gmail. No third-party sending.", sv: "Skicka direkt fran din egen Gmail. Ingen tredjeparts-sändning." },
  "features.templates.title": { en: "Save templates", sv: "Spara mallar" },
  "features.templates.body": { en: "Save your best setups and reuse them across campaigns.", sv: "Spara dina basta instaallningar och ateranvand dem i kampanjer." },
  "features.heic.title": { en: "HEIC support", sv: "HEIC-stod" },
  "features.heic.body": { en: "iPhone photos converted automatically in the browser.", sv: "iPhone-bilder konverteras automatiskt i webblesaren." },
  "features.privacy.title": { en: "Privacy first", sv: "Integritet forst" },
  "features.privacy.body": { en: "We never read your emails. Google OAuth, zero data stored.", sv: "Vi laser aldrig dina mejl. Google OAuth, noll data lagrat." },

  // PRICING
  "pricing.label": { en: "Pricing", sv: "Priser" },
  "pricing.title": { en: "Simple, honest pricing.", sv: "Enkla, ara priser." },
  "pricing.sub": { en: "Start free. Upgrade when you need more.", sv: "Borja gratis. Uppgradera nar du behover mer." },
  "pricing.most_popular": { en: "Most popular", sv: "Mest populär" },
  "pricing.per_month": { en: "/mo", sv: "/man" },
  "pricing.cta.free": { en: "Get started free", sv: "Kom igang gratis" },
  "pricing.cta.sdr": { en: "Get SDR", sv: "Skaffa SDR" },
  "pricing.cta.pro": { en: "Get Sales Pro", sv: "Skaffa Sales Pro" },
  "pricing.cta.team": { en: "Get Team", sv: "Skaffa Team" },
  "pricing.free.credits": { en: "4 credits / day", sv: "4 krediter / dag" },
  "pricing.sdr.credits": { en: "300 credits / month", sv: "300 krediter / manad" },
  "pricing.pro.credits": { en: "2 000 credits / month", sv: "2 000 krediter / manad" },
  "pricing.team.credits": { en: "10 000 credits / month", sv: "10 000 krediter / manad" },

  // FAQ
  "faq.label": { en: "FAQ", sv: "Vanliga fragor" },
  "faq.title": { en: "Common questions.", sv: "Vanliga fragor." },
  "faq.q1": { en: "Does Logoplacers store my Gmail credentials?", sv: "Lagrar Logoplacers mina Gmail-uppgifter?" },
  "faq.a1": { en: "No. Your Gmail connection uses Google's official OAuth flow entirely in the browser. We never see or store your credentials or email content.", sv: "Nej. Din Gmail-anslutning anvander Googles officiella OAuth-flode helt i webblesaren. Vi ser eller lagrar aldrig dina uppgifter eller mejlinnehall." },
  "faq.q2": { en: "How many prospects can I personalise at once?", sv: "Hur manga prospekter kan jag personalisera pa en gang?" },
  "faq.a2": { en: "There is no hard limit. Logoplacers generates images for every prospect in your list.", sv: "Det finns ingen fast grans. Logoplacers genererar bilder for varje prospekt i din lista." },
  "faq.q3": { en: "What image formats does it support?", sv: "Vilka bildformat stods?" },
  "faq.a3": { en: "PNG, JPG, WEBP and HEIC. HEIC files are automatically converted in the browser.", sv: "PNG, JPG, WEBP och HEIC. HEIC-filer konverteras automatiskt i webblesaren." },
  "faq.q4": { en: "How does automatic logo detection work?", sv: "Hur fungerar automatisk logotypdetektering?" },
  "faq.a4": { en: "Type a company name or domain and Logoplacers queries multiple logo databases simultaneously.", sv: "Skriv ett foretagsnamn eller doman och Logoplacers soker i flera logodatabaser samtidigt." },
  "faq.q5": { en: "Is there a free trial?", sv: "Finns det en gratis provperiod?" },
  "faq.a5": { en: "Yes. The Free plan gives you 4 credits per day with no credit card required.", sv: "Ja. Gratisplanen ger dig 4 krediter per dag utan kreditkort." },

  // FOOTER
  "footer.tagline": { en: "Personalised sales demos that convert.", sv: "Personaliserade saljdemos som konverterar." },
  "footer.privacy": { en: "Privacy Policy", sv: "Integritetspolicy" },
  "footer.terms": { en: "Terms of Service", sv: "Anvandardvillkor" },
  "footer.contact": { en: "Contact", sv: "Kontakt" },

  // TRUST BADGES
  "trust.ssl": { en: "SSL Encrypted", sv: "SSL-krypterat" },
  "trust.stripe": { en: "Payments by Stripe", sv: "Betalningar via Stripe" },
  "trust.gdpr": { en: "GDPR Compliant", sv: "GDPR-kompatibelt" },
  "trust.oauth": { en: "Google OAuth — we never see your password", sv: "Google OAuth — vi ser aldrig ditt losenord" },

  // APP UI
  "app.base_image": { en: "Base image", sv: "Basbild" },
  "app.remove_image": { en: "Remove image", sv: "Ta bort bild" },
  "app.bg_color": { en: "Background colour", sv: "Bakgrundsfarg" },
  "app.prospects": { en: "Prospects", sv: "Prospekter" },
  "app.preview": { en: "Preview", sv: "Forhandsgranska" },
  "app.send": { en: "Send", sv: "Skicka" },
  "app.download": { en: "Download", sv: "Ladda ner" },
  "app.saving": { en: "Saving...", sv: "Sparar..." },
  "app.saved": { en: "Saved", sv: "Sparat" },
  "app.sign_out": { en: "Sign out", sv: "Logga ut" },
  "app.feedback": { en: "Feedback", sv: "Feedback" },
  "app.upgrade": { en: "Upgrade", sv: "Uppgradera" },
  "app.credits": { en: "credits", sv: "krediter" },
  "app.refresh_all": { en: "Refresh all", sv: "Uppdatera alla" },
  "app.add_contact": { en: "Add", sv: "Lagg till" },
  "app.paste_list": { en: "Paste list", sv: "Klistra in lista" },

  // MANUAL
  "manual.title": { en: "How to use Logoplacers", sv: "Hur man anvander Logoplacers" },
  "manual.step1.title": { en: "Upload your base image", sv: "Ladda upp din basbild" },
  "manual.step1.body": { en: "Click or drag a screenshot. Supports JPG, PNG, WEBP, HEIC.", sv: "Klicka eller dra en skärmbild. Stoder JPG, PNG, WEBP, HEIC." },
  "manual.step2.title": { en: "Position logos and text", sv: "Positionera logotyper och text" },
  "manual.step2.body": { en: "Add logo placeholders and text layers. Drag them to position.", sv: "Lagg till logotypplatshallare och textlager. Dra dem till ratt position." },
  "manual.step3.title": { en: "Add your prospects", sv: "Lagg till dina prospekter" },
  "manual.step3.body": { en: "Paste companies. Logos are fetched automatically.", sv: "Klistra in foretag. Logotyper hamtas automatiskt." },
  "manual.step4.title": { en: "Preview and download", sv: "Forhandsgranska och ladda ner" },
  "manual.step4.body": { en: "Preview each personalised image. Download a ZIP or send via Gmail.", sv: "Forhandsgranska varje personaliserad bild. Ladda ner en ZIP eller skicka via Gmail." },
  "manual.step5.title": { en: "Send via Gmail", sv: "Skicka via Gmail" },
  "manual.step5.body": { en: "Connect Gmail. Use {name} and {company} placeholders in your email.", sv: "Anslut Gmail. Anvand {name} och {company} platshallare i ditt mejl." },
  "manual.step6.title": { en: "Refresh logos", sv: "Uppdatera logotyper" },
  "manual.step6.body": { en: "Click the refresh icon next to a company to retry logo fetch.", sv: "Klicka pa uppdateringsikonen bredvid ett foretag for att forsoka igen." },

  // FEEDBACK
  "feedback.title": { en: "Send feedback", sv: "Skicka feedback" },
  "feedback.placeholder": { en: "What could be better? Found a bug? Have a feature request?", sv: "Vad kan forbattras? Hittade du en bugg? Har du en funktionsbegaran?" },
  "feedback.attach": { en: "Attach image (optional)", sv: "Bifoga bild (valfritt)" },
  "feedback.send": { en: "Send feedback", sv: "Skicka feedback" },
  "feedback.thanks": { en: "Thanks for your feedback!", sv: "Tack for din feedback!" },
  "feedback.read": { en: "We read every message.", sv: "Vi laser varje meddelande." },

  // UPGRADE MODAL
  "upgrade.title": { en: "Upgrade your plan", sv: "Uppgradera din plan" },
  "upgrade.sub": { en: "More credits, more deals closed.", sv: "Fler krediter, fler affarer stangda." },
  "upgrade.current": { en: "Current plan", sv: "Nuvarande plan" },
  "upgrade.manage": { en: "Manage or cancel subscription", sv: "Hantera eller avsluta prenumeration" },

  // LEGAL
  "legal.privacy_title": { en: "Privacy Policy", sv: "Integritetspolicy" },
  "legal.terms_title": { en: "Terms of Service", sv: "Anvandardvillkor" },
  "legal.back": { en: "Back", sv: "Tillbaka" },

  // BLOG
  "blog.label": { en: "Blog", sv: "Blogg" },
  "blog.title": { en: "Sales outreach, explained.", sv: "Saljoutreach, forklarad." },
  "blog.sub": { en: "Tactics, playbooks, and deep-dives for modern SDRs and AEs.", sv: "Taktiker, spelbacker och djupdykningar for moderna SDR:er och AE:er." },
  "blog.read_more": { en: "Read more", sv: "Las mer" },
  "blog.all_posts": { en: "All posts", sv: "Alla inlagg" },
  "blog.cta_title": { en: "Send your first demo in 30 seconds.", sv: "Skicka din forsta demo pa 30 sekunder." },
  "blog.cta_sub": { en: "Ready to try visual personalisation?", sv: "Redo att testa visuell personalisering?" },
  "blog.cta_btn": { en: "Try Logoplacers free", sv: "Prova Logoplacers gratis" },
  "blog.lang_en": { en: "English", sv: "Engelska" },
  "blog.lang_sv": { en: "Swedish", sv: "Svenska" },

  // LOGIN
  "login.title": { en: "Sign in to Logoplacers", sv: "Logga in pa Logoplacers" },
  "login.sub": { en: "Personalised demos that close deals.", sv: "Personaliserade demos som stangar affarer." },
  "login.btn": { en: "Continue with Google", sv: "Fortsatt med Google" },
  "login.terms": { en: "By signing in you agree to our", sv: "Genom att logga in godkanner du var" },
};

export default TRANSLATIONS;