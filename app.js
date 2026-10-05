/* =========================
   SUPABASE CONFIG
========================= */
const SUPABASE_URL = "https://whcoxecfkwqalehbukug.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_d-YxIQY9lWa1tdf_ENJw2g_ePK25Vt5";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function useQuotaFromSupabase(userId) {
  const { data, error } = await supabaseClient.rpc("use_quota", { p_user_id: userId });
  if (error) {
    if (String(error.message || "").includes("QUOTA_HABIS")) {
      return { success: false, message: "Quota kamu sudah habis." };
    }
    console.error("Supabase quota error:", error);
    return { success: false, message: "Gagal mengecek quota." };
  }
  return { success: true, remaining: data };
}

const tools = [
{name:"TikTok Downloader",desc:"Masukkan link TikTok dan unduh hasilnya.",icon:"♪",tag:"MEDIA",cat:"download",action:"tiktok"},
{name:"Instagram",desc:"Masukkan link Instagram untuk diproses.",icon:"◎",tag:"MEDIA",cat:"download",action:"instagram"},
{name:"Fake FF",desc:"Buat gambar profil Fake FF dari nama.",icon:"◈",tag:"IMAGE",cat:"maker",action:"fakeff"},
{name:"BRAT Generator",desc:"Buat gambar teks bergaya comic.",icon:"✦",tag:"IMAGE",cat:"maker",action:"brat"},
{name:"IQC Generator",desc:"Buat gambar chat sederhana.",icon:"▣",tag:"IMAGE",cat:"maker",action:"iqc"},
{name:"Image To QR",desc:"Ubah gambar menjadi QR code.",icon:"▦",tag:"QR",cat:"maker",action:"img2qr"},
{name:"Quotes Maker",desc:"Buat gambar quotes dari teks dan nama penulis.",icon:"❝",tag:"IMAGE",cat:"maker",action:"quotes"},
{name:"iPhone Group Chat Generator",desc:"iPhone Group Chat Generator",icon:"▣",tag:"IMAGE",cat:"maker",action:"igc"},
{name:"Image To URL",desc:"Upload gambar dan dapatkan direct URL.",icon:"↗",tag:"URL",cat:"utility",action:"imgurl"},
{name:"Remove BG",desc:"Hapus background gambar dari URL.",icon:"✂",tag:"IMAGE",cat:"utility",action:"removebg"},
{name:"AI",desc:"Chat dengan pilihan AI GPTBot atau AI Ustadz.",icon:"✦",tag:"AI",cat:"utility",action:"ai"},
{name:"Fake Dana",desc:"Buat gambar saldo Fake Dana dari nominal.",icon:"▱",tag:"IMAGE",cat:"maker",action:"dana"},
{name:"NIK Check",desc:"Cek data NIK melalui API QSR.",icon:"🪪",tag:"NIK CHECK",cat:"utility",action:"nik"},
{name:"AM Generator",desc:"Generator aktivasi Alight Motion berbasis email + link verifikasi.",icon:"⚡",tag:"AM GENERATOR",cat:"utility",action:"amgenerator"},
{name:"CNN Indonesia",desc:"Berita terbaru CNN Indonesia.",icon:"📰",tag:"NEWS",cat:"utility",action:"cnn"},
{name:"Kisah Nabi",desc:"Baca kisah para nabi dengan tampilan nyaman.",icon:"🕌",tag:"ISLAMIC",cat:"utility",action:"kisahnabi"},
{name:"Info Gempa",desc:"Info gempa terbaru dari BMKG.",icon:"🌋",tag:"BMKG",cat:"utility",action:"gempa"},
{name:"Jadwal TV",desc:"Cek jadwal acara TV berdasarkan nama stasiun.",icon:"▣",tag:"TV",cat:"utility",action:"jadwaltv"},
{name:"Temp Mail",desc:"Buat email sementara dan terima pesan secara realtime.",icon:"✉️",tag:"UTILITY",cat:"utility",action:"tempmail"},
{name:"Cuaca",desc:"Cek kondisi cuaca berdasarkan nama kota.",icon:"☀️",tag:"WEATHER",cat:"utility",action:"cuaca"},
{name:"IP Checker",desc:"Cek informasi lokasi dan jaringan dari alamat IP.",icon:"🌐",tag:"IP CHECK",cat:"utility",action:"ipchecker"},
{name:"Al-Qur'an",desc:"Baca Al-Qur'an lengkap dengan Arab, latin, dan terjemahan Indonesia.",icon:"﷽",tag:"AL-QUR'AN",cat:"utility",action:"quran"},
];
let filter="all";
const toolState={};
const $=id=>document.getElementById(id);

// =========================
// HERO LIVE STATUS
// =========================
function updateHeroClock(){
  const el=$("heroClock");
  if(!el)return;
  const now=new Date();
  el.textContent=now.toLocaleTimeString("id-ID",{hour12:false});
}

function updateHeroBattery(){
  const value=$("heroBattery");
  const icon=$("batteryIcon");
  if(!value)return;
  if(!navigator.getBattery){
    value.textContent="N/A";
    if(icon)icon.textContent="?";
    return;
  }
  navigator.getBattery().then(b=>{
    const paint=()=>{
      const pct=Math.round(b.level*100);
      value.textContent=`${pct}%${b.charging?" ⚡":""}`;
      if(icon){
        icon.textContent=b.charging?"⚡":(pct<=20?"▮":"▰");
      }
      const box=value.closest(".statusItem");
      box?.classList.toggle("low",pct<=20);
    };
    paint();
    b.addEventListener("levelchange",paint);
    b.addEventListener("chargingchange",paint);
  }).catch(()=>{value.textContent="N/A";});
}

async function updateHeroPing(){
  const value=$("heroPing");
  const item=value?.closest(".statusPing");
  if(!value)return;

  value.textContent="PING…";
  item?.classList.remove("ok","bad");

  const endpoints=[
    "https://api.azbry.com/?_ping=",
    "https://api.azbry.com/api/ai/gpt4o?q=ping&_ping="
  ];

  for(const base of endpoints){
    const started=performance.now();
    try{
      // no-cors dipakai hanya untuk mengukur koneksi/reachability API.
      await fetch(base+Date.now(),{
        method:"GET",
        mode:"no-cors",
        cache:"no-store",
        credentials:"omit"
      });
      const ms=Math.max(1,Math.round(performance.now()-started));
      value.textContent=`${ms} ms`;
      item?.classList.add("ok");
      item?.classList.remove("bad");
      return;
    }catch(e){}
  }

  value.textContent="OFFLINE";
  item?.classList.add("bad");
  item?.classList.remove("ok");
}

