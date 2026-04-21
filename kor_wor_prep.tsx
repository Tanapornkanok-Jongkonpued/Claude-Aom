import { useState, useEffect, useRef, useCallback } from "react";

// Type declarations
interface User {
  username: string;
  fname: string;
  lname: string;
  dob: string;
  email: string;
  phone: string;
  pw: string;
  photo: string | null;
}

interface UserData {
  history: any[];
  streak: number;
  lastDate: string;
  badges: string[];
  notes: Record<string, any>;
  chatHistory: any[];
  photo: string | null;
  geminiKey: string;
}

// ─── i18n ─────────────────────────────────────────────────────────────────────
const T = {
  th: {
    appName:"ENGI-Mock Pro",tagline:"แพลตฟอร์มฝึกสอบใบประกอบวิชาชีพวิศวกรรม",
    login:"เข้าสู่ระบบ",register:"สมัครสมาชิก",logout:"ออกจากระบบ",
    username:"ชื่อผู้ใช้",password:"รหัสผ่าน",confirmPw:"ยืนยันรหัสผ่าน",
    fname:"ชื่อ",lname:"นามสกุล",dob:"วันเดือนปีเกิด",email:"อีเมล",phone:"เบอร์โทรศัพท์",
    forgotPw:"ลืมรหัสผ่าน?",resetPw:"รีเซ็ตรหัสผ่าน",oldPw:"รหัสผ่านเดิม",
    next:"ถัดไป →",back:"← ย้อนกลับ",save:"บันทึก",cancel:"ยกเลิก",edit:"แก้ไข",
    dashboard:"หน้าหลัก",bank:"ทำข้อสอบ",analytics:"สถิติ",leaderboard:"อันดับ",profile:"โปรไฟล์",aiChat:"AI Chat",
    startExam:"เริ่มทำข้อสอบ",submitExam:"ส่งคำตอบ ✔",retake:"ทำใหม่ 🔄",
    practice:"Practice",mock:"Mock Test",
    branch:"สาขา",category:"หมวดวิชา",numQ:"จำนวนข้อ",timeLimit:"เวลา (นาที)",
    generating:"AI กำลังสร้างข้อสอบ...",genSub:"ใช้เวลาประมาณ 30-60 วินาที",
    loadingAI:"AI กำลังคิด...",
    correct:"ถูก",wrong:"ผิด",unanswered:"ไม่ตอบ",score:"คะแนน",
    explanation:"ดูเฉลย",askAI:"ถาม AI",send:"ส่ง",
    readiness:"% พร้อมสอบ (เทียบผู้ใช้ทั้งหมด)",streak:"วันต่อเนื่อง",avgScore:"คะแนนเฉลี่ย",highest:"สูงสุด",
    recentHistory:"ประวัติล่าสุด",badges:"รางวัล",
    editProfile:"แก้ไขข้อมูลส่วนตัว",changePhoto:"เปลี่ยนรูป",changePw:"เปลี่ยนรหัสผ่าน",
    noHistory:"ยังไม่มีประวัติการสอบ",
    examReady:"พร้อมสอบกว่าส่วนใหญ่ 🏆",examGood:"อยู่ในเกณฑ์ดี ⚡",examMore:"ต้องฝึกเพิ่ม 💪",
    bookmark:"บันทึก",note:"โน้ต",formula:"สูตร",
    catGeneral:"วิชาพื้นฐานวิศวกรรมทั่วไป",catSpecific:"วิชาเฉพาะสาขา",
    aiChatPlaceholder:"ถามเกี่ยวกับวิศวกรรม กฎหมาย จรรยาบรรณ...",
    timeUp:"หมดเวลา!",qNo:"ข้อที่",of:"จาก",min:"นาที",timeLeft:"เวลาเหลือ",
    errFillAll:"กรุณากรอกข้อมูลให้ครบ",errEmail:"อีเมลไม่ถูกต้อง",errPwMatch:"รหัสผ่านไม่ตรงกัน",
    errPwLen:"รหัสผ่านต้องมีอย่างน้อย 6 ตัว",errUser:"ไม่พบชื่อผู้ใช้",errPw:"รหัสผ่านไม่ถูกต้อง",
    errOldPw:"รหัสผ่านเดิมไม่ถูกต้อง",resetSent:"ส่งลิงก์รีเซ็ตไปที่อีเมลแล้ว (ตัวอย่าง)",
    darkMode:"โหมดมืด",language:"ภาษา",
    personalInfo:"ข้อมูลส่วนตัว",accountInfo:"บัญชีผู้ใช้",
    geminiKey:"Gemma API Key (OpenRouter)",geminiKeyHint:"รับ Key ฟรีได้ที่ openrouter.ai (ใช้ model: google/gemma-4-31b-it)",
    geminiKeyMissing:"กรุณาใส่ Gemma API Key จาก OpenRouter ในหน้าโปรไฟล์ก่อน",
    showResults:"ดูผลและเฉลย",
    wrongAnswers:"ข้อที่ทำผิด",allCorrect:"ถูกทุกข้อ! 🎉",
    publicBoard:"อันดับสาธารณะ (ผู้ใช้ทั้งหมด)",yourRank:"อันดับของคุณ",
    finishFirst:"ทำข้อสอบให้ครบทุกข้อก่อนส่ง",
    note_placeholder:"จดบันทึกส่วนตัว...",
  },
  en: {
    appName:"ENGI-Mock Pro",tagline:"Engineering License Exam Practice Platform",
    login:"Login",register:"Register",logout:"Logout",
    username:"Username",password:"Password",confirmPw:"Confirm Password",
    fname:"First Name",lname:"Last Name",dob:"Date of Birth",email:"Email",phone:"Phone",
    forgotPw:"Forgot Password?",resetPw:"Reset Password",oldPw:"Current Password",
    next:"Next →",back:"← Back",save:"Save",cancel:"Cancel",edit:"Edit",
    dashboard:"Home",bank:"Take Exam",analytics:"Analytics",leaderboard:"Leaderboard",profile:"Profile",aiChat:"AI Chat",
    startExam:"Start Exam",submitExam:"Submit ✔",retake:"Retake 🔄",
    practice:"Practice",mock:"Mock Test",
    branch:"Branch",category:"Category",numQ:"Questions",timeLimit:"Time (min)",
    generating:"AI is generating questions...",genSub:"This takes about 30-60 seconds",
    loadingAI:"AI is thinking...",
    correct:"Correct",wrong:"Wrong",unanswered:"Unanswered",score:"Score",
    explanation:"View Answer",askAI:"Ask AI",send:"Send",
    readiness:"% Readiness (vs all users)",streak:"Day Streak",avgScore:"Avg Score",highest:"Highest",
    recentHistory:"Recent History",badges:"Badges",
    editProfile:"Edit Profile",changePhoto:"Change Photo",changePw:"Change Password",
    noHistory:"No exam history yet",
    examReady:"Better than most users 🏆",examGood:"Looking good ⚡",examMore:"Need more practice 💪",
    bookmark:"Bookmark",note:"Note",formula:"Formulas",
    catGeneral:"General Engineering Fundamentals",catSpecific:"Branch-Specific Subjects",
    aiChatPlaceholder:"Ask about engineering, laws, ethics...",
    timeUp:"Time's up!",qNo:"Q",of:"of",min:"min",timeLeft:"Time Left",
    errFillAll:"Please fill all fields",errEmail:"Invalid email",errPwMatch:"Passwords don't match",
    errPwLen:"Password must be 6+ chars",errUser:"Username not found",errPw:"Wrong password",
    errOldPw:"Current password incorrect",resetSent:"Reset link sent (demo)",
    darkMode:"Dark Mode",language:"Language",
    personalInfo:"Personal Info",accountInfo:"Account Info",
    geminiKey:"Gemma API Key (OpenRouter)",geminiKeyHint:"Get free key at openrouter.ai (model: google/gemma-4-31b-it)",
    geminiKeyMissing:"Please add your Gemma API Key from OpenRouter in Profile first",
    showResults:"View Results & Answers",
    wrongAnswers:"Wrong Answers",allCorrect:"All Correct! 🎉",
    publicBoard:"Public Leaderboard (All Users)",yourRank:"Your Rank",
    finishFirst:"Answer all questions before submitting",
    note_placeholder:"Personal notes...",
  }
};

