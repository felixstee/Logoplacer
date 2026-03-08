import { useState, useEffect } from "react";

function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="blg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1a82ff"/><stop offset="1" stopColor="#5b4fff"/>
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#blg)"/>
      <rect x="4" y="4" width="11" height="11" rx="3" fill="white" opacity=".95"/>
      <rect x="17" y="4" width="11" height="11" rx="3" fill="white" opacity=".6"/>
      <rect x="4" y="17" width="11" height="11" rx="3" fill="white" opacity=".6"/>
      <rect x="17" y="17" width="11" height="11" rx="3" fill="white" opacity=".95"/><rect x="13" y="13" width="6" height="6" rx="1.5" fill="white" opacity=".28"/>
    </svg>
  );
}

const POSTS = [
  {slug:"personalised-demos-reply-rate",title:"How Personalised Sales Demos Increase Reply Rates by 3x",excerpt:"Visual personalisation outperforms text-only cold outreach in every study. Here is the data and how to do it at scale.",cat:"Strategy",rt:"5 min",date:"Mar 2025",tags:["personalisation","cold email","reply rate"],body:"Personalised outreach is not new. What is new is doing it visually and at scale. When a prospect opens an email and sees their own company logo placed perfectly on your product screenshot, something clicks. It signals effort. It signals relevance. And it converts.\n\nStudies consistently show that visual personalisation outperforms text-only approaches. Reply rates of 15 to 30% are achievable for teams that implement logo-based demo personalisation versus the industry average of 2 to 5% for generic cold email.\n\nThe core mechanic is simple: upload your product screenshot once, auto-fetch your prospect's logo, and send a tailored image that looks like you spent an hour on it. You spent 20 seconds.\n\nThis is not about manipulation. It is about showing your prospect that you understand their world. A logo is the most recognisable visual asset a company has. When yours appears on someone's tool in context, it creates immediate rapport.\n\nScale is the key advantage. Doing this manually in Figma for one prospect might take 30 minutes. Doing it for 50 prospects with Logoplacers takes 8 minutes total."},
  {slug:"cold-email-personalisation-sdrs",title:"Cold Email Personalisation at Scale: A Practical Guide for SDRs",excerpt:"Most SDRs spend 70% of their time on manual research. Here is how to cut that to under 5% without sacrificing quality.",cat:"Playbook",rt:"7 min",date:"Mar 2025",tags:["SDR","cold email","automation"],body:"The average SDR spends 3.5 hours per day on research and personalisation. That is time not spent on calls, not spent closing. And most of that personalisation is basic: first name, company name, maybe a LinkedIn detail. Prospects see through it immediately.\n\nThe shift to visual personalisation changes the economics. Instead of writing a unique opening line for every prospect, you create one great visual asset and let automation do the personalisation layer.\n\nHere is the workflow: build your demo screenshot in Logoplacers once. Add text layers with placeholders like name and company. Then paste your prospect list and let the tool generate 50 unique personalised images in under 2 minutes.\n\nEach image gets sent directly from your Gmail with a 15 to 30 second anti-spam delay between sends. The prospect receives an email that looks like you hand-crafted a custom demo specifically for them.\n\nThe SDRs who adopt this report 4 to 6x increases in positive reply rates within the first two weeks."},
  {slug:"visual-demos-b2b-outreach",title:"Why Visual Demos Work Better Than Text in B2B Outreach",excerpt:"The human brain processes images 60,000x faster than text. Here is why that matters for your sales pipeline.",cat:"Strategy",rt:"4 min",date:"Feb 2025",tags:["visual demos","B2B","sales"],body:"The brain processes visual information 60,000 times faster than text. In cold outreach, you have approximately 3 seconds to capture attention before your email is archived. A personalised visual demo is your strongest tool for those 3 seconds.\n\nText-only cold emails rely on the prospect reading far enough to understand your value proposition. Most do not. A well-designed visual demo communicates the core value instantly before a single word is read.\n\nThe psychology is straightforward. When a B2B buyer sees their company logo placed on a product screenshot, several things happen simultaneously. They recognise their brand and get immediate attention. They see it in context with your tool and get instant product comprehension. They feel that this email was prepared specifically for them.\n\nNone of this requires expensive video production. A single high-quality screenshot with a well-placed logo achieves the same psychological effect at 1% of the cost and time."},
  {slug:"gmail-bulk-send-personalised",title:"How to Send 100 Personalised Emails from Gmail in Under 10 Minutes",excerpt:"A step-by-step workflow for bulk personalised outreach from Gmail without getting flagged as spam.",cat:"Tutorial",rt:"6 min",date:"Feb 2025",tags:["Gmail","bulk send","tutorial"],body:"Sending personalised bulk email from Gmail requires three things: unique content per recipient, natural send timing, and a good sender reputation.\n\nLogoplacers handles the first two automatically. Each recipient gets a genuinely unique personalised image attached. Sends are spaced 15 to 30 seconds apart to mimic natural human sending behaviour.\n\nThe workflow: upload your screenshot, arrange logo placement and text layers, paste your prospect list, write your email with name and company placeholders, connect Gmail via OAuth, and hit send.\n\nImportant note on warm sending: new Gmail accounts should ramp up slowly. Start with 20 to 30 sends per day for the first two weeks before scaling. Use a custom domain rather than a personal Gmail address for B2B outreach. A Google Workspace account is significantly better than personal Gmail for deliverability."},
  {slug:"logo-personalisation-saas-sales",title:"Logo Personalisation: The Easiest Win in SaaS Sales Outreach",excerpt:"One change to your outreach strategy that takes 20 minutes to implement and immediately improves every metric.",cat:"Strategy",rt:"4 min",date:"Feb 2025",tags:["SaaS","logo","personalisation"],body:"If you work in SaaS sales, you are competing against dozens of other tools for the same buyer's attention. Your product might be genuinely better. But your outreach looks exactly like everyone else's.\n\nLogo personalisation is the lowest-effort, highest-impact change you can make right now. It takes one afternoon to set up and immediately differentiates every email you send.\n\nHere is the simple version: take a screenshot of your product with a company's logo already placed on it. Send that as part of your cold email. The prospect sees their brand in your UI. Conversion begins.\n\nThe more scalable version: use Logoplacers to automate this for your entire prospect list. One upload, 100 personalised demos, all sent from Gmail. The conversion lift pays for the tool in the first week."},
  {slug:"what-is-logoplacers",title:"What Is Logoplacers? The Personalised Demo Tool Explained",excerpt:"A complete overview of how Logoplacers works, who it is for, and why sales teams are switching from Figma and Loom.",cat:"Product",rt:"5 min",date:"Jan 2025",tags:["product","overview","getting started"],body:"Logoplacers is a browser-based tool that lets sales teams create personalised product demos at scale. You upload one product screenshot, and the tool generates unique versions for every prospect on your list, each with their own company logo automatically placed.\n\nThe core workflow has three steps. First, upload your screenshot and use the drag-and-drop editor to position where logos and text should appear. Second, paste your prospect list. Logoplacers automatically fetches each company's logo. Third, connect Gmail and send.\n\nWhat makes Logoplacers different: Loom requires recording per prospect. Figma requires design skills and manual work per person. Logoplacers does in 8 minutes what Figma takes 3 hours.\n\nIt is designed specifically for SDRs, AEs, and sales managers who send outreach at volume but want each touchpoint to feel personal."},
  {slug:"sales-outreach-personalisation-2025",title:"The State of Sales Outreach Personalisation in 2025",excerpt:"Buyers are more sceptical than ever. Here is what the data says about what actually works in modern B2B prospecting.",cat:"Industry",rt:"6 min",date:"Jan 2025",tags:["2025","trends","personalisation"],body:"The average B2B buyer in 2025 receives 120 or more cold emails per week. Open rates for generic outreach have fallen to sub-2%. First-name personalisation, once a differentiator, is now table stakes.\n\nWhat does work? Data from high-performing sales teams consistently points to three things: genuine relevance, visual impact, and low friction.\n\nPersonalised visual demos hit all three. They demonstrate research. They create immediate visual impact. And the value proposition is communicated before a single word is read.\n\nThe teams seeing the best results in 2025 combine this with strong signal-based targeting: people who have recently raised funding, launched a product, or hired a new sales leader, and then hit them with a visual demo that references their specific context."},
  {slug:"figma-alternative-sales-demos",title:"The Best Figma Alternative for Sales Demo Personalisation",excerpt:"Figma is powerful but it was not built for sales. Here is a faster workflow that requires zero design skills.",cat:"Comparison",rt:"5 min",date:"Jan 2025",tags:["Figma","alternative","comparison"],body:"Figma is an excellent design tool. It was built for product designers who need pixel-perfect control. It was not built for account executives who need to personalise 50 demo images before their 9am stand-up.\n\nThe problems with using Figma for sales demo personalisation are well-known. It requires a design background. Each personalisation is a manual process of copying a file, replacing a logo, and exporting. There is no bulk workflow. It does not connect to your email client.\n\nLogoplacers was built specifically to solve these problems. No design skills needed. Bulk personalisation is the core feature. Gmail integration means you go from personalised image to sent email without leaving the tool.\n\nThe typical switch reduces time per personalised demo from 25 to 40 minutes to under 30 seconds. For a team sending 50 demos per week, that is 20 or more hours saved every single week."},
  {slug:"increase-cold-email-open-rates",title:"7 Ways to Increase Cold Email Open Rates in B2B Sales",excerpt:"Subject lines, send times, sender reputation: every lever that actually moves open rates, ranked by impact.",cat:"Strategy",rt:"8 min",date:"Dec 2024",tags:["open rate","cold email","B2B"],body:"Open rates are the first gate in cold email. Here are seven things that have a measurable impact, in order of impact.\n\n1. Sender reputation. The biggest factor. A Google Workspace account with a custom domain consistently outperforms all other variables. Set up DKIM, SPF, and DMARC.\n\n2. Subject line. Keep it under 50 characters. Avoid spam trigger words. The highest-performing subject lines are either very specific or create genuine curiosity.\n\n3. Send time. Tuesday to Thursday, 7 to 9am or 4 to 6pm in your prospect's timezone.\n\n4. Deliverability warm-up. New accounts should ramp up over 4 to 6 weeks. Never jump straight to 100 sends per day.\n\n5. List quality. A clean list with correct domains opens better than a cheap scraped list. Verify emails before sending.\n\n6. Company name in subject. Including the prospect's company name lifts open rates by 10 to 20%.\n\n7. Preview text. The 80 characters after the subject line in most email clients. Make them compelling."},
  {slug:"sales-demo-before-first-call",title:"Sales Demo Best Practices: Show Value Before the First Call",excerpt:"The best demo happens before you get on a Zoom. Here is how to pre-sell your product visually in the prospecting phase.",cat:"Strategy",rt:"5 min",date:"Dec 2024",tags:["sales demo","best practices","pipeline"],body:"The traditional sales demo is a structured presentation on a Zoom call, 30 to 60 minutes long. For enterprise deals, this still makes sense. For SMB and mid-market SaaS, it is often too much friction too early.\n\nThe modern approach is to front-load value into the prospecting phase. Instead of asking for a call to show your product, you show it in the cold email itself.\n\nThe best practices for pre-call demo images: show the most impressive moment in your product, not the most complex one. Use a real-looking interface with real-looking data. Include the prospect's logo in a natural position.\n\nThe goal is to create a moment where the prospect thinks: this is actually relevant to me. Teams that adopt this approach report that prospects arrive on first calls better informed and more engaged."},
  {slug:"ai-sales-tools-2025",title:"The Best AI Sales Tools in 2025: A Practical Review",excerpt:"From AI-written emails to automated prospecting: what is actually worth using, and what is overhyped.",cat:"Industry",rt:"7 min",date:"Nov 2024",tags:["AI","sales tools","2025"],body:"The AI sales tools landscape in 2025 is crowded. Most of them produce generic, detectable AI-written copy that damages your sender reputation and annoys prospects.\n\nThe tools worth using fall into three categories: research tools, personalisation tools, and sequencing tools. The mistake most teams make is conflating all three into one platform that does everything mediocrely.\n\nFor research: tools that pull signal data such as job changes, funding rounds, and product launches are genuinely useful.\n\nFor personalisation: visual personalisation tools like Logoplacers are in a different category to AI copywriters. They create genuine visual relevance by embedding the prospect's actual brand identity into your demo.\n\nFor sequencing: simple multi-step sequences with manual personal touches at key moments still outperform fully automated AI sequences."},
  {slug:"loom-alternative-b2b-sales",title:"The Best Loom Alternative for B2B Sales Outreach",excerpt:"Loom is great for async communication. But for cold outreach personalisation, there is a faster approach.",cat:"Comparison",rt:"4 min",date:"Nov 2024",tags:["Loom","alternative","video vs image"],body:"Loom built a great category around asynchronous video. For onboarding and customer success it is excellent. For cold outbound prospecting at scale, it has limitations.\n\nThe core problem: it requires recording a new video for each prospect if you want real personalisation. At 20 prospects per day, that becomes unsustainable.\n\nVideos also face deliverability challenges. Many corporate email filters block emails with video links.\n\nThe Logoplacers approach: create one strong demo image and personalise it automatically for every prospect with their logo and name. 30 seconds of total effort, not 3 minutes per prospect. The image is attached directly to the email so deliverability is unaffected."},
  {slug:"personalise-outreach-without-hours",title:"How to Personalise Every Outreach Email Without Spending Hours on Research",excerpt:"The research trap in sales and a workflow that cuts personalisation time by 90% without sacrificing quality.",cat:"Playbook",rt:"6 min",date:"Oct 2024",tags:["workflow","efficiency","personalisation"],body:"The personalisation trap is real. You know personalised outreach performs better. So you spend 20 minutes per prospect researching them. By the time you have sent 10 emails, two hours have passed.\n\nThe solution is to identify which layer of personalisation drives the most conversion, and automate everything else.\n\nResearch shows that visual recognition triggers the fastest and strongest response. Seeing your own company logo in a relevant context creates immediate attention without any of the written personalisation that takes time.\n\nThe workflow: spend your research time on qualifying the right prospects, not on crafting unique openers. Then use Logoplacers to create the visual personalisation layer automatically. 50 personalised demos in 8 minutes."},
  {slug:"track-email-opens-gmail",title:"How to Track Email Open Rates When Sending from Gmail",excerpt:"Gmail does not give you open tracking by default. Here is how to measure what is working in your outbound campaigns.",cat:"Tutorial",rt:"5 min",date:"Oct 2024",tags:["Gmail","tracking","analytics"],body:"Gmail's native interface does not include email open tracking. For sales outreach, knowing which emails were opened is essential data.\n\nThe most reliable method is pixel tracking. A 1x1 transparent pixel is embedded in the email HTML. When the email is opened and images load, the pixel fires. Tools like Mailtrack, Streak, and Mixmax add this to Gmail via Chrome extensions.\n\nImportant caveat: Apple's Mail Privacy Protection pre-fetches email content including tracking pixels, making open tracking unreliable for Apple Mail users. This means open rates are now inflated.\n\nReply rate and positive reply rate are more reliable success metrics for cold outbound."},
  {slug:"personalised-images-email-body",title:"Beyond the Email Signature: Using Personalised Images in Sales Outreach",excerpt:"Email signatures are table stakes. Here is how top-performing sales teams use visual personalisation in the email body itself.",cat:"Strategy",rt:"4 min",date:"Sep 2024",tags:["email design","personalisation","images"],body:"Most sales emails are walls of text. The best-performing ones include a personalised visual in the email body itself.\n\nThe distinction matters. An email signature tells the prospect who you are. A personalised demo image in the body shows the prospect what you can do for them. The latter drives replies.\n\nThe technical implementation: attach the personalised image directly to the email so it loads without clicking any links. Keep email copy short, three to four sentences maximum. Let the image carry the value proposition.\n\nBest-performing structure: one sentence of relevance, one sentence bridging to your tool, the personalised image, and one low-friction call to action."},
];

