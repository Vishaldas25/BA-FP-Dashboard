import { useState, useEffect } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
} from "recharts";

/* ─── TOKENS ─── */
const T = {
  bg0:"#080c12", bg1:"#0d1520", bg2:"#111d2e", bg3:"#162235",
  border:"#1e3048", borderBright:"#2a4a70",
  cyan:"#00d4ff", cyanDim:"#00a8cc", cyanGlow:"rgba(0,212,255,0.15)",
  amber:"#f5a623", amberGlow:"rgba(245,166,35,0.15)",
  coral:"#ff5f6d", coralGlow:"rgba(255,95,109,0.12)",
  teal:"#00c9a7", tealGlow:"rgba(0,201,167,0.12)",
  purple:"#7c6af7", purpleGlow:"rgba(124,106,247,0.12)",
  txt:"#e8f4ff", txtDim:"#7a9cc0", txtFaint:"#3d6080",
};

/* ─── GLOBAL STYLES ─── */
const GS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html{-webkit-text-size-adjust:100%;}
.dr{font-family:'DM Mono',monospace;background:${T.bg0};min-height:100vh;color:${T.txt};padding:clamp(10px,3vw,20px);position:relative;overflow-x:hidden;}
.dr::before{content:'';position:fixed;inset:0;background-image:linear-gradient(rgba(0,212,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.025) 1px,transparent 1px);background-size:44px 44px;pointer-events:none;z-index:0;}
.dc{position:relative;z-index:1;}

/* HEADER */
.hcard{background:${T.bg1};border:1px solid ${T.border};border-top:2px solid ${T.cyan};border-radius:12px;padding:clamp(14px,3vw,22px) clamp(14px,4vw,28px);margin-bottom:clamp(10px,2vw,16px);position:relative;overflow:hidden;}
.hcard::after{content:'';position:absolute;top:0;left:0;right:0;height:70px;background:linear-gradient(180deg,${T.cyanGlow} 0%,transparent 100%);pointer-events:none;}
.hcard-inner{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;}
.hcard-title{font-family:'Syne',sans-serif;font-size:clamp(15px,3.5vw,22px);font-weight:800;color:${T.txt};letter-spacing:-.01em;line-height:1.2;}
.hcard-sub{font-size:clamp(11px,2.5vw,14px);font-weight:600;color:${T.cyan};margin-top:3px;display:block;}
.hcard-label{font-size:clamp(9px,2vw,10px);color:${T.cyan};letter-spacing:.14em;text-transform:uppercase;margin-bottom:6px;}
.hcard-meta{font-size:clamp(10px,2.2vw,11px);color:${T.txtDim};}
.hcard-meta2{font-size:clamp(9px,2vw,11px);color:${T.txtFaint};}
.hcard-stats{margin-top:8px;display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;}
.stat-box{background:${T.bg2};border:1px solid ${T.border};border-radius:6px;padding:4px 10px;text-align:center;}
.stat-v{font-size:clamp(12px,3vw,14px);font-weight:700;color:${T.cyan};font-family:'Syne',sans-serif;}
.stat-l{font-size:clamp(7px,1.8vw,9px);color:${T.txtFaint};letter-spacing:.06em;text-transform:uppercase;}

/* METRIC CARDS */
.mc{background:${T.bg1};border:1px solid ${T.border};border-radius:10px;padding:clamp(12px,2.5vw,16px) clamp(12px,2.5vw,18px);position:relative;overflow:hidden;transition:border-color .25s,transform .2s;}
.mc:hover{border-color:${T.borderBright};transform:translateY(-2px);}
.mc::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;}
.mc.cyan::before{background:${T.cyan};box-shadow:0 0 14px ${T.cyan};}
.mc.amber::before{background:${T.amber};box-shadow:0 0 14px ${T.amber};}
.mc.coral::before{background:${T.coral};box-shadow:0 0 14px ${T.coral};}
.mc.teal::before{background:${T.teal};box-shadow:0 0 14px ${T.teal};}
.mc.purple::before{background:${T.purple};box-shadow:0 0 14px ${T.purple};}
.ml{font-size:clamp(8px,1.8vw,10px);color:${T.txtDim};letter-spacing:.1em;text-transform:uppercase;margin-bottom:5px;}
.mv{font-family:'Syne',sans-serif;font-size:clamp(20px,4vw,28px);font-weight:700;line-height:1;}
.ms{font-size:clamp(8px,1.8vw,10px);color:${T.txtFaint};margin-top:4px;}

/* CHART CARDS */
.cc{background:${T.bg1};border:1px solid ${T.border};border-radius:10px;padding:clamp(14px,3vw,20px);transition:border-color .2s;}
.cc:hover{border-color:${T.borderBright};}
.ct{font-size:clamp(9px,1.9vw,10px);color:${T.txtDim};letter-spacing:.07em;text-transform:uppercase;margin-bottom:clamp(10px,2vw,16px);display:flex;align-items:center;gap:8px;line-height:1.4;}
.ct::before{content:'';display:inline-block;width:3px;height:12px;min-width:3px;background:${T.cyan};border-radius:2px;box-shadow:0 0 8px ${T.cyan};}

/* NAV */
.nb{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:clamp(10px,2vw,16px);}
.nv{padding:clamp(5px,1.5vw,7px) clamp(10px,2.5vw,16px);border-radius:6px;font-size:clamp(9px,2vw,11px);font-family:'DM Mono',monospace;letter-spacing:.04em;cursor:pointer;border:1px solid ${T.border};background:${T.bg1};color:${T.txtDim};transition:all .2s;white-space:nowrap;}
.nv:hover{border-color:${T.borderBright};color:${T.txt};}
.nv.active{background:${T.cyanGlow};border-color:${T.cyanDim};color:${T.cyan};box-shadow:0 0 18px ${T.cyanGlow};}

/* FUNNEL BARS */
.fb{border-radius:3px;position:relative;overflow:hidden;}
.fb::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent 60%,rgba(255,255,255,.05) 100%);}

/* KPI ROWS */
.kr{border-radius:8px;padding:clamp(10px,2vw,12px) clamp(12px,2.5vw,16px);border:1px solid ${T.border};background:${T.bg2};transition:border-color .2s;margin-bottom:8px;}
.kr:hover{border-color:${T.borderBright};}

/* INSIGHT CALLOUTS */
.ins{border-left:2px solid ${T.amber};background:${T.amberGlow};border-radius:0 6px 6px 0;padding:8px 12px;font-size:clamp(10px,2vw,11px);color:${T.txtDim};margin-top:12px;line-height:1.6;}
.ins.cyan{border-color:${T.cyan};background:${T.cyanGlow};}
.ins.coral{border-color:${T.coral};background:${T.coralGlow};}
.ins.teal{border-color:${T.teal};background:${T.tealGlow};}

/* TAB STRIP */
.ts{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:clamp(10px,2vw,16px);}
.tb{padding:5px clamp(8px,2vw,12px);border-radius:5px;font-size:clamp(9px,1.9vw,10px);font-family:'DM Mono',monospace;letter-spacing:.04em;cursor:pointer;border:1px solid ${T.border};background:${T.bg2};color:${T.txtFaint};transition:all .18s;white-space:nowrap;}
.tb:hover{color:${T.txtDim};border-color:${T.borderBright};}
.tb.active{background:${T.purpleGlow};border-color:${T.purple};color:${T.purple};}

/* CORRELATION */
.xc{width:clamp(28px,5vw,38px);height:clamp(22px,3.5vw,30px);display:flex;align-items:center;justify-content:center;font-size:clamp(7px,1.5vw,9px);font-weight:500;border-radius:3px;transition:transform .15s;cursor:default;font-family:'DM Mono',monospace;}
.xc:hover{transform:scale(1.3);z-index:10;position:relative;}