function initHeroStatus(){
  updateHeroClock();
  updateHeroBattery();
  updateHeroPing();
  setInterval(updateHeroClock,1000);
  setInterval(updateHeroPing,30000);
}
function toggleNav(){ const n=$("nav"); n.classList.toggle("mobileOpen"); }
function setFilter(value,el){filter=value;document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));el.classList.add("active");render();}
function render(){
 const q=$("search").value.toLowerCase().trim();
 const list=tools.filter(t=>(filter==="all"||t.cat===filter)&&(`${t.name} ${t.desc}`.toLowerCase().includes(q)));
 $("count").textContent=`${list.length} tool`;
 $("empty").style.display=list.length?"none":"block";
 $("grid").innerHTML=list.map(t=>`<a class="card toolCard" href="?tool=${encodeURIComponent(t.action)}" aria-label="Buka ${escapeHtml(t.name)}"><div class="icon">${t.icon}</div><h3>${t.name}</h3><p>${t.desc}</p><span class="tag">${t.tag}</span><span class="go">→</span></a>`).join("");
}
function getToolRoot(){return $("toolPageBody") || $("modalBody");}
function saveToolState(){
 const action=currentAction();
 if(!action)return;
 const root=getToolRoot();
 if(!root)return;
 const state={};
 root.querySelectorAll("input, textarea, select").forEach(el=>{
   if(el.type==="file")return;
   state[el.id||el.name||el.tagName+Math.random()] = el.value;
 });
 toolState[action]=state;
}
function restoreToolState(action){
 const state=toolState[action];
 if(!state)return;
 Object.entries(state).forEach(([id,value])=>{const el=$(id);if(el&&el.type!=="file")el.value=value;});
}
function openTool(i){
 const t=tools[i];
 if(!t)return;
 location.href=`?tool=${encodeURIComponent(t.action)}`;
}
function closeTool(){saveToolState();$("toolModal").classList.remove("show");$("toolModal").setAttribute("aria-hidden","true");}
function field(label,id,placeholder=""){return `<label>${label}<input id="${id}" placeholder="${placeholder}"></label>`}
function toolUI(a){
 const common=`<div class="toolActions"><button class="actionBtn" onclick="runTool()">JALANKAN</button><button class="actionBtn secondary" onclick="clearTool()">RESET</button></div><div id="toolResult" class="toolResult"></div>`;
 if(a==="amgenerator")return `<div class="amComicWrap">${comicQuotaBadge("amgenerator")}<div class="amComicHead"><span class="csBurst">⚡ AM GENERATOR</span><h2>ALIGHT MOTION PREMIUM</h2><p>Ikuti tahap satu per satu. Setelah Step 1 berhasil, otomatis lanjut ke Step 2.</p><div class="amProgress"><span id="amProg1" class="amProgNum active">1</span><span class="amLine"></span><span id="amProg2" class="amProgNum">2</span></div></div><div id="amStep1" class="amComicStep"><div class="amNum">1</div><div class="amStepBody"><b>REQUEST ACTIVATION</b><label>Email<input id="amEmail" class="amInput" type="email" autocomplete="email" placeholder="name@example.com"></label><button class="amBtn" id="amRequestBtn" onclick="runAMRequest()">REQUEST ACTIVATION</button><div class="amMsg" id="amRequestMsg"></div></div></div><div id="amStep2" class="amComicStep" hidden><div class="amNum">2</div><div class="amStepBody"><b>VERIFIKASI LINK</b><label>Link dari email<input id="amVerify" class="amInput" type="url" placeholder="https://alightcreative.com/verify?..." autocomplete="off"></label><button class="amBtn secondary" id="amVerifyBtn" onclick="runAMVerify()">VERIFIKASI SEKARANG</button><button class="amBtn back" type="button" onclick="amShowStep(1)">← KEMBALI KE STEP 1</button><div class="amMsg" id="amVerifyMsg"></div></div></div><div class="amNote">💡 Gunakan <b>email yang sama</b> pada kedua tahap.</div></div>`;
 if(a==="nik")return `<div class="nikIntro">${comicQuotaBadge("nik")}<div class="nikBadge">🪪 NIK CHECK</div><p>Masukkan <b>16 digit NIK</b>, lalu tekan JALANKAN untuk mengambil hasil dari API.</p></div><label class="nikField">NIK<input id="toolInput" type="text" inputmode="numeric" autocomplete="off" maxlength="16" pattern="[0-9]{16}" placeholder="Contoh: 3201010101010001" oninput="this.value=this.value.replace(/\D/g,'').slice(0,16)"></label>${common}`;
 if(a==="tiktok")return field("Link TikTok","toolInput","https://www.tiktok.com/@user/video/...")+common;
 if(a==="instagram")return field("Link Instagram","toolInput","https://www.instagram.com/p/...")+common;
 if(a==="fakeff")return field("Nama","toolInput","Nama pemain")+common;
 if(a==="link")return field("Masukkan URL","toolInput","https://...")+common;
 if(a==="igc")return `<label>Link profil grup<input id="igcProfile" type="url" maxlength="500" placeholder="https://cloud.yardansh.com/PZsJGH.jpg"></label><label>Nama grup<input id="igcName" maxlength="60" placeholder="Nama grup"></label><label>Peserta<input id="igcParticipants" type="number" min="1" max="100" value="10" placeholder="10"></label>${common}`;
 if(a==="ai")return `<div class="aiTool"><div class="aiIntro"><div class="aiBadge">✦</div><div><div class="aiKicker">AI ASSISTANT</div><div class="aiSub">Pilih asisten dan kirim pertanyaanmu.</div></div></div><label class="fieldLabel">Asisten<select id="aiChoice" class="aiSelect"><option value="gpt4o">GPTBot</option><option value="ustadz">Ustadz</option></select></label><label class="fieldLabel">Pertanyaan / Pesan<textarea id="toolInput" rows="5" maxlength="4000" placeholder="Tulis pertanyaan atau pesan..."></textarea></label>${common}</div>`;
 if(a==="removebg")return field("URL Gambar","toolInput","https://contoh.com/gambar.jpg")+common;
 if(a==="quotes")return `<label>Text<input id="toolInput" maxlength="500" placeholder="Masukkan text quotes..."></label><label>Nama penulis<input id="quoteAuthor" maxlength="80" placeholder="Nama penulis"></label>${common}`;
 if(a==="brat")return `<label>Teks<input id="toolInput" maxlength="80" placeholder="brat style text"></label>${common}`;
 if(a==="img2qr")return `<label>Pilih gambar<input id="fileInput" type="file" accept="image/*"></label>${common}`;
 if(a==="iqc")return field("Pesan","toolInput","Masukkan pesan...")+common;
 if(a==="imgurl")return `<p class="hint">Upload gambar langsung melalui Catbox untuk mendapatkan direct URL.</p><a class="downloadBtn" href="https://catbox.moe/" target="_blank" rel="noopener">⬆ UPLOAD SEKARANG KE CATBOX</a>`;
 if(a==="ktp")return `<p class="hint">Generator ini hanya template visual/demo, bukan dokumen identitas resmi.</p>${field("Nama","toolInput","NAMA DEMO")}${field("NIK demo","subInput","0000000000000000")}${common}`;
 if(a==="certificate")return field("Nama penerima","toolInput","Nama Lengkap")+field("Judul","subInput","SERTIFIKAT PENGHARGAAN")+common;
 if(a==="quran")return `<div class="quranWrap"><div class="quranHead"><div class="quranBismillah">﷽</div><h2>AL-QUR'AN</h2><p>Al-Qur'an digital dengan teks Arab, transliterasi, dan terjemahan Indonesia.</p></div><label class="quranSearchLabel">CARI SURAH<input id="quranSearch" class="quranSearch" placeholder="Contoh: Al-Fatihah" autocomplete="off" oninput="filterQuranSurah(this.value)"></label><div id="quranList" class="quranList"><div class="quranLoading">Memuat daftar surah…</div></div><div id="quranReader" class="quranReader" hidden><button class="quranBack" type="button" onclick="closeQuranReader()">← KEMBALI KE DAFTAR SURAH</button><div id="quranReaderHead" class="quranReaderHead"></div><div id="quranContent" class="quranContent"></div></div></div>`;
 if(a==="cnn")return `<div class="scToolIntro"><span>📰</span><div><b>CNN INDONESIA</b><small>Berita terbaru dari API sumber.</small></div></div><div id="cnnComicList" class="newsComicList"><div class="loading">Memuat berita...</div></div><button class="actionBtn secondary" type="button" onclick="loadCNNComic()">↻ MUAT ULANG</button>`;
 if(a==="kisahnabi")return `<div class="scToolIntro"><span>🕌</span><div><b>KISAH NABI</b><small>Masukkan nama nabi untuk membaca kisahnya.</small></div></div><div class="nabiChipsComic"><button type="button" onclick="setNabiComic('Adam')">Adam</button><button type="button" onclick="setNabiComic('Nuh')">Nuh</button><button type="button" onclick="setNabiComic('Ibrahim')">Ibrahim</button><button type="button" onclick="setNabiComic('Musa')">Musa</button><button type="button" onclick="setNabiComic('Muhammad')">Muhammad</button></div><label>Nama Nabi<input id="nabiComicInput" placeholder="Contoh: Muhammad" autocomplete="off"></label><button class="actionBtn" type="button" onclick="loadKisahNabiComic()">📖 LIHAT KISAH</button><div id="nabiComicResult" class="toolResult"></div>`;
 if(a==="gempa")return `<div class="scToolIntro"><span>🌋</span><div><b>INFO GEMPA</b><small>Informasi gempa terbaru dari BMKG.</small></div></div><div id="gempaComicContent" class="gempaComicContent"><div class="loading">Mengambil data BMKG...</div></div><button class="actionBtn secondary" type="button" onclick="loadGempaComic()">↻ MUAT ULANG</button>`;
 if(a==="jadwaltv")return `<div class="tvComicWrap"><div class="tvComicHead"><span class="csBurst">▣ JADWAL TV</span><h2>CEK JADWAL ACARA TV</h2><p>Masukkan nama stasiun TV untuk melihat jadwal acara.</p></div><label>NAMA TV<input id="tvInput" class="tvComicInput" autocomplete="off" placeholder="Contoh: RCTI" type="text"></label><div class="tvChipsComic"><button type="button" onclick="setTVComic('RCTI')">RCTI</button><button type="button" onclick="setTVComic('SCTV')">SCTV</button><button type="button" onclick="setTVComic('Indosiar')">Indosiar</button><button type="button" onclick="setTVComic('ANTV')">ANTV</button><button type="button" onclick="setTVComic('Trans TV')">Trans TV</button></div><button class="actionBtn" id="tvCheckBtn" type="button" onclick="loadJadwalTVComic()">📺 LIHAT JADWAL</button><div id="tvResult" class="tvComicResult"></div></div>`;
 if(a==="cuaca")return `<div class="weatherComicWrap"><div class="weatherComicHead"><span class="csBurst">☀️ CUACA</span><h2>CEK CUACA KOTA</h2><p>Masukkan nama kota untuk melihat kondisi cuaca terkini.</p></div><label class="weatherLabel">NAMA KOTA<input id="weatherInput" class="weatherInput" autocomplete="off" placeholder="Contoh: Sragen, Jakarta, Surabaya" type="text"></label><div class="weatherExamples"><button type="button" onclick="setWeatherCity('Jakarta')">Jakarta</button><button type="button" onclick="setWeatherCity('Sragen')">Sragen</button><button type="button" onclick="setWeatherCity('Surabaya')">Surabaya</button></div><button class="actionBtn weatherBtn" id="weatherCheckBtn" type="button" onclick="loadWeatherComic()">☀️ CEK CUACA</button><div id="weatherResult" class="weatherResult"></div></div>`;
 if(a==="ipchecker")return `<div class="ipComicWrap">${comicQuotaBadge("ipchecker")}<div class="ipComicHead"><span class="csBurst">🌐 IP CHECKER</span><h2>CEK ALAMAT IP</h2><p>Masukkan alamat IP untuk melihat lokasi dan informasi jaringan. Kosongkan untuk mengecek IP publik kamu.</p></div><label class="ipLabel">ALAMAT IP<input id="ipInput" class="ipInput" autocomplete="off" inputmode="decimal" placeholder="Contoh: 8.8.8.8" type="text"></label><div class="ipExamples"><button type="button" onclick="setIPCity('8.8.8.8')">8.8.8.8</button><button type="button" onclick="setIPCity('1.1.1.1')">1.1.1.1</button></div><button class="actionBtn ipBtn" id="ipCheckBtn" type="button" onclick="loadIPCheckerComic()">🌐 CEK IP</button><div id="ipResult" class="ipResult"></div><div class="ipFoot">Data geolokasi berbasis IP bersifat perkiraan, bukan lokasi GPS.</div></div>`;
 if(a==="tempmail")return `<div class="tempComicWrap">${comicQuotaBadge("tempmail")}<div class="tempComicHead"><span class="csBurst">✉ TEMP MAIL</span><h2>TEMPORARY INBOX</h2><p>Email sementara cepat untuk menerima pesan. Gratis dan tanpa API key.</p></div><div class="tempEmailBox"><div class="tempEmailLabel">ALAMAT EMAIL</div><div class="tempEmailRow"><span id="tempEmailAddress">Belum ada email</span><button class="tempComicBtn secondary" disabled id="tempCopyBtn" onclick="copyTempEmail()" type="button">COPY</button></div></div><div class="tempComicActions"><button class="tempComicBtn" id="tempCreateBtn" onclick="createTempEmail()" type="button">＋ CREATE EMAIL</button><button class="tempComicBtn secondary" id="tempInboxBtn" onclick="checkTempInbox()" type="button">↻ REFRESH INBOX</button></div><div class="tempComicStatus" id="tempMailStatus"></div><div class="tempInboxHead"><b>INBOX</b><span id="tempInboxCount">0 pesan</span></div><div class="tempInboxList" id="tempInboxList"><div class="tempEmpty"><div>⌁</div><b>Belum ada email</b><small>Create Email untuk membuat alamat sementara.</small></div></div><div class="tempAttrib">Temporary email service by <a href="https://tempmailportal.com/" target="_blank" rel="noopener">TempMailPortal</a></div></div><div id="tempMailModal" class="tempComicModal" onclick="if(event.target===this)closeTempMessage()"><div class="tempModalCard"><div class="tempModalTop"><h3 id="tempModalSubject">Pesan</h3><button class="tempModalClose" onclick="closeTempMessage()" type="button">×</button></div><div class="tempModalFrom" id="tempModalFrom"></div><div class="tempLinkBox" hidden id="tempModalLinkBox"><div><b>🔗 LINK TERDETEKSI</b><small id="tempModalLinkText">Link verifikasi ditemukan di email.</small></div><button class="tempComicBtn" id="tempCopyLinkBtn" onclick="copyTempMessageLink()" type="button">COPY LINK</button></div><div class="tempLinkBox" hidden id="tempModalCodeBox"><div><b>🔢 KODE TERDETEKSI</b><small id="tempModalCodeText">Kode verifikasi ditemukan di email.</small></div><div class="tempCodesList" id="tempModalCodes"></div></div><div class="tempModalBody" id="tempModalBody"></div></div></div>`;
 if(a==="dana")return `<label>Nominal<input id="toolInput" inputmode="numeric" maxlength="12" placeholder="100000"></label>${common}`;
}
function initTool(a){}
function runTool(){
 const action=currentAction(); const input=$("toolInput")?.value||""; const out=$("toolResult");
 try{
  if(action==="ai"){runAI(input);return;}
  if(action==="igc"){runIGC();return;}
  if(action==="tiktok"){runTikTok(input);return;}
  if(action==="instagram"){runInstagram(input);return;}
  if(action==="fakeff"){runFakeFF(input);return;}
  if(action==="link"){if(!/^https?:\/\//i.test(input)){out.textContent="Masukkan URL yang valid (http/https).";return;}navigator.clipboard?.writeText(input);out.innerHTML=`URL siap: <a href="${escapeHtml(input)}" target="_blank" rel="noopener">Buka link</a><br><small>URL juga dicoba disalin ke clipboard.</small>`;return;}
  if(action==="imgurl"){runImageToURL();return;}
  if(action==="removebg"){runRemoveBG(input);return;}
  if(action==="quotes"){runQuotesMaker(input);return;}
  if(action==="img2qr"){runImg2QR();return;}
  if(action==="brat"){runBrat(input);return;}
  if(action==="iqc"){runIQC(input);return;}
  if(action==="dana"){runDana(input);return;}
  if(action==="nik"){runNIK(input);return;}
   if(action==="amgenerator"){runAMRequest();return;}
   if(action==="cnn"){loadCNNComic();return;}
   if(action==="kisahnabi"){loadKisahNabiComic();return;}
   if(action==="gempa"){loadGempaComic();return;}
   if(action==="cuaca"){loadWeatherComic();return;}
  if(action==="ipchecker"){loadIPCheckerComic();return;}
 }catch(e){out.textContent="Input tidak valid: "+e.message;}
}
async function runAI(input){
 const out=$("toolResult");
 const text=input.trim();
 const choice=$("aiChoice")?.value||"gpt4o";
 if(!text){out.textContent="Masukkan pertanyaan atau pesan terlebih dahulu.";return;}
 out.innerHTML='<div class="loading">AI sedang memproses…</div>';
 const endpoint="https://api.azbry.com/api/ai/"+choice+"?q="+encodeURIComponent(text)+(choice==="ustadz"?"&madhhab=0":"");
 try{
   const r=await fetchAzbry(endpoint,{method:"GET"});
   if(!r.ok) throw new Error(`API ${r.status}`);
   const type=(r.headers.get("content-type")||"").toLowerCase();
   let data=type.includes("json")?await r.json():await r.text();
   const answer=extractAIText(data);
   if(!answer) throw new Error("Jawaban AI tidak ditemukan dari response API.");
   out.innerHTML=`<div class="aiAnswer">${escapeHtml(answer).replace(/\n/g,"<br>")}</div>`;
 }catch(e){
   out.innerHTML=`<div class="errorMsg">Gagal memproses AI: ${escapeHtml(e.message||String(e))}</div>`;
 }
}

async function runNIK(input){
 const out=$("toolResult");
 const nik=String(input||"").replace(/\D/g,"");
 if(!/^\d{16}$/.test(nik)){
   out.innerHTML='<div class="nikError">⚠️ NIK harus terdiri dari tepat 16 angka.</div>';
   return;
 }
 if(!comicQuotaTryReserve('nik')){
   out.innerHTML=comicQuotaError('nik');
   return;
 }
 out.innerHTML='<div class="nikLoading"><span>🔎</span><div><b>MEMERIKSA NIK...</b><small>Menghubungi API QSR</small></div></div>';
 const endpoint='https://api.qsr.web.id/tools/nik?apikey=qsr&nik='+encodeURIComponent(nik);
 let counted=true;
 try{
   const r=await fetch(endpoint,{method:'GET',headers:{Accept:'application/json, text/plain, */*'},cache:'no-store'});
   const text=await r.text();
   let data;
   try{data=JSON.parse(text);}catch(_){data=text;}
   if(!r.ok || (data && typeof data==='object' && data.status===false)){
      const msg=(data&&typeof data==='object'&&(data.error||data.message))||('API '+r.status);
      throw new Error(msg);
   }
   out.innerHTML=renderNikResult(data);
   counted=false;
 }catch(e){
   if(counted) comicQuotaRefund('nik');
   out.innerHTML='<div class="nikError"><div class="nikErrorTitle">❌ NIK CHECK GAGAL</div><p>'+escapeHtml(e.message||String(e))+'</p><small>Quota tidak dipotong karena request gagal.</small></div>';
 }
}
function renderNikResult(data){
 const ignored=new Set(['status','creator','domain','success','apikey','api_key']);
 let obj=data;
 // Tampilkan hanya data hasil NIK; metadata API seperti status/creator/domain disembunyikan.
 if(obj&&typeof obj==='object'&&!Array.isArray(obj)){
   if(obj.result!==undefined) obj=obj.result;
   else if(obj.data!==undefined) obj=obj.data;
 }
 const entries=[];
 const walk=(value,keyPath)=>{
   if(value===null||value===undefined)return;
   if(Array.isArray(value)){
     value.forEach((v,i)=>walk(v,keyPath?keyPath+' '+(i+1):String(i+1)));
     return;
   }
   if(typeof value==='object'){
     Object.entries(value).forEach(([k,v])=>{
       if(ignored.has(String(k).toLowerCase())) return;
       walk(v,keyPath?keyPath+' › '+k:k);
     });
     return;
   }
   if(keyPath && !ignored.has(String(keyPath).split('›').pop().trim().toLowerCase())) entries.push([keyPath,String(value)]);
 };
 walk(obj,'');
 const cards=entries.map(([k,v])=>`<div class="nikItem"><span>${escapeHtml(formatNikKey(k))}</span><b>${escapeHtml(v)}</b></div>`).join('');
 return `<div class="nikResultHead"><div class="nikSuccess">✓ BERHASIL</div><h3>HASIL NIK CHECK</h3><p>Data NIK berhasil ditemukan.</p></div><div class="nikGrid">${cards||'<div class="nikItem"><b>Data NIK tidak tersedia.</b></div>'}</div>`;
}
function formatNikKey(key){
 return String(key).replace(/^.*?›\s*/, '').replace(/[_-]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
}

function extractAIText(value){
 if(typeof value==="string") return value.trim();
 if(!value || typeof value!=="object") return "";
 const keys=["answer","response","result","message","content","text","data"];
 for(const k of keys){
   const v=value[k];
   if(typeof v==="string" && v.trim()) return v.trim();
   if(v && typeof v==="object"){const nested=extractAIText(v);if(nested)return nested;}
 }
 return "";
}
async function amQsr(path, params={}){ const query=new URLSearchParams({apikey:'qsr'}); Object.entries(params||{}).forEach(([k,v])=>{if(v!==undefined&&v!==null&&String(v)!=='')query.set(k,String(v));}); const url='https://api.qsr.web.id'+(String(path).startsWith('/')?String(path):'/'+String(path))+'?'+query.toString(); let last; for(const target of [url,'https://api.allorigins.win/raw?url='+encodeURIComponent(url)]){ try{ const r=await fetch(target,{method:'GET',cache:'no-store',headers:{Accept:'application/json, text/plain, */*'}}); const text=await r.text(); let data=text; try{data=JSON.parse(text)}catch(_){ } if(!r.ok) throw new Error('HTTP '+r.status+(typeof data==='object'?(data.message||data.error?' — '+(data.message||data.error):''):'')); return data; }catch(e){last=e;} } throw last||new Error('API tidak dapat dihubungi.'); }
function amNormalizeLink(raw){ let link=String(raw||'').trim().replace(/^['"`]+|['"`]+$/g,'').trim(); for(let i=0;i<2;i++){try{const d=decodeURIComponent(link);if(d!==link)link=d;else break;}catch{break;}} link=link.replace(/[\r\n\t ]+/g,''); try{const u=new URL(link);if(!/^https?:$/.test(u.protocol))throw new Error();return u.toString();}catch{throw new Error('Link verifikasi tidak valid. Tempel URL lengkap dari email.');} }
function amSucceeded(data){ if(typeof data==='string')return /(success|sukses|berhasil|verified|premium|activated|active)/i.test(data); if(!data||typeof data!=='object')return false; if(data.success===true||data.verified===true||data.activated===true)return true; const status=String(data.status??data.result??data.code??'').toLowerCase(); return ['success','ok','verified','activated','active','premium','200'].includes(status)||Boolean(data.data?.success||data.data?.verified||data.data?.activated); }
function amDetail(data){ if(typeof data==='string')return data; return data?.message||data?.error||data?.detail||data?.result||''; }
function amShowStep(step){ const s1=$("amStep1"),s2=$("amStep2"),p1=$("amProg1"),p2=$("amProg2"); if(!s1||!s2)return; const second=step===2; s1.hidden=second; s2.hidden=!second; p1?.classList.toggle("active",!second);p1?.classList.toggle("done",second);p2?.classList.toggle("active",second); if(second) setTimeout(()=>$("amVerify")?.focus(),120); }


/* =========================
   DAILY GLOBAL-QUOTA CLIENT
   NOTE: GitHub Pages is static, so this version stores the daily quota
   in this browser. A truly shared quota across every visitor requires
   a server/database endpoint.
========================= */
const COMIC_QUOTA_KEY = 'comic_tools_daily_quota_v2';
const COMIC_QUOTA_LIMITS = {
  amgenerator: 15,
  nik: 30,
  ipchecker: 30,
  tempmail: 30
};

function comicQuotaToday(){
  const d=new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function comicQuotaRead(){
  const today=comicQuotaToday();
  let data=null;
  try{data=JSON.parse(localStorage.getItem(COMIC_QUOTA_KEY)||'null');}catch(_){}
  if(!data || data.date!==today){
    data={date:today,used:{amgenerator:0,nik:0,ipchecker:0,tempmail:0}};
    try{localStorage.setItem(COMIC_QUOTA_KEY,JSON.stringify(data));}catch(_){}
  }
  for(const k of Object.keys(COMIC_QUOTA_LIMITS)){
    if(typeof data.used[k]!=='number') data.used[k]=0;
  }
  return data;
}
function comicQuotaLeft(tool){
  const d=comicQuotaRead();
  return Math.max(0,(COMIC_QUOTA_LIMITS[tool]||0)-Number(d.used[tool]||0));
}
function comicQuotaMessage(tool){
  const names={
    amgenerator:'AM Generator',
    nik:'NIK Check',
    ipchecker:'IP Checker',
    tempmail:'Temp Mail'
  };
  const name=names[tool]||tool;
  return `Quota global ${name} telah habis, silahkan tunggu besok untuk menggunakan tools ${name} lagi.`;
}
function comicQuotaTryReserve(tool){
  if(!COMIC_QUOTA_LIMITS[tool]) return true;
  const d=comicQuotaRead();
  const used=Number(d.used[tool]||0);
  const max=COMIC_QUOTA_LIMITS[tool];
  if(used>=max) return false;
  d.used[tool]=used+1;
  try{localStorage.setItem(COMIC_QUOTA_KEY,JSON.stringify(d));}catch(_){}
  return true;
}
function comicQuotaRefund(tool){
  if(!COMIC_QUOTA_LIMITS[tool]) return;
  const d=comicQuotaRead();
  d.used[tool]=Math.max(0,Number(d.used[tool]||0)-1);
  try{localStorage.setItem(COMIC_QUOTA_KEY,JSON.stringify(d));}catch(_){}
}
function comicQuotaBadge(tool){
  if(!COMIC_QUOTA_LIMITS[tool]) return '';
  return `<div class="comicQuotaBadge">QUOTA HARI INI: <b>${comicQuotaLeft(tool)}</b> / ${COMIC_QUOTA_LIMITS[tool]}<small>REFILL OTOMATIS 00:00</small></div>`;
}
function comicQuotaError(tool){
  const msg=comicQuotaMessage(tool);
  const name=({amgenerator:'AM Generator',nik:'NIK Check',ipchecker:'IP Checker',tempmail:'Temp Mail'})[tool]||tool;
  return `<div class="quotaError"><b>🚫 QUOTA HABIS</b><p>${comicEsc(msg)}</p><small>Quota ${comicEsc(name)} akan tersedia lagi setelah pukul 00:00.</small></div>`;
}
function amWaitText(sec){ const m=Math.floor(sec/60),s=sec%60; return m>0 ? m+'m '+String(s).padStart(2,'0')+'s' : s+'s'; }
function amCooldownCountdown(btn,msg,seconds){ return Promise.resolve(); }

async function runAMRequest(){
 const emailEl=$('amEmail'),msg=$('amRequestMsg'),btn=$('amRequestBtn');
 const email=(emailEl?.value||'').trim();
 if(!email||!email.includes('@')){
   if(msg)msg.textContent='Masukkan email yang valid.';
   return;
 }
 if(!comicQuotaTryReserve('amgenerator')){
   if(msg)msg.textContent=comicQuotaMessage('amgenerator');
   return;
 }
 if(btn)btn.disabled=true;
 let reserved=true;
 try{
   btn.textContent='MENGIRIM...';
   if(msg)msg.textContent='Menghubungkan ke API...';
   let data;
   try{
     data=await amQsr('/alight/send',{email});
   }catch(e){
     const m=String(e?.message||'').match(/(\d+)\s*(?:detik|seconds?|sec)/i);
     if(/HTTP\s*429/i.test(String(e?.message||''))&&m){
       let left=Math.max(1,parseInt(m[1],10));
       while(left>0){
         btn.textContent='TUNGGU '+left+'s';
         if(msg)msg.textContent='Batas API tercapai. Tunggu '+left+' detik...';
         await new Promise(r=>setTimeout(r,1000));
         left--;
       }
       data=await amQsr('/alight/send',{email});
     }else throw e;
   }
   if(msg){
     msg.textContent='Link verifikasi sudah dikirim ke email kamu ✓';
     amShowStep(2);
   }
   reserved=false;
 }catch(e){
   if(reserved) comicQuotaRefund('amgenerator');
   if(msg)msg.textContent='Gagal: '+String(e?.message||'Request gagal.');
 }finally{
   if(btn){
     btn.disabled=false;
     btn.textContent='REQUEST ACTIVATION';
   }
 }
}

async function runAMVerify(){ const emailEl=$('amEmail'),linkEl=$('amVerify'),msg=$('amVerifyMsg'),btn=$('amVerifyBtn'); const email=(emailEl?.value||'').trim(); if(!email||!email.includes('@')){if(msg)msg.textContent='Email wajib diisi dengan benar.';emailEl?.focus();return;} let link;try{link=amNormalizeLink(linkEl?.value||'');}catch(e){if(msg)msg.textContent=e.message;linkEl?.focus();return;} btn.disabled=true;btn.textContent='MEMVERIFIKASI...';if(msg)msg.textContent='Memeriksa email dan link verifikasi...'; try{ const data=await amQsr('/alight/verify',{email,link}); if(amSucceeded(data))msg.textContent='Verifikasi berhasil, akun kamu sudah premium 🎉'; else msg.textContent='Verifikasi belum berhasil: '+(amDetail(data)||'Server belum mengonfirmasi verifikasi.'); }catch(e){msg.textContent='Gagal verifikasi: '+String(e?.message||'Request gagal.');} finally{btn.disabled=false;btn.textContent='VERIFIKASI SEKARANG';} }

function comicEsc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function comicItems(data){let x=data?.result??data?.data??data?.articles??data;if(Array.isArray(x))return x;if(x&&Array.isArray(x.articles))return x.articles;if(x&&typeof x==='object'){for(const k of Object.keys(x))if(Array.isArray(x[k]))return x[k];}return[];}
function comicVal(o,keys){for(const k of keys){if(o?.[k]!=null&&String(o[k]).trim())return o[k];}return '';}

function setTVComic(name){const input=$("tvInput");if(input){input.value=name;input.focus();}loadJadwalTVComic();}
function tvComicEsc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function tvComicVal(o,keys){for(const k of keys){if(o&&o[k]!=null&&String(o[k]).trim())return o[k];}return '';}
function tvComicTitle(o){if(typeof o==='string')return o;return tvComicVal(o,['title','judul','program','acara','name','show','program_name','event','description'])||'';}
function tvComicTime(o){if(typeof o==='string')return '';return tvComicVal(o,['time','jam','waktu','start','start_time','mulai','startTime','schedule_time','time_start','from'])||'';}
function tvComicChannel(o){return typeof o==='object'?tvComicVal(o,['channel','channel_name','tv','stasiun','station','station_name']):'';}
function tvComicLooksLikeTime(k){return /^(\d{1,2}[:.]\d{2})(\s*[-–]\s*\d{1,2}[:.]\d{2})?$/.test(String(k).trim());}
function tvComicObjectSchedule(obj){if(!obj||typeof obj!=='object'||Array.isArray(obj))return [];const out=[];for(const[k,v]of Object.entries(obj)){if(tvComicLooksLikeTime(k)&&(typeof v==='string'||typeof v==='number'))out.push({time:k,title:String(v)});else if(tvComicLooksLikeTime(k)&&v&&typeof v==='object')out.push({...v,time:tvComicTime(v)||k,title:tvComicTitle(v)});}return out;}
function tvComicExtractSchedule(node){if(!node)return [];if(Array.isArray(node)){let out=[];for(const x of node){const nested=tvComicExtractSchedule(x);if(nested.length)out.push(...nested);else if(tvComicTitle(x)||tvComicTime(x))out.push(typeof x==='object'?{...x}:{title:String(x)});}return out;}if(typeof node==='string')return [{title:node}];if(typeof node!=='object')return [];for(const k of ['jadwal','schedule','schedules','programs','program','acara','events','items','list','shows']){if(node[k]!=null){const out=tvComicExtractSchedule(node[k]);if(out.length)return out;}}const byTime=tvComicObjectSchedule(node);if(byTime.length)return byTime;if(tvComicTitle(node)||tvComicTime(node))return [{...node}];return [];}
function tvComicFindChannel(data,wanted){const q=String(wanted||'').trim().toLowerCase(),seen=new Set();const score=name=>{const n=String(name||'').toLowerCase().trim();if(!n)return -1;if(n===q)return 100;if(n.includes(q)||q.includes(n))return 80;return 0;};function walk(x){if(!x||typeof x!=='object'||seen.has(x))return null;seen.add(x);if(Array.isArray(x)){for(const item of x){if(item&&typeof item==='object'){const c=tvComicChannel(item);if(score(c)>0){const items=tvComicExtractSchedule(item);if(items.length)return {items,channel:c};}}}for(const item of x){const r=walk(item);if(r?.items?.length)return r;}return null;}for(const[k,v]of Object.entries(x)){if(score(k)>0){const items=tvComicExtractSchedule(v);if(items.length)return {items,channel:k};}if(v&&typeof v==='object'){const c=tvComicChannel(v);if(score(c)>0){const items=tvComicExtractSchedule(v);if(items.length)return {items,channel:c};}}}for(const v of Object.values(x)){const r=walk(v);if(r?.items?.length)return r;}return null;}return walk(data)||{items:[],channel:''};}
function tvComicParse(raw){if(typeof raw==='string'){try{return JSON.parse(raw);}catch{return {__text:raw};}}return raw;}
function tvComicSort(items){return [...items].sort((a,b)=>{const toMin=x=>{const m=String(tvComicTime(x)).match(/(\d{1,2})[:.](\d{2})/);return m?Number(m[1])*60+Number(m[2]):9999;};return toMin(a)-toMin(b);});}
function tvComicRender(items,tv,channel=''){const box=$("tvResult");if(!box)return;items=tvComicSort(items).filter(x=>tvComicTitle(x)||tvComicTime(x)).filter((x,i,a)=>{const key=(tvComicTime(x)+'|'+tvComicTitle(x)).toLowerCase();return a.findIndex(y=>(tvComicTime(y)+'|'+tvComicTitle(y)).toLowerCase()===key)===i;});if(!items.length){box.innerHTML='<div class="tvComicEmpty">Belum ada daftar acara untuk <b>'+tvComicEsc(tv)+'</b>.</div>';return;}const head=String(channel||tv).toUpperCase();box.innerHTML='<div class="tvComicHeadResult"><div><b>'+tvComicEsc(head)+'</b><small>Jadwal acara yang tersedia</small></div><span>'+items.length+' ACARA</span></div>'+items.map(item=>{const time=tvComicTime(item)||'--:--',title=tvComicTitle(item)||'Acara TV',meta=tvComicVal(item,['description','desc','keterangan','episode','subtitle','genre','kategori']);return '<div class="tvComicItem"><div class="tvComicTime">'+tvComicEsc(time)+'</div><div><div class="tvComicName">'+tvComicEsc(title)+'</div>'+(meta?'<div class="tvComicMeta">'+tvComicEsc(meta)+'</div>':'')+'</div></div>';}).join('');}
async function loadJadwalTVComic(){const input=$("tvInput"),box=$("tvResult"),btn=$("tvCheckBtn");const tv=(input?.value||'').trim();if(!box)return;if(!tv){box.innerHTML='<div class="tvComicError">Masukkan nama TV terlebih dahulu, contoh: RCTI.</div>';input?.focus();return;}if(btn){btn.disabled=true;btn.textContent='MEMUAT...';}box.innerHTML='<div class="tvComicLoading">📺 Memuat jadwal '+tvComicEsc(tv)+'...</div>';try{const base='https://api-yunn.vercel.app/info/jadwaltv?apikey=qsr';const urls=[base+'&tv='+encodeURIComponent(tv),base,base+'&channel='+encodeURIComponent(tv),base+'&stasiun='+encodeURIComponent(tv)];let lastErr='Jadwal tidak ditemukan.';for(const url of urls){try{const response=await fetch(url,{method:'GET',headers:{Accept:'application/json, text/plain, */*'},cache:'no-store'});const raw=await response.text();if(!response.ok){lastErr='HTTP '+response.status;continue;}const data=tvComicParse(raw);if(data?.status===false){lastErr=data?.message||data?.error||'API menolak permintaan.';continue;}let found=tvComicFindChannel(data,tv),items=found.items,channel=found.channel;if(!items.length)items=tvComicExtractSchedule(data);if(items.length){const filtered=items.filter(x=>{const c=tvComicChannel(x);return !c||c.toLowerCase()===tv.toLowerCase()||c.toLowerCase().includes(tv.toLowerCase())||tv.toLowerCase().includes(c.toLowerCase());});if(filtered.length)items=filtered;}if(items.length){tvComicRender(items,tv,channel||tv);return;}lastErr='Data jadwal kosong untuk '+tv+'.';}catch(err){lastErr=err?.message||'Request gagal.';}}throw new Error(lastErr);}catch(e){console.error('Jadwal TV API error:',e);box.innerHTML='<div class="tvComicError">Gagal memuat jadwal.<br><small>'+tvComicEsc(e?.message||'Request gagal.')+'</small></div>';}finally{if(btn){btn.disabled=false;btn.textContent='📺 LIHAT JADWAL';}}}
function initTVComic(){$("tvInput")?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();loadJadwalTVComic();}});}

function setWeatherCity(city){const input=$("weatherInput");if(input){input.value=city;input.focus();}loadWeatherComic();}
function weatherEsc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));}
function weatherPick(o,keys){if(!o||typeof o!=="object")return "";for(const k of keys){if(o[k]!==undefined&&o[k]!==null&&String(o[k]).trim()!=="")return o[k];}return "";}
function weatherWalk(data){
  if(!data||typeof data!=="object")return data;
  if(data.data&&typeof data.data==="object")return weatherWalk(data.data);
  if(data.result&&typeof data.result==="object")return weatherWalk(data.result);
  if(data.weather&&typeof data.weather==="object")return weatherWalk(data.weather);
  return data;
}
function renderWeatherResult(data,city){
  const root=weatherWalk(data)||{};
  const location=weatherPick(root,["city","kota","name","location","lokasi"])||city;
  const condition=weatherPick(root,["condition","description","desc","weather","cuaca","text","status"]);
  const temp=weatherPick(root,["temperature","temp","suhu","temperature_c","temp_c","celsius"]);
  const feels=weatherPick(root,["feels_like","feelsLike","feels","suhu_terasa","temperature_feels_like"]);
  const humidity=weatherPick(root,["humidity","kelembapan","kelembaban"]);
  const wind=weatherPick(root,["wind","wind_speed","windspeed","angin","wind_kph"]);
  const pressure=weatherPick(root,["pressure","tekanan","pressure_mb"]);
  const visibility=weatherPick(root,["visibility","jarak_pandang","vis_km"]);
  const icon=weatherPick(root,["icon","icon_url","image","thumbnail"]);
  const time=weatherPick(root,["localtime","local_time","updated","updated_at","last_updated","waktu"]);
  const cards=[
    ["🌡️","SUHU",temp], ["💧","KELEMBAPAN",humidity], ["🌬️","ANGIN",wind], ["🥵","TERASA",feels], ["⏱️","TEKANAN",pressure], ["👁️","VISIBILITAS",visibility]
  ].filter(x=>x[2]!==""&&x[2]!==null&&x[2]!==undefined);
  let extras="";
  if(!cards.length){
    const skip=new Set(["status","creator","domain","message","success"]);
    const flat=[];
    const walk=(o,prefix="")=>{if(!o||typeof o!=="object"||flat.length>=12)return;for(const [k,v] of Object.entries(o)){if(skip.has(k.toLowerCase()))continue;if(v&&typeof v==="object")walk(v,prefix?prefix+" "+k:k);else if(v!==null&&v!==undefined&&String(v).trim())flat.push([k.replace(/[_-]/g," "),String(v)]);}};
    walk(root); cards.push(...flat.slice(0,6).map(x=>["•",x[0].toUpperCase(),x[1]]));
  }
  return `<div class="weatherHero">${icon?`<img src="${weatherEsc(icon)}" alt="" onerror="this.style.display='none'">`:"<span>☀️</span>"}<div><small>CUACA SEKARANG</small><h3>${weatherEsc(location)}</h3><b>${weatherEsc(condition||"Informasi cuaca tersedia")}</b></div></div><div class="weatherGrid">${cards.map(c=>`<div><span>${c[0]}</span><small>${weatherEsc(c[1])}</small><strong>${weatherEsc(c[2])}</strong></div>`).join("")}</div>${time?`<div class="weatherTime">🕒 ${weatherEsc(time)}</div>`:""}`;
}
async function loadWeatherComic(){
 const input=$("weatherInput"),box=$("weatherResult"),btn=$("weatherCheckBtn");
 const city=(input?.value||"").trim(); if(!box)return;
 if(!city){box.innerHTML='<div class="weatherError">Masukkan nama kota terlebih dahulu.</div>';input?.focus();return;}
 if(btn){btn.disabled=true;btn.textContent="MEMUAT...";}
 box.innerHTML=`<div class="weatherLoading">☁️ Mengambil cuaca ${weatherEsc(city)}...</div>`;
 const base="https://api.azbry.com/api/search/cuaca";
 const urls=[base+"?city="+encodeURIComponent(city),base+"?q="+encodeURIComponent(city),base+"?query="+encodeURIComponent(city)];
 let last="Data cuaca tidak ditemukan.";
 try{
   for(const url of urls){
     try{
       const r=await fetchAzbry(url,{method:"GET"});
       const raw=await r.text(); let data; try{data=JSON.parse(raw);}catch(_){data=raw;}
       if(!r.ok){last="HTTP "+r.status;continue;}
       if(data&&typeof data==="object"&&data.status===false){last=data.message||data.error||last;continue;}
       if(data&&typeof data==="object"){box.innerHTML=renderWeatherResult(data,city);return;}
     }catch(e){last=e?.message||last;}
   }
   throw new Error(last);
 }catch(e){box.innerHTML='<div class="weatherError"><b>❌ CUACA GAGAL DIMUAT</b><small>'+weatherEsc(e.message||"Request gagal.")+'</small></div>';}finally{if(btn){btn.disabled=false;btn.textContent="☀️ CEK CUACA";}}
}
function initWeatherComic(){$("weatherInput")?.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();loadWeatherComic();}});}

