import { useState } from "react";
import { useLang, useT } from "./i18n.jsx";

function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="22" fill="#000"/>
      <path d="M72 18 L28 18 Q14 18 14 32 L14 68 Q14 82 28 82 L72 82" stroke="white" strokeWidth="9" fill="none" strokeLinecap="square"/>
      <line x1="52" y1="28" x2="80" y2="58" stroke="white" strokeWidth="7" strokeLinecap="round"/>
    </svg>
  );
}

const PRIVACY = `Last updated: April 2025

Logoplacers ("we", "our", "the Service") is operated as an independent tool. This Privacy Policy explains what data we collect, how we use it, and your rights under GDPR.

1. DATA WE COLLECT AND WHERE IT IS STORED

Server-side (Supabase):
We store your email address, name, profile picture, plan tier, and credit balance in our database (Supabase). This is required to manage your account, enforce subscription limits, and sync your plan across devices.

Browser — sessionStorage (cleared when you close the tab):
- lp_gtoken — your Gmail OAuth access token, used solely to send emails on your behalf during the session. This is never sent to or stored on our servers.
- lp_user — your name, email address, and profile picture from Google
- lp_authed — confirms you are logged in for this session
- lp_verified_plan — your plan as confirmed by our server this session
- lp_sent_* — tracks which emails have been sent in this session to prevent duplicates

Browser — localStorage (persistent until cleared):
- lp_gdpr_consent — records that you accepted this policy
- lp_cookie_ok / lp_cookie_no — records your cookie banner choice
- lp_lang — your language preference (en/sv)
- lp_credits — your credit balance and plan, mirrored locally from our server for performance
- lp_email_subject / lp_email_body — your saved email template
- lp_templates — your saved canvas templates
- lp_companies_* — your saved prospect lists

None of these values are shared with third parties or used for advertising.

2. DATA WE DO NOT COLLECT
We do not store the content of emails you send. Your Gmail access token is stored only in your browser's sessionStorage — it is never sent to or stored on our servers. We do not read, store, or process your inbox or sent mail.
We do not store uploaded images beyond what is needed to deliver the Service. Base images may be stored temporarily in Supabase Storage to enable session persistence.

3. THIRD-PARTY LOGOS
Logoplacers automatically fetches company logos from public sources (Clearbit, DuckDuckGo, Google) based on domain names you enter. These logos are fetched at your request. You are solely responsible for ensuring your use of third-party logos complies with applicable laws and brand guidelines. We do not claim ownership of any third-party logos and do not store them permanently.

4. GOOGLE OAUTH
We use Google OAuth to authenticate users and to enable Gmail sending. We request the minimum necessary scopes: email, profile, and gmail.send. We do not access your Google Drive, contacts, or any other Google data beyond what is listed above.

5. PAYMENT DATA
Payments are processed by Stripe. We never see or store your card details.

6. DATA RETENTION
You may delete your account by contacting hello@logoplacers.com. Upon request, we will delete your server-side account data within 30 days. Locally stored data can be cleared at any time from your browser settings.

7. YOUR RIGHTS (GDPR)
If you are located in the European Economic Area, you have the following rights:
- Right of access: request a copy of your personal data
- Right to rectification: correct inaccurate data
- Right to erasure: delete your account and all associated data
- Right to data portability: receive your data in a machine-readable format
- Right to object: object to processing of your data

To exercise any of these rights, contact hello@logoplacers.com. You may also delete your account directly in the app. We will fulfil all requests within 30 days.

8. CONTACT
hello@logoplacers.com`;