/* UTILS */
::-webkit-scrollbar{width:3px;height:3px;}
::-webkit-scrollbar-track{background:${T.bg0};}
::-webkit-scrollbar-thumb{background:${T.border};border-radius:2px;}
.lg{display:flex;align-items:center;gap:5px;font-size:clamp(9px,1.9vw,10px);color:${T.txtDim};}
.ld{width:8px;height:8px;border-radius:2px;flex-shrink:0;}

/* ANIMATION */
@keyframes fu{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
.sw{animation:fu .3s ease both;}

/* SECTION TITLE */
.st{font-family:'Syne',sans-serif;font-size:clamp(13px,3vw,16px);font-weight:700;color:${T.txt};margin-bottom:clamp(12px,2.5vw,16px);display:flex;align-items:center;gap:10px;letter-spacing:.02em;}
.st::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,${T.border} 0%,transparent 100%);}

/* RESPONSIVE GRIDS */
.g-2{display:grid;gap:clamp(8px,2vw,12px);}
.g-3{display:grid;gap:clamp(8px,2vw,12px);}
.g-5{display:grid;gap:clamp(8px,2vw,10px);}

/* Profile card */
.prof-card{background:${T.bg2};border:1px solid ${T.border};border-radius:10px;padding:clamp(12px,2.5vw,16px) clamp(14px,3vw,18px);}