const CAT_COLORS = {Strategy:"#1a82ff",Playbook:"#8b5cf6",Tutorial:"#10b981",Industry:"#f59e0b",Comparison:"#ec4899",Product:"#06b6d4"};

function BlogCard({ p, onClick }) {
  const [hov, setHov] = useState(false);
  const c = CAT_COLORS[p.cat] || "#1a82ff";
  return (
    <article onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} onClick={()=>onClick(p)}
      itemScope itemType="https://schema.org/BlogPosting"
      style={{
        background:hov?"rgba(255,255,255,.045)":"rgba(255,255,255,.018)",
        border:`1px solid ${hov?`${c}44`:"rgba(255,255,255,.06)"}`,
        borderRadius:20,padding:"26px 24px",cursor:"pointer",
        transition:"border-color .2s,background .2s,box-shadow .2s,transform .2s",
        boxShadow:hov?`0 14px 44px rgba(0,0,0,.3),0 0 0 0.5px ${c}18`:"none",
        transform:hov?"translateY(-2px)":"translateY(0)",
        display:"flex",flexDirection:"column",gap:13,
      }}>
      <meta itemProp="headline" content={p.title}/>
      <meta itemProp="datePublished" content={p.date}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
        <span style={{fontSize:10,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:c,background:`${c}14`,border:`1px solid ${c}30`,borderRadius:6,padding:"3px 8px"}}>{p.cat}</span>
        <span style={{fontSize:11,color:"rgba(255,255,255,.24)"}}>{p.rt} read</span>
      </div>
      <h2 itemProp="name" style={{fontSize:15,fontWeight:700,color:"#fff",margin:0,letterSpacing:"-.3px",lineHeight:1.34}}>{p.title}</h2>
      <p itemProp="description" style={{fontSize:12,color:"rgba(255,255,255,.4)",lineHeight:1.65,margin:0,flex:1}}>{p.excerpt}</p>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontSize:11,color:"rgba(255,255,255,.24)"}}>{p.date}</span>
        <span style={{fontSize:12,color:c,fontWeight:600}}>Read more →</span>
      </div>
    </article>
  );
}