const BRANCHES = ["โยธา","ไฟฟ้า","เครื่องกล","อุตสาหการ","เคมี","สิ่งแวดล้อม"];
const BRANCHES_EN = ["Civil","Electrical","Mechanical","Industrial","Chemical","Environmental"];
const NUM_Q_OPTS = [10,15,20,25,30,40,50];
const TIME_OPTS  = [15,20,30,45,60,90,120];
const BADGE_DEFS = [
  {id:"first",icon:"🎯",th:"ข้อสอบแรก",en:"First Exam"},
  {id:"streak3",icon:"🔥",th:"3 วันติด",en:"3-Day Streak"},
  {id:"perfect",icon:"⭐",th:"100%",en:"Perfect Score"},
  {id:"veteran",icon:"🏅",th:"10 ครั้ง",en:"10 Exams"},
  {id:"allbranch",icon:"🗺️",th:"ครบทุกสาขา",en:"All Branches"},
];

const hashPw = s=>{let h=0;for(let c of s)h=(Math.imul(31,h)+c.charCodeAt(0))|0;return h.toString(36);};
const uk = u=>`engi_user_${u}`;
const dk = u=>`engi_data_${u}`;
const BOARD_KEY = "engi_leaderboard_v2";

const loadJSON = async (key: string)=>{try{const r=localStorage.getItem(key);return r?JSON.parse(r):null;}catch{return null;}};
const saveJSON = async(key: string, val: any)=>{try{localStorage.setItem(key,JSON.stringify(val));}catch{}};
const saveLocal = async(key: string, val: any)=>{try{localStorage.setItem(key,JSON.stringify(val));}catch{}};
const defUD = ()=>({history:[],streak:0,lastDate:"",badges:["first"],notes:{},chatHistory:[],photo:null,geminiKey:""});

