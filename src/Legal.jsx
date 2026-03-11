import { useState } from "react";
import { useLang, useT } from "./i18n.jsx";

function Logo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs><linearGradient id="llg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#1a82ff"/><stop offset="1" stopColor="#5b4fff"/></linearGradient></defs>
      <rect width="32" height="32" rx="9" fill="url(#llg)"/>
      <rect x="4" y="4" width="11" height="11" rx="3" fill="white" opacity=".95"/>
      <rect x="17" y="4" width="11" height="11" rx="3" fill="white" opacity=".6"/>
      <rect x="4" y="17" width="11" height="11" rx="3" fill="white" opacity=".6"/>
      <rect x="17" y="17" width="11" height="11" rx="3" fill="white" opacity=".95"/>
      <rect x="13" y="13" width="6" height="6" rx="1.5" fill="white" opacity=".28"/>
    </svg>
  );
}

const PRIVACY = `Last updated: March 2025

Logoplacers ("we", "our", "the Service") is operated as an independent tool. This Privacy Policy explains what data we collect, how we use it, and your rights.

1. DATA WE COLLECT
Account data: When you sign in with Google, we receive your name, email address, and profile picture. We store these in our database (Supabase) to manage your account and subscription.
Usage data: We store your plan tier and credit balance to enforce subscription limits.
Project data: If you save a project, your canvas settings and contact list are stored in our database linked to your email.
Payment data: Payments are processed by Stripe. We never see or store your card details.

2. DATA WE DO NOT COLLECT
We do not store the content of emails you send. Gmail is accessed via Google OAuth solely to send emails on your behalf. We do not read, store, or process your inbox or sent mail.
We do not store uploaded images beyond what is needed to deliver the Service. Base images may be stored temporarily in Supabase Storage to enable session persistence.

3. THIRD-PARTY LOGOS
Logoplacers automatically fetches company logos from public sources (Clearbit, DuckDuckGo, Google) based on domain names you enter. These logos are fetched at your request. You are solely responsible for ensuring your use of third-party logos complies with applicable laws and brand guidelines. We do not claim ownership of any third-party logos and do not store them permanently.

4. GOOGLE OAUTH
We use Google OAuth to authenticate users and to enable Gmail sending. We request the minimum necessary scopes: email, profile, and gmail.send. We do not access your Google Drive, contacts, or any other Google data beyond what is listed above.

5. DATA RETENTION
You may delete your account by contacting hello@logoplacers.com. Upon request, we will delete your account data within 30 days.

6. GDPR
If you are located in the European Economic Area, you have the right to access, correct, and delete your personal data. Contact hello@logoplacers.com to exercise these rights.

7. COOKIES
We use sessionStorage and localStorage in your browser to maintain your session and save preferences. We do not use tracking cookies.

8. CONTACT
hello@logoplacers.com`;

const TERMS = `Last updated: March 2025

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


const PRIVACY_SV = `Senast uppdaterad: Mars 2025

Logoplacers ("vi", "var", "Tjansten") drivs som ett oberoende verktyg. Denna integritetspolicy forklarar vilka uppgifter vi samlar in, hur vi anvander dem och dina rattigheter.

1. UPPGIFTER VI SAMLAR IN
Kontoupgifter: Nar du loggar in med Google tar vi emot ditt namn, e-postadress och profilbild. Vi lagrar dessa i var databas (Supabase) for att hantera ditt konto och prenumeration.
Anvandningsdata: Vi lagrar din planniva och kreditbalans for att genomdriva prenumerationsgranser.
Projektdata: Om du sparar ett projekt lagras dina canvasinstaallningar och kontaktlista i var databas kopplad till din e-post.
Betalningsdata: Betalningar behandlas av Stripe. Vi ser eller lagrar aldrig dina kortuppgifter.

2. UPPGIFTER VI INTE SAMLAR IN
Vi lagrar inte innehallet i mejl du skickar. Gmail nars via Google OAuth enbart for att skicka mejl a dina vagnar. Vi laser, lagrar eller behandlar inte din inbox eller skickade post.
Vi lagrar inte uppladdade bilder utover vad som behovs for att leverera Tjansten.

3. TREDJEPARTS LOGOTYPER
Logoplacers hamtar automatiskt foretagslogotyper fran offentliga kallor baserat pa domaner du anger. Dessa logotyper hamtas pa din begaran. Du ansvarar ensamt for att din anvandning av tredjeparts logotyper foljer tillampliga lagar och varumarkesriktlinjer. Vi gor inga ansprak pa agandeskapet av tredjeparts logotyper.

4. GOOGLE OAUTH
Vi anvander Google OAuth for att autentisera anvandare och mojliggora Gmail-utskick. Vi begars minimala behorigheter: email, profile och gmail.send.