function BlogPost({ p, onBack }) {
  const c = CAT_COLORS[p.cat] || "#1a82ff";
  useEffect(() => {
    window.scrollTo(0,0);
    document.title = `${p.title} — Logoplacers Blog`;
    return () => { document.title = "Logoplacers"; };
  }, [p]);
  return (
    <div style={{maxWidth:720,margin:"0 auto",padding:"40px 24px 80px"}}>
      <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",color:"rgba(255,255,255,.4)",fontSize:13,cursor:"pointer",fontFamily:"inherit",padding:0,marginBottom:40,transition:"color .15s"}}
        onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.4)"}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        All posts
      </button>
      <span style={{fontSize:10,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:c,background:`${c}14`,border:`1px solid ${c}30`,borderRadius:6,padding:"4px 10px",display:"inline-block",marginBottom:20}}>{p.cat}</span>
      <h1 style={{fontSize:"clamp(24px,4vw,40px)",fontWeight:800,letterSpacing:"-1.5px",margin:"0 0 16px",lineHeight:1.15,color:"#fff"}}>{p.title}</h1>
      <div style={{display:"flex",gap:14,marginBottom:48,fontSize:12,color:"rgba(255,255,255,.28)"}}>
        <span>{p.date}</span><span>·</span><span>{p.rt} read</span>
      </div>
      <div style={{fontSize:16,color:"rgba(255,255,255,.65)",lineHeight:1.85}}>
        {p.body.trim().split("\n\n").map((para,i)=><p key={i} style={{margin:"0 0 22px"}}>{para}</p>)}
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:7,marginTop:40,paddingTop:32,borderTop:"1px solid rgba(255,255,255,.06)"}}>
        {p.tags.map(tag=><span key={tag} style={{fontSize:11,color:"rgba(255,255,255,.32)",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:6,padding:"3px 9px"}}>#{tag}</span>)}
      </div>
      <div style={{marginTop:56,background:"rgba(26,130,255,.07)",border:"1px solid rgba(26,130,255,.2)",borderRadius:20,padding:"32px 28px",textAlign:"center"}}>
        <p style={{fontSize:14,color:"rgba(255,255,255,.5)",margin:"0 0 8px"}}>Ready to try visual personalisation?</p>
        <h3 style={{fontSize:20,fontWeight:800,letterSpacing:"-1px",margin:"0 0 20px",color:"#fff"}}>Send your first demo in 30 seconds.</h3>
        <a href="/" style={{display:"inline-block",background:"linear-gradient(135deg,#1a82ff,#5b4fff)",color:"#fff",textDecoration:"none",borderRadius:12,padding:"12px 28px",fontSize:14,fontWeight:700,boxShadow:"0 8px 24px rgba(26,130,255,.35)"}}>
          Try Logoplacers free →
        </a>
      </div>
    </div>
  );
}