/* MOBILE-SPECIFIC */
@media(max-width:500px){
  .hcard-right{text-align:left!important;}
  .hcard-stats{justify-content:flex-start!important;}
  .mob-hide{display:none!important;}
}
@media(min-width:501px) and (max-width:768px){
  .hcard-right{text-align:right;}
}
`;

/* ─── RESPONSIVE HOOK ─── */
function useWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 800);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

/* ─── TOOLTIP ─── */
const DT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:T.bg3,border:`1px solid ${T.borderBright}`,borderRadius:8,padding:"10px 14px",fontSize:11,boxShadow:"0 8px 32px rgba(0,0,0,.6)",fontFamily:"'DM Mono',monospace",maxWidth:200}}>
      {label && <p style={{color:T.cyan,marginBottom:6,fontWeight:500,fontSize:11}}>{label}</p>}
      {payload.map((p,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}>
          <span style={{width:6,height:6,borderRadius:2,background:p.color||T.cyan,flexShrink:0}}/>
          <span style={{color:T.txtDim,fontSize:10}}>{p.name}:</span>
          <span style={{color:T.txt,fontWeight:500,fontSize:10}}>{p.value}%</span>
        </div>
      ))}
    </div>
  );
};

/* ─── CARD ─── */
const CC = ({title,children,span})=>(
  <div className="cc" style={{gridColumn:span?`span ${span}`:undefined}}>
    <div className="ct">{title}</div>
    {children}
  </div>
);

/* ─── METRIC CARD ─── */
const MC = ({label,value,sub,accent="cyan"})=>{
  const colors={cyan:T.cyan,amber:T.amber,coral:T.coral,teal:T.teal,purple:T.purple};
  return(
    <div className={`mc ${accent}`}>
      <div className="ml">{label}</div>
      <div className="mv" style={{color:colors[accent]}}>{value}</div>
      {sub&&<div className="ms">{sub}</div>}
    </div>
  );
};

/* ─── CHART DEFAULTS ─── */
const CP = {
  cg:{strokeDasharray:"3 3",stroke:T.border,vertical:false},
  xa:{tick:{fill:T.txtDim,fontSize:9,fontFamily:"'DM Mono',monospace"},axisLine:{stroke:T.border},tickLine:false},
  ya:{tick:{fill:T.txtDim,fontSize:9,fontFamily:"'DM Mono',monospace"},axisLine:false,tickLine:false},
};

/* ─── NAV ─── */
const NAV=[
  {id:"overview",label:"01 Overview"},
  {id:"demo",label:"02 Demographics"},
  {id:"awareness",label:"03 Awareness"},
  {id:"crosstab",label:"04 Cross-Tabs"},
  {id:"correlation",label:"05 Correlation"},
  {id:"radar",label:"06 Occupation"},
  {id:"kpi",label:"07 KPI"},
  {id:"risk",label:"08 Risk & Behavior"},
];

/* ══════════════════════════════════════════════════════════ */
export default function Dashboard(){
  const [active,setActive]=useState("overview");
  const w=useWidth();
  const mob=w<600;
  const tab=w>=600&&w<1024;

  return(
    <>
      <style>{GS}</style>
      <div className="dr">
        <div className="dc">

          {/* HEADER */}
          <div className="hcard">
            <div className="hcard-inner">
              <div style={{flex:1,minWidth:0}}>
                <div className="hcard-label">◈ SIBMT Pune · MBA Business Analytics · 2025–26</div>
                <h1 className="hcard-title">
                  Predictive Analysis of Banking Fraud
                  <span className="hcard-sub">& Its Implications for Customer Security and Trust</span>
                </h1>
              </div>
              <div className="hcard-right" style={{textAlign:"right",flexShrink:0}}>
                <div className="hcard-meta">Das Vishal · Roll: 20250143107</div>
                <div className="hcard-meta2">Guide: Prof. Anjali Mulik · SPPU</div>
                <div className="hcard-stats">
                  {[["111","Respondents"],["29","Questions"],["10","Methods"]].map(([v,l])=>(
                    <div key={l} className="stat-box">
                      <div className="stat-v">{v}</div>
                      <div className="stat-l">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* NAV */}
          <div className="nb">
            {NAV.map(n=>(
              <button key={n.id} className={`nv ${active===n.id?"active":""}`} onClick={()=>setActive(n.id)}>
                {n.label}
              </button>
            ))}
          </div>

          {/* SECTIONS */}
          <div key={active} className="sw">
            {active==="overview"    && <Sec1 mob={mob} tab={tab}/>}
            {active==="demo"        && <Sec2 mob={mob} tab={tab}/>}
            {active==="awareness"   && <Sec3 mob={mob} tab={tab}/>}
            {active==="crosstab"    && <Sec4 mob={mob} tab={tab}/>}
            {active==="correlation" && <Sec5 mob={mob} tab={tab}/>}
            {active==="radar"       && <Sec6 mob={mob} tab={tab}/>}
            {active==="kpi"         && <Sec7 mob={mob}/>}
            {active==="risk"        && <Sec8 mob={mob} tab={tab}/>}
          </div>
        </div>
      </div>
    </>
  );
}

/* ══════ 01 · OVERVIEW ══════ */
function Sec1({mob,tab}){
  const metrics=[
    {label:"Age 18–25 dominant",value:"64.0%",sub:"Digital-native majority",accent:"cyan"},
    {label:"Digital Banking Usage",value:"91.7%",sub:"Online or hybrid",accent:"teal"},
    {label:"Correctly Define Phishing",value:"44.1%",sub:"Critical literacy gap",accent:"coral"},
    {label:"Believe Fraud Increasing",value:"79.3%",sub:"High risk awareness",accent:"amber"},
    {label:"OTP = Most Dangerous",value:"47.7%",sub:"Social engineering dominant",accent:"coral"},
    {label:"Prefer Predictive Analytics",value:"44.1%",sub:"AI-driven detection validated",accent:"purple"},
    {label:"Prefer Real-Time Monitoring",value:"73.9%",sub:"Real-time + daily combined",accent:"cyan"},
    {label:"Shared Responsibility",value:"46.8%",sub:"Banks + customers equally",accent:"teal"},
    {label:"Professionals at Risk",value:"63.3%",sub:"High/mod vulnerable segment",accent:"amber"},
    {label:"Regular Bank Alerts",value:"23.4%",sub:"Systemic comm. failure",accent:"coral"},
  ];
  const ocd=[
    {group:"Very Confident",correct:55.3,incorrect:44.7},
    {group:"Somewhat Confident",correct:47.5,incorrect:52.5},
    {group:"Slightly Confident",correct:31.8,incorrect:68.2},
    {group:"Not Confident",correct:20.0,incorrect:80.0},
  ];
  const ftd=[{name:"OTP Fraud",value:47.7},{name:"Phishing",value:24.3},{name:"Card Fraud",value:18.0},{name:"Identity Theft",value:9.9}];
  const ftc=[T.coral,T.amber,T.purple,T.cyan];
  const cols=mob?"repeat(2,1fr)":tab?"repeat(3,1fr)":"repeat(5,1fr)";
  const chartH=mob?180:230;
  return(
    <div>
      <div className="st">Executive Intelligence Dashboard</div>
      <div style={{display:"grid",gridTemplateColumns:cols,gap:"clamp(8px,2vw,10px)",marginBottom:16}}>
        {metrics.map(m=><MC key={m.label} {...m}/>)}
      </div>
      <div className="g-2" style={{gridTemplateColumns:mob?"1fr":tab?"1fr":"1.6fr 1fr"}}>
        <CC title="Overconfidence bias — confidence level vs. actual phishing knowledge">
          <ResponsiveContainer width="100%" height={chartH}>
            <BarChart data={ocd} layout="vertical" margin={{left:mob?4:10,right:mob?20:30,top:4,bottom:4}}>
              <CartesianGrid {...CP.cg} horizontal={false}/>
              <XAxis type="number" domain={[0,100]} tickFormatter={v=>`${v}%`} {...CP.xa}/>
              <YAxis type="category" dataKey="group" width={mob?110:145} {...CP.ya} tick={{fill:T.txtDim,fontSize:mob?8:10,fontFamily:"'DM Mono',monospace"}}/>
              <Tooltip content={<DT/>}/>
              <Bar dataKey="correct" name="Correct %" fill={T.teal} radius={[0,3,3,0]}/>
              <Bar dataKey="incorrect" name="Incorrect %" fill={T.coral} radius={[0,3,3,0]}/>
            </BarChart>
          </ResponsiveContainer>
          <div style={{display:"flex",gap:12,marginTop:6,flexWrap:"wrap"}}>
            {[["Correct phishing %",T.teal],["Incorrect / unsure %",T.coral]].map(([l,c])=>(
              <div key={l} className="lg"><span className="ld" style={{background:c}}/>{l}</div>
            ))}
          </div>
          <div className="ins amber">⚡ Even the most confident group (55.3%) barely exceeds overall average (44.1%) — overconfidence bias confirmed.</div>
        </CC>
        <CC title="Fraud type threat perception (N=111)">
          <ResponsiveContainer width="100%" height={mob?160:200}>
            <PieChart>
              <Pie data={ftd} cx="50%" cy="50%" innerRadius={mob?40:52} outerRadius={mob?65:80} dataKey="value" paddingAngle={3}>
                {ftd.map((_,i)=><Cell key={i} fill={ftc[i]}/>)}
              </Pie>
              <Tooltip content={<DT/>} formatter={v=>[`${v}%`]}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:4}}>
            {ftd.map((d,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
                <span className="ld" style={{background:ftc[i],width:10,height:10,borderRadius:2}}/>
                <span style={{flex:1,fontSize:"clamp(9px,2vw,10px)",color:T.txtDim}}>{d.name}</span>
                <span style={{fontSize:"clamp(11px,2.5vw,13px)",fontWeight:700,color:ftc[i],fontFamily:"'Syne',sans-serif"}}>{d.value}%</span>
              </div>
            ))}
          </div>
          <div className="ins coral">OTP fraud dominates universally across all age groups & genders.</div>
        </CC>
      </div>
    </div>
  );
}

/* ══════ 02 · DEMOGRAPHICS ══════ */
function Sec2({mob,tab}){
  const agD=[{name:"18–25",value:64.0},{name:"26–35",value:24.3},{name:"36–45",value:9.9},{name:"46+",value:1.8}];
  const gnD=[{name:"Female",value:54.1},{name:"Male",value:45.0},{name:"Other",value:0.9}];
  const drD=[{name:"<1 yr",value:21.6},{name:"1–3 yrs",value:30.6},{name:"3–5 yrs",value:27.9},{name:">5 yrs",value:19.8}];
  const inD=[
    {name:"Student",student:58,professional:2,business:0,other:4},
    {name:"< ₹20K",student:4,professional:5,business:0,other:4},
    {name:"₹20–50K",student:2,professional:14,business:2,other:2},
    {name:"₹50K+",student:0,professional:9,business:5,other:0},
  ];
  const txD=[{name:"0–2/day",value:26.1},{name:"3–5/day",value:41.4},{name:"6–10/day",value:18.9},{name:">10/day",value:13.5}];
  const agC=[T.cyan,T.teal,T.purple,T.amber];
  const gnC=[T.coral,T.cyan,T.purple];
  const pieH=mob?160:190;
  const cols3=mob?"1fr":tab?"1fr 1fr":"1fr 1fr 1fr";
  return(
    <div>
      <div className="st">Demographic & Banking Usage Profile</div>
      <div className="g-3" style={{gridTemplateColumns:cols3,marginBottom:12}}>
        <CC title="Age group distribution">
          <ResponsiveContainer width="100%" height={pieH}>
            <PieChart><Pie data={agD} cx="50%" cy="50%" innerRadius={mob?36:48} outerRadius={mob?56:72} dataKey="value" paddingAngle={3}>{agD.map((_,i)=><Cell key={i} fill={agC[i]}/>)}</Pie><Tooltip content={<DT/>} formatter={v=>[`${v}%`]}/></PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:6}}>
            {agD.map((d,i)=><div key={i} className="lg"><span className="ld" style={{background:agC[i]}}/>{d.name}: <strong style={{color:T.txt,marginLeft:2}}>{d.value}%</strong></div>)}
          </div>
        </CC>
        <CC title="Gender distribution">
          <ResponsiveContainer width="100%" height={pieH}>
            <PieChart><Pie data={gnD} cx="50%" cy="50%" innerRadius={mob?36:48} outerRadius={mob?56:72} dataKey="value" paddingAngle={3}>{gnD.map((_,i)=><Cell key={i} fill={gnC[i]}/>)}</Pie><Tooltip content={<DT/>} formatter={v=>[`${v}%`]}/></PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:6}}>
            {gnD.map((d,i)=><div key={i} className="lg"><span className="ld" style={{background:gnC[i]}}/>{d.name}: <strong style={{color:T.txt,marginLeft:2}}>{d.value}%</strong></div>)}
          </div>
        </CC>
        <CC title="Digital banking experience">
          <ResponsiveContainer width="100%" height={pieH}>
            <BarChart data={drD} margin={{left:-20,right:4,top:4}}>
              <CartesianGrid {...CP.cg}/><XAxis dataKey="name" {...CP.xa}/><YAxis tickFormatter={v=>`${v}%`} {...CP.ya}/>
              <Tooltip content={<DT/>}/>
              <Bar dataKey="value" name="%" fill={T.purple} radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </CC>
      </div>
      <div className="g-2" style={{gridTemplateColumns:mob?"1fr":tab?"1fr":"1fr 1fr"}}>
        <CC title="Income range by occupation">
          <ResponsiveContainer width="100%" height={mob?180:210}>
            <BarChart data={inD} margin={{left:-10,right:4}}>
              <CartesianGrid {...CP.cg}/><XAxis dataKey="name" {...CP.xa}/><YAxis {...CP.ya}/>
              <Tooltip content={<DT/>}/>
              <Legend wrapperStyle={{fontSize:9,color:T.txtDim,fontFamily:"'DM Mono',monospace"}}/>
              <Bar dataKey="student" name="Student" stackId="a" fill={T.cyan}/>
              <Bar dataKey="professional" name="Professional" stackId="a" fill={T.teal}/>
              <Bar dataKey="business" name="Business" stackId="a" fill={T.amber}/>
              <Bar dataKey="other" name="Other" stackId="a" fill={T.purple} radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </CC>
        <CC title="Daily transaction volume">
          <ResponsiveContainer width="100%" height={mob?180:210}>
            <BarChart data={txD} margin={{left:-10,right:4}}>
              <CartesianGrid {...CP.cg}/><XAxis dataKey="name" {...CP.xa}/><YAxis tickFormatter={v=>`${v}%`} {...CP.ya}/>
              <Tooltip content={<DT/>}/>
              <Bar dataKey="value" name="%" radius={[3,3,0,0]}>{txD.map((_,i)=><Cell key={i} fill={[T.cyan,T.teal,T.amber,T.coral][i]}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="ins teal">41.4% do 3–5 transactions/day — highly active sample with proportional fraud exposure.</div>
        </CC>
      </div>
    </div>
  );
}

/* ══════ 03 · AWARENESS ══════ */
function Sec3({mob,tab}){
  const funnel=[
    {label:"Uses Digital Banking",pct:91.7,color:T.cyan},
    {label:"Receives Suspicious Comms",pct:73.9,color:T.cyanDim},
    {label:"Believes Fraud Increasing",pct:79.3,color:T.purple},
    {label:"Feels Personally Vulnerable",pct:94.6,color:T.amber},
    {label:"Recognizes ALL Fraud Signs",pct:45.9,color:T.coral},
    {label:"Correctly Defines Phishing",pct:44.1,color:T.coral},
    {label:"Receives Regular Alerts",pct:23.4,color:"#ff2244"},
  ];
  const phish=[
    {name:"Fake comm to steal data (correct)",value:44.1,c:T.teal},
    {name:"Bank verification process (wrong)",value:19.8,c:T.coral},
    {name:"Security feature",value:14.4,c:T.amber},
    {name:"Not sure",value:21.6,c:T.txtFaint},
  ];
  const signs=[{name:"Urgent only",value:18.9},{name:"Unknown link only",value:17.1},{name:"Spelling errors only",value:18.0},{name:"ALL three correct",value:45.9}];
  const alerts=[{name:"Regularly",value:23.4},{name:"Occasionally",value:36.0},{name:"Rarely",value:27.0},{name:"Never",value:13.5}];
  const labelW=mob?90:tab?140:210;
  const cols3=mob?"1fr":tab?"1fr 1fr":"1.2fr 1fr 1fr";
  return(
    <div>
      <div className="st">Fraud Awareness & Literacy Analysis</div>
      <CC title="Fraud literacy funnel — 7-stage sequential drop-off (N=111)">
        <div style={{display:"flex",flexDirection:"column",gap:mob?7:9,padding:"4px 0"}}>
          {funnel.map((s,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:`${labelW}px 1fr 46px`,alignItems:"center",gap:mob?6:12}}>
              <span style={{fontSize:mob?8:10,color:T.txtDim,textAlign:"right",lineHeight:1.3}}>{s.label}</span>
              <div style={{background:T.bg2,borderRadius:4,height:mob?18:24,overflow:"hidden",border:`1px solid ${T.border}`}}>
                <div className="fb" style={{width:`${s.pct}%`,height:"100%",background:s.color,boxShadow:`0 0 12px ${s.color}55`}}/>
              </div>
              <span style={{fontSize:mob?11:12,fontWeight:700,color:s.color,fontFamily:"'Syne',sans-serif"}}>{s.pct}%</span>
            </div>
          ))}
        </div>
        <div className="ins coral" style={{marginTop:14}}>⚡ Critical 50.5pp collapse: Vulnerability awareness (94.6%) → Phishing knowledge (44.1%).</div>
      </CC>
      <div style={{height:12}}/>
      <div className="g-3" style={{gridTemplateColumns:cols3}}>
        <CC title="Phishing knowledge — Q12">
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {phish.map((d,i)=>(
              <div key={i}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:mob?9:10,color:T.txtDim,lineHeight:1.3,paddingRight:8}}>{d.name}</span>
                  <span style={{fontSize:mob?11:12,fontWeight:700,color:d.c,fontFamily:"'Syne',sans-serif",flexShrink:0}}>{d.value}%</span>
                </div>
                <div style={{background:T.bg2,borderRadius:3,height:8,overflow:"hidden"}}>
                  <div style={{width:`${d.value}%`,height:"100%",background:d.c,borderRadius:3,boxShadow:`0 0 8px ${d.c}44`}}/>
                </div>
              </div>
            ))}
          </div>
          <div className="ins amber" style={{marginTop:12}}>19.8% misidentify phishing as a bank verification process.</div>
        </CC>
        <CC title="Fraud sign recognition — Q13">
          <ResponsiveContainer width="100%" height={mob?170:195}>
            <BarChart data={signs} layout="vertical" margin={{left:mob?4:8,right:mob?24:30}}>
              <CartesianGrid {...CP.cg} horizontal={false}/>
              <XAxis type="number" tickFormatter={v=>`${v}%`} {...CP.xa} domain={[0,55]}/>
              <YAxis type="category" dataKey="name" width={mob?90:120} {...CP.ya} tick={{fill:T.txtDim,fontSize:mob?8:9,fontFamily:"'DM Mono',monospace"}}/>
              <Tooltip content={<DT/>}/>
              <Bar dataKey="value" name="%" radius={[0,3,3,0]}>{signs.map((_,i)=><Cell key={i} fill={i===3?T.teal:T.txtFaint}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="ins teal">Only 45.9% identified all three fraud indicators.</div>
        </CC>
        <CC title="Bank alerts received — Q14">
          <ResponsiveContainer width="100%" height={mob?170:195}>
            <BarChart data={alerts} margin={{left:-18,right:4}}>
              <CartesianGrid {...CP.cg}/><XAxis dataKey="name" {...CP.xa}/><YAxis tickFormatter={v=>`${v}%`} {...CP.ya}/>
              <Tooltip content={<DT/>}/>
              <Bar dataKey="value" name="%" radius={[3,3,0,0]}>{alerts.map((_,i)=><Cell key={i} fill={[T.teal,T.amber,T.coral,"#ff2244"][i]}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="ins coral">Only 23.4% receive regular alerts — 36.6pp below benchmark.</div>
        </CC>
      </div>
    </div>
  );
}

/* ══════ 04 · CROSS-TABS ══════ */
function Sec4({mob,tab}){
  const [active,setActive]=useState("confidence");
  const tabs=[
    {id:"confidence",label:"Confidence"},
    {id:"occupation",label:"Occupation"},
    {id:"age",label:"Age"},
    {id:"income",label:"Income"},
    {id:"gender",label:"Gender"},
  ];
  const datasets={
    confidence:[
      {group:mob?"V. Confident":"Very Confident (n=38)",correct:55.3,incorrect:44.7},
      {group:mob?"S. Confident":"Somewhat Confident (n=40)",correct:47.5,incorrect:52.5},
      {group:mob?"Sl. Confident":"Slightly Confident (n=22)",correct:31.8,incorrect:68.2},
      {group:mob?"Not Confident":"Not Confident (n=10)",correct:20.0,incorrect:80.0},
    ],
    occupation:[
      {group:mob?"Professionals":"Working Professionals",high:33.3,moderate:30.0,slight:26.7,not:10.0},
      {group:mob?"Business":"Business Owners",high:28.6,moderate:28.5,slight:28.6,not:14.3},
      {group:"Students",high:17.2,moderate:25.0,slight:35.9,not:21.9},
      {group:"Other",high:20.0,moderate:20.0,slight:40.0,not:20.0},
    ],
    age:[
      {group:"18–25",otp:47.9,phishing:23.9,card:18.3,identity:9.9},
      {group:"26–35",otp:48.1,phishing:25.9,card:18.5,identity:7.4},
      {group:"36–45",otp:50.0,phishing:22.2,card:16.7,identity:11.1},
      {group:"46+",otp:50.0,phishing:25.0,card:25.0,identity:0.0},
    ],
    income:[
      {group:mob?"Student":"Student (No income)",predictive:44.8,descriptive:22.4,prescriptive:19.0,notsure:13.8},
      {group:mob?"< ₹20K":"Below ₹20,000",predictive:38.5,descriptive:23.1,prescriptive:23.1,notsure:15.4},
      {group:mob?"₹20–50K":"₹20,000–50,000",predictive:52.0,descriptive:16.0,prescriptive:24.0,notsure:8.0},
      {group:"₹50K+",predictive:60.0,descriptive:20.0,prescriptive:13.3,notsure:6.7},
    ],
    gender:[
      {group:mob?"Male":"Male (n=50)",otp:50.0,phishing:24.0,card:18.0,identity:8.0},
      {group:mob?"Female":"Female (n=60)",otp:45.0,phishing:25.0,card:18.3,identity:11.7},
    ],
  };
  const ins={
    confidence:{t:"amber",m:"Even the most confident group (55.3%) barely surpasses overall average (44.1%). Overconfidence bias confirmed."},
    occupation:{t:"coral",m:"Working professionals show highest combined vulnerability (63.3% high/moderate) — highest financial risk exposure."},
    age:{t:"coral",m:"OTP fraud is #1 threat consistently across ALL age cohorts (47.9–50.0%). Supports a universal OTP education strategy."},
    income:{t:"cyan",m:"Higher income → stronger predictive analytics preference (60% at ₹50K+ vs 44.8% students)."},
    gender:{t:"amber",m:"Gender differences are marginal. OTP fraud dominates for both — targeted messaging needs only nuanced tweaks."},
  };
  const d=datasets[active]; const i=ins[active];
  const chartH=mob?220:280;
  const ywConf=mob?100:185;
  const ywOcc=mob?90:165;
  return(
    <div>
      <div className="st">Cross-Tabulation Analysis</div>
      <div className="ts">{tabs.map(t=><button key={t.id} className={`tb ${active===t.id?"active":""}`} onClick={()=>setActive(t.id)}>{t.label}</button>)}</div>
      <CC title={`${tabs.find(t=>t.id===active)?.label} — conditional distribution`}>
        {active==="confidence"&&(
          <ResponsiveContainer width="100%" height={chartH}>
            <BarChart data={d} layout="vertical" margin={{left:mob?4:20,right:mob?20:40,top:4,bottom:4}}>
              <CartesianGrid {...CP.cg} horizontal={false}/>
              <XAxis type="number" domain={[0,100]} tickFormatter={v=>`${v}%`} {...CP.xa}/>
              <YAxis type="category" dataKey="group" width={ywConf} {...CP.ya} tick={{fill:T.txtDim,fontSize:mob?8:10,fontFamily:"'DM Mono',monospace"}}/>
              <Tooltip content={<DT/>}/>
              <Bar dataKey="correct" name="Correct %" fill={T.teal} radius={[0,3,3,0]}/>
              <Bar dataKey="incorrect" name="Incorrect %" fill={T.coral} radius={[0,3,3,0]}/>
            </BarChart>
          </ResponsiveContainer>
        )}
        {active==="occupation"&&(
          <ResponsiveContainer width="100%" height={chartH}>
            <BarChart data={d} layout="vertical" margin={{left:mob?4:20,right:20}}>
              <CartesianGrid {...CP.cg} horizontal={false}/>
              <XAxis type="number" tickFormatter={v=>`${v}%`} {...CP.xa}/>
              <YAxis type="category" dataKey="group" width={ywOcc} {...CP.ya} tick={{fill:T.txtDim,fontSize:mob?8:10,fontFamily:"'DM Mono',monospace"}}/>
              <Tooltip content={<DT/>}/>
              <Legend wrapperStyle={{fontSize:9,color:T.txtDim,fontFamily:"'DM Mono',monospace"}}/>
              <Bar dataKey="high" name="Highly vulnerable" stackId="a" fill={T.coral}/>
              <Bar dataKey="moderate" name="Moderately vulnerable" stackId="a" fill={T.amber}/>
              <Bar dataKey="slight" name="Slightly vulnerable" stackId="a" fill={T.purple}/>
              <Bar dataKey="not" name="Not vulnerable" stackId="a" fill={T.teal} radius={[0,3,3,0]}/>
            </BarChart>
          </ResponsiveContainer>
        )}
        {(active==="age"||active==="gender")&&(
          <ResponsiveContainer width="100%" height={chartH}>
            <BarChart data={d} margin={{left:-5,right:10}}>
              <CartesianGrid {...CP.cg}/><XAxis dataKey="group" {...CP.xa}/><YAxis tickFormatter={v=>`${v}%`} {...CP.ya}/>
              <Tooltip content={<DT/>}/>
              <Legend wrapperStyle={{fontSize:9,color:T.txtDim,fontFamily:"'DM Mono',monospace"}}/>
              <Bar dataKey="otp" name="OTP Fraud" stackId="a" fill={T.coral}/>
              <Bar dataKey="phishing" name="Phishing" stackId="a" fill={T.amber}/>
              <Bar dataKey="card" name="Card Fraud" stackId="a" fill={T.purple}/>
              <Bar dataKey="identity" name="Identity Theft" stackId="a" fill={T.cyan} radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        )}
        {active==="income"&&(
          <ResponsiveContainer width="100%" height={chartH}>
            <BarChart data={d} margin={{left:-5,right:10}}>
              <CartesianGrid {...CP.cg}/><XAxis dataKey="group" {...CP.xa}/><YAxis tickFormatter={v=>`${v}%`} {...CP.ya}/>
              <Tooltip content={<DT/>}/>
              <Legend wrapperStyle={{fontSize:9,color:T.txtDim,fontFamily:"'DM Mono',monospace"}}/>
              <Bar dataKey="predictive" name="Predictive" fill={T.cyan}/>
              <Bar dataKey="descriptive" name="Descriptive" fill={T.teal}/>
              <Bar dataKey="prescriptive" name="Prescriptive" fill={T.purple}/>
              <Bar dataKey="notsure" name="Not Sure" fill={T.txtFaint} radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        )}
        <div className={`ins ${i.t}`}>{i.m}</div>
      </CC>
    </div>
  );
}

/* ══════ 05 · CORRELATION ══════ */
function Sec5({mob,tab}){
  const sh=["Risk","Vuln","Phish","Switch","Digital","Age","Alerts","Pred"];
  const full=["Risk Perception","Vulnerability","Phishing Awareness","Switch Likelihood","Digital Usage","Age","Bank Alerts","Pred. Preference"];
  const mx=[
    [1.00,0.52,0.18,0.32,0.29,-0.12,0.15,0.22],
    [0.52,1.00,-0.28,0.38,0.21,-0.18,0.12,0.18],
    [0.18,-0.28,1.00,0.15,0.25,-0.20,0.19,0.41],
    [0.32,0.38,0.15,1.00,0.17,-0.14,0.08,0.16],
    [0.29,0.21,0.25,0.17,1.00,-0.31,0.14,0.22],
    [-0.12,-0.18,-0.20,-0.14,-0.31,1.00,-0.09,-0.11],
    [0.15,0.12,0.19,0.08,0.14,-0.09,1.00,0.20],
    [0.22,0.18,0.41,0.16,0.22,-0.11,0.20,1.00],
  ];
  const gs=v=>{
    if(v===1)return{bg:T.cyan,c:T.bg0};
    if(v>=0.4)return{bg:"#0f4d3a",c:T.teal};
    if(v>=0.25)return{bg:"#0a2e28",c:"#4db891"};
    if(v>=0.1)return{bg:T.bg3,c:T.txtDim};
    if(v>=-0.1)return{bg:T.bg2,c:T.txtFaint};
    if(v>=-0.25)return{bg:"#2e140a",c:"#b86a40"};
    return{bg:"#3a0f0f",c:T.coral};
  };
  const hi=[
    {p:"Risk ↔ Vulnerability",r:0.52,n:"Consistent internal perception"},
    {p:"Phishing ↔ Pred. Preference",r:0.41,n:"Knowledge drives demand for AI detection"},
    {p:"Vulnerability ↔ Switch",r:0.38,n:"Direct trust-churn relationship"},
    {p:"Risk ↔ Switch",r:0.32,n:"High risk → bank-switching intent"},
    {p:"Age ↔ Digital Usage",r:-0.31,n:"Older users are less digitally active"},
    {p:"Digital ↔ Risk Perception",r:0.29,n:"Exposure builds awareness"},
    {p:"Phishing ↔ Vulnerability",r:-0.28,n:"Knowledge offers protective confidence"},
    {p:"Alerts ↔ Pred. Preference",r:0.20,n:"Alerts nudge analytics sophistication"},
  ];
  const cols=mob?"1fr":tab?"1fr":"1fr 1fr";
  return(
    <div>
      <div className="st">Pearson Correlation Matrix</div>
      <div className="g-2" style={{gridTemplateColumns:cols}}>
        <CC title="Correlation heatmap — amber border = |r| ≥ 0.35">
          <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
            <table style={{borderCollapse:"separate",borderSpacing:2,minWidth:mob?280:320}}>
              <thead>
                <tr>
                  <th style={{width:mob?52:72}}></th>
                  {sh.map((s,i)=>(
                    <th key={i} style={{padding:"2px 0",width:mob?28:38}}>
                      <div style={{fontSize:mob?7:8,color:T.txtDim,writingMode:"vertical-rl",transform:"rotate(180deg)",height:mob?50:64,textAlign:"left",paddingTop:4,fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap"}}>{s}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mx.map((row,i)=>(
                  <tr key={i}>
                    <td style={{fontSize:mob?7:8,color:T.txtDim,paddingRight:4,textAlign:"right",fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap"}}>{sh[i]}</td>
                    {row.map((v,j)=>{
                      const s=gs(v);
                      const isH=Math.abs(v)>=0.35&&v!==1;
                      return(
                        <td key={j} style={{padding:1}}>
                          <div className="xc" style={{background:s.bg,color:s.c,outline:isH?`1.5px solid ${T.amber}`:undefined,outlineOffset:isH?"-1px":undefined}}>{v.toFixed(2)}</div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:12}}>
            {[{bg:"#0f4d3a",c:T.teal,l:"Strong ≥0.4"},{bg:"#0a2e28",c:"#4db891",l:"Moderate"},{bg:T.bg3,c:T.txtDim,l:"Weak"},{bg:"#3a0f0f",c:T.coral,l:"Negative"}].map((x,k)=>(
              <div key={k} className="lg"><span style={{width:9,height:9,borderRadius:2,background:x.bg,flexShrink:0,display:"inline-block"}}/>{x.l}</div>
            ))}
          </div>
        </CC>
        <CC title="Notable variable pairs — ranked by strength">
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {hi.map((h,i)=>{
              const c=h.r>=0.4?T.teal:h.r>=0.3?T.cyan:h.r>=0?T.purple:T.coral;
              return(
                <div key={i} style={{display:"flex",gap:10,padding:"9px 12px",background:T.bg2,borderRadius:6,borderLeft:`2px solid ${c}`}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:mob?13:15,fontWeight:700,color:c,minWidth:36,flexShrink:0}}>{h.r>0?"+":""}{h.r.toFixed(2)}</div>
                  <div>
                    <div style={{fontSize:mob?10:11,fontWeight:500,color:T.txt,marginBottom:2}}>{h.p}</div>
                    <div style={{fontSize:mob?9:10,color:T.txtDim,lineHeight:1.5}}>{h.n}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CC>
      </div>
    </div>
  );
}

/* ══════ 06 · OCCUPATION RADAR ══════ */
function Sec6({mob,tab}){
  const rd=[
    {metric:"Digital Literacy",students:88,professionals:82,business:70,other:75},
    {metric:"Phishing Awareness",students:40,professionals:50,business:43,other:42},
    {metric:"Risk Perception",students:76,professionals:82,business:86,other:78},
    {metric:"Alert Receipt",students:22,professionals:29,business:25,other:23},
    {metric:"Vulnerability",students:42,professionals:63,business:57,other:50},
    {metric:"Shared Resp.",students:40,professionals:47,business:43,other:44},
  ];
  const cr=[
    {group:mob?"Prof.":"Professionals",phishIgn:50,highVuln:63,digital:82,noAlerts:71},
    {group:mob?"Business":"Business Owners",phishIgn:57,highVuln:57,digital:70,noAlerts:75},
    {group:"Students",phishIgn:60,highVuln:42,digital:88,noAlerts:78},
    {group:"Other",phishIgn:58,highVuln:50,digital:75,noAlerts:77},
  ];
  const gc=[T.cyan,T.teal,T.amber,T.txtDim];
  const gs=[{k:"students",l:"Students"},{k:"professionals",l:"Professionals"},{k:"business",l:"Business"},{k:"other",l:"Other"}];
  const profiles=[
    {name:"Students",color:T.cyan,pts:["Highest digital literacy (88%) — most exposed","Lowest alert receipt (22%) — least engaged","Below-avg phishing awareness (40%)"]},
    {name:"Professionals",color:T.teal,pts:["Highest phishing awareness (50%)","Highest vulnerability (63.3%)","Only 29% receive alerts — highest risk group"]},
    {name:"Business Owners",color:T.amber,pts:["Highest risk perception (86%)","Lowest digital literacy (70%)","Small sample n=7 — directional only"]},
  ];
  const cols=mob?"1fr":tab?"1fr":"1fr 1fr";
  const profCols=mob?"1fr":tab?"1fr 1fr":"1fr 1fr 1fr";
  const radarH=mob?240:320;
  return(
    <div>
      <div className="st">Occupation Group Profiling</div>
      <div className="g-2" style={{gridTemplateColumns:cols,marginBottom:12}}>
        <CC title="Radar chart — 4 groups × 6 key dimensions">
          <ResponsiveContainer width="100%" height={radarH}>
            <RadarChart data={rd} margin={{top:10,right:mob?20:30,bottom:10,left:mob?20:30}}>
              <PolarGrid stroke={T.border}/>
              <PolarAngleAxis dataKey="metric" tick={{fill:T.txtDim,fontSize:mob?8:9,fontFamily:"'DM Mono',monospace"}}/>
              <PolarRadiusAxis angle={30} domain={[0,100]} tick={{fill:T.txtFaint,fontSize:7}} tickCount={4}/>
              {gs.map((g,i)=><Radar key={g.k} name={g.l} dataKey={g.k} stroke={gc[i]} fill={gc[i]} fillOpacity={0.1} strokeWidth={1.5}/>)}
              <Legend wrapperStyle={{fontSize:9,color:T.txtDim,fontFamily:"'DM Mono',monospace"}}/>
              <Tooltip content={<DT/>}/>
            </RadarChart>
          </ResponsiveContainer>
          <div className="ins cyan">Alert receipt is the weakest dimension across all groups (22–29%) — systemic bank communication failure.</div>
        </CC>
        <CC title="Composite fraud risk score by occupation">
          <ResponsiveContainer width="100%" height={mob?200:250}>
            <BarChart data={cr} margin={{left:-5,right:10}}>
              <CartesianGrid {...CP.cg}/><XAxis dataKey="group" {...CP.xa}/><YAxis tickFormatter={v=>`${v}%`} {...CP.ya}/>
              <Tooltip content={<DT/>}/>
              <Legend wrapperStyle={{fontSize:9,color:T.txtDim,fontFamily:"'DM Mono',monospace"}}/>
              <Bar dataKey="phishIgn" name="Phishing ignorance %" fill={T.coral}/>
              <Bar dataKey="highVuln" name="High/mod vulnerability %" fill={T.amber}/>
              <Bar dataKey="digital" name="Digital exposure %" fill={T.cyan}/>
              <Bar dataKey="noAlerts" name="Not receiving alerts %" fill={T.purple} radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
          <div className="ins coral">Professionals: high exposure + vulnerability + low alerts = acute risk profile.</div>
        </CC>
      </div>
      <div className="g-3" style={{gridTemplateColumns:profCols}}>
        {profiles.map(p=>(
          <div key={p.name} className="prof-card" style={{borderTop:`2px solid ${p.color}`}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:mob?13:14,fontWeight:700,color:p.color,marginBottom:10}}>{p.name}</div>
            {p.pts.map((pt,i)=>(
              <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:7}}>
                <span style={{color:p.color,fontSize:10,marginTop:2,flexShrink:0}}>▸</span>
                <span style={{fontSize:mob?9:10,color:T.txtDim,lineHeight:1.6}}>{pt}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════ 07 · KPI ══════ */
function Sec7({mob}){
  const kpis=[
    {m:"Receives Regular Bank Alerts",s:23.4,t:60,st:"CRITICAL",g:-36.6},
    {m:"Correctly Identified Phishing",s:44.1,t:70,st:"CRITICAL",g:-25.9},
    {m:"Recognized ALL Fraud Signs",s:45.9,t:70,st:"CRITICAL",g:-24.1},
    {m:"Supports Shared Responsibility",s:46.8,t:50,st:"NEAR MET",g:-3.2},
    {m:"Prefers Predictive Analytics",s:44.1,t:40,st:"MET",g:4.1},
    {m:"Believes Fraud Is Increasing",s:79.3,t:70,st:"MET",g:9.3},
    {m:"Prefers Real-Time Monitoring",s:73.9,t:60,st:"MET",g:13.9},
    {m:"Uses Digital Banking",s:100.0,t:90,st:"EXCEEDS",g:10.0},
    {m:"Feels Personally Vulnerable",s:94.6,t:60,st:"EXCEEDS*",g:34.6},
  ];
  const ss={"CRITICAL":{bg:"rgba(255,34,68,.15)",c:"#ff2244",bar:T.coral},"NEAR MET":{bg:T.amberGlow,c:T.amber,bar:T.amber},"MET":{bg:T.tealGlow,c:T.teal,bar:T.teal},"EXCEEDS":{bg:T.cyanGlow,c:T.cyan,bar:T.cyan},"EXCEEDS*":{bg:"rgba(0,212,255,.08)",c:T.cyanDim,bar:T.cyanDim}};
  const sumCols=mob?"1fr 1fr":"1fr 1fr 1fr";
  return(
    <div>
      <div className="st">KPI Benchmark Analysis</div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {kpis.map((k,i)=>{
          const s=ss[k.st];
          return(
            <div key={i} className="kr">
              <div style={{display:"grid",gridTemplateColumns:"1fr auto",alignItems:"center",gap:mob?10:16}}>
                <div>
                  <div style={{fontSize:mob?11:12,fontWeight:500,color:T.txt,marginBottom:7,lineHeight:1.3}}>{k.m}</div>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <div style={{flex:1,minWidth:80,background:T.bg0,borderRadius:4,height:9,overflow:"hidden",border:`1px solid ${T.border}`,position:"relative"}}>
                      <div style={{position:"absolute",left:`${Math.min(k.t,100)}%`,top:0,bottom:0,width:1.5,background:T.txtFaint,zIndex:2}}/>
                      <div style={{width:`${Math.min(k.s,100)}%`,height:"100%",background:s.bar,borderRadius:4,boxShadow:`0 0 10px ${s.bar}55`,position:"relative",zIndex:1}}/>
                    </div>
                    <span style={{fontSize:mob?9:10,color:T.txtDim,whiteSpace:"nowrap",fontFamily:"'DM Mono',monospace"}}>
                      <strong style={{color:T.txt}}>{k.s}%</strong> / {k.t}%
                    </span>
                  </div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{display:"inline-block",fontSize:mob?8:9,fontWeight:600,padding:"3px 8px",borderRadius:4,background:s.bg,color:s.c,letterSpacing:".05em",marginBottom:3}}>{k.st}</div>
                  <div style={{fontSize:mob?12:14,fontWeight:700,color:k.g>=0?T.teal:T.coral,fontFamily:"'Syne',sans-serif"}}>{k.g>0?"+":""}{k.g.toFixed(1)}pp</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{marginTop:12,display:"grid",gridTemplateColumns:sumCols,gap:8}}>
        {[{l:"CRITICAL gaps",n:3,c:"#ff2244",note:"Immediate bank/regulator action needed"},{l:"MET benchmarks",n:3,c:T.teal,note:"Customer demand aligned with targets"},{l:"EXCEEDS targets",n:2,c:T.cyan,note:"High awareness — action gap remains"}].map(s=>(
          <div key={s.l} style={{background:T.bg2,border:`1px solid ${T.border}`,borderRadius:8,padding:"12px 14px"}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:mob?20:24,fontWeight:800,color:s.c}}>{s.n}</div>
            <div style={{fontSize:mob?10:10,color:T.txt,fontWeight:500,marginBottom:4}}>{s.l}</div>
            <div style={{fontSize:mob?9:10,color:T.txtFaint,lineHeight:1.5}}>{s.note}</div>
          </div>
        ))}
      </div>
      <p style={{fontSize:mob?8:9,color:T.txtFaint,marginTop:8,fontFamily:"'DM Mono',monospace"}}>* EXCEEDS vulnerability is not positive — over-awareness without action creates false security complacency.</p>
    </div>
  );
}

/* ══════ 08 · RISK & BEHAVIOR ══════ */
function Sec8({mob,tab}){
  const ap=[{name:"Predictive (AI/ML)",value:44.1,color:T.cyan},{name:"Prescriptive",value:21.6,color:T.purple},{name:"Descriptive",value:20.7,color:T.teal},{name:"Not sure",value:13.5,color:T.txtFaint}];
  const mf=[{name:"Real-time",value:51.4},{name:"Multi/day",value:22.5},{name:"Weekly",value:18.0},{name:"Monthly",value:8.1}];
  const sw=[{name:"Very unlikely",value:22.5},{name:"Unlikely",value:24.3},{name:"Neutral",value:23.4},{name:"Likely",value:29.7}];
  const rc=[{name:"Trust unknown sources",value:32.4,c:T.coral},{name:"Lack of awareness",value:30.6,c:T.amber},{name:"Carelessness",value:22.5,c:T.purple},{name:"Weak bank systems",value:14.4,c:T.txtDim}];
  const rs=[{name:"Both equally",value:46.8,c:T.teal},{name:"Bank",value:32.4,c:T.cyan},{name:"Customer",value:12.6,c:T.amber},{name:"Government",value:8.1,c:T.txtFaint}];
  const ec=[{e:"<1 yr",v:39.1},{e:"1–3 yrs",v:41.2},{e:"3–5 yrs",v:48.4},{e:">5 yrs",v:54.5}];
  const fr=[{name:"Stronger security",value:38.7},{name:"Faster response",value:28.8},{name:"Stricter regulations",value:18.0},{name:"Better awareness",value:14.4}];
  const cols3=mob?"1fr":tab?"1fr 1fr":"1fr 1fr 1fr";
  const pieH=mob?160:190;
  const barH=mob?160:190;
  return(
    <div>
      <div className="st">Risk Perception, Behavior & Prevention</div>
      <div className="g-3" style={{gridTemplateColumns:cols3,marginBottom:12}}>
        <CC title="Analytics preference (Q20)">
          <ResponsiveContainer width="100%" height={pieH}>
            <PieChart>
              <Pie data={ap} cx="50%" cy="50%" innerRadius={mob?38:48} outerRadius={mob?58:72} dataKey="value" paddingAngle={3}>
                {ap.map((d,i)=><Cell key={i} fill={d.color}/>)}
              </Pie>
              <Tooltip content={<DT/>} formatter={v=>[`${v}%`]}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",flexDirection:"column",gap:5,marginTop:4}}>
            {ap.map(d=><div key={d.name} style={{display:"flex",alignItems:"center",gap:6}}><span className="ld" style={{background:d.color}}/><span style={{flex:1,fontSize:mob?9:10,color:T.txtDim}}>{d.name}</span><span style={{fontSize:mob?11:12,fontWeight:700,color:d.color,fontFamily:"'Syne',sans-serif"}}>{d.value}%</span></div>)}
          </div>
        </CC>
        <CC title="Monitoring frequency (Q21)">
          <ResponsiveContainer width="100%" height={barH}>
            <BarChart data={mf} margin={{left:-18,right:4}}>
              <CartesianGrid {...CP.cg}/><XAxis dataKey="name" {...CP.xa}/><YAxis tickFormatter={v=>`${v}%`} {...CP.ya}/>
              <Tooltip content={<DT/>}/>
              <Bar dataKey="value" name="%" radius={[3,3,0,0]}>{mf.map((_,i)=><Cell key={i} fill={[T.cyan,T.teal,T.amber,T.txtFaint][i]}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="ins cyan">73.9% want real-time or multiple-daily monitoring.</div>
        </CC>
        <CC title="Experience vs. phishing knowledge">
          <ResponsiveContainer width="100%" height={barH}>
            <LineChart data={ec} margin={{left:-14,right:10}}>
              <CartesianGrid {...CP.cg}/><XAxis dataKey="e" {...CP.xa}/><YAxis domain={[30,60]} tickFormatter={v=>`${v}%`} {...CP.ya}/>
              <Tooltip content={<DT/>}/>
              <Line type="monotone" dataKey="v" name="Correct phishing %" stroke={T.cyan} strokeWidth={2.5} dot={{r:4,fill:T.cyan,stroke:T.bg0,strokeWidth:2}}/>
            </LineChart>
          </ResponsiveContainer>
          <div className="ins teal">r≈0.35: even &gt;5yr users (54.5%) miss 70% benchmark.</div>
        </CC>
      </div>
      <div className="g-3" style={{gridTemplateColumns:cols3,marginBottom:12}}>
        <CC title="Root causes of fraud victimization (Q26)">
          <div style={{display:"flex",flexDirection:"column",gap:10,paddingTop:4}}>
            {rc.map(d=>(
              <div key={d.name}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:mob?9:10,color:T.txtDim}}>{d.name}</span>
                  <span style={{fontSize:mob?11:12,fontWeight:700,color:d.c,fontFamily:"'Syne',sans-serif",marginLeft:8,flexShrink:0}}>{d.value}%</span>
                </div>
                <div style={{background:T.bg2,borderRadius:3,height:8,overflow:"hidden"}}>
                  <div style={{width:`${d.value}%`,height:"100%",background:d.c,borderRadius:3,boxShadow:`0 0 8px ${d.c}44`}}/>
                </div>
              </div>
            ))}
          </div>
          <div className="ins coral" style={{marginTop:12}}>63% of fraud is behavioral — trust + awareness failures dominate over technical gaps.</div>
        </CC>
        <CC title="Fraud responsibility attribution (Q25)">
          <ResponsiveContainer width="100%" height={mob?160:180}>
            <PieChart>
              <Pie data={rs} cx="50%" cy="50%" innerRadius={mob?38:48} outerRadius={mob?58:72} dataKey="value" paddingAngle={3}>
                {rs.map((d,i)=><Cell key={i} fill={d.c}/>)}
              </Pie>
              <Tooltip content={<DT/>} formatter={v=>[`${v}%`]}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:6}}>
            {rs.map(d=><div key={d.name} style={{display:"flex",alignItems:"center",gap:6}}><span className="ld" style={{background:d.c}}/><span style={{flex:1,fontSize:mob?9:10,color:T.txtDim}}>{d.name}</span><span style={{fontSize:mob?11:11,fontWeight:700,color:d.c,fontFamily:"'Syne',sans-serif"}}>{d.value}%</span></div>)}
          </div>
        </CC>
        <CC title="Top fraud reduction strategies (Q28)">
          <ResponsiveContainer width="100%" height={mob?160:180}>
            <BarChart data={fr} layout="vertical" margin={{left:mob?4:10,right:mob?30:40}}>
              <CartesianGrid {...CP.cg} horizontal={false}/>
              <XAxis type="number" tickFormatter={v=>`${v}%`} {...CP.xa}/>
              <YAxis type="category" dataKey="name" width={mob?90:140} {...CP.ya} tick={{fill:T.txtDim,fontSize:mob?8:9,fontFamily:"'DM Mono',monospace"}}/>
              <Tooltip content={<DT/>}/>
              <Bar dataKey="value" name="%" radius={[0,3,3,0]}>{fr.map((_,i)=><Cell key={i} fill={[T.cyan,T.amber,T.purple,T.teal][i]}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="ins cyan">Stronger security (38.7%) is #1 demanded solution.</div>
        </CC>
      </div>
      <CC title="Bank switching likelihood if fraud detection is weak (Q24)">
        <ResponsiveContainer width="100%" height={mob?110:130}>
          <BarChart data={sw} layout="vertical" margin={{left:mob?8:20,right:mob?30:60}}>
            <CartesianGrid {...CP.cg} horizontal={false}/>
            <XAxis type="number" tickFormatter={v=>`${v}%`} {...CP.xa} domain={[0,35]}/>
            <YAxis type="category" dataKey="name" width={mob?80:100} {...CP.ya} tick={{fill:T.txtDim,fontSize:mob?9:10,fontFamily:"'DM Mono',monospace"}}/>
            <Tooltip content={<DT/>}/>
            <Bar dataKey="value" name="%" radius={[0,3,3,0]}>{sw.map((_,i)=><Cell key={i} fill={[T.teal,T.cyanDim,T.amber,T.coral][i]}/>)}</Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="ins amber">29.7% likely to switch banks over weak fraud detection — direct link between detection quality and customer retention.</div>
      </CC>
    </div>
  );
}