async function loadCNNComic(){
 const el=$('cnnComicList'); if(!el)return; el.innerHTML='<div class="loading">Memuat berita CNN Indonesia...</div>';
 try{const r=await fetch('https://api-yunn.vercel.app/berita/cnn?apikey=qsr',{headers:{Accept:'application/json, text/plain, */*'},cache:'no-store'});const type=r.headers.get('content-type')||'';const data=type.includes('json')?await r.json():await r.text();if(!r.ok)throw new Error(typeof data==='string'?data:(data?.error||data?.message||`HTTP ${r.status}`));if(data?.status===false)throw new Error(data?.error||'API berita menolak permintaan.');let items=comicItems(typeof data==='string'?JSON.parse(data):data).slice(0,15);if(!items.length)throw new Error('Berita tidak tersedia dari API.');el.innerHTML=items.map((it,i)=>{const title=comicVal(it,['title','judul','name'])||`Berita ${i+1}`;const desc=comicVal(it,['description','desc','summary','content','isi']);const image=comicVal(it,['image','thumbnail','thumb','image_url','urlToImage','gambar']);const link=comicVal(it,['url','link','href']);const date=comicVal(it,['publishedAt','published_at','date','tanggal','time']);const cat=comicVal(it,['category','kategori','channel'])||'CNN Indonesia';const inner=`${image?`<img class="newsComicImg" src="${comicEsc(image)}" alt="" loading="lazy" onerror="this.style.display='none'">`:''}<div class="newsComicMeta">${comicEsc(cat)}${date?' • '+comicEsc(date):''}</div><h3>${comicEsc(title)}</h3>${desc?`<p>${comicEsc(String(desc).replace(/<[^>]*>/g,'').slice(0,180))}${String(desc).length>180?'…':''}</p>`:''}`;return link?`<a class="newsComicCard" href="${comicEsc(link)}" target="_blank" rel="noopener noreferrer">${inner}</a>`:`<article class="newsComicCard">${inner}</article>`;}).join('');}catch(e){el.innerHTML=`<div class="errorMsg">Gagal memuat berita.<br>${comicEsc(e?.message||'Request gagal.')}</div>`;}}