const TERMS = `Last updated: April 2025

By using Logoplacers ("the Service"), you agree to these Terms of Service.

1. ACCEPTABLE USE
You may use Logoplacers only for lawful purposes. You agree not to use the Service to send spam, engage in deceptive practices, or violate any applicable laws including anti-spam legislation (CAN-SPAM, GDPR, CASL).

2. USER RESPONSIBILITY FOR CONTENT
You are solely responsible for all content you create, upload, and send using the Service. This includes:
- The images and screenshots you upload as base images
- The prospect data you enter
- The emails you send via Gmail
- Any third-party logos fetched at your request

We provide a technical tool. We are not responsible for how you use it.

3. THIRD-PARTY LOGOS AND INTELLECTUAL PROPERTY
The logo fetching feature retrieves publicly available logos from third-party sources. These logos are the property of their respective owners. Logoplacers does not claim ownership of any third-party logos.

You acknowledge that:
(a) Use of third-party logos in your outreach is your responsibility
(b) You will comply with applicable trademark and IP laws
(c) We are not liable for any claims arising from your use of third-party logos

If you receive a complaint from a brand regarding logo use, you agree to immediately cease that use and contact us.

4. DISCLAIMER OF WARRANTIES
The Service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted availability, logo fetch accuracy, or email deliverability.

5. LIMITATION OF LIABILITY
To the maximum extent permitted by law, Logoplacers shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.

6. INDEMNIFICATION
You agree to indemnify and hold harmless Logoplacers and its operators from any claims, damages, or expenses arising from your use of the Service, violation of these Terms, or infringement of any third-party rights.

7. CHANGES TO TERMS
We may update these Terms at any time. Continued use of the Service constitutes acceptance of updated Terms.

8. GOVERNING LAW
These Terms are governed by the laws of Sweden.

9. CONTACT
hello@logoplacers.com`;

const PRIVACY_SV = `Senast uppdaterad: April 2025

Logoplacers ("vi", "oss", "Tjänsten") drivs som ett oberoende verktyg. Denna integritetspolicy förklarar vilka uppgifter vi samlar in, hur vi använder dem och dina rättigheter enligt GDPR.

1. UPPGIFTER VI SAMLAR IN OCH VAR DE LAGRAS

Serversidan (Supabase):
Vi lagrar din e-postadress, ditt namn, din profilbild, plannivå och kreditbalans i vår databas (Supabase). Detta krävs för att hantera ditt konto, genomdriva prenumerationsgränser och synkronisera din plan mellan enheter.

Webbläsaren — sessionStorage (rensas när du stänger fliken):
- lp_gtoken — din Gmail OAuth-åtkomsttoken, används enbart för att skicka mejl å dina vägnar under sessionen. Denna skickas aldrig till eller lagras på våra servrar.
- lp_user — ditt namn, din e-postadress och profilbild från Google
- lp_authed — bekräftar att du är inloggad under denna session
- lp_verified_plan — din plan som bekräftats av vår server under sessionen
- lp_sent_* — spårar vilka mejl som skickats under sessionen för att förhindra dubbletter

Webbläsaren — localStorage (beständig tills du rensar den):
- lp_gdpr_consent — registrerar att du accepterade denna policy
- lp_cookie_ok / lp_cookie_no — registrerar ditt val i cookie-bannern
- lp_lang — din språkinställning (en/sv)
- lp_credits — din kreditbalans och plan, speglad lokalt från vår server för prestanda
- lp_email_subject / lp_email_body — din sparade mejlmall
- lp_templates — dina sparade canvas-mallar
- lp_companies_* — dina sparade prospektlistor

Inget av dessa värden delas med tredje part eller används för reklam.

2. UPPGIFTER VI INTE SAMLAR IN
Vi lagrar inte innehållet i mejl du skickar. Din Gmail-åtkomsttoken lagras enbart i din webbläsares sessionStorage — den skickas aldrig till eller lagras på våra servrar. Vi läser, lagrar eller behandlar inte din inkorg eller skickad post.
Vi lagrar inte uppladdade bilder utöver vad som behövs för att leverera Tjänsten. Basbilder kan lagras tillfälligt i Supabase Storage för att möjliggöra sessionspersistens.

3. TREDJEPARTS LOGOTYPER
Logoplacers hämtar automatiskt företagslogotyper från offentliga källor (Clearbit, DuckDuckGo, Google) baserat på domäner du anger. Dessa logotyper hämtas på din begäran. Du ansvarar ensamt för att din användning av tredjeparts logotyper följer tillämpliga lagar och varumärkesriktlinjer. Vi gör inga anspråk på äganderätten till tredjeparts logotyper och lagrar dem inte permanent.

4. GOOGLE OAUTH
Vi använder Google OAuth för att autentisera användare och möjliggöra Gmail-utskick. Vi begär minimala behörigheter: email, profile och gmail.send. Vi får inte tillgång till din Google Drive, dina kontakter eller några andra Google-data utöver vad som anges ovan.

5. BETALNINGSDATA
Betalningar behandlas av Stripe. Vi ser eller lagrar aldrig dina kortuppgifter.

6. DATALAGRING
Du kan ta bort ditt konto genom att kontakta hello@logoplacers.com. Vi raderar dina serverlagrade kontouppgifter inom 30 dagar på begäran. Lokalt lagrad data kan när som helst rensas via din webbläsares inställningar.

7. DINA RÄTTIGHETER (GDPR)
Om du befinner dig inom EES har du följande rättigheter:
- Rätt till tillgång: begär en kopia av dina personuppgifter
- Rätt till rättelse: korrigera felaktiga uppgifter
- Rätt till radering: radera ditt konto och all tillhörande data
- Rätt till dataportabilitet: ta emot dina uppgifter i maskinläsbart format
- Rätt att invända: invända mot behandling av dina uppgifter

För att utöva någon av dessa rättigheter, kontakta hello@logoplacers.com. Du kan även radera ditt konto direkt i appen. Vi uppfyller alla förfrågningar inom 30 dagar.

8. KONTAKT
hello@logoplacers.com`;