// ─── Gemma API (via OpenRouter) ─────────────────────────────────────────────────
async function gemmaCall(apiKey, prompt, jsonMode=false, timeoutMs=58000) {
  const controller = new AbortController();
  const tid = setTimeout(()=>controller.abort(), timeoutMs);
  try {
    const systemPrompt = jsonMode 
      ? "You must respond with ONLY valid JSON. No markdown, no explanation, no extra text."
      : "You are a helpful assistant.";
    
    // Ensure API key has proper format
    const key = apiKey.trim();
    if (!key) throw new Error("API key is missing");
    
    const res = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      { method:"POST", signal:controller.signal,
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${key}`,
          "HTTP-Referer":"http://localhost:3001",
          "X-Title":"ENGI-Mock Pro"
        },
        body:JSON.stringify({
          model:"google/gemma-4-31b-it",
          messages:[
            {role:"system", content:systemPrompt},
            {role:"user", content:prompt}
          ],
          max_tokens:8192,
          temperature:0.7,
          ...(jsonMode?{response_format:{type:"json_object"}}:{})
        })
      }
    );
    clearTimeout(tid);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.error?.message || `HTTP ${res.status}: ${res.statusText}`);
    }
    
    const d = await res.json();
    if(d.error) throw new Error(d.error.message||"Gemma API error");
    return d.choices?.[0]?.message?.content||"";
  } catch(e){clearTimeout(tid);throw e;}
}

async function generateQuestions(apiKey, branch, category, numQ, lang) {
  const branchEn = BRANCHES_EN[BRANCHES.indexOf(branch)]||branch;
  const catLabel = category==="catGeneral"
    ? (lang==="th"?"วิชาพื้นฐานวิศวกรรมทั่วไป (คณิตศาสตร์ ฟิสิกส์ กลศาสตร์ ความแข็งแรง อุณหพลศาสตร์ กฎหมายวิศวกร จรรยาบรรณ)":"General Engineering Fundamentals (math, physics, mechanics, thermodynamics, engineering law, ethics)")
    : (lang==="th"?`วิชาเฉพาะสาขา${branch} (เนื้อหาเชิงลึกของวิศวกรรม${branch})`:`${branchEn} Engineering specialized subjects`);

  const prompt = `You are an expert exam question generator for Thailand Council of Engineers (COE) licensing exam (ใบ กว.).
Generate exactly ${numQ} multiple-choice questions for:
- Engineering Branch: ${branch} (${branchEn})
- Subject Category: ${catLabel}
- Language: Thai (all text in Thai, technical terms may include English abbreviations)
- Style: COE exam style, mix of calculation and conceptual questions
- Difficulty: 40% easy, 40% medium, 20% hard
- For calculations: include relevant formula in explanation
- Reference Thai standards: วสท., ACI, AISC, IEC, พ.ร.บ.วิศวกร 2542, กฎกระทรวง as appropriate

Return ONLY a valid JSON array, no markdown, no extra text. The response must start with [ and end with ].
Format:
[{"id":1,"q":"question text","choices":["A. option1","B. option2","C. option3","D. option4"],"ans":0,"explain":"detailed explanation","ref":"standard reference"},...]

Rules:
- ans must be 0-indexed (0=A, 1=B, 2=C, 3=D)
- Each question must have exactly 4 choices
- Generate all ${numQ} questions
- Do NOT include any text before or after the JSON array`;

  const raw = await gemmaCall(apiKey, prompt, true, 58000);
  
  // Extract JSON from response
  let clean = raw.trim();
  
  // Remove markdown code blocks if present
  clean = clean.replace(/^```(?:json)?\s*/gm, '').replace(/```\s*$/gm, '');
  
  // Find JSON array in response
  const startIdx = clean.indexOf('[');
  const endIdx = clean.lastIndexOf(']');
  
  if (startIdx === -1 || endIdx === -1 || startIdx >= endIdx) {
    console.error('Raw response:', raw);
    throw new Error('AI did not return valid JSON format. Response: ' + raw.substring(0, 200));
  }
  
  clean = clean.substring(startIdx, endIdx + 1);
  
  try {
    const arr = JSON.parse(clean);
    if(!Array.isArray(arr)||arr.length===0) {
      throw new Error(`Expected array with ${numQ} questions, got ${Array.isArray(arr) ? arr.length : 'non-array'}`);
    }
    // Validate structure
    arr.forEach((q, idx) => {
      if (!q.q || !q.choices || !Array.isArray(q.choices) || q.choices.length !== 4 || typeof q.ans !== 'number' || !q.explain) {
        throw new Error(`Question ${idx + 1} has invalid structure`);
      }
    });
    return arr.slice(0, numQ);
  } catch (e) {
    if (e instanceof SyntaxError) {
      console.error('JSON parse error. Raw:', clean.substring(0, 500));
      throw new Error('Failed to parse AI response as JSON. Please try again.');
    }
    throw e;
  }
}

// ─── Components ───────────────────────────────────────────────────────────────
const Avatar = ({photo,name,size=40})=>{
  const bg=["#4F46E5","#0891B2","#059669","#D97706","#DC2626"];
  const c=bg[(name||"U").charCodeAt(0)%bg.length];
  if(photo) return <img src={photo} style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",flexShrink:0}}/>;
  return <div style={{width:size,height:size,borderRadius:"50%",background:c,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:size*0.4,flexShrink:0}}>{(name||"U")[0].toUpperCase()}</div>;
};

const Toggle = ({value,onChange})=>(
  <div style={{width:44,height:24,borderRadius:12,background:value?"#4F46E5":"#CBD5E1",cursor:"pointer",position:"relative",transition:"background .2s"}} onClick={()=>onChange(!value)}>
    <div style={{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:value?22:2,transition:"left .2s"}}/>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function App(){
  const [lang,setLang]=useState("th");
  const t=T[lang];
  const [dark,setDark]=useState(false);
  const [screen,setScreen]=useState("splash");
  const [user,setUser]=useState(null);
  const [ud,setUd]=useState(defUD());

  // auth
  const [regStep,setRegStep]=useState(1);
  const [regData,setRegData]=useState({fname:"",lname:"",dob:"",email:"",phone:""});
  const [creds,setCreds]=useState({username:"",password:"",confirm:""});
  const [loginData,setLoginData]=useState({username:"",password:""});
  const [authErr,setAuthErr]=useState("");
  const [forgotEmail,setForgotEmail]=useState("");
  const [forgotMsg,setForgotMsg]=useState("");

  // exam
  const [examFilter,setExamFilter]=useState({branch:"โยธา",category:"catGeneral",numQ:10,timeLimit:30,mode:"practice"});
  const [examQs,setExamQs]=useState([]);
  const [examIdx,setExamIdx]=useState(0);
  const [answers,setAnswers]=useState({});
  const [flagged,setFlagged]=useState({});
  const [localNotes,setLocalNotes]=useState({});
  const [timer,setTimer]=useState(0);
  const [timeLeft,setTimeLeft]=useState(0);
  const [examDone,setExamDone]=useState(false);
  const [showFormula,setShowFormula]=useState(false);
  const [genLoading,setGenLoading]=useState(false);
  const [genErr,setGenErr]=useState("");
  const [aiQText,setAiQText]=useState("");
  const [aiReply,setAiReply]=useState("");
  const [aiLoading,setAiLoading]=useState(false);
  const [submitErr,setSubmitErr]=useState("");

  // chat
  const [chatMsgs,setChatMsgs]=useState([]);
  const [chatInput,setChatInput]=useState("");
  const [chatLoading,setChatLoading]=useState(false);
  const chatEndRef=useRef(null);

  // profile
  const [editMode,setEditMode]=useState(false);
  const [editData,setEditData]=useState({});
  const [pwData,setPwData]=useState({old:"",nw:"",confirm:""});
  const [pwErr,setPwErr]=useState("");
  const [pwOk,setPwOk]=useState("");
  const [geminiKeyInput,setGeminiKeyInput]=useState("");
  const photoRef=useRef(null);
  const timerRef=useRef(null);

  // leaderboard
  const [board,setBoard]=useState([]);

  useEffect(()=>{setTimeout(()=>setScreen("login"),1600);},[]);
  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth"});},[chatMsgs]);

  const loadBoard = useCallback(async()=>{
    const b=await loadJSON(BOARD_KEY);
    setBoard(Array.isArray(b)?b:[]);
  },[]);

  useEffect(()=>{if(screen==="leaderboard")loadBoard();},[screen,loadBoard]);

  // countdown
  useEffect(()=>{
    if(screen==="exam"&&!examDone&&examFilter.mode==="mock"&&timeLeft>0){
      timerRef.current=setInterval(()=>{
        setTimeLeft(v=>{if(v<=1){clearInterval(timerRef.current);handleSubmitExam(true);return 0;}return v-1;});
        setTimer(v=>v+1);
      },1000);
    } else clearInterval(timerRef.current);
    return()=>clearInterval(timerRef.current);
  },[screen,examDone,examFilter.mode,timeLeft]);

  const fmt=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const bg=dark?"#0F172A":"#F1F5F9";
  const card=dark?"#1E293B":"#FFFFFF";
  const text=dark?"#F1F5F9":"#1E293B";
  const sub=dark?"#94A3B8":"#64748B";
  const bdr=dark?"#334155":"#E2E8F0";
  const acc="#4F46E5";

  const css={
    app:{minHeight:"100vh",background:bg,color:text,fontFamily:"'Noto Sans Thai',sans-serif",fontSize:15},
    card:{background:card,borderRadius:16,padding:18,marginBottom:12,border:`1px solid ${bdr}`,boxShadow:"0 1px 6px #0001"},
    btn:(bg2=acc,col="#fff")=>({background:bg2,color:col,border:"none",borderRadius:10,padding:"10px 20px",fontWeight:700,cursor:"pointer",fontSize:15,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6}),
    btnOut:{background:"transparent",color:acc,border:`2px solid ${acc}`,borderRadius:10,padding:"9px 18px",fontWeight:700,cursor:"pointer",fontSize:15},
    input:{width:"100%",padding:"10px 14px",borderRadius:10,border:`1.5px solid ${bdr}`,background:dark?"#0F172A":card,color:text,fontSize:15,boxSizing:"border-box"},
    label:{fontSize:13,color:sub,marginBottom:4,display:"block"},
    h1:{fontSize:22,fontWeight:800,margin:0},
    h2:{fontSize:16,fontWeight:700,margin:0},
    wrap:{maxWidth:480,margin:"0 auto",padding:"14px 14px"},
    err:{color:"#EF4444",fontSize:13,marginBottom:10},
  };

  const getKey=()=>ud.geminiKey||geminiKeyInput;

  // readiness vs all users
  const myAvg = ud.history?.length ? Math.round(ud.history.slice(0,20).reduce((a,h)=>a+h.score,0)/Math.min(20,ud.history.length)) : 0;
  const readinessPct = ()=>{
    if(!board.length) return myAvg;
    const scores = board.map(b=>b.avg||0);
    const below = scores.filter(s=>s<myAvg).length;
    return Math.round(below/scores.length*100);
  };

  // ── Auth ──
  const handleReg=async()=>{
    setAuthErr("");
    if(regStep===1){
      if(!regData.fname||!regData.lname||!regData.dob||!regData.email||!regData.phone){setAuthErr(t.errFillAll);return;}
      if(!/\S+@\S+\.\S+/.test(regData.email)){setAuthErr(t.errEmail);return;}
      setRegStep(2);
    } else {
      if(!creds.username||!creds.password||!creds.confirm){setAuthErr(t.errFillAll);return;}
      if(creds.password!==creds.confirm){setAuthErr(t.errPwMatch);return;}
      if(creds.password.length<6){setAuthErr(t.errPwLen);return;}
      const u={...regData,username:creds.username,pw:hashPw(creds.password),photo:null};
      await saveLocal(uk(creds.username),u);
      const d=defUD();
      await saveLocal(dk(creds.username),d);
      setUser(u);setUd(d);setChatMsgs([]);
      setScreen("dashboard");
    }
  };

  const handleLogin=async()=>{
    setAuthErr("");
    const u=await loadJSON(uk(loginData.username));
    if(!u){setAuthErr(t.errUser);return;}
    if(u.pw!==hashPw(loginData.password)){setAuthErr(t.errPw);return;}
    const d=await loadJSON(dk(u.username))||defUD();
    const today=new Date().toDateString();
    if(d.lastDate!==today){
      const yest=new Date();yest.setDate(yest.getDate()-1);
      d.streak=d.lastDate===yest.toDateString()?(d.streak||0)+1:1;
      d.lastDate=today;
      await saveLocal(dk(u.username),d);
    }
    setUser(u);setUd(d);setChatMsgs(d.chatHistory||[]);setGeminiKeyInput(d.geminiKey||"");
    await loadBoard();
    setScreen("dashboard");
  };

  // ── Exam ──
  const startExam=async(filter)=>{
    const key=getKey();
    if(!key){alert(t.geminiKeyMissing);setScreen("profile");return;}
    setGenLoading(true);setGenErr("");setScreen("bank");
    try{
      const qs=await generateQuestions(key,filter.branch,filter.category,filter.numQ,lang);
      setExamQs(qs);setAnswers({});setFlagged({});setLocalNotes({});
      setExamIdx(0);setExamDone(false);setTimer(0);setSubmitErr("");
      setTimeLeft(filter.mode==="mock"?filter.timeLimit*60:0);
      setShowFormula(false);setAiReply("");setAiQText("");
      setScreen("exam");
    }catch(e){setGenErr(`เกิดข้อผิดพลาด: ${e.message}`);}
    setGenLoading(false);
  };

  const handleSubmitExam=async(forced=false)=>{
    const unanswered=examQs.filter((_,i)=>answers[i]===undefined).length;
    if(!forced&&unanswered>0){setSubmitErr(t.finishFirst+" ("+unanswered+(lang==="th"?" ข้อยังไม่ตอบ":" unanswered)"));return;}
    clearInterval(timerRef.current);
    setExamDone(true);
    const correct=examQs.filter((_,i)=>answers[i]===examQs[i].ans).length;
    const pct=Math.round(correct/examQs.length*100);
    const rec={date:new Date().toLocaleDateString(lang==="th"?"th-TH":"en-US"),mode:examFilter.mode,branch:examFilter.branch,category:examFilter.category,score:pct,total:examQs.length,correct,time:timer};
    const newUd={...ud,history:[rec,...(ud.history||[])].slice(0,100)};
    // badges
    if(!newUd.badges.includes("first"))newUd.badges=[...newUd.badges,"first"];
    if(pct===100&&!newUd.badges.includes("perfect"))newUd.badges=[...newUd.badges,"perfect"];
    if((newUd.history||[]).length>=10&&!newUd.badges.includes("veteran"))newUd.badges=[...newUd.badges,"veteran"];
    const branches=[...new Set((newUd.history||[]).map(h=>h.branch))];
    if(branches.length>=6&&!newUd.badges.includes("allbranch"))newUd.badges=[...newUd.badges,"allbranch"];
    setUd(newUd);
    if(user){
      await saveLocal(dk(user.username),newUd);
      // update public leaderboard
      try{
        const b=await loadJSON(BOARD_KEY)||[];
        const newAvg=Math.round((newUd.history||[]).slice(0,20).reduce((a,h)=>a+h.score,0)/Math.min(20,(newUd.history||[]).length));
        const idx=b.findIndex(x=>x.username===user.username);
        const entry={username:user.username,fname:user.fname,avg:newAvg,exams:(newUd.history||[]).length,branch:examFilter.branch,updated:new Date().toLocaleDateString()};
        if(idx>=0)b[idx]=entry; else b.push(entry);
        b.sort((a,z)=>z.avg-a.avg);
        await saveJSON(BOARD_KEY,b.slice(0,200));
      }catch{}
    }
    setScreen("results");
  };

  // ── AI Chat ──
  const sendChat=async()=>{
    if(!chatInput.trim()||chatLoading)return;
    const key=getKey();
    if(!key){alert(t.geminiKeyMissing);return;}
    const msg={role:"user",content:chatInput};
    const newMsgs=[...chatMsgs,msg];
    setChatMsgs(newMsgs);setChatInput("");setChatLoading(true);
    const history=newMsgs.slice(-10).map(m=>`${m.role==="user"?"User":"Assistant"}: ${m.content}`).join("\n");
    const prompt=`You are an expert engineering advisor for Thai COE licensing exams. Answer questions about civil, electrical, mechanical, industrial, chemical, environmental engineering. Include Thai standards (วสท.), laws (พ.ร.บ.วิศวกร 2542), ethics, and technical calculations. Respond in the same language as the user.\n\nConversation:\n${history}\n\nAssistant:`;
    try{
      const reply=await gemmaCall(key,prompt,false,30000);
      const assistMsg={role:"assistant",content:reply};
      const final=[...newMsgs,assistMsg];
      setChatMsgs(final);setChatLoading(false);
      const newUd={...ud,chatHistory:final.slice(-40)};
      setUd(newUd);if(user)await saveLocal(dk(user.username),newUd);
    }catch(e){setChatLoading(false);setChatMsgs([...newMsgs,{role:"assistant",content:`ขออภัย: ${e.message}`}]);}
  };

  // ── Profile helpers ──
  const handlePhoto=e=>{
    const file=e.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=async ev=>{
      const photo=ev.target.result;
      const newU={...user,photo};setUser(newU);
      await saveLocal(uk(user.username),newU);
    };
    reader.readAsDataURL(file);
  };
  const saveProfile=async()=>{
    const newU={...user,...editData};setUser(newU);
    await saveLocal(uk(user.username),newU);setEditMode(false);
  };
  const saveGeminiKey=async()=>{
    const newUd={...ud,geminiKey:geminiKeyInput};setUd(newUd);
    await saveLocal(dk(user.username),newUd);
    alert(lang==="th"?"บันทึก API Key แล้ว ✅":"API Key saved ✅");
  };
  const savePw=async()=>{
    setPwErr("");setPwOk("");
    if(hashPw(pwData.old)!==user.pw){setPwErr(t.errOldPw);return;}
    if(pwData.nw!==pwData.confirm){setPwErr(t.errPwMatch);return;}
    if(pwData.nw.length<6){setPwErr(t.errPwLen);return;}
    const newU={...user,pw:hashPw(pwData.nw)};setUser(newU);
    await saveLocal(uk(user.username),newU);
    setPwData({old:"",nw:"",confirm:""});
    setPwOk(lang==="th"?"เปลี่ยนรหัสผ่านสำเร็จ ✅":"Password changed ✅");
  };

  const rp=readinessPct();

  // ════════ SCREENS ════════════════════════════════════════════════════════════

  // SPLASH
  if(screen==="splash")return(
    <div style={{...css.app,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:14}}>
      <div style={{fontSize:64}}>⚙️</div>
      <div style={{fontSize:28,fontWeight:900,color:acc,letterSpacing:1}}>ENGI-Mock Pro</div>
      <div style={{color:sub,fontSize:13}}>Powered by Gemma-4-31b-it</div>
      <div style={{display:"flex",gap:8,marginTop:8}}>{[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:acc,opacity:.3+i*.35}}/>)}</div>
    </div>
  );

  // LOGIN
  if(screen==="login")return(
    <div style={css.app}><div style={css.wrap}>
      <div style={{display:"flex",justifyContent:"flex-end",gap:8,paddingTop:8,marginBottom:8}}>
        <button style={{...css.btnOut,padding:"5px 12px",fontSize:12}} onClick={()=>setLang(l=>l==="th"?"en":"th")}>{lang==="th"?"EN":"TH"}</button>
        <button style={{background:"none",border:"none",cursor:"pointer",fontSize:20}} onClick={()=>setDark(d=>!d)}>{dark?"☀️":"🌙"}</button>
      </div>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:52}}>⚙️</div>
        <div style={{fontSize:26,fontWeight:900,color:acc}}>ENGI-Mock Pro</div>
        <div style={{color:sub,fontSize:13,marginTop:4}}>{t.tagline}</div>
      </div>
      <div style={css.card}>
        <div style={{marginBottom:14}}><label style={css.label}>{t.username}</label><input style={css.input} value={loginData.username} onChange={e=>setLoginData({...loginData,username:e.target.value})} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/></div>
        <div style={{marginBottom:6}}><label style={css.label}>{t.password}</label><input type="password" style={css.input} value={loginData.password} onChange={e=>setLoginData({...loginData,password:e.target.value})} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/></div>
        <div style={{textAlign:"right",marginBottom:14}}><span style={{color:acc,fontSize:13,cursor:"pointer"}} onClick={()=>{setScreen("forgot");setAuthErr("");setForgotMsg("");}}>{t.forgotPw}</span></div>
        {authErr&&<div style={css.err}>{authErr}</div>}
        <button style={{...css.btn(),width:"100%"}} onClick={handleLogin}>{t.login}</button>
      </div>
      <div style={{textAlign:"center",color:sub,fontSize:13}}>{lang==="th"?"ยังไม่มีบัญชี?":"No account?"} <span style={{color:acc,cursor:"pointer"}} onClick={()=>{setScreen("register");setRegStep(1);setAuthErr("");;setCreds({username:"",password:"",confirm:""});}}>{t.register}</span></div>
    </div></div>
  );

  // FORGOT
  if(screen==="forgot")return(
    <div style={css.app}><div style={css.wrap}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,paddingTop:12}}>
        <button style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:text}} onClick={()=>setScreen("login")}>←</button>
        <div style={css.h1}>🔑 {t.resetPw}</div>
      </div>
      <div style={css.card}>
        <div style={{marginBottom:14}}><label style={css.label}>{t.email}</label><input type="email" style={css.input} value={forgotEmail} onChange={e=>setForgotEmail(e.target.value)}/></div>
        {forgotMsg&&<div style={{color:"#16A34A",fontSize:13,marginBottom:10}}>{forgotMsg}</div>}
        <button style={{...css.btn(),width:"100%"}} onClick={()=>{if(!forgotEmail){setForgotMsg(t.errFillAll);}else setForgotMsg(t.resetSent);}}>{t.send}</button>
      </div>
    </div></div>
  );

  // REGISTER
  if(screen==="register")return(
    <div style={css.app}><div style={css.wrap}>
      <div style={{display:"flex",alignItems:"center",gap:10,paddingTop:12,marginBottom:6}}>
        <button style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:text}} onClick={()=>{regStep===2?setRegStep(1):setScreen("login");}}>←</button>
        <div style={css.h1}>{t.register}</div>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {[1,2].map(i=><div key={i} style={{flex:1,height:4,borderRadius:4,background:regStep>=i?acc:bdr,transition:"background .3s"}}/>)}
      </div>
      <div style={css.card}>
        <div style={{fontWeight:700,color:sub,fontSize:12,marginBottom:12,textTransform:"uppercase",letterSpacing:.5}}>{regStep===1?t.personalInfo:t.accountInfo}</div>
        {regStep===1
          ?[["fname",t.fname],["lname",t.lname],["dob",t.dob,"date"],["email",t.email,"email"],["phone",t.phone,"tel"]].map(([k,lb,tp])=>(
            <div key={k} style={{marginBottom:12}}><label style={css.label}>{lb}</label><input type={tp||"text"} style={css.input} value={regData[k]} onChange={e=>setRegData({...regData,[k]:e.target.value})}/></div>
          ))
          :[["username",t.username],["password",t.password,"password"],["confirm",t.confirmPw,"password"]].map(([k,lb,tp])=>(
            <div key={k} style={{marginBottom:12}}><label style={css.label}>{lb}</label><input type={tp||"text"} style={css.input} value={creds[k]} onChange={e=>setCreds({...creds,[k]:e.target.value})}/></div>
          ))
        }
        {authErr&&<div style={css.err}>{authErr}</div>}
        <button style={{...css.btn(),width:"100%"}} onClick={handleReg}>{regStep===1?t.next:t.register}</button>
      </div>
      <div style={{textAlign:"center",color:sub,fontSize:13}}>{lang==="th"?"มีบัญชีแล้ว?":"Have account?"} <span style={{color:acc,cursor:"pointer"}} onClick={()=>setScreen("login")}>{t.login}</span></div>
    </div></div>
  );

  // DASHBOARD
  if(screen==="dashboard"){
    const last5=(ud.history||[]).slice(0,5);
    const avgS=last5.length?Math.round(last5.reduce((a,h)=>a+h.score,0)/last5.length):0;
    return(
    <div style={css.app}><div style={css.wrap}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setScreen("profile")}>
          <Avatar photo={user?.photo} name={user?.fname||user?.username} size={42}/>
          <div><div style={{fontWeight:700,fontSize:15}}>{user?.fname} {user?.lname}</div><div style={{color:sub,fontSize:12}}>@{user?.username}</div></div>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <button style={{...css.btnOut,padding:"4px 10px",fontSize:11}} onClick={()=>setLang(l=>l==="th"?"en":"th")}>{lang==="th"?"EN":"TH"}</button>
          <button style={{background:"none",border:"none",cursor:"pointer",fontSize:20}} onClick={()=>setDark(d=>!d)}>{dark?"☀️":"🌙"}</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
        {[["🔥",t.streak,`${ud.streak||0}d`],["📊",t.avgScore,`${avgS}%`],["🎯",lang==="th"?"% พร้อม":"Readiness",`${rp}%`]].map(([ic,lb,v])=>(
          <div key={lb} style={{...css.card,textAlign:"center",padding:"12px 6px",marginBottom:0}}>
            <div style={{fontSize:20}}>{ic}</div><div style={{fontWeight:800,fontSize:16,color:acc}}>{v}</div><div style={{color:sub,fontSize:10,lineHeight:1.3}}>{lb}</div>
          </div>
        ))}
      </div>

      {/* Readiness bar */}
      <div style={css.card}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
          <span style={{fontWeight:700,fontSize:14}}>{t.readiness}</span>
          <span style={{color:acc,fontWeight:800}}>{rp}%</span>
        </div>
        <div style={{background:bdr,borderRadius:8,height:10}}>
          <div style={{background:`linear-gradient(90deg,${acc},#818CF8)`,width:`${rp}%`,height:10,borderRadius:8,transition:"width .6s"}}/>
        </div>
        <div style={{color:sub,fontSize:12,marginTop:6}}>{rp<50?t.examMore:rp<75?t.examGood:t.examReady}</div>
      </div>

      {/* Mode select */}
      <div style={{...css.h2,marginBottom:10}}>{t.startExam}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        {[["📝",t.practice,"practice","ดูเฉลยหลังทำครบ"],["🎯",t.mock,"mock","จับเวลา จำลองสอบจริง"]].map(([ic,nm,md,ds])=>(
          <div key={md} style={{...css.card,cursor:"pointer",marginBottom:0,padding:16,border:`2px solid ${examFilter.mode===md?acc:bdr}`,background:examFilter.mode===md?(dark?"#1e1b4b":"#EEF2FF"):card}}
            onClick={()=>{setExamFilter(f=>({...f,mode:md}));setScreen("bank");}}>
            <div style={{fontSize:26,marginBottom:6}}>{ic}</div>
            <div style={{fontWeight:800,fontSize:15}}>{nm}</div>
            <div style={{color:sub,fontSize:12,marginTop:2}}>{lang==="th"?ds:md==="practice"?"View answers after finishing":"Timed, real exam simulation"}</div>
          </div>
        ))}
      </div>

      {/* Recent */}
      {last5.length>0&&<>
        <div style={{...css.h2,marginBottom:8}}>{t.recentHistory}</div>
        {last5.map((h,i)=>(
          <div key={i} style={{...css.card,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",marginBottom:6}}>
            <div><div style={{fontWeight:600,fontSize:13}}>{h.branch} · {lang==="th"?h.mode==="practice"?t.practice:t.mock:h.mode}</div><div style={{color:sub,fontSize:11}}>{h.date} · {h.correct}/{h.total}</div></div>
            <div style={{fontWeight:800,fontSize:16,color:h.score>=70?acc:"#EF4444"}}>{h.score}%</div>
          </div>
        ))}
      </>}

      {/* Nav */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginTop:6}}>
        {[["📊",t.analytics,"analytics"],["🏆",t.leaderboard,"leaderboard"],["🤖",t.aiChat,"aichat"],["👤",t.profile,"profile"]].map(([ic,lb,sc])=>(
          <button key={sc} style={{...css.btnOut,padding:"10px 4px",fontSize:10,display:"flex",flexDirection:"column",alignItems:"center",gap:3}} onClick={()=>setScreen(sc)}>
            <span style={{fontSize:20}}>{ic}</span>{lb}
          </button>
        ))}
      </div>
    </div></div>
  );}

  // BANK / SETTINGS
  if(screen==="bank")return(
    <div style={css.app}><div style={css.wrap}>
      <div style={{display:"flex",alignItems:"center",gap:10,paddingTop:12,marginBottom:16}}>
        <button style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:text}} onClick={()=>setScreen("dashboard")}>←</button>
        <div style={css.h1}>⚙️ {lang==="th"?"ตั้งค่าข้อสอบ":"Exam Setup"}</div>
      </div>
      {genLoading
        ?<div style={{...css.card,textAlign:"center",padding:40}}>
          <div style={{fontSize:48,marginBottom:10}}>⚙️</div>
          <div style={{fontWeight:700,color:acc,fontSize:16,marginBottom:6}}>{t.generating}</div>
          <div style={{color:sub,fontSize:13}}>{t.genSub}</div>
          <div style={{marginTop:16,display:"flex",justifyContent:"center",gap:8}}>
            {[0,1,2].map(i=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:acc,animation:`pulse${i} 1.2s ${i*.2}s infinite`}}/>)}
          </div>
        </div>
        :<>
          <div style={css.card}>
            {/* Mode */}
            <div style={{marginBottom:14}}>
              <label style={css.label}>{lang==="th"?"โหมด":"Mode"}</label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[["📝",t.practice,"practice"],["🎯",t.mock,"mock"]].map(([ic,lb,md])=>(
                  <div key={md} style={{padding:"10px",borderRadius:10,cursor:"pointer",border:`2px solid ${examFilter.mode===md?acc:bdr}`,background:examFilter.mode===md?(dark?"#1e1b4b":"#EEF2FF"):card,textAlign:"center",fontWeight:700,fontSize:14}}
                    onClick={()=>setExamFilter(f=>({...f,mode:md}))}>
                    {ic} {lb}
                  </div>
                ))}
              </div>
            </div>

            {[
              [t.branch,"branch",BRANCHES],
              [t.category,"category",["catGeneral","catSpecific"]],
              [t.numQ,"numQ",NUM_Q_OPTS],
              ...(examFilter.mode==="mock"?[[t.timeLimit,"timeLimit",TIME_OPTS]]:[]),
            ].map(([lb,k,opts])=>(
              <div key={k} style={{marginBottom:14}}>
                <label style={css.label}>{lb}</label>
                <select style={css.input} value={examFilter[k]} onChange={e=>setExamFilter(f=>({...f,[k]:["numQ","timeLimit"].includes(k)?+e.target.value:e.target.value}))}>
                  {opts.map(o=><option key={o} value={o}>
                    {o==="catGeneral"?t.catGeneral:o==="catSpecific"?t.catSpecific:k==="timeLimit"?`${o} ${t.min}`:o}
                  </option>)}
                </select>
              </div>
            ))}
            {genErr&&<div style={css.err}>{genErr}</div>}
            <button style={{...css.btn(),width:"100%",fontSize:16,padding:"13px"}} onClick={()=>startExam(examFilter)}>🚀 {t.startExam}</button>
          </div>
          {!getKey()&&<div style={{...css.card,background:dark?"#3a1a1a":"#FEF2F2",borderColor:"#FCA5A5"}}>
            <div style={{color:"#EF4444",fontSize:13}}>⚠️ {t.geminiKeyMissing}</div>
          </div>}
        </>
      }
    </div></div>
  );

  // EXAM
  if(screen==="exam"&&examQs.length>0){
    const q=examQs[examIdx];
    const answeredCount=Object.keys(answers).length;
    return(
    <div style={css.app}><div style={css.wrap}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,marginBottom:10}}>
        <button style={{background:"none",border:"none",cursor:"pointer",color:sub,fontSize:13}} onClick={()=>{clearInterval(timerRef.current);if(window.confirm(lang==="th"?"ออกจากข้อสอบ?":"Exit exam?"))setScreen("dashboard");}}>✕ {lang==="th"?"ออก":"Exit"}</button>
        {examFilter.mode==="mock"&&<div style={{color:timeLeft<60?"#EF4444":acc,fontWeight:800,fontSize:15,background:dark?"#1e293b":"#EEF2FF",borderRadius:8,padding:"4px 12px"}}>⏱ {fmt(timeLeft)}</div>}
        <div style={{color:sub,fontSize:13}}>{t.qNo} {examIdx+1}/{examQs.length}</div>
      </div>

      {/* Progress */}
      <div style={{background:bdr,borderRadius:8,height:6,marginBottom:14}}>
        <div style={{background:`linear-gradient(90deg,${acc},#818CF8)`,width:`${(answeredCount/examQs.length)*100}%`,height:6,borderRadius:8,transition:"width .3s"}}/>
      </div>

      {/* Q Card */}
      <div style={css.card}>
        <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
          <span style={{background:dark?"#1e3a5f":"#EFF6FF",color:"#2563EB",borderRadius:20,padding:"2px 10px",fontSize:11}}>{q.branch||examFilter.branch}</span>
          <span style={{background:dark?"#2d1a3a":"#FAF5FF",color:"#7C3AED",borderRadius:20,padding:"2px 10px",fontSize:11}}>{examFilter.category==="catGeneral"?t.catGeneral:t.catSpecific}</span>
        </div>
        <div style={{fontWeight:600,lineHeight:1.7,fontSize:14,marginBottom:16}}>{q.q}</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {q.choices.map((c,i)=>{
            const sel=answers[examIdx]===i;
            return(
              <div key={i} style={{padding:"12px 14px",borderRadius:10,cursor:"pointer",border:`2px solid ${sel?acc:bdr}`,background:sel?(dark?"#1e1b4b":"#EEF2FF"):card,transition:".15s"}}
                onClick={()=>setAnswers(a=>({...a,[examIdx]:i}))}>
                <span style={{color:sel?acc:text,fontWeight:sel?700:400,fontSize:14}}>{c}</span>
              </div>
            );
          })}
        </div>

        {/* Note */}
        <div style={{marginTop:12}}>
          <textarea style={{...css.input,resize:"vertical",minHeight:48,fontSize:12}} placeholder={t.note_placeholder} value={localNotes[q.id]||""} onChange={e=>setLocalNotes(n=>({...n,[q.id]:e.target.value}))}/>
        </div>
      </div>

      {/* Nav buttons */}
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <button style={{...css.btnOut,flex:1}} disabled={examIdx===0} onClick={()=>setExamIdx(i=>i-1)}>←</button>
        {examIdx<examQs.length-1
          ?<button style={{...css.btn(),flex:1}} onClick={()=>setExamIdx(i=>i+1)}>→</button>
          :<button style={{...css.btn("#059669"),flex:1}} onClick={()=>handleSubmitExam(false)}>{t.submitExam}</button>
        }
      </div>
      {submitErr&&<div style={{...css.err,textAlign:"center",marginBottom:8}}>{submitErr}</div>}
      {examIdx===examQs.length-1&&answeredCount<examQs.length&&(
        <div style={{textAlign:"center",marginBottom:8}}>
          <button style={{...css.btn("#6B7280"),fontSize:13,padding:"8px 18px"}} onClick={()=>handleSubmitExam(true)}>
            {lang==="th"?`ส่งแม้ยังไม่ครบ (${examQs.length-answeredCount} ข้อ)`:`Submit anyway (${examQs.length-answeredCount} unanswered)`}
          </button>
        </div>
      )}

      {/* Dot navigator */}
      <div style={{display:"flex",gap:4,flexWrap:"wrap",justifyContent:"center"}}>
        {examQs.map((_,i)=>(
          <div key={i} style={{width:26,height:26,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:10,fontWeight:700,
            background:i===examIdx?acc:answers[i]!==undefined?(dark?"#1e3a2f":"#dcfce7"):flagged[i]?(dark?"#3a1e1e":"#fee2e2"):(dark?"#1e293b":"#f1f5f9"),
            color:i===examIdx?"#fff":text,border:`1.5px solid ${i===examIdx?acc:bdr}`}}
            onClick={()=>setExamIdx(i)}>{i+1}</div>
        ))}
      </div>
    </div></div>
  );}

  // RESULTS
  if(screen==="results"){
    const last=ud.history?.[0];
    if(!last)return null;
    const wrongQs=examQs.filter((_,i)=>answers[i]!==undefined&&answers[i]!==examQs[i].ans);
    const unansweredQs=examQs.filter((_,i)=>answers[i]===undefined);
    return(
    <div style={css.app}><div style={css.wrap}>
      <div style={{textAlign:"center",paddingTop:20,marginBottom:16}}>
        <div style={{fontSize:60}}>{last.score>=70?"🎉":last.score>=50?"😤":"😢"}</div>
        <div style={{fontSize:34,fontWeight:900,color:last.score>=70?acc:last.score>=50?"#F59E0B":"#EF4444"}}>{last.score}%</div>
        <div style={{color:sub,fontSize:14,marginTop:4}}>{last.correct} {t.of} {last.total} · {fmt(last.time||0)}</div>
        <div style={{display:"inline-block",background:dark?"#1e293b":"#F1F5F9",borderRadius:20,padding:"4px 14px",fontSize:12,marginTop:6,color:sub}}>{last.branch} · {last.mode==="practice"?t.practice:t.mock}</div>
      </div>

      <div style={{...css.card,textAlign:"center"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          {[["✅",t.correct,last.correct],["❌",t.wrong,last.total-last.correct-unansweredQs.length],["➖",t.unanswered,unansweredQs.length]].map(([ic,lb,v])=>(
            <div key={lb}><div style={{fontSize:24}}>{ic}</div><div style={{fontWeight:800,fontSize:20}}>{v}</div><div style={{color:sub,fontSize:12}}>{lb}</div></div>
          ))}
        </div>
      </div>

      {/* Explanations */}
      {examQs.map((eq,i)=>{
        const sel=answers[i];
        const isRight=sel===eq.ans;
        const isSkip=sel===undefined;
        return(
          <div key={i} style={{...css.card,borderLeft:`4px solid ${isRight?"#22C55E":isSkip?"#94A3B8":"#EF4444"}`,marginBottom:8,padding:"12px 14px"}}>
            <div style={{fontSize:12,color:sub,marginBottom:4}}>{t.qNo} {i+1}</div>
            <div style={{fontSize:13,fontWeight:600,lineHeight:1.6,marginBottom:8}}>{eq.q}</div>
            <div style={{fontSize:13,color:"#16A34A",marginBottom:2}}>✅ {eq.choices[eq.ans]}</div>
            {!isRight&&!isSkip&&<div style={{fontSize:13,color:"#EF4444",marginBottom:6}}>❌ {eq.choices[sel]}</div>}
            {isSkip&&<div style={{fontSize:12,color:sub,marginBottom:6}}>➖ {t.unanswered}</div>}
            <div style={{fontSize:12,lineHeight:1.7,color:sub,background:dark?"#0f172a":"#f8fafc",borderRadius:8,padding:"8px 12px",marginTop:4}}>{eq.explain}</div>
            {eq.ref&&<div style={{fontSize:11,color:acc,marginTop:4,fontStyle:"italic"}}>📖 {eq.ref}</div>}
            {/* Ask AI per question */}
            <div style={{marginTop:10,borderTop:`1px solid ${bdr}`,paddingTop:8}}>
              <div style={{display:"flex",gap:6}}>
                <input style={{...css.input,fontSize:12,margin:0}} placeholder={t.askAI+" ..."} id={`aiq${i}`}/>
                <button style={{...css.btn(acc),padding:"8px 12px",fontSize:12,flexShrink:0}} onClick={async()=>{
                  const el=document.getElementById(`aiq${i}`);
                  const q2=el?.value;if(!q2||!getKey())return;
                  el.disabled=true;
                  const rep=await gemmaCall(getKey(),`Engineering question context:\n${eq.q}\nAnswer: ${eq.explain}\nUser asks: ${q2}\nAnswer in Thai briefly.`,false,20000).catch(e=>e.message);
                  const out=document.getElementById(`aio${i}`);
                  if(out){out.textContent=rep;out.style.display="block";}
                  el.disabled=false;
                }}>➤</button>
              </div>
              <div id={`aio${i}`} style={{display:"none",marginTop:6,fontSize:12,lineHeight:1.7,background:dark?"#1e293b":"#f0f4ff",borderRadius:8,padding:"8px 12px",color:text,whiteSpace:"pre-wrap"}}/>
            </div>
          </div>
        );
      })}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:6}}>
        <button style={css.btnOut} onClick={()=>setScreen("dashboard")}>🏠</button>
        <button style={css.btn()} onClick={()=>startExam(examFilter)}>{t.retake}</button>
      </div>
    </div></div>
  );}

  // ANALYTICS
  if(screen==="analytics"){
    const hist=ud.history||[];
    return(
    <div style={css.app}><div style={css.wrap}>
      <div style={{display:"flex",alignItems:"center",gap:10,paddingTop:12,marginBottom:16}}>
        <button style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:text}} onClick={()=>setScreen("dashboard")}>←</button>
        <div style={css.h1}>📊 {t.analytics}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
        {[["🎯",lang==="th"?"ครั้งที่สอบ":"Total Exams",hist.length],
          ["📈",t.avgScore,myAvg+"%"],
          ["🔥",t.streak,(ud.streak||0)+"d"],
          ["🏆",t.highest,hist.length?Math.max(...hist.map(h=>h.score))+"%":"—"]].map(([ic,lb,v])=>(
          <div key={lb} style={{...css.card,textAlign:"center",padding:12,marginBottom:0}}>
            <div style={{fontSize:20}}>{ic}</div><div style={{fontWeight:800,fontSize:16,color:acc}}>{v}</div><div style={{color:sub,fontSize:11}}>{lb}</div>
          </div>
        ))}
      </div>
      <div style={css.card}>
        <div style={{fontWeight:700,marginBottom:12}}>📈 Score Trend</div>
        {hist.length===0?<div style={{color:sub,textAlign:"center",padding:20}}>{t.noHistory}</div>
        :<div style={{display:"flex",alignItems:"flex-end",gap:3,height:100}}>
          {hist.slice(0,20).reverse().map((h,i)=>(
            <div key={i} title={`${h.score}%`} style={{flex:1,borderRadius:"3px 3px 0 0",background:`linear-gradient(180deg,${h.score>=70?acc:"#F59E0B"},${h.score>=70?"#818CF8":"#FCD34D"})`,height:`${h.score}%`,minHeight:3,cursor:"default"}}/>
          ))}
        </div>}
      </div>
      {/* By branch */}
      {BRANCHES.map(br=>{
        const bh=hist.filter(h=>h.branch===br);
        if(!bh.length)return null;
        const ba=Math.round(bh.reduce((a,h)=>a+h.score,0)/bh.length);
        return(
          <div key={br} style={{...css.card,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",marginBottom:6}}>
            <div><div style={{fontWeight:600,fontSize:14}}>{br}</div><div style={{color:sub,fontSize:12}}>{bh.length} {lang==="th"?"ครั้ง":"exams"}</div></div>
            <div style={{fontWeight:800,fontSize:16,color:ba>=70?acc:"#F59E0B"}}>{ba}%</div>
          </div>
        );
      })}
      {/* Badges */}
      <div style={{...css.h2,marginBottom:10,marginTop:4}}>🏅 {t.badges}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
        {BADGE_DEFS.map(b=>{
          const has=(ud.badges||[]).includes(b.id);
          return(
            <div key={b.id} style={{...css.card,padding:10,marginBottom:0,textAlign:"center",opacity:has?1:.35}}>
              <div style={{fontSize:26}}>{b.icon}</div>
              <div style={{fontSize:10,color:sub,marginTop:3}}>{lang==="th"?b.th:b.en}</div>
            </div>
          );
        })}
      </div>
    </div></div>
  );}

  // LEADERBOARD
  if(screen==="leaderboard"){
    const myEntry=board.find(b=>b.username===user?.username);
    const myRank=board.findIndex(b=>b.username===user?.username)+1;
    return(
    <div style={css.app}><div style={css.wrap}>
      <div style={{display:"flex",alignItems:"center",gap:10,paddingTop:12,marginBottom:16}}>
        <button style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:text}} onClick={()=>setScreen("dashboard")}>←</button>
        <div style={css.h1}>🏆 {t.publicBoard}</div>
        <button style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",fontSize:18,color:sub}} onClick={loadBoard}>🔄</button>
      </div>
      {myRank>0&&(
        <div style={{...css.card,background:dark?"#1e1b4b":"#EEF2FF",borderColor:acc,marginBottom:10,padding:"12px 16px"}}>
          <div style={{color:sub,fontSize:12,marginBottom:4}}>{t.yourRank}</div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{fontWeight:900,fontSize:22,color:acc,width:32}}>#{myRank}</div>
            <Avatar photo={user?.photo} name={user?.fname||user?.username} size={32}/>
            <div style={{flex:1,fontWeight:700}}>{user?.fname} {user?.lname}</div>
            <div style={{fontWeight:800,fontSize:18,color:acc}}>{myEntry?.avg||0}%</div>
          </div>
        </div>
      )}
      <div style={css.card}>
        {board.length===0?<div style={{color:sub,textAlign:"center",padding:20,fontSize:13}}>
          {lang==="th"?"ยังไม่มีข้อมูล ทำข้อสอบเพื่อขึ้น Leaderboard!":"No data yet. Take an exam to join!"}
        </div>:board.slice(0,50).map((b,i)=>(
          <div key={b.username} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 6px",borderRadius:10,marginBottom:4,background:b.username===user?.username?(dark?"#1e1b4b":"#EEF2FF"):card}}>
            <div style={{fontWeight:800,width:28,textAlign:"center",fontSize:15,color:i<3?["#F59E0B","#94A3B8","#CD7C2B"][i]:sub}}>{i<3?["🥇","🥈","🥉"][i]:`#${i+1}`}</div>
            <Avatar name={b.fname||b.username} size={30}/>
            <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{b.fname||b.username}</div><div style={{color:sub,fontSize:11}}>{b.branch} · {b.exams} {lang==="th"?"ครั้ง":"exams"}</div></div>
            <div style={{fontWeight:800,fontSize:15,color:b.avg>=70?acc:"#F59E0B"}}>{b.avg}%</div>
          </div>
        ))}
      </div>
    </div></div>
  );}

  // AI CHAT
  if(screen==="aichat")return(
    <div style={{...css.app,display:"flex",flexDirection:"column",height:"100vh"}}>
      <div style={{maxWidth:480,width:"100%",margin:"0 auto",display:"flex",flexDirection:"column",height:"100vh"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px 8px",borderBottom:`1px solid ${bdr}`,background:card,flexShrink:0}}>
          <button style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:text}} onClick={()=>setScreen("dashboard")}>←</button>
          <div style={{fontSize:22}}>🤖</div>
          <div><div style={{fontWeight:700}}>Engineering AI</div><div style={{color:sub,fontSize:11}}>Powered by Gemma-4-31b-it · กว. Expert</div></div>
          <button style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",fontSize:13,color:sub}} onClick={()=>{setChatMsgs([]);const nu={...ud,chatHistory:[]};setUd(nu);if(user)saveLocal(dk(user.username),nu);}}>
            {lang==="th"?"ล้าง":"Clear"}
          </button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:10}}>
          {chatMsgs.length===0&&<div style={{textAlign:"center",color:sub,fontSize:13,marginTop:30}}>
            <div style={{fontSize:48,marginBottom:8}}>🤖</div>
            <div style={{fontWeight:600,marginBottom:8}}>{lang==="th"?"ถามได้เลยเกี่ยวกับ:":"Ask me about:"}</div>
            {["📐 คำนวณวิศวกรรม / Engineering calculations","⚖️ พ.ร.บ.วิศวกร 2542 / Engineering Law","🧭 จรรยาบรรณวิศวกร / Professional Ethics","📋 มาตรฐาน วสท. / ACI / IEC / AISC"].map(item=>(
              <div key={item} style={{background:dark?"#1e293b":"#f1f5f9",borderRadius:10,padding:"8px 14px",margin:"4px 0",fontSize:12,cursor:"pointer",textAlign:"left"}}
                onClick={()=>{setChatInput(item.split("/")[0].replace(/[📐⚖️🧭📋]/g,"").trim());}}>{item}</div>
            ))}
          </div>}
          {chatMsgs.map((m,i)=>(
            <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
              {m.role==="assistant"&&<div style={{fontSize:20,marginRight:6,alignSelf:"flex-end"}}>🤖</div>}
              <div style={{maxWidth:"80%",padding:"10px 14px",borderRadius:14,fontSize:13,lineHeight:1.7,whiteSpace:"pre-wrap",
                background:m.role==="user"?acc:(dark?"#1e293b":"#f1f5f9"),
                color:m.role==="user"?"#fff":text,
                borderBottomRightRadius:m.role==="user"?4:14,borderBottomLeftRadius:m.role==="user"?14:4}}>
                {m.content}
              </div>
            </div>
          ))}
          {chatLoading&&<div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{fontSize:20}}>🤖</div>
            <div style={{background:dark?"#1e293b":"#f1f5f9",padding:"10px 16px",borderRadius:14,fontSize:13,color:sub}}>⚙️ {t.loadingAI}</div>
          </div>}
          <div ref={chatEndRef}/>
        </div>
        <div style={{padding:"10px 14px",borderTop:`1px solid ${bdr}`,background:card,display:"flex",gap:8,flexShrink:0}}>
          <input style={{...css.input,fontSize:13,margin:0}} placeholder={t.aiChatPlaceholder} value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendChat()}/>
          <button style={{...css.btn(),padding:"10px 14px",flexShrink:0}} onClick={sendChat} disabled={chatLoading}>➤</button>
        </div>
      </div>
    </div>
  );

  // PROFILE
  if(screen==="profile")return(
    <div style={css.app}><div style={css.wrap}>
      <div style={{display:"flex",alignItems:"center",gap:10,paddingTop:12,marginBottom:14}}>
        <button style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:text}} onClick={()=>setScreen("dashboard")}>←</button>
        <div style={css.h1}>👤 {t.profile}</div>
      </div>

      {/* Photo */}
      <div style={{...css.card,display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
        <div style={{position:"relative",cursor:"pointer"}} onClick={()=>photoRef.current?.click()}>
          <Avatar photo={user?.photo} name={user?.fname||user?.username} size={84}/>
          <div style={{position:"absolute",bottom:0,right:0,background:acc,borderRadius:"50%",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#fff"}}>📷</div>
        </div>
        <input ref={photoRef} type="file" accept="image/*" style={{display:"none"}} onChange={handlePhoto}/>
        <div style={{fontWeight:700,fontSize:17}}>{user?.fname} {user?.lname}</div>
        <div style={{color:sub,fontSize:13}}>@{user?.username}</div>
      </div>

      {/* Gemini Key */}
      <div style={css.card}>
        <div style={{fontWeight:700,marginBottom:10}}>🔑 {t.geminiKey}</div>
        <div style={{color:sub,fontSize:12,marginBottom:8}}>💡 {t.geminiKeyHint}</div>
        <div style={{background:dark?"#1e293b":"#FEF3C7",borderRadius:8,padding:"8px 12px",marginBottom:10,fontSize:12}}>
          <strong>📌 How to get your key:</strong><br/>
          1. Go to <a href="https://openrouter.ai" target="_blank" style={{color:acc}}>openrouter.ai</a><br/>
          2. Sign up and go to "Keys" section<br/>
          3. Copy your API key (starts with <code>sk-or-v1...</code>)<br/>
          4. Paste it below
        </div>
        <input type="password" style={{...css.input,marginBottom:10}} placeholder="sk-or-v1..." value={geminiKeyInput} onChange={e=>setGeminiKeyInput(e.target.value)}/>
        <button style={{...css.btn(),width:"100%"}} onClick={saveGeminiKey}>{t.save} API Key</button>
        {ud.geminiKey&&<div style={{color:"#16A34A",fontSize:12,marginTop:8,textAlign:"center"}}>✅ API Key {lang==="th"?"ถูกบันทึกแล้ว":"is saved"}</div>}
      </div>

      {/* Edit info */}
      <div style={css.card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontWeight:700}}>✏️ {t.editProfile}</div>
          <button style={{...css.btnOut,padding:"5px 12px",fontSize:12}} onClick={()=>{setEditMode(!editMode);setEditData({fname:user?.fname||"",lname:user?.lname||"",email:user?.email||"",phone:user?.phone||"",dob:user?.dob||""})}}>
            {editMode?t.cancel:t.edit}
          </button>
        </div>
        {editMode?<>
          {[["fname",t.fname],["lname",t.lname],["dob",t.dob,"date"],["email",t.email,"email"],["phone",t.phone,"tel"]].map(([k,lb,tp])=>(
            <div key={k} style={{marginBottom:12}}><label style={css.label}>{lb}</label><input type={tp||"text"} style={css.input} value={editData[k]||""} onChange={e=>setEditData({...editData,[k]:e.target.value})}/></div>
          ))}
          <button style={{...css.btn(),width:"100%"}} onClick={saveProfile}>{t.save}</button>
        </>:<>
          {[["👤",`${user?.fname||""} ${user?.lname||""}`],["📧",user?.email],["📱",user?.phone],["📅",user?.dob]].map(([ic,v])=>(
            <div key={ic} style={{display:"flex",gap:8,marginBottom:8,fontSize:13}}><span>{ic}</span><span>{v||"—"}</span></div>
          ))}
        </>}
      </div>

      {/* Change password */}
      <div style={css.card}>
        <div style={{fontWeight:700,marginBottom:12}}>🔒 {t.changePw}</div>
        {[["old",t.oldPw],["nw",t.password],["confirm",t.confirmPw]].map(([k,lb])=>(
          <div key={k} style={{marginBottom:12}}><label style={css.label}>{lb}</label><input type="password" style={css.input} value={pwData[k]} onChange={e=>setPwData({...pwData,[k]:e.target.value})}/></div>
        ))}
        {pwErr&&<div style={css.err}>{pwErr}</div>}
        {pwOk&&<div style={{color:"#16A34A",fontSize:13,marginBottom:8}}>{pwOk}</div>}
        <button style={{...css.btn(),width:"100%"}} onClick={savePw}>{t.save}</button>
      </div>

      {/* Settings */}
      <div style={css.card}>
        <div style={{fontWeight:700,marginBottom:12}}>⚙️ Settings</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${bdr}`}}>
          <span style={{fontSize:14}}>{t.darkMode}</span><Toggle value={dark} onChange={setDark}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0"}}>
          <span style={{fontSize:14}}>{t.language}</span>
          <button style={{...css.btnOut,padding:"5px 12px",fontSize:12}} onClick={()=>setLang(l=>l==="th"?"en":"th")}>{lang==="th"?"English":"ภาษาไทย"}</button>
        </div>
      </div>

      <button style={{...css.btnOut,width:"100%",color:"#EF4444",borderColor:"#EF4444"}} onClick={()=>{setUser(null);setLoginData({username:"",password:""});setScreen("login");}}>
        🚪 {t.logout}
      </button>
    </div></div>
  );

  return <div style={css.app}><div style={{padding:20,color:sub}}>Loading...</div></div>;
}