function setNabiComic(name){const i=$('nabiComicInput');if(i){i.value=name;loadKisahNabiComic();}}
const NABI_COMIC_STORIES={
 Adam:{title:'Nabi Adam AS',text:'Nabi Adam AS adalah manusia pertama dan nabi pertama. Allah SWT menciptakan beliau dan menjadikannya awal dari keturunan manusia. Adam AS kemudian ditempatkan di surga bersama Hawa dan mendapatkan banyak kenikmatan. Allah SWT memberikan petunjuk agar keduanya tidak mendekati pohon yang telah dilarang. Namun setelah mendapat godaan, keduanya melakukan kesalahan dan akhirnya turun ke bumi. Adam AS tidak terus-menerus membenarkan kesalahannya. Beliau memohon ampun dan bertaubat kepada Allah SWT, lalu Allah menerima taubatnya. Setelah berada di bumi, Adam AS menjalani kehidupan sebagai manusia pertama sekaligus nabi yang mengajarkan keluarganya untuk taat kepada Allah. Beliau menjadi awal dari perjalanan manusia di bumi dan mengajarkan keluarganya untuk mengenal petunjuk Allah serta menjaga ketaatan. Dari kisah ini kita belajar bahwa manusia dapat melakukan kesalahan, tetapi kesalahan tidak boleh membuat seseorang berhenti kembali kepada Allah. Pintu taubat dan ampunan Allah tetap terbuka bagi orang yang sungguh-sungguh menyesal dan memperbaiki diri. Kisah Nabi Adam AS juga mengajarkan pentingnya menaati perintah Allah, berhati-hati terhadap godaan, mengakui kesalahan, tidak mencari-cari alasan untuk membenarkan kesalahan, dan tidak berputus asa dari rahmat Allah. Kisah beliau menjadi pengingat bahwa kehidupan manusia di bumi adalah tempat menjalankan amanah dan berusaha mengikuti petunjuk Allah.'},
 Nuh:{title:'Nabi Nuh AS',text:'Nabi Nuh AS diutus kepada kaumnya ketika banyak manusia telah jauh dari ajaran tauhid. Beliau mengajak mereka menyembah Allah SWT dan meninggalkan kesyirikan. Dakwah Nabi Nuh AS berlangsung sangat lama, tetapi tidak semua orang mau menerima nasihatnya. Banyak yang menolak bahkan mengejek beliau. Meski demikian, Nabi Nuh AS tetap menjalankan tugasnya dan tidak berhenti menyampaikan kebenaran. Keteguhan beliau menunjukkan bahwa seorang yang menyampaikan kebenaran tidak boleh berhenti hanya karena banyak orang menolak. Allah SWT kemudian memerintahkan Nabi Nuh AS membuat sebuah kapal sebagai persiapan menghadapi banjir besar. Beliau membuat kapal sesuai petunjuk Allah, sementara orang-orang yang ingkar terus mengejeknya. Ketika banjir datang, Nabi Nuh AS membawa orang-orang beriman dan makhluk yang diperintahkan Allah untuk diselamatkan. Mereka yang tetap menolak kebenaran akhirnya menghadapi akibat dari pilihannya. Setelah air surut, Nabi Nuh AS dan orang-orang beriman melanjutkan kehidupan. Kisah ini memperlihatkan panjangnya kesabaran seorang nabi dalam berdakwah dan pentingnya tetap teguh ketika menghadapi ejekan. Nabi Nuh AS tidak mengukur keberhasilan hanya dari banyaknya orang yang mengikuti, tetapi tetap menjalankan amanah yang diberikan kepadanya. Kisah ini mengajarkan kesabaran dalam berdakwah, keteguhan ketika menghadapi penolakan, pentingnya mengikuti petunjuk Allah, dan keyakinan bahwa pertolongan Allah datang pada waktu yang telah ditentukan.'},
 Ibrahim:{title:'Nabi Ibrahim AS',text:'Nabi Ibrahim AS dikenal sebagai salah satu nabi yang sangat kuat dalam mempertahankan tauhid. Sejak muda, beliau menolak penyembahan kepada berhala dan mempertanyakan keyakinan kaumnya yang menyembah sesuatu yang tidak dapat memberi manfaat maupun mudarat. Ibrahim AS berdakwah dengan hujah yang kuat dan mengajak manusia hanya menyembah Allah SWT. Karena keteguhannya, beliau menghadapi penentangan yang berat dari kaumnya. Ibrahim AS tetap tidak menyerah dan tidak meninggalkan keyakinannya. Beliau berani mempertahankan tauhid walaupun harus menghadapi tekanan dan permusuhan dari orang-orang yang menolak dakwahnya. Ibrahim AS juga diuji dengan berbagai perintah yang membutuhkan ketaatan luar biasa. Ketika diperintahkan menjalankan ujian besar bersama putranya, beliau menunjukkan bahwa ketaatan kepada Allah berada di atas segala sesuatu. Bersama Ismail AS, beliau juga membangun Ka\'bah sebagai tempat ibadah kepada Allah. Semua ujian tersebut menjadi bagian dari perjalanan Ibrahim AS dalam menunjukkan keikhlasan dan keteguhan iman. Kisah Nabi Ibrahim AS mengajarkan keberanian mempertahankan kebenaran, keteguhan tauhid, keikhlasan dalam menjalankan perintah Allah, kesabaran menghadapi ujian, serta kesediaan mendahulukan ketaatan kepada Allah di atas kepentingan pribadi. Kisah beliau juga mengingatkan bahwa mempertahankan keyakinan membutuhkan keberanian, kesabaran, dan kepercayaan penuh kepada Allah.'},
 Musa:{title:'Nabi Musa AS',text:'Nabi Musa AS diutus oleh Allah SWT untuk menyampaikan dakwah kepada Fir\'aun dan menyelamatkan Bani Israil dari penindasan. Musa AS mendapat dukungan dari saudaranya, Harun AS, dalam menjalankan tugas tersebut. Di hadapan Fir\'aun, Musa AS menyampaikan bahwa hanya Allah yang berhak disembah. Fir\'aun menolak dan menunjukkan kesombongannya, tetapi Allah memberikan berbagai mukjizat kepada Musa AS sebagai tanda kekuasaan-Nya. Ketika Bani Israil meninggalkan Mesir, mereka menghadapi pengejaran pasukan Fir\'aun. Dalam keadaan yang tampak sulit, Allah memberikan jalan keluar dan menyelamatkan Musa AS beserta orang-orang beriman. Fir\'aun dan pasukannya akhirnya tenggelam. Perjalanan Musa AS kemudian dipenuhi berbagai ujian dalam membimbing Bani Israil. Beliau harus menghadapi keluhan, ketakutan, dan ketidaktaatan kaumnya, tetapi tetap menjalankan amanah. Perjalanan tersebut menunjukkan bahwa menjadi seorang pemimpin dan pembimbing bukanlah tugas yang ringan. Musa AS tetap berusaha membimbing kaumnya meskipun menghadapi banyak tantangan. Kisah ini mengajarkan keberanian menghadapi kezaliman, kesabaran memimpin, tawakal kepada Allah ketika keadaan terasa mustahil, serta keyakinan bahwa pertolongan Allah dapat datang dari arah yang tidak disangka-sangka. Kisah Nabi Musa AS juga mengingatkan agar manusia tidak menyerah ketika menghadapi tekanan dan tetap berpegang pada petunjuk Allah ketika berada dalam keadaan sulit.'},
 Muhammad:{title:'Nabi Muhammad SAW',text:'Nabi Muhammad SAW adalah rasul terakhir yang diutus Allah SWT untuk menyampaikan risalah Islam kepada seluruh manusia. Beliau dikenal memiliki akhlak yang mulia, jujur, amanah, penyayang, dan sabar. Setelah menerima wahyu pertama, beliau mulai mengajak manusia menyembah Allah SWT dan meninggalkan kesyirikan serta kebiasaan buruk. Dakwah di Makkah menghadapi penolakan dan berbagai tekanan, tetapi Rasulullah SAW tetap teguh menyampaikan kebenaran. Beliau tidak berhenti mengajarkan tauhid dan memperbaiki akhlak meskipun menghadapi tantangan yang berat. Setelah hijrah ke Madinah, beliau membangun masyarakat yang berlandaskan iman, persaudaraan, keadilan, dan akhlak. Rasulullah SAW juga menghadapi berbagai ujian dan peperangan, namun beliau tetap mengajarkan kesabaran, kasih sayang, dan sikap memaafkan. Dalam kehidupan sehari-hari, beliau memberi teladan tentang menghormati orang lain, membantu yang lemah, menjaga amanah, serta berbuat baik kepada keluarga dan masyarakat. Rasulullah SAW juga mengajarkan umatnya untuk tidak sombong, menjaga lisan, menolong sesama, dan selalu kembali kepada Allah. Perjalanan dakwah beliau menunjukkan keteguhan dalam menyampaikan kebenaran sekaligus kelembutan dalam memperlakukan manusia. Kisah Nabi Muhammad SAW mengajarkan bahwa keberhasilan dakwah tidak hanya melalui perkataan, tetapi juga melalui akhlak dan keteladanan. Beliau adalah teladan bagi umat Islam dalam beribadah, bermuamalah, menghadapi ujian, menjaga amanah, dan menjalani kehidupan dengan penuh tanggung jawab. Kisah beliau juga menjadi pengingat agar umatnya berusaha menerapkan ajaran Islam dalam kehidupan sehari-hari melalui ibadah, akhlak yang baik, kepedulian kepada sesama, dan keteguhan ketika menghadapi ujian.'},
};
function loadKisahNabiComic(){const input=$('nabiComicInput'),out=$('nabiComicResult');if(!out)return;const name=(input?.value||'').trim();if(!name){out.innerHTML='<div class="errorMsg">Masukkan nama nabi terlebih dahulu.</div>';return;}const key=Object.keys(NABI_COMIC_STORIES).find(k=>k.toLowerCase()===name.toLowerCase());if(!key){out.innerHTML='<div class="errorMsg">Kisah untuk nama tersebut belum tersedia. Pilih salah satu nabi di atas.</div>';return;}const d=NABI_COMIC_STORIES[key];out.innerHTML=`<div class="nabiComicTitle">🕌 ${comicEsc(d.title)}</div><p>${comicEsc(d.text)}</p>`;}
async function loadGempaComic(){const el=$('gempaComicContent');if(!el)return;el.innerHTML='<div class="loading">Mengambil data terbaru BMKG...</div>';try{const r=await fetch('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json',{cache:'no-store'});if(!r.ok)throw new Error('HTTP '+r.status);const j=await r.json();const d=j.result||j.data||j;let g=d?.Infogempa?.gempa||d?.gempa||d?.Infogempa||d;if(Array.isArray(g))g=g[0];if(!g||typeof g!=='object')throw new Error('Data gempa tidak ditemukan');const v=(...keys)=>{for(const k of keys)if(g?.[k]!=null&&g[k]!=='')return g[k];return '-';};const waktu=(v('Tanggal','tanggal')!=='-'&&v('Jam','jam')!=='-')?`${v('Tanggal','tanggal')} • ${v('Jam','jam')}`:v('DateTime','Waktu','datetime');el.innerHTML=`<div class="gempaComicCard"><div class="gempaComicHead"><span>🌋 INFOGEMPA</span><b>M ${comicEsc(v('Magnitude','magnitude','Mag','mag'))}</b></div><div class="gempaComicLocation"><small>📍 LOKASI GEMPA</small><strong>${comicEsc(v('Wilayah','wilayah','Lokasi','lokasi'))}</strong></div><div class="gempaComicGrid"><div><small>WAKTU</small><b>${comicEsc(waktu)}</b></div><div><small>KEDALAMAN</small><b>${comicEsc(v('Kedalaman','kedalaman','Depth','depth'))}</b></div><div><small>LINTANG</small><b>${comicEsc(v('Lintang','lintang'))}</b></div><div><small>BUJUR</small><b>${comicEsc(v('Bujur','bujur'))}</b></div></div><div class="gempaComicNote">${comicEsc(v('Potensi','potensi'))}</div></div>`;}catch(e){el.innerHTML=`<div class="errorMsg">Gagal mengambil data gempa.<br>${comicEsc(e?.message||'Request gagal.')}</div>`;}}