const TERMS_SV = `Senast uppdaterad: April 2025

Genom att använda Logoplacers ("Tjänsten") godkänner du dessa användarvillkor.

1. ACCEPTABEL ANVÄNDNING
Du får bara använda Logoplacers för lagliga ändamål. Du samtycker till att inte använda Tjänsten för att skicka spam, ägna dig åt bedrägliga metoder eller bryta mot tillämpliga lagar inklusive anti-spam-lagstiftning (CAN-SPAM, GDPR, CASL).

2. ANVÄNDARANSVAR FÖR INNEHÅLL
Du ansvarar ensamt för allt innehåll du skapar, laddar upp och skickar med Tjänsten. Detta inkluderar:
- De bilder och skärmbilder du laddar upp som basbilder
- Den prospektdata du anger
- De mejl du skickar via Gmail
- Tredjeparts logotyper som hämtas på din begäran

Vi tillhandahåller ett tekniskt verktyg. Vi ansvarar inte för hur du använder det.

3. TREDJEPARTS LOGOTYPER OCH IMMATERIELLA RÄTTIGHETER
Logotyphämtningsfunktionen hämtar offentligt tillgängliga logotyper från tredjeparts källor. Dessa logotyper tillhör sina respektive ägare. Logoplacers gör inga anspråk på äganderätten till tredjeparts logotyper.

Du bekräftar att:
(a) Användning av tredjeparts logotyper i din outreach är ditt ansvar
(b) Du följer tillämpliga varumärkes- och IP-lagar
(c) Vi ansvarar inte för krav som uppstår från din användning av tredjeparts logotyper

Om du mottar ett klagomål från ett varumärke angående logotypanvändning, samtycker du till att omedelbart upphöra med den användningen och kontakta oss.

4. ANSVARSFRISKRIVNING
Tjänsten tillhandahålls "i befintligt skick" utan garantier av något slag. Vi garanterar inte oavbruten tillgänglighet, noggrannhet vid logotyphämtning eller e-postleverans.

5. ANSVARSBEGRÄNSNING
I den utsträckning lagen tillåter ska Logoplacers inte vara ansvarigt för indirekta, tillfälliga, särskilda eller följdskador som uppstår från din användning av Tjänsten. Vårt totala ansvar ska inte överstiga det belopp du betalat oss under de 12 månader som föregick kravet.

6. SKADESLÖSHÅLLANDE
Du samtycker till att skadeslösha Logoplacers och dess operatörer från krav, skador eller utgifter som uppstår från din användning av Tjänsten, brott mot dessa villkor eller intrång i tredje parts rättigheter.

7. ÄNDRINGAR AV VILLKOR
Vi kan uppdatera dessa villkor när som helst. Fortsatt användning av Tjänsten innebär godkännande av uppdaterade villkor.

8. TILLÄMPLIG LAG
Dessa villkor regleras av svensk lag.

9. KONTAKT
hello@logoplacers.com`;