5. DATALAGRING
Du kan ta bort ditt konto genom att kontakta hello@logoplacers.com. Vi raderar dina kontouppgifter inom 30 dagar pa begaran.

6. GDPR
Om du befinner dig inom EES har du ratt att komma at, korrigera och ta bort dina personuppgifter. Kontakta hello@logoplacers.com for att utova dessa rattigheter.

7. COOKIES
Vi anvander sessionStorage och localStorage i din webblesare. Vi anvander inte spar-cookies.

8. KONTAKT
hello@logoplacers.com`;

const TERMS_SV = `Senast uppdaterad: Mars 2025

Genom att anvanda Logoplacers ("Tjansten") godkanner du dessa anvandardvillkor.

1. ACCEPTABEL ANVANDNING
Du far bara anvanda Logoplacers for lagliga andamal. Du samtycker till att inte anvanda Tjansten for att skicka spam, agna dig at bedrageriska metoder eller bryta mot tillampliga lagar.

2. ANVANDARDANSVAR FOR INNEHALL
Du ansvarar ensamt for allt innehall du skapar, laddar upp och skickar med Tjansten. Vi tillhandahaller ett tekniskt verktyg. Vi ansvarar inte for hur du anvander det.

3. TREDJEPARTS LOGOTYPER OCH IMMATERIELLA RATTIGHETER
Logotyphamtningsfunktionen hamtar offentligt tillgangliga logotyper fran tredjeparts kallor. Dessa logotyper tilllhor sina respektive agare. Logoplacers gor inga ansprak pa agandeskapet av tredjeparts logotyper.

Du bekraftar att:
(a) Anvandning av tredjeparts logotyper i din outreach ar ditt ansvar
(b) Du foljer tillampliga varumarkes- och IP-lagar
(c) Vi ansvarar inte for krav som uppstar fran din anvandning av tredjeparts logotyper

4. ANSVARSFRISKRIVNING
Tjansten tillhandahlls "i befintligt skick" utan garantier av nagot slag.

5. ANSVARSBEGRANSNING
I den utstrackning lagen tillater ska Logoplacers inte vara ansvarigt for indirekta, tillfalliga, sarskilda eller foljdskador. Vart totala ansvar ska inte overstiga det belopp du betalat oss under de 12 manader som foregick kravet.

6. SKADESLOSHALLANDEFORPLIKTELSE
Du samtycker till att skadelosha Logoplacers och dess operatorer fran krav, skador eller utgifter som uppstar fran din anvandning av Tjansten.

7. TILLAAMPLIG LAG
Dessa villkor regleras av svensk lag.

8. KONTAKT
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
    <div style={{background:"#070b12",color:"#fff",minHeight:"100vh",fontFamily:"'DM Sans','Helvetica Neue',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <nav style={{position:"sticky",top:0,zIndex:100,height:60,padding:"0 32px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(7,11,18,.92)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:9,textDecoration:"none"}}>
          <Logo size={26}/>
          <span style={{fontSize:15,fontWeight:700,color:"#fff",letterSpacing:"-.3px"}}>Logoplacers</span>
        </a>
        <button onClick={onBack} style={{background:"none",border:"none",color:"rgba(255,255,255,.4)",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>← {t("legal.back")}</button>
      </nav>
      <div style={{maxWidth:720,margin:"0 auto",padding:"60px 24px 100px"}}>
        <div style={{display:"flex",gap:8,marginBottom:40}}>
          {["privacy","terms"].map(t2=>(
            <button key={t2} onClick={()=>setTab(t2)} style={{background:tab===t2?"rgba(26,130,255,.12)":"rgba(255,255,255,.04)",border:`1px solid ${tab===t2?"rgba(26,130,255,.3)":"rgba(255,255,255,.08)"}`,color:tab===t2?"#60a5fa":"rgba(255,255,255,.4)",borderRadius:10,padding:"8px 18px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
              {t2==="privacy"?t("legal.privacy_title"):t("legal.terms_title")}
            </button>
          ))}
        </div>
        <h1 style={{fontSize:"clamp(28px,4vw,42px)",fontWeight:800,letterSpacing:"-1.5px",margin:"0 0 40px",color:"#fff"}}>{title}</h1>
        <div style={{fontSize:15,color:"rgba(255,255,255,.55)",lineHeight:1.9,whiteSpace:"pre-wrap"}}>
          {content.split("\n").map((line, i) => {
            if (/^\d+\./.test(line.trim()) || line.startsWith("Last updated")) {
              return <p key={i} style={{fontWeight:700,color:"rgba(255,255,255,.85)",margin:"28px 0 8px",fontSize:14,letterSpacing:"-.2px"}}>{line}</p>;
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