async function runTikTok(input){
 const out=$("toolResult");
 const url=String(input||"").trim();
 if(!/^https?:\/\//i.test(url)){out.textContent="Masukkan link TikTok yang valid (http/https).";return;}
 out.innerHTML='<div class="loading">Memproses video TikTok…</div>';
 const encoded=encodeURIComponent(url);
 // Prioritaskan endpoint yang memang mengembalikan video. Endpoint lama /tiktok
 // tetap dipakai sebagai fallback karena respons upstream bisa berubah.
 const endpoints=[
  'https://api.azbry.com/api/download/tiktokv2?url='+encoded,
  'https://api.azbry.com/api/download/allinonev2?url='+encoded+'&format=mp4',
  'https://api.azbry.com/api/download/tiktok?url='+encoded,
  'https://api.azbry.com/api/download/allinone?url='+encoded
 ];
 let lastError="API tidak merespons.";
 for(const endpoint of endpoints){
  try{
   const r=await fetchAzbry(endpoint,{method:'GET',accept:'application/json, video/mp4, text/plain, */*'});
   const type=(r.headers.get('content-type')||'').toLowerCase();
   if(!r.ok){
    let msg='API '+r.status;
    try{const t=await r.text(); if(t) msg+=' — '+t.slice(0,180);}catch(_){ }
    lastError=msg; continue;
   }
   if(type.includes('video/')){
    const blob=await r.blob();
    const objectUrl=URL.createObjectURL(blob);
    showTikTokLinks([objectUrl],true);
    return;
   }
   if(type.includes('json')){
    const data=await r.json();
    const links=findTikTokLinks(data);
    if(links.length){showTikTokLinks(links);return;}
    lastError=extractApiError(data)||'URL video tidak ditemukan dari response API.';
    continue;
   }
   // Be tolerant of APIs that return a raw URL or JSON with a non-standard content-type.
   const raw=(await r.text()).trim();
   if(/^https?:\/\//i.test(raw)){
    showTikTokLinks([raw]);
    return;
   }
   try{
    const data=JSON.parse(raw);
    const links=findTikTokLinks(data);
    if(links.length){showTikTokLinks(links);return;}
    lastError=extractApiError(data)||'URL video tidak ditemukan dari response API.';
   }catch(_){
    lastError='Response API bukan JSON/video yang dapat dipakai.';
   }
  }catch(e){lastError=e?.message||String(e);}
 }
 out.innerHTML='<div class="errorMsg">Gagal memproses TikTok.<br><small>'+escapeHtml(lastError)+'</small><br><a href="'+escapeHtml(url)+'" target="_blank" rel="noopener">Buka TikTok asli</a></div>';
}
async function runFakeFF(input){
 const out=$("toolResult");
 const name=input.trim();
 if(!name){out.textContent="Masukkan nama terlebih dahulu.";return;}
 out.innerHTML='<div class="loading">Membuat Fake FF…</div>';
 const endpoint='https://api.azbry.com/api/maker/fakeff?name='+encodeURIComponent(name);
 try{
   const r=await fetchAzbry(endpoint,{method:'GET'});
   if(!r.ok) throw new Error(`API ${r.status}`);
   const type=(r.headers.get('content-type')||'').toLowerCase();
   let data;
   if(type.includes('json')) data=await r.json();
   else {
     const blob=await r.blob();
     const u=URL.createObjectURL(blob);
     showFakeFFPreview(u, 'fakeff.png');
     return;
   }
   const links=findMediaLinks(data);
   if(!links.length) throw new Error('URL gambar tidak ditemukan dari response API.');
   showFakeFFPreview(links[0], 'fakeff.png');
 }catch(e){
   out.innerHTML=`<div class="errorMsg">Gagal memproses: ${escapeHtml(e.message||String(e))}</div>`;
 }
}
function showFakeFFPreview(url,name){
 const out=$("toolResult");
 out.innerHTML=`<img id="fakeFFResultImg" class="mediaPreview imagePreview" src="${escapeHtml(url)}" alt="Fake FF hasil" loading="lazy"><a class="downloadBtn" href="${escapeHtml(url)}" download="${name}" target="_blank" rel="noopener">⬇ DOWNLOAD GAMBAR</a><div class="hint" style="margin-top:12px;text-align:center">Tekan button download untuk mengunduh gambar (auto download gambar)</div>`;
 const im=$("fakeFFResultImg");
 if(im) setImageWithRelayFallback(im,url);
}
async function runInstagram(input){
 const out=$("toolResult");
 if(!/^https?:\/\//i.test(input)){out.textContent="Masukkan link Instagram yang valid (http/https).";return;}
 out.innerHTML='<div class="loading">Memproses media Instagram…</div>';
 const endpoint='https://api.azbry.com/api/download/instagram?url='+encodeURIComponent(input);
 try{
   const r=await fetchAzbry(endpoint,{method:'GET'});
   if(!r.ok) throw new Error(`API ${r.status}`);
   const type=(r.headers.get('content-type')||'').toLowerCase();
   if(!type.includes('json')) throw new Error('Response API bukan JSON.');
   const data=await r.json();
   const links=findMediaLinks(data);
   if(!links.length) throw new Error('Link media tidak ditemukan dari response API.');
   showInstagramMedia(links);
 }catch(e){
   out.innerHTML=`<div class="errorMsg">Gagal memproses: ${escapeHtml(e.message||String(e))}</div>`;
 }
}
function findMediaLinks(value){
 const found=[]; const seen=new Set();
 function add(v){
   if(typeof v!=="string" || !/^https?:\/\//i.test(v)) return;
   if(!seen.has(v)){seen.add(v);found.push(v);}
 }
 // URL media Instagram dari Azbry bisa berupa URL bertoken tanpa ekstensi .mp4.
 // Prioritaskan field videos/images/links agar URL seperti dl.snapcdn.app/get?... tetap terbaca.
 if(value && typeof value === "object"){
   const preferred=[value.videos,value.video,value.images,value.image,value.links];
   preferred.forEach(list=>{
     if(Array.isArray(list)) list.forEach(v=>{
       if(typeof v === "string") add(v);
       else if(v && typeof v === "object") Object.values(v).forEach(x=>add(x));
     });
     else if(typeof list === "string") add(list);
   });
 }
 if(!found.length){
   function walk(v){
     if(typeof v==="string"){add(v);return;}
     if(Array.isArray(v)){v.forEach(walk);return;}
     if(v && typeof v==="object")Object.values(v).forEach(walk);
   }
   walk(value);
 }
 return found;
}
function showInstagramMedia(links){
 const out=$("toolResult");
 const first=links[0];
 // Tidak menampilkan preview. Langsung sediakan tombol menuju URL media hasil API.
 const isVideo=/\.(mp4|webm|mov)(?:[?#]|$)/i.test(first) || /snapcdn\.app\/get/i.test(first);
 if(isVideo){
   out.innerHTML=`<a class="downloadBtn" href="${escapeHtml(first)}" download target="_blank" rel="noopener">⬇ DOWNLOAD VIDEO</a><div class="hint" style="margin-top:12px;text-align:center">Tekan button download untuk mengunduh video (auto download video)</div>`;
 }else{
   out.innerHTML=`<a class="downloadBtn" href="${escapeHtml(first)}" download target="_blank" rel="noopener">⬇ DOWNLOAD GAMBAR</a><div class="hint" style="margin-top:12px;text-align:center">Tekan button download untuk mengunduh gambar (auto download gambar)</div>`;
 }
}
function extractApiError(value){
 if(typeof value==='string') return value.trim();
 if(!value||typeof value!=='object') return '';
 for(const k of ['message','error','msg','detail','status']){
  const v=value[k];
  if(typeof v==='string'&&v.trim()) return v.trim();
 }
 return '';
}
function findTikTokLinks(value){
 const candidates=[];
 const seen=new Set();
 const audioRe=/(^|[._\-/])(mp3|m4a|aac|wav|ogg)(?:[?#]|$)/i;
 const audioKeyRe=/(^|[._\[\]\s])(audio|music|sound|song)(?:$|[._\[\]\s])/i;
 const videoKeyRe=/(video|download|play|no[_-]?watermark|nowatermark|hd|mp4|media)/i;
 const add=(v,path='',boost=0)=>{
  if(typeof v!=='string' || !/^https?:\/\//i.test(v)) return;
  if(audioRe.test(v) || audioKeyRe.test(path)) return;
  if(seen.has(v)) return;
  let score=boost;
  if(/\.mp4(?:[?#]|$)/i.test(v)) score+=120;
  else if(/\.m3u8(?:[?#]|$)/i.test(v)) score+=80;
  if(videoKeyRe.test(path)) score+=45;
  if(/snapcdn|tiktok|ttcdn|video/i.test(v)) score+=5;
  candidates.push({url:v,score});
  seen.add(v);
 };
 const walk=(v,path='',boost=0)=>{
  if(typeof v==='string'){add(v,path,boost);return;}
  if(Array.isArray(v)){v.forEach((x,i)=>walk(x,path+'['+i+']',boost));return;}
  if(v&&typeof v==='object'){
   const type=typeof v.type==='string'?v.type.toLowerCase():'';
   const localBoost=/video|mp4/i.test(type)?80:(/audio|music/i.test(type)?-100:0);
   Object.entries(v).forEach(([k,x])=>{
    const next=path?path+'.'+k:k;
    const keyBoost=videoKeyRe.test(k)?35:(audioKeyRe.test(k)?-100:0);
    walk(x,next,boost+localBoost+keyBoost);
   });
  }
 };
 walk(value);
 candidates.sort((a,b)=>b.score-a.score);
 // MP4 video is the preferred result; HLS is retained as a last-resort preview source.
 return candidates.map(x=>x.url).filter((v,i,a)=>a.indexOf(v)===i);
}
function showTikTokLinks(links,objectUrl=false){
 const out=$("toolResult");
 const usable=[...new Set((links||[]).filter(Boolean))];
 if(!usable.length){out.innerHTML='<div class="errorMsg">Video TikTok tidak ditemukan.</div>';return;}
 out.innerHTML='';
 const wrap=document.createElement("div");
 wrap.className="tiktokPreviewWrap";
 const video=document.createElement("video");
 video.className="mediaPreview tiktokVideo";
 video.controls=true;
 video.playsInline=true;
 video.preload="metadata";
 video.setAttribute("aria-label","Preview video TikTok");
 const status=document.createElement("div");
 status.className="hint tiktokStatus";
 status.textContent="Memuat preview video…";
 const buttons=document.createElement("div");
 buttons.className="mediaBtns";
 let index=0;
 let failed=false;
 let currentSrc='';
 const tryNext=()=>{
  if(index>=usable.length){
   failed=true;
   status.innerHTML='Preview video tidak bisa diputar. <a href="'+escapeHtml(usable[0])+ '" target="_blank" rel="noopener">Buka video</a>';
   return;
  }
  failed=false;
  currentSrc=usable[index++];
  video.src=currentSrc;
  video.load();
 };
 video.addEventListener("loadedmetadata",()=>{
  // Beberapa API mengembalikan audio-only URL. Jangan tampilkan itu sebagai preview.
  if(video.videoWidth===0 || video.videoHeight===0){
   tryNext();
   return;
  }
  status.textContent="Preview video siap — tekan ▶ untuk memutar.";
  video.classList.add("loaded");
  buttons.innerHTML='';
  const dl=document.createElement("a");
  dl.className="downloadBtn";
  dl.href=currentSrc;
  dl.download="tiktok-video.mp4";
  dl.target="_blank";
  dl.rel="noopener";
  dl.textContent="⬇ DOWNLOAD VIDEO";
  buttons.appendChild(dl);
 });
 video.addEventListener("canplay",()=>{
  if(video.videoWidth>0 && video.videoHeight>0) status.textContent="Preview video siap — tekan ▶ untuk memutar.";
 });
 video.addEventListener("error",()=>{if(!failed)tryNext();});
 wrap.appendChild(video);
 wrap.appendChild(status);
 wrap.appendChild(buttons);
 out.appendChild(wrap);
 tryNext();
}
async function runQuotesMaker(text){
 const out=$("toolResult");
 const author=$("quoteAuthor")?.value.trim()||"Seseorang";
 if(!text.trim()){out.textContent="Masukkan text quotes terlebih dahulu.";return;}
 out.innerHTML='<div class="loading">Membuat quotes…</div>';
 const api='https://api.azbry.com/api/maker/quotesmaker?text='+encodeURIComponent(text.trim())+'&author='+encodeURIComponent(author);
 const img=document.createElement("img");
 img.className="mediaPreview imagePreview";
 img.alt="Hasil Quotes Maker";
 img.loading="eager";
 img.onload=()=>{
  out.innerHTML="";
  out.appendChild(img);
  const box=document.createElement("div");
  box.innerHTML=`<a class="downloadBtn" href="${escapeHtml(api)}" download="quotes-maker.png" target="_blank" rel="noopener">⬇ DOWNLOAD GAMBAR</a><div class="hint" style="margin-top:12px;text-align:center">Tekan button download untuk mengunduh gambar (auto download gambar)</div>`;
  out.appendChild(box);
 };
 img.onerror=()=>{out.innerHTML='<div class="errorMsg">Gagal membuat quotes dari API.</div>';};
 setImageWithRelayFallback(img,api);
}


async function runIGC(){
 const out=$("toolResult");
 const profile=$("igcProfile")?.value.trim();
 const name=$("igcName")?.value.trim();
 const participants=$("igcParticipants")?.value.trim()||"10";
 if(!profile){out.textContent="Masukkan link foto profil grup terlebih dahulu.";return;}
 if(!/^https?:\/\//i.test(profile)){out.textContent="Link profil harus berupa URL http/https yang valid.";return;}
 if(!name){out.textContent="Masukkan nama grup terlebih dahulu.";return;}
 out.innerHTML='<div class="loading">Membuat iPhone Group Chat…</div>';
 try{
   const api='https://api.azbry.com/api/maker/igc?profile='+encodeURIComponent(profile)+'&nama='+encodeURIComponent(name)+'&peserta='+encodeURIComponent(participants);
   const img=document.createElement("img");
   img.className="mediaPreview imagePreview";
   img.alt="Hasil iPhone Group Chat Generator";
   img.loading="eager";
   img.onload=()=>{
     out.innerHTML="";
     out.appendChild(img);
     const box=document.createElement("div");
     box.innerHTML=`<a class="downloadBtn" href="${escapeHtml(api)}" download="iphone-group-chat.png" target="_blank" rel="noopener">⬇ DOWNLOAD GAMBAR</a><div class="hint" style="margin-top:12px;text-align:center">Tekan button download untuk mengunduh gambar (auto download gambar)</div>`;
     out.appendChild(box);
   };
   img.onerror=()=>{out.innerHTML='<div class="errorMsg">Gagal membuat iPhone Group Chat dari API. Pastikan link foto profil bisa diakses publik.</div>';};
   setImageWithRelayFallback(img,api);
 }catch(e){out.innerHTML=`<div class="errorMsg">Gagal memproses: ${escapeHtml(e.message||String(e))}</div>`;}
}
/* === TEMP MAIL / TEMPMailPortal === */
const TEMPPMAIL_API = 'https://api.tempmailportal.com';
let tempMailAddress = '';
let tempMailToken = '';
let tempMailAutoRefresh = null;

function tempMailSafe(v){return String(v??'').replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[s]));}
function setTempStatus(t){const e=document.getElementById('tempMailStatus');if(e)e.textContent=t||'';}
function setTempBusy(id,busy,label){const b=document.getElementById(id);if(!b)return;b.disabled=busy;if(busy){b.dataset.oldText=b.innerHTML;b.innerHTML='<span class="tm-spin">↻</span> '+label;}else if(b.dataset.oldText){b.innerHTML=b.dataset.oldText;}}
function tempMailRandom(len=10){const chars='abcdefghijklmnopqrstuvwxyz0123456789';let out='';for(let i=0;i<len;i++)out+=chars[Math.floor(Math.random()*chars.length)];return out;}
function tempMailRenderEmpty(title='Inbox kosong',sub='Belum ada pesan masuk. Tekan Refresh Inbox untuk mengecek lagi.'){const l=document.getElementById('tempInboxList');if(l)l.innerHTML=`<div class="tempmail-empty"><div>⌁</div><b>${tempMailSafe(title)}</b><small>${tempMailSafe(sub)}</small></div>`;}
function tempMailFormatDate(v){if(!v)return '';try{return new Date(v).toLocaleString('id-ID',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});}catch{return String(v)}}
async function tempPortalFetch(url,opts={}){
  const r=await fetch(url,{...opts,headers:{Accept:'application/json',...(opts.headers||{})},cache:'no-store'});
  let j=null;try{j=await r.json();}catch{}
  if(!r.ok) throw new Error(j?.error||j?.detail||j?.message||`HTTP ${r.status}`);
  return j;
}
async function createTempEmail(){
  if(!comicQuotaTryReserve('tempmail')){setTempStatus(comicQuotaMessage('tempmail'));return;}
  let quotaCounted=true;
  clearInterval(tempMailAutoRefresh);tempMailAutoRefresh=null;
  setTempBusy('tempCreateBtn',true,'Membuat...');setTempStatus('Membuat inbox aman...');
  try{
    const j=await tempPortalFetch(TEMPPMAIL_API+'/api/inbox',{method:'POST'});
    if(!j?.address||!j?.token)throw new Error('Respons server tidak lengkap.');
    tempMailAddress=j.address;tempMailToken=j.token;
    const emailEl=document.getElementById('tempEmailAddress');if(emailEl)emailEl.textContent=tempMailAddress;
    const copyBtn=document.getElementById('tempCopyBtn');if(copyBtn)copyBtn.disabled=false;
    document.getElementById('tempInboxCount').textContent='0 pesan';
    tempMailRenderEmpty('Inbox siap','Alamat aktif. Menunggu pesan masuk...');
    setTempStatus('Email aktif ✓ • Tekan Refresh atau tunggu otomatis.');
    await checkTempInbox(true);
    quotaCounted=false;
    tempMailAutoRefresh=setInterval(()=>{if(tempMailToken)checkTempInbox(true)},10000);
  }catch(e){
    if(quotaCounted)comicQuotaRefund('tempmail');
    tempMailAddress='';tempMailToken='';
    const emailEl=document.getElementById('tempEmailAddress');if(emailEl)emailEl.textContent='Gagal membuat email';
    setTempStatus('Gagal membuat email: '+(e?.message||'Request gagal.'));
    console.error('TempMailPortal create:',e);
  }finally{setTempBusy('tempCreateBtn',false);}
}
async function checkTempInbox(silent=false){
  if(!tempMailToken){if(!silent)setTempStatus('Buat email terlebih dahulu.');return;}
  if(!silent)setTempBusy('tempInboxBtn',true,'Refresh...');
  try{
    const mails=await tempPortalFetch(TEMPPMAIL_API+'/api/messages',{headers:{Authorization:'Bearer '+tempMailToken}});
    const list=Array.isArray(mails)?mails:[];
    const count=document.getElementById('tempInboxCount');if(count)count.textContent=`${list.length} pesan`;
    const box=document.getElementById('tempInboxList');
    if(!list.length){tempMailRenderEmpty('Belum ada pesan','Inbox kosong. Coba Refresh lagi setelah pesan dikirim.');}
    else if(box){
      box.innerHTML=list.map(m=>{
        const from=m?.fromName?`${m.fromName} <${m.from||''}>`:m?.from||'Pengirim tidak diketahui';
        const subject=m?.subject||'Tanpa subjek';
        const intro=m?.intro||'Klik pesan untuk melihat detail.';
        return `<button class="tempmail-mail" type="button" onclick="openTempMessage('${tempMailSafe(m?.id||'')}')"><span class="tm-mail-icon">●</span><span class="tm-mail-main"><b>${tempMailSafe(subject)}</b><small>${tempMailSafe(from)}</small><p>${tempMailSafe(intro)}</p></span><span class="tm-mail-date">${tempMailSafe(tempMailFormatDate(m?.date))}</span></button>`;
      }).join('');
    }
    if(!silent)setTempStatus(`Inbox diperbarui ✓ • ${list.length} pesan ditemukan.`);
  }catch(e){if(!silent)setTempStatus('Gagal refresh inbox: '+(e?.message||'Request gagal.'));console.error('TempMailPortal inbox:',e);}
  finally{if(!silent)setTempBusy('tempInboxBtn',false);}
}
let tempMailMessageLink = '';
let tempMailMessageCodes = [];
function tempMailMessageSource(m){
  const html=String(m?.html||m?.bodyHtml||m?.htmlBody||'');
  let text=String(m?.text||m?.intro||'');
  if(html){
    try{
      const doc=new DOMParser().parseFromString(html,'text/html');
      text += '\n' + (doc.body?.textContent||'');
    }catch{}
  }
  return text;
}
function extractTempMessageLink(m){
  const html=String(m?.html||m?.bodyHtml||m?.htmlBody||'');
  if(html){
    try{
      const doc=new DOMParser().parseFromString(html,'text/html');
      const a=[...doc.querySelectorAll('a[href]')];
      const preferred=a.find(x=>/sign in|login|verify|verification|alight/i.test((x.textContent||'')+' '+x.getAttribute('href')));
      if(preferred?.href && /^https?:\/\//i.test(preferred.href)) return preferred.href;
      const any=a.find(x=>/^https?:\/\//i.test(x.getAttribute('href')||''));
      if(any) return any.href;
    }catch{}
  }
  const text=String(m?.text||m?.intro||'');
  const match=text.match(/https?:\/\/[^\s<>'"\)]+/i);
  return match?match[0].replace(/[.,;]+$/,''):'';
}
function extractTempMessageCodes(m){
  const text=tempMailMessageSource(m);
  const found=[];
  const add=(v)=>{v=String(v||'').trim();if(v && !found.includes(v))found.push(v)};
  // Strong signal: a code/OTP/verification label followed by 4-8 digits or short alphanumeric token.
  const contextual=/(?:verification|verify|confirmation|security|otp|one[- ]?time|access|login|sign[ -]?in|activation)\s*(?:code|kode|pin)?\s*(?:is|:|=|-)?\s*([A-Z0-9]{4,8})\b/gi;
  let m1; while((m1=contextual.exec(text))!==null)add(m1[1]);
  const labelled=/(?:code|kode|otp|pin)\s*(?:is|:|=|-)?\s*([A-Z0-9]{4,8})\b/gi;
  let m2; while((m2=labelled.exec(text))!==null)add(m2[1]);
  // Numeric OTPs are common; ignore likely years and ordinary long numbers.
  const numeric=text.match(/\b\d{4,8}\b/g)||[];
  numeric.forEach(v=>{if(!/^19\d{2}$|^20\d{2}$/.test(v)) add(v);});
  // Common 6-character/8-character verification token presented on its own line.
  const lines=text.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  lines.forEach(line=>{const hit=line.match(/^([A-Z0-9]{4,8})$/i);if(hit)add(hit[1]);});
  return found.slice(0,8);
}
async function openTempMessage(id){
  if(!id||!tempMailToken)return;
  try{
    const m=await tempPortalFetch(TEMPPMAIL_API+'/api/messages/'+encodeURIComponent(id),{headers:{Authorization:'Bearer '+tempMailToken}});
    const from=m?.fromName?`${m.fromName} <${m.from||''}>`:m?.from||'Pengirim tidak diketahui';
    const text=m?.text||m?.intro||'Tidak ada isi teks.';
    const subject=m?.subject||'Tanpa subjek';
    tempMailMessageLink=extractTempMessageLink(m);
    tempMailMessageCodes=extractTempMessageCodes(m);
    const modal=document.getElementById('tempMailModal');
    const linkBox=document.getElementById('tempModalLinkBox');
    const codeBox=document.getElementById('tempModalCodeBox');
    if(modal){
      document.getElementById('tempModalSubject').textContent=subject;
      document.getElementById('tempModalFrom').textContent=from;
      document.getElementById('tempModalBody').textContent=text;
      if(linkBox){linkBox.hidden=!tempMailMessageLink;}
      const lt=document.getElementById('tempModalLinkText');if(lt)lt.textContent=tempMailMessageLink?'Link siap disalin.':'Link tidak ditemukan di isi email.';
      if(codeBox){codeBox.hidden=!tempMailMessageCodes.length;}
      const codeText=document.getElementById('tempModalCodeText');if(codeText)codeText.textContent=tempMailMessageCodes.length?`${tempMailMessageCodes.length} kode terdeteksi • tekan kode untuk menyalin.`:'Kode tidak ditemukan di isi email.';
      const codesEl=document.getElementById('tempModalCodes');
      if(codesEl){codesEl.innerHTML=tempMailMessageCodes.map((code,i)=>`<button class="tm-copy-code" type="button" data-code-index="${i}" onclick="copyTempMessageCode(${i},this)">${tempMailSafe(code)}</button>`).join('');}
      modal.classList.add('show');
    }
  }catch(e){setTempStatus('Gagal membuka pesan: '+(e?.message||'Request gagal.'));}
}
function closeTempMessage(){document.getElementById('tempMailModal')?.classList.remove('show');tempMailMessageLink='';tempMailMessageCodes=[];}
async function copyTempMessageLink(){
  if(!tempMailMessageLink){setTempStatus('Link tidak ditemukan di email.');return;}
  try{
    await navigator.clipboard.writeText(tempMailMessageLink);
    const b=document.getElementById('tempCopyLinkBtn');if(b){const old=b.textContent;b.textContent='✓ Copied';setTimeout(()=>b.textContent=old,1400);}
    setTempStatus('Link dari email berhasil disalin ✓');
  }catch(e){
    const ta=document.createElement('textarea');ta.value=tempMailMessageLink;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');setTempStatus('Link dari email berhasil disalin ✓');}catch{setTempStatus('Tidak bisa menyalin link otomatis.');}ta.remove();
  }
}
async function copyTempMessageCode(index,button){
  const code=tempMailMessageCodes?.[index];
  if(!code)return;
  try{
    await navigator.clipboard.writeText(code);
  }catch(e){
    const ta=document.createElement('textarea');ta.value=code;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch{setTempStatus('Tidak bisa menyalin kode otomatis.');}ta.remove();
  }
  if(button){const old=button.textContent;button.textContent='✓ '+code;button.classList.add('copied');setTimeout(()=>{button.textContent=old;button.classList.remove('copied')},1400);}
  setTempStatus('Kode '+code+' berhasil disalin ✓');
}
async function copyTempEmail(){
  if(!tempMailAddress){setTempStatus('Belum ada email untuk disalin.');return;}
  try{await navigator.clipboard.writeText(tempMailAddress);setTempStatus('Alamat email disalin ✓');}
  catch(e){setTempStatus('Tidak bisa menyalin otomatis.');}
}


function currentAction(){
 if(window.__pageAction)return window.__pageAction;
 const title=$("modalTitle")?.textContent||"";
 return tools.find(t=>t.name===title)?.action;
}
function clearTool(){
 const action=currentAction();
 if(action) delete toolState[action];
 const b=getToolRoot();
 if(!b)return;
 b.querySelectorAll("input, textarea, select").forEach(x=>{
  if(x.type==="file") x.value="";
  else if(x.id==="igcParticipants") x.value="10";
  else if(x.tagName==="SELECT") x.selectedIndex=0;
  else x.value="";
 });
 const result=$("toolResult");
 if(result) result.innerHTML="";
 $("qrPreview")?.replaceChildren();
}
function initDedicatedToolPage(){
 const params=new URLSearchParams(location.search);
 const action=params.get("tool");
 if(!action)return;
 const t=tools.find(x=>x.action===action);
 if(!t)return;
 window.__pageAction=action;
 document.body.classList.add("tool-page-active");
 const title=$("toolPageTitle"), icon=$("toolPageIcon"), body=$("toolPageBody");
 if(title)title.textContent=t.name;
 if(icon)icon.textContent=t.icon;
 if(body)body.innerHTML=toolUI(action);
 document.title=`${t.name} • Comic Tools`;
 initTool(action);
 restoreToolState(action);
 if(action==="quran") loadQuranComic();
 if(action==="cnn") loadCNNComic();
 if(action==="gempa") loadGempaComic();
 if(action==="jadwaltv"){ initTVComic(); const input=$("tvInput"); if(input) setTimeout(()=>input.focus(),80); }
 if(action==="cuaca"){ initWeatherComic(); const input=$("weatherInput"); if(input) setTimeout(()=>input.focus(),80); }
}

function setIPCity(value){const el=$("ipInput");if(el)el.value=value;}
function ipCell(label,value,icon="•"){const text=(value===undefined||value===null||value==="")?"-":String(value);return `<div class="ipCell"><span class="ipCellIcon">${icon}</span><div><small>${escapeHtml(label)}</small><b>${escapeHtml(text)}</b></div></div>`;}
async function loadIPCheckerComic(){
 const out=$("ipResult"),btn=$("ipCheckBtn"); if(!out)return; const raw=String($("ipInput")?.value||"").trim();
 if(!comicQuotaTryReserve('ipchecker')){out.innerHTML=comicQuotaError('ipchecker');return;}
 let quotaCounted=true;
 const ipv4=/^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)$/; const ipv6=/^[0-9a-f:]+$/i;
 if(raw&&!ipv4.test(raw)&&!ipv6.test(raw)){out.innerHTML='<div class="ipError">Masukkan alamat IPv4/IPv6 yang valid.</div>';return;}
 if(btn){btn.disabled=true;btn.textContent="⏳ MEMERIKSA...";} out.innerHTML='<div class="ipLoading">🌐 Mengambil informasi IP…</div>';
 const endpoint=raw?`https://ipapi.co/${encodeURIComponent(raw)}/json/`:`https://ipapi.co/json/`;
 try{const r=await fetch(endpoint,{headers:{Accept:"application/json"},cache:"no-store"});const data=await r.json();if(!r.ok||data.error)throw new Error(data.reason||data.detail||`API ${r.status}`);const flag=data.country_code?String(data.country_code).toUpperCase():"🌐";out.innerHTML=`<div class="ipMainCard"><div class="ipMainTop"><span class="ipFlag">${escapeHtml(flag)}</span><div><small>IP TERDETEKSI</small><h3>${escapeHtml(data.ip||raw||"-")}</h3><p>${escapeHtml(data.country_name||data.country||"Lokasi tidak tersedia")}</p></div></div><div class="ipGrid">${ipCell("KOTA",data.city,"🏙️")}${ipCell("REGION",data.region,"📍")}${ipCell("NEGARA",data.country_name||data.country,"🌍")}${ipCell("KODE POS",data.postal,"🏷️")}${ipCell("ISP / ORGANISASI",data.org,"🏢")}${ipCell("ASN",data.asn,"🔢")}${ipCell("TIMEZONE",data.timezone,"🕐")}${ipCell("KOORDINAT",data.latitude!=null&&data.longitude!=null?`${data.latitude}, ${data.longitude}`:"-","🗺️")}</div></div>`;}catch(e){if(quotaCounted)comicQuotaRefund('ipchecker');out.innerHTML=`<div class="ipError"><b>Gagal mengecek IP</b><span>${escapeHtml(e.message||String(e))}</span><small>Quota tidak dipotong karena request gagal.</small></div>`;}finally{if(btn){btn.disabled=false;btn.textContent="🌐 CEK IP";}}
}


const QURAN_API='https://api.alquran.cloud/v1';
let quranSurahs=[];
let quranAll=[];
let quranAyahs=[];
let quranLatinAyahs=[];
let quranTranslationAyahs=[];
let quranNextIndex=0;
const QURAN_CHUNK_SIZE=10;
async function loadQuranComic(){
 const box=$("quranList"); if(!box)return;
 try{
  const r=await fetch(QURAN_API+'/surah',{headers:{Accept:'application/json'},cache:'no-store'});
  const j=await r.json(); if(!r.ok||j.code!==200)throw new Error(j.status||'Gagal memuat daftar surah');
  quranSurahs=j.data||[]; quranAll=quranSurahs; renderQuranSurahList(quranSurahs);
 }catch(e){box.innerHTML=`<div class="quranError">Gagal memuat daftar surah.<br><small>${escapeHtml(e.message||String(e))}</small></div>`;}
}
function renderQuranSurahList(list){
 const box=$("quranList"); if(!box)return;
 if(!list.length){box.innerHTML='<div class="quranEmpty">Surah tidak ditemukan.</div>';return;}
 box.innerHTML=list.map(x=>`<button class="quranSurah" type="button" onclick="openQuranSurah(${Number(x.number)})"><span class="quranNum">${Number(x.number)}</span><span class="quranSurahText"><b>${escapeHtml(x.englishName||x.name)}</b><small>${escapeHtml(x.englishNameTranslation||'')} · ${Number(x.numberOfAyahs)} ayat</small></span><strong dir="rtl">${escapeHtml(x.name||'')}</strong><span class="quranArrow">›</span></button>`).join('');
}
function filterQuranSurah(v){const q=String(v||'').trim().toLowerCase();renderQuranSurahList(quranAll.filter(x=>!q||String(x.number).includes(q)||String(x.name||'').toLowerCase().includes(q)||String(x.englishName||'').toLowerCase().includes(q)||String(x.englishNameTranslation||'').toLowerCase().includes(q)));}
async function openQuranSurah(id){
 const list=$("quranList"), reader=$("quranReader"), head=$("quranReaderHead"), content=$("quranContent"); if(!reader||!content)return;
 list.hidden=true; reader.hidden=false; head.innerHTML='<div class="quranLoading">Memuat ayat…</div>'; content.innerHTML=''; quranAyahs=[]; quranLatinAyahs=[]; quranTranslationAyahs=[]; quranNextIndex=0; window.scrollTo(0,0);
 try{
  const r=await fetch(QURAN_API+`/surah/${id}/editions/quran-uthmani,en.transliteration,id.indonesian`,{headers:{Accept:'application/json'},cache:'no-store'});
  const j=await r.json(); if(!r.ok||j.code!==200)throw new Error(j.status||'Gagal memuat surah');
  const editions=j.data||[]; const ar=editions.find(x=>x.edition?.identifier==='quran-uthmani')||editions[0]; const latin=editions.find(x=>x.edition?.identifier==='en.transliteration'); const idn=editions.find(x=>x.edition?.identifier==='id.indonesian');
  const surah=ar?.name?ar:(quranAll.find(x=>x.number===id)||{});
  head.innerHTML=`<div class="quranTitleArabic" dir="rtl">${escapeHtml(surah.name||'')}</div><h2>${escapeHtml(surah.englishName||'')}</h2><p>${escapeHtml(surah.englishNameTranslation||'')} · ${Number(surah.numberOfAyahs||ar?.numberOfAyahs||0)} ayat</p>`;
  quranAyahs=ar?.ayahs||[]; quranLatinAyahs=latin?.ayahs||[]; quranTranslationAyahs=idn?.ayahs||[]; content.innerHTML=''; renderNextQuranChunk();
 }catch(e){head.innerHTML='';content.innerHTML=`<div class="quranError">Gagal memuat Al-Qur'an.<br><small>${escapeHtml(e.message||String(e))}</small></div>`;}
}
function renderNextQuranChunk(){
 const content=$("quranContent"); if(!content||!quranAyahs.length)return;
 const oldMore=content.querySelector('.quranMore'); if(oldMore)oldMore.remove();
 const oldProgress=content.querySelector('.quranProgress'); if(oldProgress)oldProgress.remove();
 const start=quranNextIndex, end=Math.min(start+QURAN_CHUNK_SIZE,quranAyahs.length), frag=document.createDocumentFragment();
 for(let i=start;i<end;i++){
  const a=quranAyahs[i], article=document.createElement('article'); article.className='quranAyah';
  article.innerHTML=`<div class="quranAyahTop"><span>${a.numberInSurah||i+1}</span></div><div class="quranArabic" dir="rtl">${escapeHtml(a.text||'')}</div>${quranLatinAyahs[i]?`<div class="quranLatin">${escapeHtml(quranLatinAyahs[i].text||'')}</div>`:''}${quranTranslationAyahs[i]?`<div class="quranTranslation">${escapeHtml(quranTranslationAyahs[i].text||'')}</div>`:''}`;
  frag.appendChild(article);
 }
 content.appendChild(frag); quranNextIndex=end;
 if(quranNextIndex<quranAyahs.length){
  const more=document.createElement('button'); more.type='button'; more.className='quranMore'; more.textContent=`Muat 10 ayat berikutnya (${quranNextIndex}/${quranAyahs.length})`; more.onclick=()=>{more.disabled=true;renderNextQuranChunk();}; content.appendChild(more);
  const progress=document.createElement('div'); progress.className='quranProgress'; progress.textContent=`Menampilkan ayat 1–${quranNextIndex} dari ${quranAyahs.length}`; content.appendChild(progress);
 }
}
function closeQuranReader(){const r=$("quranReader"),l=$("quranList");if(r)r.hidden=true;if(l)l.hidden=false;window.scrollTo(0,0);}


async function fetchAzbry(url, options={}){
  const directOptions={...options, headers:{Accept:options.accept||"application/json, text/plain, */*", ...(options.headers||{})}};
  try{
    const r=await fetch(url,directOptions);
    if(r.ok) return r;
    // Retry through a CORS relay for local-file/QuickEdit previews.
    if(r.status>=400) throw new Error(`API ${r.status}`);
    return r;
  }catch(primaryError){
    if(options.method && String(options.method).toUpperCase()!=="GET") throw primaryError;
    const relay="https://api.allorigins.win/raw?url="+encodeURIComponent(url);
    try{
      const r=await fetch(relay,{method:"GET",cache:"no-store"});
      if(!r.ok) throw new Error(`Relay ${r.status}`);
      return r;
    }catch(relayError){
      throw primaryError;
    }
  }
}

function azbryRelayUrl(url){
  return "https://api.allorigins.win/raw?url="+encodeURIComponent(url);
}
function setImageWithRelayFallback(img,directUrl){
  let retried=false;
  img.onerror=function(){
    if(retried)return;
    retried=true;
    img.src=azbryRelayUrl(directUrl);
  };
  img.src=directUrl;
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));}
async function runRemoveBG(input){
 const out=$("toolResult");
 const url=(input||"").trim();
 if(!url){out.textContent="Masukkan URL gambar terlebih dahulu.";return;}
 if(!/^https?:\/\//i.test(url)){out.textContent="URL gambar harus diawali http:// atau https://";return;}
 out.innerHTML='<div class="loading">Memproses remove background…</div>';
 try{
   const api="https://api.azbry.com/api/tools/removebg?url="+encodeURIComponent(url);
   const r=await fetchAzbry(api,{method:"GET",accept:"image/*, application/json, */*"});
   if(!r.ok) throw new Error(`API ${r.status}`);
   const type=(r.headers.get("content-type")||"").toLowerCase();
   if(type.includes("image/")){
     const blob=await r.blob();
     const u=URL.createObjectURL(blob);
     out.innerHTML=`<img class="mediaPreview imagePreview" src="${u}" alt="Hasil Remove BG" loading="eager"><a class="downloadBtn" href="${u}" download="remove-bg.png">⬇ DOWNLOAD GAMBAR</a><div class="hint" style="margin-top:12px;text-align:center">Tekan button download untuk mengunduh hasil Remove BG.</div>`;
     return;
   }
   if(type.includes("json")){
     const data=await r.json();
     const media=findMediaLinks(data);
     if(media.length){
       const resultUrl=media[0];
       out.innerHTML=`<img class="mediaPreview imagePreview" src="${escapeHtml(resultUrl)}" alt="Hasil Remove BG" loading="eager"><a class="downloadBtn" href="${escapeHtml(resultUrl)}" download="remove-bg.png" target="_blank" rel="noopener">⬇ DOWNLOAD GAMBAR</a><div class="hint" style="margin-top:12px;text-align:center">Tekan button download untuk mengunduh hasil Remove BG.</div>`;
       return;
     }
     throw new Error(data.message||"Hasil gambar tidak ditemukan.");
   }
   throw new Error("Response API bukan gambar atau JSON.");
 }catch(e){
   out.innerHTML=`<div class="errorMsg">Gagal remove background: ${escapeHtml(e.message||String(e))}</div>`;
 }
}
function showDownload(blob,name){
 const out=$("toolResult");
 const u=URL.createObjectURL(blob);
 out.innerHTML="";
 const img=document.createElement("img");
 img.className="mediaPreview imagePreview demoPreview";
 img.alt="Preview hasil "+name;
 img.loading="eager";
 img.src=u;
 out.appendChild(img);
 const box=document.createElement("div");
 box.className="mediaBtns";
 box.innerHTML=`<a class="downloadBtn" href="${u}" download="${escapeHtml(name)}">⬇ DOWNLOAD GAMBAR</a>`;
 out.appendChild(box);
 const hint=document.createElement("div");
 hint.className="hint";hint.style.cssText="margin-top:12px;text-align:center";
 hint.textContent="Preview hasil — tekan tombol untuk mengunduh.";
 out.appendChild(hint);
}
async function runIQC(input){
 const out=$("toolResult");
 const text=input.trim();
 if(!text){out.textContent="Masukkan pesan terlebih dahulu.";return;}
 out.innerHTML='<div class="loading">Membuat IQC…</div>';
 const api='https://api.azbry.com/api/maker/iqc?text='+encodeURIComponent(text);
 const img=document.createElement("img");
 img.alt="Hasil IQC";
 img.loading="eager";
 img.decoding="async";
 img.style.cssText='max-width:100%;max-height:520px;border:3px solid var(--black);border-radius:12px;display:block;margin:0 auto';
 img.onload=()=>{out.innerHTML='';out.appendChild(img);const box=document.createElement("div");box.innerHTML=`<a class="downloadBtn" href="${api}" download="iqc.png" target="_blank" rel="noopener">⬇ DOWNLOAD GAMBAR</a><div class="hint" style="margin-top:12px;text-align:center">Tekan button download untuk mengunduh gambar (auto download gambar)</div>`;out.appendChild(box);};
 img.onerror=()=>{out.innerHTML='<div class="errorMsg">Gagal memuat hasil IQC dari API Azbry.</div>';};
 img.src=api;
}
async function runImg2QR(){
 const out=$("toolResult");
 const file=$("fileInput")?.files?.[0];
 if(!file){out.textContent="Pilih gambar terlebih dahulu.";return;}
 out.innerHTML='<div class="loading">Memproses gambar menjadi QR…</div>';
 try{
   const form=new FormData();
   form.append("file",file,file.name);
   const r=await fetch("https://api.azbry.com/api/tools/img2qr",{method:"POST",body:form,headers:{Accept:"image/*, application/json, */*"}});
   if(!r.ok) throw new Error(`API ${r.status}`);
   const type=(r.headers.get("content-type")||"").toLowerCase();
   if(type.includes("image/")){
     const blob=await r.blob();
     const u=URL.createObjectURL(blob);
     out.innerHTML=`<img class="mediaPreview imagePreview" src="${u}" alt="Hasil Image To QR" loading="eager"><a class="downloadBtn" href="${u}" download="image-to-qr.png">⬇ DOWNLOAD QR</a><div class="hint" style="margin-top:12px;text-align:center">Tekan button download untuk mengunduh QR (auto download QR)</div>`;
     return;
   }
   if(type.includes("json")){
     const data=await r.json();
     const media=findMediaLinks(data);
     if(media.length){
       const url=media[0];
       out.innerHTML=`<img class="mediaPreview imagePreview" src="${escapeHtml(url)}" alt="Hasil Image To QR" loading="eager"><a class="downloadBtn" href="${escapeHtml(url)}" download="image-to-qr.png" target="_blank" rel="noopener">⬇ DOWNLOAD QR</a><div class="hint" style="margin-top:12px;text-align:center">Tekan button download untuk mengunduh QR (auto download QR)</div>`;
       return;
     }
     throw new Error(data.message||"Link hasil QR tidak ditemukan.");
   }
   throw new Error("Response API bukan gambar atau JSON.");
 }catch(e){
   out.innerHTML=`<div class="errorMsg">Gagal membuat QR: ${escapeHtml(e.message||String(e))}</div>`;
 }
}

async function runDana(input){
 const out=$("toolResult");
 const raw=String(input||"").replace(/[^0-9]/g,"");
 if(!raw||Number(raw)<=0){out.textContent="Masukkan nominal terlebih dahulu.";return;}
 const api="https://api.azbry.com/api/maker/fakedana?amount="+encodeURIComponent(raw);
 out.innerHTML='<div class="loading">Membuat Fake Dana…</div>';
 const renderImage=(src,downloadName="fake-dana.png")=>{
  out.innerHTML='';
  const img=document.createElement("img");
  img.className="mediaPreview imagePreview danaPreview";
  img.alt="Hasil Fake Dana";
  img.loading="eager";
  img.onload=()=>{
   const box=document.createElement("div");
   box.className="mediaBtns";
   box.innerHTML=`<a class="downloadBtn" href="${escapeHtml(src)}" download="${downloadName}" target="_blank" rel="noopener">⬇ DOWNLOAD GAMBAR</a>`;
   out.appendChild(box);
  };
  img.onerror=()=>{
   out.innerHTML='<div class="errorMsg">Gambar Fake Dana gagal dimuat dari API.<br><small>Coba lagi beberapa detik kemudian jika server sedang rate-limit.</small></div>';
  };
  img.src=src;
  out.appendChild(img);
 };
 // Direct image first: this works even when browser fetch/CORS blocks API responses.
 renderImage(api);
}
async function runBrat(input){
 const out=$("toolResult");
 const text=String(input||"").trim();
 if(!text){out.textContent="Masukkan teks terlebih dahulu.";return;}
 out.innerHTML='<div class="loading">Membuat BRAT dari API…</div>';
 const api="https://api.azbry.com/api/maker/brat?text="+encodeURIComponent(text);
 const renderImage=(src)=>{
  out.innerHTML='';
  const img=document.createElement("img");
  img.className="mediaPreview imagePreview bratPreview";
  img.alt="Hasil BRAT Generator";
  img.loading="eager";
  let retried=false;
  img.onerror=()=>{
   if(!retried){retried=true;img.src=azbryRelayUrl(src);return;}
   out.innerHTML='<div class="errorMsg">Gagal memuat hasil BRAT dari API.<br><small>Pastikan API sedang online lalu coba lagi.</small></div>';
  };
  img.onload=()=>{
   const box=document.createElement("div");
   box.className="mediaBtns";
   box.innerHTML=`<a class="downloadBtn" href="${escapeHtml(src)}" download="brat.png" target="_blank" rel="noopener">⬇ DOWNLOAD GAMBAR</a>`;
   out.appendChild(box);
  };
  img.src=src;
  out.appendChild(img);
 };
 renderImage(api);
}
function drawDemo(a){
 const c=document.createElement("canvas");
 c.width=1000;c.height=650;
 const x=c.getContext("2d");
 const title=($("toolInput")?.value||"COMIC TOOL").trim()||"COMIC TOOL";
 const sub=($("subInput")?.value||"MADE WITH COMIC TOOLS").trim();
 x.clearRect(0,0,c.width,c.height);
 x.fillStyle="#fff6cf";x.fillRect(0,0,c.width,c.height);
 x.strokeStyle="#111";x.lineWidth=12;x.strokeRect(20,20,960,610);
 if(a==="brat"){
   x.fillStyle="#b8ff00";x.fillRect(70,70,860,510);
   x.strokeStyle="#000";x.lineWidth=8;x.strokeRect(70,70,860,510);
   x.fillStyle="#000";
   x.font="900 82px Arial, sans-serif";x.textAlign="center";x.textBaseline="middle";
   const words=title.slice(0,32).split(/\s+/);
   let lines=[],line="";
   for(const w of words){const test=line?line+" "+w:w;if(x.measureText(test).width>760&&line){lines.push(line);line=w}else line=test}
   if(line)lines.push(line);
   const shown=lines.slice(0,4);
   const lineH=92;
   const start=325-(shown.length-1)*lineH/2;
   shown.forEach((t,i)=>x.fillText(t,500,start+i*lineH));
 }else{
   x.fillStyle="#ed174c";x.font="900 64px Impact, Arial, sans-serif";x.textAlign="center";
   x.fillText(title.slice(0,25),500,320);
   x.font="700 34px Arial, sans-serif";x.fillStyle="#111";
   x.fillText(sub.slice(0,45),500,405);
 }
 c.toBlob(b=>showDownload(b,a+".png"),"image/png");
}
function toggleNav(){document.querySelector(".nav").classList.toggle("mobileOpen");}
$("toolModal")?.addEventListener("click",e=>{if(e.target.id==="toolModal")closeTool();});
initHeroStatus();
render();

window.addEventListener("DOMContentLoaded",initDedicatedToolPage);

(function(){
  const toast=document.getElementById('waChannelToast');
  if(!toast)return;
  const closeBtn=toast.querySelector('.waChannelToastClose');
  let hideTimer=null;
  let interval=null;
  function showToast(){
    toast.classList.add('show');
    toast.setAttribute('aria-hidden','false');
    clearTimeout(hideTimer);
    hideTimer=setTimeout(function(){
      toast.classList.remove('show');
      toast.setAttribute('aria-hidden','true');
    },6000);
  }
  function hideToast(){
    clearTimeout(hideTimer);
    toast.classList.remove('show');
    toast.setAttribute('aria-hidden','true');
  }
  closeBtn?.addEventListener('click',hideToast);
  window.addEventListener('load',function(){
    // Notifikasi atas langsung muncul setiap kali halaman dibuka, lalu tiap 10 detik.
    setTimeout(showToast,450);
    interval=setInterval(showToast,10000);
  });
})();

(function(){
  function openWaWelcome(){
    const el=document.getElementById('waWelcomeOverlay');
    if(!el)return;
    el.classList.add('show');
    el.setAttribute('aria-hidden','false');
    document.documentElement.style.overflow='hidden';
    document.body.style.overflow='hidden';
  }
  window.closeWaWelcome=function(){
    const el=document.getElementById('waWelcomeOverlay');
    if(!el)return;
    el.classList.remove('show');
    el.setAttribute('aria-hidden','true');
    document.documentElement.style.overflow='';
    document.body.style.overflow='';
  };
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape') window.closeWaWelcome();
  });
  document.getElementById('waWelcomeOverlay')?.addEventListener('click',function(e){
    if(e.target===this) window.closeWaWelcome();
  });
  window.addEventListener('load',function(){
    // Popup besar hanya muncul di halaman utama. Halaman tool cukup memakai notif dari atas.
    if(document.body.classList.contains('tool-page-active')) return;
    setTimeout(openWaWelcome,180);
  });
})();
