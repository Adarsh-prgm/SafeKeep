import React,{createContext,useContext,useEffect,useMemo,useReducer,useState} from 'react';import{createRoot}from'react-dom/client';import{BrowserRouter,Link,Navigate,Route,Routes,useNavigate}from'react-router-dom';import{ShieldCheck,LayoutDashboard,Files,Upload,Settings,LogOut,Bell,Search,Plus,Download,Trash2,FileText,Image as ImageIcon,Table2,FileSpreadsheet,LockKeyhole,ArrowRight,Menu,X,Check,Eye,EyeOff}from'lucide-react';import{api,authApi,docsApi,notificationApi,setTokenGetter}from'./api';import'./style.css';
const Auth=createContext(null);const authReducer=(s,a)=>a.type==='set'?{ready:true,token:a.token,user:a.user}:a.type==='clear'?{ready:true,token:null,user:null}:s;
function AuthProvider({children}){const[state,dispatch]=useReducer(authReducer,{ready:false,token:null,user:null});const[token,setToken]=useState(null);useEffect(()=>{setTokenGetter(()=>token);},[token]);useEffect(()=>{let alive=true;authApi.me().then(r=>{if(alive){setToken(null);dispatch({type:'set',token:null,user:r.data.user});}}).catch(()=>{if(alive)dispatch({type:'clear'});});return()=>{alive=false}},[]);const value=useMemo(()=>({state,login:async(email,password)=>{const r=await authApi.login({email,password});setToken(r.data.accessToken);dispatch({type:'set',token:r.data.accessToken,user:r.data.user});return r.data.user;},register:async(data)=>{const r=await authApi.register(data);setToken(r.data.accessToken);dispatch({type:'set',token:r.data.accessToken,user:r.data.user});return r.data.user;},logout:async()=>{await authApi.logout().catch(()=>{});setToken(null);dispatch({type:'clear'});}}),[state]);return <Auth.Provider value={value}>{children}</Auth.Provider>}
function useAuth(){return useContext(Auth)}function Protected({children}){const{state}=useAuth();if(!state.ready)return <div className="loading-screen"><div className="spinner"/><span>Unlocking your vault…</span></div>;return state.user?children:<Navigate to="/login" replace/>}
function ToastProvider({children}){const[toast,setToast]=useState(null);const show=(message,type='success')=>{setToast({message,type});setTimeout(()=>setToast(null),3200)};return <ToastCtx.Provider value={show}>{children}{toast&&<div role="status" className={`toast ${toast.type}`}><Check size={17}/>{toast.message}</div>}</ToastCtx.Provider>}const ToastCtx=createContext(()=>{});
function Brand(){return <Link to="/" className="brand"><span className="brand-icon"><ShieldCheck size={21}/></span>SafeKeep</Link>}
function Landing(){return <div className="landing"><nav className="public-nav wrap"><Brand/><div><Link to="/login" className="text-link">Log in</Link><Link to="/register" className="button primary">Create free account <ArrowRight size={16}/></Link></div></nav><main className="hero wrap"><div className="hero-copy"><div className="eyebrow"><LockKeyhole size={14}/> YOUR DOCUMENTS, PROTECTED</div><h1>A safer place for<br/>your <span>important things.</span></h1><p>Keep the documents that matter organized, private, and easy to find. Your personal vault, ready whenever you need it.</p><div className="hero-actions"><Link to="/register" className="button primary large">Get started <ArrowRight size={17}/></Link><Link to="/login" className="button quiet large">I already have an account</Link></div><div className="trust"><span className="avatar-stack"><i>✓</i><i>⌂</i><i>✳</i></span><span>Private by design <b>·</b> Yours to manage</span></div></div><div className="vault-art"><div className="orb orb-a"/><div className="orb orb-b"/><div className="vault-card"><div className="vault-top"><span className="shield-large"><ShieldCheck size={29}/></span><span className="lock-pill"><LockKeyhole size={13}/> PRIVATE VAULT</span></div><div className="vault-label">YOUR SPACE</div><div className="vault-title">Everything in its place.</div><div className="file-preview"><span className="file-icon pdf"><FileText size={18}/></span><span><b>Passport.pdf</b><small>Personal · 2.4 MB</small></span><span className="checkmark">✓</span></div><div className="file-preview"><span className="file-icon blue"><ImageIcon size={18}/></span><span><b>Home insurance</b><small>Home · 1.8 MB</small></span><span className="checkmark">✓</span></div><div className="secure-note"><ShieldCheck size={15}/> Only you can access your documents</div></div><div className="float-note"><div className="float-check">✓</div><span><b>Looking good.</b><small>Your files stay private.</small></span></div></div></main><section className="features wrap"><div><span className="feature-icon"><LockKeyhole size={19}/></span><b>Private, by default</b><p>Your vault belongs to you. Each file stays behind your personal sign-in.</p></div><div><span className="feature-icon green"><Files size={19}/></span><b>Everything organized</b><p>Keep important records together and find them when life asks.</p></div><div><span className="feature-icon gold"><ShieldCheck size={19}/></span><b>Built with care</b><p>Thoughtful protections at every step, from upload to download.</p></div></section><footer className="landing-foot wrap"><Brand/><div className="team-credit"><strong>Team Kingfisher</strong><span>Preetham Ferrao · Sushruth Shetty · Adarsh A D · B K Karthik</span></div><span>Made for the things that matter.</span></footer></div>}
function AuthPage({mode}){const{login,register}=useAuth(),nav=useNavigate(),toast=useContext(ToastCtx),[form,setForm]=useState({name:'',email:'',password:'',confirm:''}),[show,setShow]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');const signup=mode==='register';const submit=async e=>{e.preventDefault();setError('');if(form.password.length<10)return setError('Use at least 10 characters for your password.');if(signup&&form.password!==form.confirm)return setError('Those passwords do not match.');setBusy(true);try{if(signup)await register({name:form.name,email:form.email,password:form.password});else await login(form.email,form.password);toast(signup?'Your vault is ready.':'Welcome back.');nav('/dashboard');}catch(err){setError(err.response?.data?.error?.message||'Could not connect. Check your details and try again.');}finally{setBusy(false)}};return <div className="auth-layout"><aside className="auth-side"><Brand/><div className="auth-quote"><div className="quote-icon"><ShieldCheck size={28}/></div><h2>Your important documents deserve a safe place.</h2><p>Keep your personal records organized, private, and within reach.</p><div className="quote-bottom">SafeKeep <span>·</span> Personal Document Vault</div></div></aside><main className="auth-main"><Link to="/" className="back-home">← Back to home</Link><div className="auth-form-wrap"><div className="auth-eyebrow">{signup?'GET STARTED':'WELCOME BACK'}</div><h1>{signup?'Create your vault':'Good to see you'}</h1><p className="auth-sub">{signup?'A little setup, then your documents have a home.':'Sign in to access your personal documents.'}</p><form onSubmit={submit}>{signup&&<label>Full name<div className="input-wrap"><input autoComplete="name" required minLength="2" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name"/></div></label>}<label>Email address<div className="input-wrap"><input type="email" autoComplete="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></div></label><label>Password<div className="input-wrap"><input type={show?'text':'password'} autoComplete={signup?'new-password':'current-password'} required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="At least 10 characters"/><button type="button" className="eye" onClick={()=>setShow(!show)} aria-label={show?'Hide password':'Show password'}>{show?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>{signup&&<label>Confirm password<div className="input-wrap"><input type={show?'text':'password'} autoComplete="new-password" required value={form.confirm} onChange={e=>setForm({...form,confirm:e.target.value})} placeholder="Enter it once more"/></div></label>}{error&&<div className="form-error" role="alert">{error}</div>}<button className="button primary submit" disabled={busy}>{busy?'Please wait…':signup?'Create my vault':'Sign in'} <ArrowRight size={17}/></button></form><div className="switch-auth">{signup?'Already have an account?':'New to SafeKeep?'} <Link to={signup?'/login':'/register'}>{signup?'Sign in':'Create an account'}</Link></div><div className="form-privacy"><LockKeyhole size={14}/> Your credentials are encrypted and private</div></div></main></div>}
const fmtBytes=n=>n<1024*1024?`${Math.max(1,Math.round(n/1024))} KB`:`${(n/1024/1024).toFixed(1)} MB`;const categoryIcons={PDF:FileText,Image:ImageIcon,Spreadsheet:FileSpreadsheet,Document:FileText};
function NotificationStream({token,setNotes,setUnread}){useEffect(()=>{if(!token)return;let stopped=false,delay=1000,controller;const connect=async()=>{controller=new AbortController();try{const response=await fetch(`${api.defaults.baseURL}/notifications/stream`,{headers:{Authorization:`Bearer ${token}`,Accept:'text/event-stream'},signal:controller.signal});if(!response.ok||!response.body)throw new Error('stream unavailable');delay=1000;const reader=response.body.getReader(),decoder=new TextDecoder();let buffer='';while(!stopped){const{value,done}=await reader.read();if(done)break;buffer+=decoder.decode(value,{stream:true});let split;while((split=buffer.indexOf('\n\n'))>=0){const event=buffer.slice(0,split);buffer=buffer.slice(split+2);const line=event.split('\n').find(x=>x.startsWith('data: '));if(line){try{const n=JSON.parse(line.slice(6));setNotes(prev=>[n,...prev].slice(0,50));setUnread(v=>v+1)}catch{}}}}}catch{}if(!stopped){await new Promise(r=>setTimeout(r,delay));delay=Math.min(delay*2,30000);connect()}};connect();return()=>{stopped=true;controller?.abort()}},[token,setNotes,setUnread]);return null}
function AppShell({children}){const{state,logout}=useAuth(),nav=useNavigate(),[mobile,setMobile]=useState(false),[notes,setNotes]=useState([]),[unread,setUnread]=useState(0),[showNotes,setShowNotes]=useState(false);const load=()=>notificationApi.list().then(r=>{setNotes(r.data.notifications);setUnread(r.data.unreadCount)}).catch(()=>{});useEffect(()=>{load();},[]);const doLogout=async()=>{await logout();nav('/');};return <div className="app-shell"><NotificationStream token={state.token} setNotes={setNotes} setUnread={setUnread}/><aside className={`sidebar ${mobile?'open':''}`}><div className="side-brand"><Brand/><button className="mobile-close" onClick={()=>setMobile(false)}><X size={20}/></button></div><div className="side-label">WORKSPACE</div><nav className="side-nav"><Link to="/dashboard" onClick={()=>setMobile(false)}><LayoutDashboard size={18}/> Overview</Link><Link to="/documents" onClick={()=>setMobile(false)}><Files size={18}/> My documents</Link><Link to="/upload" onClick={()=>setMobile(false)}><Upload size={18}/> Upload files</Link></nav><div className="side-bottom"><div className="storage-card"><div className="storage-heading"><span>Vault storage</span><LockKeyhole size={14}/></div><div className="storage-meter"><i style={{width:'18%'}}/></div><small>Storage depends on your server configuration</small></div><Link to="/settings" className="side-setting"><Settings size={17}/> Settings</Link><button onClick={doLogout} className="side-setting"><LogOut size={17}/> Sign out</button><div className="profile-mini"><div className="profile-avatar">{state.user?.name?.[0]?.toUpperCase()||'U'}</div><span><b>{state.user?.name}</b><small>Personal vault</small></span><span className="online-dot"/></div></div></aside>{mobile&&<div className="mobile-scrim" onClick={()=>setMobile(false)}/>}<main className="main-area"><header className="topbar"><button className="mobile-menu" onClick={()=>setMobile(true)}><Menu/></button><div className="crumb">My space <span>/</span> <b>Personal vault</b></div><div className="top-actions"><button className={`icon-button ${showNotes?'selected':''}`} onClick={()=>{setShowNotes(!showNotes);if(!showNotes)load()}} aria-label="Notifications"><Bell size={19}/>{unread>0&&<i className="badge"/>}</button><div className="top-avatar">{state.user?.name?.[0]?.toUpperCase()}</div><b className="top-name">{state.user?.name}</b></div>{showNotes&&<div className="notification-pop"><div className="notif-head"><b>Notifications</b><button onClick={()=>notificationApi.readAll().then(load)}>Mark all read</button></div>{notes.length?notes.slice(0,7).map(n=><button className={`notif-row ${n.readAt?'':'unread'}`} key={n.id} onClick={()=>notificationApi.read(n.id).then(load)}><span className="notif-dot"/><span><b>{n.title}</b><small>{n.message}</small><time>{new Date(n.createdAt).toLocaleDateString()}</time></span></button>):<div className="notif-empty">You’re all caught up.</div>}</div>}</header>{children}</main></div>}
function PreviewModal({doc,onClose}){
  const toast=useContext(ToastCtx);
  const [blobUrl,setBlobUrl]=useState(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);
  const [zoom,setZoom]=useState(1);
  const Icon=doc.mimeType?.includes('image')?ImageIcon:doc.mimeType?.includes('spreadsheet')?FileSpreadsheet:doc.mimeType?.includes('word')?FileText:FileText;
  const isImage=Boolean(doc.mimeType?.startsWith('image/'));
  const isPdf=doc.mimeType==='application/pdf';
  const isOffice=Boolean(doc.mimeType?.includes('openxmlformats'));

  useEffect(()=>{
    const onKey=e=>{if(e.key==='Escape')onClose();};
    window.addEventListener('keydown',onKey);
    return()=>window.removeEventListener('keydown',onKey);
  },[onClose]);

  useEffect(()=>{
    let alive=true;
    let createdUrl=null;
    setLoading(true);
    setError(null);
    setZoom(1);

    const fetchPreview=async()=>{
      try{
        const res=await docsApi.preview(doc.id);
        if(!alive)return;
        createdUrl=URL.createObjectURL(res.data);
        setBlobUrl(createdUrl);
        setLoading(false);
      }catch{
        try{
          const fallback=await docsApi.download(doc.id);
          if(!alive)return;
          createdUrl=URL.createObjectURL(fallback.data);
          setBlobUrl(createdUrl);
          setLoading(false);
        }catch{
          if(!alive)return;
          setError('Could not load in-browser preview.');
          setLoading(false);
        }
      }
    };
    fetchPreview();

    return()=>{
      alive=false;
      if(createdUrl)URL.revokeObjectURL(createdUrl);
    };
  },[doc.id]);

  const download=async()=>{
    try{
      const r=await docsApi.download(doc.id);
      const url=URL.createObjectURL(r.data);
      const a=document.createElement('a');
      a.href=url;
      a.download=doc.originalFilename;
      a.click();
      URL.revokeObjectURL(url);
      toast('Download started.');
    }catch{
      toast('Could not download this file.','error');
    }
  };

  const fileExt=doc.originalFilename?.split('.').pop()?.toUpperCase()||(isPdf?'PDF':isImage?'IMG':'DOC');

  return (
    <div className="preview-backdrop" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="preview-modal" role="dialog" aria-modal="true" aria-labelledby="preview-title" onClick={e=>e.stopPropagation()}>
        <header className="preview-header">
          <div className="preview-title-wrap">
            <div className={`doc-type ${isPdf?'pdf-type':''}`}>
              <Icon size={19}/>
            </div>
            <div>
              <div className="preview-title-row">
                <h2 id="preview-title">{doc.title}</h2>
                <span className="preview-badge ext">{fileExt}</span>
                <span className="preview-badge category">{doc.category}</span>
              </div>
              <p className="preview-meta-line">
                <span>{doc.originalFilename}</span>
                <i>·</i>
                <span>{fmtBytes(doc.fileSize)}</span>
                <i>·</i>
                <span>Added {new Date(doc.createdAt).toLocaleDateString()}</span>
              </p>
            </div>
          </div>
          <div className="preview-header-actions">
            {isImage&&blobUrl&&!loading&&(
              <div className="preview-zoom-controls">
                <button type="button" onClick={()=>setZoom(z=>Math.max(0.5,Number((z-0.25).toFixed(2))))} title="Zoom out" disabled={zoom<=0.5}>−</button>
                <span>{Math.round(zoom*100)}%</span>
                <button type="button" onClick={()=>setZoom(z=>Math.min(3,Number((z+0.25).toFixed(2))))} title="Zoom in" disabled={zoom>=3}>+</button>
                <button type="button" onClick={()=>setZoom(1)} title="Reset zoom">Reset</button>
              </div>
            )}
            <button type="button" className="button quiet small-btn" onClick={download} title="Download file">
              <Download size={14}/> Download
            </button>
            <button type="button" className="preview-close-button" onClick={onClose} aria-label="Close preview">
              <X size={19}/>
            </button>
          </div>
        </header>

        <div className="preview-body">
          {loading ? (
            <div className="preview-loading">
              <div className="spinner"/>
              <span>Loading secure preview…</span>
            </div>
          ) : error ? (
            <div className="preview-fallback">
              <div className="preview-fallback-icon"><FileText size={36}/></div>
              <h3>Preview unavailable</h3>
              <p>{error}</p>
              <button type="button" className="button primary" onClick={download}><Download size={15}/> Download to view</button>
            </div>
          ) : isPdf ? (
            <iframe src={blobUrl} title={doc.title} className="preview-pdf-frame"/>
          ) : isImage ? (
            <div className="preview-image-scroll">
              <img src={blobUrl} alt={doc.title} className="preview-image" style={{transform:`scale(${zoom})`,transformOrigin:'center center'}}/>
            </div>
          ) : isOffice ? (
            <div className="preview-office-card">
              <div className={`preview-office-icon ${doc.mimeType?.includes('sheet')?'sheet-sym':'word-sym'}`}>
                <Icon size={42}/>
              </div>
              <h3>{doc.title}</h3>
              <p className="preview-filename">{doc.originalFilename}</p>
              <div className="preview-office-badges">
                <span><b>Format:</b> {fileExt} Document</span>
                <span><b>Category:</b> {doc.category}</span>
                <span><b>Size:</b> {fmtBytes(doc.fileSize)}</span>
              </div>
              <div className="preview-office-notice">
                <ShieldCheck size={16}/>
                <span>SafeKeep verified file signature. For privacy, Office documents are kept local and can be opened in your desktop apps.</span>
              </div>
              <button type="button" className="button primary large" onClick={download}>
                <Download size={16}/> Download & Open in {fileExt==='XLSX'?'Excel':'Word'}
              </button>
            </div>
          ) : (
            <div className="preview-fallback">
              <div className="preview-fallback-icon"><Icon size={36}/></div>
              <h3>{doc.title}</h3>
              <p>{doc.originalFilename} ({fmtBytes(doc.fileSize)})</p>
              <button type="button" className="button primary" onClick={download}><Download size={15}/> Download to view</button>
            </div>
          )}
        </div>

        <footer className="preview-footer">
          <div className="preview-security-tag">
            <LockKeyhole size={13}/>
            <span>Private vault asset · Access token protected</span>
          </div>
          <div className="preview-footer-info">
            <span>Ref ID: <small>{doc.id.slice(0, 10)}…</small></span>
          </div>
        </footer>
      </div>
    </div>
  );
}
function Dashboard(){const{state}=useAuth(),[docs,setDocs]=useState([]),[loading,setLoading]=useState(true),[previewDoc,setPreviewDoc]=useState(null);useEffect(()=>{docsApi.list({limit:5}).then(r=>setDocs(r.data.documents)).catch(()=>{}).finally(()=>setLoading(false));},[]);const cats=[['Identity','Passport, licenses, and personal records'],['Home','Property and household documents'],['Finance','Statements and tax records'],['Health','Medical records and insurance']];return <AppShell><div className="page-content"><div className="welcome-row"><div><div className="date-label">YOUR PERSONAL SPACE</div><h1>Good morning, {state.user?.name?.split(' ')[0]} <span className="wave">✳</span></h1><p>Your documents are right where you left them.</p></div><Link to="/upload" className="button primary"><Plus size={17}/> Add a document</Link></div><div className="stat-grid"><div className="stat-card"><div className="stat-symbol blue-sym"><Files size={18}/></div><small>Documents</small><strong>{loading?'—':docs.length}</strong><span>Stored in your vault</span></div><div className="stat-card"><div className="stat-symbol green-sym"><LockKeyhole size={18}/></div><small>Vault status</small><strong className="stat-word">Private</strong><span>Only you can access these files</span></div><div className="stat-card"><div className="stat-symbol amber-sym"><ShieldCheck size={18}/></div><small>Account</small><strong className="stat-word">Protected</strong><span>Signed in as {state.user?.email}</span></div></div><div className="content-grid"><section className="panel recent-panel"><div className="panel-head"><div><h2>Recently added</h2><p>Your latest documents</p></div><Link to="/documents" className="panel-link">View all <ArrowRight size={14}/></Link></div>{loading?<SkeletonRows/>:docs.length?<div className="doc-list">{docs.map(d=><DocRow key={d.id} doc={d} onPreview={setPreviewDoc}/>)}</div>:<EmptyState icon={Files} title="Your vault starts here" text="Upload a document to keep your important records close." action={<Link className="button primary small-btn" to="/upload"><Plus size={15}/> Upload a document</Link>}/>}</section><section className="panel category-panel"><div className="panel-head"><div><h2>Your categories</h2><p>Keep life neatly organized</p></div></div><div className="category-list">{cats.map(([name,sub],i)=><Link to={`/documents?category=${name}`} className="category-item" key={name}><span className={`cat-icon cat-${i}`}><FolderIcon index={i}/></span><span><b>{name}</b><small>{sub}</small></span><ArrowRight size={15}/></Link>)}</div></section></div><div className="private-strip"><span><ShieldCheck size={17}/></span><div><b>A little peace of mind</b><small>Files in your vault are served only to your signed-in account.</small></div><LockKeyhole size={16} className="strip-lock"/></div></div>{previewDoc&&<PreviewModal doc={previewDoc} onClose={()=>setPreviewDoc(null)}/>}</AppShell>}
function FolderIcon({index}){const I=[FileText,HomeIcon,Table2,ShieldCheck][index]||FileText;return <I size={18}/>};function HomeIcon(){return <span>⌂</span>}
function SkeletonRows(){return <div className="skeletons">{[1,2,3].map(x=><div className="skeleton-row" key={x}><i/><span><b/><small/></span><em/></div>)}</div>}
function EmptyState({icon:Icon,title,text,action}){return <div className="empty-state"><span><Icon size={23}/></span><h3>{title}</h3><p>{text}</p>{action}</div>}
function DocRow({doc,onDelete,onPreview}){const toast=useContext(ToastCtx),Icon=doc.mimeType?.includes('image')?ImageIcon:doc.mimeType?.includes('spreadsheet')?FileSpreadsheet:doc.mimeType?.includes('word')?FileText:FileText;const download=async(e)=>{e?.stopPropagation();try{const r=await docsApi.download(doc.id),url=URL.createObjectURL(r.data),a=document.createElement('a');a.href=url;a.download=doc.originalFilename;a.click();URL.revokeObjectURL(url);toast('Download started.');}catch{toast('Could not download this file.','error')}};return <div className="doc-row"><div className={`doc-type ${doc.mimeType?.includes('pdf')?'pdf-type':''}`} onClick={()=>onPreview?.(doc)} style={{cursor:onPreview?'pointer':'default'}} title={onPreview?'Click to preview':undefined}><Icon size={19}/></div><span className="doc-info" onClick={()=>onPreview?.(doc)} style={{cursor:onPreview?'pointer':'default'}} title={onPreview?'Click to preview':undefined}><b>{doc.title}</b><small>{doc.category} <i>·</i> {fmtBytes(doc.fileSize)} <i>·</i> {new Date(doc.createdAt).toLocaleDateString()}</small></span><span className="doc-actions">{onPreview&&<button type="button" onClick={()=>onPreview(doc)} title="Preview document" className="preview-action-btn"><Eye size={16}/></button>}<button type="button" onClick={download} title="Download"><Download size={16}/></button>{onDelete&&<button type="button" onClick={(e)=>{e.stopPropagation();onDelete(doc);}} title="Delete" className="delete-icon"><Trash2 size={16}/></button>}</span></div>}
function Documents(){const[docs,setDocs]=useState([]),[loading,setLoading]=useState(true),[search,setSearch]=useState(''),[category,setCategory]=useState(new URLSearchParams(location.search).get('category')||'All'),[sort,setSort]=useState('newest'),[page,setPage]=useState(1),[pages,setPages]=useState(1),[selected,setSelected]=useState(null),[previewDoc,setPreviewDoc]=useState(null);const toast=useContext(ToastCtx),load=()=>{setLoading(true);docsApi.list({search,category,sort,page,limit:10}).then(r=>{setDocs(r.data.documents);setPages(r.data.pages||1)}).catch(()=>toast('Unable to load documents.','error')).finally(()=>setLoading(false))};useEffect(()=>{load()},[search,category,sort,page]);const remove=async()=>{try{await docsApi.remove(selected.id);setSelected(null);toast('Document deleted.');load()}catch{toast('Could not delete this document.','error')}};return <AppShell><div className="page-content"><div className="welcome-row"><div><div className="date-label">YOUR RECORDS</div><h1>My documents</h1><p>One safe place for the things you may need again.</p></div><Link to="/upload" className="button primary"><Plus size={17}/> Upload files</Link></div><section className="panel documents-panel"><div className="filter-row"><div className="search-field"><Search size={17}/><input placeholder="Search your documents…" value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}}/></div><select aria-label="Filter by category" value={category} onChange={e=>setCategory(e.target.value)}>{['All','Identity','Home','Finance','Health','Other'].map(x=><option key={x}>{x}</option>)}</select><select aria-label="Sort documents" value={sort} onChange={e=>setSort(e.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="name">Name</option><option value="size">Largest first</option></select></div>{loading?<SkeletonRows/>:docs.length?<><div className="doc-list">{docs.map(d=><DocRow key={d.id} doc={d} onDelete={setSelected} onPreview={setPreviewDoc}/>)}</div><div className="pagination"><span>{docs.length} shown <i>·</i> Page {page} of {pages}</span><div><button disabled={page<=1} onClick={()=>setPage(page-1)}>Previous</button><button disabled={page>=pages} onClick={()=>setPage(page+1)}>Next</button></div></div></>:<EmptyState icon={Files} title={search?'No matching documents':'Nothing here yet'} text={search?'Try another title or filename.':'Documents you upload will appear here.'} action={!search&&<Link to="/upload" className="button primary small-btn"><Plus size={15}/> Upload a document</Link>}/>}</section></div>{selected&&<div className="modal-backdrop" onClick={()=>setSelected(null)}><div className="confirm-modal" role="dialog" aria-modal="true" onClick={e=>e.stopPropagation()}><div className="modal-icon"><Trash2 size={20}/></div><h2>Delete this document?</h2><p><b>{selected.title}</b> will be permanently removed from your vault.</p><div className="modal-actions"><button className="button quiet" onClick={()=>setSelected(null)}>Keep it</button><button className="button danger" onClick={remove}>Delete document</button></div></div></div>}{previewDoc&&<PreviewModal doc={previewDoc} onClose={()=>setPreviewDoc(null)}/>}</AppShell>}
function UploadPage(){const[files,setFiles]=useState([]),[drag,setDrag]=useState(false),[busy,setBusy]=useState(false),[progress,setProgress]=useState({}),[category,setCategory]=useState('Other'),toast=useContext(ToastCtx),nav=useNavigate();const accept=f=>{const allowed=['application/pdf','image/jpeg','image/png','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];const okay=[...f].filter(x=>allowed.includes(x.type)&&x.size<=15*1024*1024);if(okay.length!==f.length)toast('Some files were skipped. Choose PDF, JPG, PNG, DOCX, or XLSX up to 15 MB.','error');setFiles(p=>[...p,...okay]);};const upload=async()=>{setBusy(true);let fail=0;for(const [i,file]of files.entries()){const body=new FormData();body.append('file',file);body.append('category',category);try{await docsApi.upload(body,e=>setProgress(p=>({...p,[i]:Math.round(e.loaded/e.total*100)})));}catch{fail++}}setBusy(false);if(!fail){toast(files.length===1?'Document uploaded.':'Documents uploaded.');nav('/documents')}else toast(`${fail} upload${fail>1?'s':''} failed. Try again.`,'error')};return <AppShell><div className="page-content narrow-content"><div className="welcome-row"><div><div className="date-label">ADD TO YOUR VAULT</div><h1>Upload documents</h1><p>Bring your important records together in one place.</p></div></div><section className="panel upload-panel"><div className={`drop-zone ${drag?'dragging':''}`} onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);accept(e.dataTransfer.files)}}><div className="upload-cloud"><Upload size={23}/></div><h2>Drop files here, or <label className="browse-link">browse<input type="file" multiple hidden accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx" onChange={e=>accept(e.target.files)}/></label></h2><p>PDF, JPG, PNG, DOCX, or XLSX · Up to 15 MB each</p></div><div className="upload-options"><label>Save in category<select value={category} onChange={e=>setCategory(e.target.value)}>{['Other','Identity','Home','Finance','Health'].map(x=><option key={x}>{x}</option>)}</select></label><div className="supported"><LockKeyhole size={15}/> Private to your account</div></div>{files.length>0&&<div className="selected-files"><div className="selected-header"><b>Ready to upload</b><button onClick={()=>setFiles([])}>Clear all</button></div>{files.map((f,i)=><div className="selected-file" key={`${f.name}${i}`}><span className="doc-type"><FileText size={18}/></span><span><b>{f.name}</b><small>{fmtBytes(f.size)}{progress[i]!==undefined?` · ${progress[i]}%`:''}</small></span><button aria-label="Remove file" onClick={()=>setFiles(files.filter((_,n)=>n!==i))}><X size={17}/></button></div>)}</div>}<div className="upload-footer"><span><ShieldCheck size={16}/> Your files are stored privately</span><button className="button primary" disabled={!files.length||busy} onClick={upload}>{busy?'Uploading…':`Upload ${files.length||''} ${files.length===1?'document':'documents'}`} <ArrowRight size={16}/></button></div></section><div className="upload-tip"><span><ShieldCheck size={18}/></span><p><b>Just the essentials.</b> SafeKeep accepts common personal document formats. Your files stay private and can only be downloaded by your signed-in account.</p></div></div></AppShell>}
function SettingsPage(){const{state,logout}=useAuth(),[name,setName]=useState(state.user?.name||''),toast=useContext(ToastCtx),nav=useNavigate();const save=async e=>{e.preventDefault();try{const r=await api.patch('/profile',{name});toast('Profile updated.');}catch{toast('Could not update profile.','error')}};return <AppShell><div className="page-content"><div className="date-label">YOUR ACCOUNT</div><h1>Settings</h1><p className="page-sub">Manage your profile and account preferences.</p><section className="panel settings-panel"><div className="panel-head"><div><h2>Personal information</h2><p>Update the name associated with your vault.</p></div></div><form className="settings-form" onSubmit={save}><label>Full name<input value={name} onChange={e=>setName(e.target.value)} minLength="2" required/></label><label>Email address<input value={state.user?.email||''} disabled/></label><button className="button primary">Save changes</button></form><div className="settings-security"><span className="feature-icon"><LockKeyhole size={18}/></span><span><b>Private account</b><small>Your documents are scoped to your account.</small></span></div><button className="button quiet signout-btn" onClick={async()=>{await logout();nav('/')}}><LogOut size={16}/> Sign out</button></section></div></AppShell>}
function NotFound(){return <div className="not-found"><Brand/><div><span className="not-found-code">404</span><h1>This page wandered off.</h1><p>The page you’re looking for isn’t here. Your documents are safe.</p><Link to="/dashboard" className="button primary">Back to your vault <ArrowRight size={16}/></Link></div></div>}
function App(){return <AuthProvider><ToastProvider><Routes><Route path="/" element={<Landing/>}/><Route path="/login" element={<AuthPage mode="login"/>}/><Route path="/register" element={<AuthPage mode="register"/>}/><Route path="/dashboard" element={<Protected><Dashboard/></Protected>}/><Route path="/documents" element={<Protected><Documents/></Protected>}/><Route path="/upload" element={<Protected><UploadPage/></Protected>}/><Route path="/settings" element={<Protected><SettingsPage/></Protected>}/><Route path="*" element={<NotFound/>}/></Routes></ToastProvider></AuthProvider>}
createRoot(document.getElementById('root')).render(<BrowserRouter><App/></BrowserRouter>);