function BlogIndex({ onPost }) {
  const [filter, setFilter] = useState("All");
  const cats = ["All","Strategy","Playbook","Tutorial","Industry","Comparison","Product"];
  const shown = filter === "All" ? POSTS : POSTS.filter(p=>p.cat===filter);
  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"60px 24px 80px"}}>
      <div style={{textAlign:"center",marginBottom:56}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:"2px",color:"#1a82ff",textTransform:"uppercase",marginBottom:14}}>Blog</div>
        <h1 style={{fontSize:"clamp(32px,5vw,56px)",fontWeight:800,letterSpacing:"-2.5px",margin:"0 0 14px",lineHeight:1.04}}>Sales outreach,<br/>explained.</h1>
        <p style={{fontSize:16,color:"rgba(255,255,255,.36)",maxWidth:400,margin:"0 auto 36px"}}>Tactics, playbooks, and deep-dives for modern SDRs and AEs.</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:7,justifyContent:"center"}}>
          {cats.map(cat=>(
            <button key={cat} onClick={()=>setFilter(cat)} style={{
              background:filter===cat?"rgba(26,130,255,.15)":"rgba(255,255,255,.04)",
              border:`1px solid ${filter===cat?"rgba(26,130,255,.38)":"rgba(255,255,255,.08)"}`,
              color:filter===cat?"#60a5fa":"rgba(255,255,255,.42)",
              borderRadius:100,padding:"6px 16px",fontSize:12,fontWeight:600,
              cursor:"pointer",fontFamily:"inherit",transition:"all .15s",
            }}>{cat}</button>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
        {shown.map(p=><BlogCard key={p.slug} p={p} onClick={onPost}/>)}
      </div>
    </div>
  );
}

export default function Blog() {
  const [activePost, setActivePost] = useState(null);

  useEffect(() => {
    const hash = window.location.hash.replace("#","");
    if (hash) {
      const found = POSTS.find(p=>p.slug===hash);
      if (found) setActivePost(found);
    }
  }, []);

  const handlePost = (p) => {
    setActivePost(p);
    window.location.hash = p.slug;
    window.scrollTo(0,0);
  };

  const handleBack = () => {
    setActivePost(null);
    window.location.hash = "";
    window.scrollTo(0,0);
  };

  return (
    <div style={{background:"#070b12",color:"#fff",minHeight:"100vh",fontFamily:"'DM Sans','Helvetica Neue',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <nav style={{position:"sticky",top:0,zIndex:100,height:60,padding:"0 32px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(7,11,18,.92)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:9,textDecoration:"none"}}>
          <Logo size={28}/>
          <span style={{fontSize:15,fontWeight:700,color:"#fff",letterSpacing:"-.3px"}}>Logoplacers</span>
          <span style={{fontSize:12,color:"rgba(255,255,255,.25)",margin:"0 2px"}}>/</span>
          <span style={{fontSize:13,color:"rgba(255,255,255,.45)",fontWeight:500}}>Blog</span>
        </a>
        <a href="/" style={{background:"linear-gradient(135deg,#1a82ff,#5b4fff)",color:"#fff",textDecoration:"none",borderRadius:10,padding:"8px 18px",fontSize:13,fontWeight:700,boxShadow:"0 4px 16px rgba(26,130,255,.3)"}}>
          Try free →
        </a>
      </nav>
      {activePost ? <BlogPost p={activePost} onBack={handleBack}/> : <BlogIndex onPost={handlePost}/>}
      <footer style={{borderTop:"1px solid rgba(255,255,255,.05)",padding:"24px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <Logo size={22}/>
          <span style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,.4)"}}>Logoplacers</span>
        </div>
        <span style={{fontSize:12,color:"rgba(255,255,255,.2)"}}>Personalised sales demos that convert.</span>
        <a href="/" style={{fontSize:12,color:"rgba(255,255,255,.3)",textDecoration:"none"}}>Back to home</a>
      </footer>
      <style>{`*{box-sizing:border-box}html{scroll-behavior:smooth}`}</style>
    </div>
  );
}