export default function Legal({ page = "privacy", onBack }) {
  const [tab, setTab] = useState(page);
  const { lang } = useLang();
  const t = useT();
  const content = tab === "privacy"
    ? (lang === "sv" ? PRIVACY_SV : PRIVACY)
    : (lang === "sv" ? TERMS_SV : TERMS);
  const title = tab === "privacy" ? t("legal.privacy_title") : t("legal.terms_title");
  return (
    <div style={{background:"#080808",color:"#fff",minHeight:"100vh",fontFamily:"-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif"}}>
      <nav style={{position:"sticky",top:0,zIndex:100,height:60,padding:"0 32px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(8,8,8,.92)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:9,textDecoration:"none"}}>
          <Logo size={26}/>
          <span style={{fontSize:15,fontWeight:700,color:"#fff",letterSpacing:"-.3px"}}>Logoplacers</span>
        </a>
        <button onClick={onBack} style={{background:"none",border:"none",color:"rgba(255,255,255,.4)",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>← {t("legal.back")}</button>
      </nav>
      <div style={{maxWidth:720,margin:"0 auto",padding:"60px 24px 100px"}}>
        <div style={{display:"flex",gap:8,marginBottom:40}}>
          {["privacy","terms"].map(t2=>(
            <button key={t2} onClick={()=>setTab(t2)} style={{
              background: tab===t2 ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,.04)",
              border: `1px solid ${tab===t2 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,.08)"}`,
              color: tab===t2 ? "#fff" : "rgba(255,255,255,.4)",
              borderRadius:10,padding:"8px 18px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"
            }}>
              {t2==="privacy"?t("legal.privacy_title"):t("legal.terms_title")}
            </button>
          ))}
        </div>
        <h1 style={{fontSize:"clamp(28px,4vw,42px)",fontWeight:800,letterSpacing:"-1.5px",margin:"0 0 40px",color:"#fff"}}>{title}</h1>
        <div style={{fontSize:15,color:"rgba(255,255,255,.55)",lineHeight:1.9}}>
          {content.split("\n").map((line, i) => {
            if (/^\d+\./.test(line.trim()) || line.startsWith("Last updated") || line.startsWith("Senast")) {
              return <p key={i} style={{fontWeight:700,color:"rgba(255,255,255,.85)",margin:"32px 0 8px",fontSize:12,letterSpacing:"1px",textTransform:"uppercase"}}>{line}</p>;
            }
            if (line.startsWith("- ")) {
              return <p key={i} style={{margin:"0 0 5px",paddingLeft:16,color:"rgba(255,255,255,.4)",fontSize:13,fontFamily:"'SF Mono','Fira Code',monospace"}}>{line}</p>;
            }
            if (line.trim()==="") return <br key={i}/>;
            return <p key={i} style={{margin:"0 0 12px"}}>{line}</p>;
          })}
        </div>
      </div>
      <footer style={{borderTop:"1px solid rgba(255,255,255,.05)",padding:"24px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><Logo size={20}/><span style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,.35)"}}>Logoplacers</span></div>
        <span style={{fontSize:12,color:"rgba(255,255,255,.2)"}}>hello@logoplacers.com</span>
      </footer>
    </div>
  );
}
