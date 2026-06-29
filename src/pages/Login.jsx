import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/* ─── Keyframe injection ─────────────────────────────────────────────────────── */
const styleTag = document.createElement('style');
styleTag.textContent = `
  @keyframes bpr-spin { to { transform: rotate(360deg); } }
  @keyframes bpr-fadeup { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  .bpr-input:focus { border-color: #0d9488 !important; box-shadow: 0 0 0 3px rgba(13,148,136,0.12) !important; outline: none; }
  .bpr-social:hover { border-color: #cbd5e1 !important; background: #f8fafc !important; box-shadow: 0 2px 8px rgba(0,0,0,0.07) !important; }
  .bpr-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(13,148,136,0.45) !important; }
  .bpr-submit:active:not(:disabled) { transform: translateY(0); }
  @media (max-width: 768px) { .bpr-hero { display: none !important; } .bpr-form-panel { min-height: 100vh; } }
`;
if (!document.getElementById('bpr-styles')) {
  styleTag.id = 'bpr-styles';
  document.head.appendChild(styleTag);
}

/* ─── SVG Icons ──────────────────────────────────────────────────────────────── */
const IconMail = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>);
const IconLock = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>);
const IconEye = () => (<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>);
const IconEyeOff = () => (<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>);
const IconArrow = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>);
const IconUser = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>);
const IconBriefcase = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>);
const IconPhone = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.4 2 2 0 0 1 3.04 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/></svg>);
const IconCheck = () => (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>);
const IconGoogle = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>);
const IconLinkedIn = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>);

/* ─── BPR Logo ───────────────────────────────────────────────────────────────── */
const BPRLogo = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bpr-logo-g" x1="0" y1="0" x2="56" y2="56">
        <stop offset="0%" stopColor="rgba(255,255,255,0.25)"/>
        <stop offset="100%" stopColor="rgba(255,255,255,0.05)"/>
      </linearGradient>
    </defs>
    <rect width="56" height="56" rx="14" fill="rgba(255,255,255,0.12)"/>
    <rect width="56" height="56" rx="14" fill="url(#bpr-logo-g)"/>
    <path d="M12 22L28 13L44 22" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <rect x="14" y="21" width="28" height="21" rx="2" fill="none" stroke="white" strokeWidth="1.8"/>
    <rect x="18" y="26" width="5" height="5" rx="1" fill="white" opacity="0.8"/>
    <rect x="25.5" y="26" width="5" height="5" rx="1" fill="white" opacity="0.8"/>
    <rect x="33" y="26" width="5" height="5" rx="1" fill="white" opacity="0.8"/>
    <rect x="22" y="33" width="12" height="9" rx="1" fill="white" opacity="0.9"/>
    <circle cx="40" cy="17" r="7.5" fill="#F59E0B"/>
    <text x="40" y="21" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">★</text>
  </svg>
);

/* ─── Main Auth Page ─────────────────────────────────────────────────────────── */
export default function Login() {
  const [activeTab, setActiveTab] = useState('signin');
  const [pillStyle, setPillStyle] = useState({ left: 4, width: 0 });
  const tabsRef = useRef({});
  const { login } = useAuth();

  useEffect(() => {
    const el = tabsRef.current[activeTab];
    if (el) setPillStyle({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeTab]);

  useEffect(() => {
    const el = tabsRef.current['signin'];
    if (el) setPillStyle({ left: el.offsetLeft, width: el.offsetWidth });
  }, []);

  return (
    <div style={S.page}>
      {/* ── Hero Panel ── */}
      <div className="bpr-hero" style={S.hero}>
        <div style={S.heroContent}>
          <div style={S.logoRow}>
            <BPRLogo size={56} />
            <div>
              <div style={S.appName}>Business Pool Review</div>
              <div style={S.appTagline}>Professional Business Intelligence</div>
            </div>
          </div>
          <div style={S.heroHeading}>
            Discover. Review.<br />
            <span style={S.heroAccent}>Trust.</span>
          </div>
          <p style={S.heroSub}>
            Join thousands of professionals sharing honest reviews and ratings on businesses worldwide. Make informed decisions, every time.
          </p>
          <div style={S.statsGrid}>
            {[
              { v: '24K+', l: 'Businesses Listed' },
              { v: '186K', l: 'Verified Reviews' },
              { v: '4.8★', l: 'Platform Rating' },
            ].map((s) => (
              <div key={s.l} style={S.statCard}>
                <div style={S.statVal}>{s.v}</div>
                <div style={S.statLbl}>{s.l}</div>
              </div>
            ))}
          </div>
          <div style={S.features}>
            {[
              'Verified business profiles & credentials',
              'In-depth review system with ratings',
              'Industry insights & trend reports',
            ].map((f) => (
              <div key={f} style={S.featureRow}>
                <span style={S.featureDot}><IconCheck /></span>
                <span style={S.featureTxt}>{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={S.orb1}/><div style={S.orb2}/><div style={S.orb3}/>
      </div>

      {/* ── Form Panel ── */}
      <div className="bpr-form-panel" style={S.formPanel}>
        <div style={S.formWrap}>
          {/* Tab bar */}
          <div style={S.tabBar}>
            <div style={{ ...S.tabPill, left: pillStyle.left, width: pillStyle.width }} />
            {['signin', 'register'].map((t) => (
              <button
                key={t}
                id={`tab-${t}`}
                ref={(el) => { tabsRef.current[t] = el; }}
                style={{ ...S.tabBtn, ...(activeTab === t ? S.tabBtnOn : {}) }}
                onClick={() => setActiveTab(t)}
              >
                {t === 'signin' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {/* Slide area */}
          <div style={{ position: 'relative', minHeight: 200 }}>
            <div style={{
              ...S.slide,
              opacity: activeTab === 'signin' ? 1 : 0,
              transform: activeTab === 'signin' ? 'translateX(0)' : 'translateX(-20px)',
              pointerEvents: activeTab === 'signin' ? 'all' : 'none',
              position: activeTab === 'signin' ? 'relative' : 'absolute',
              top: 0, left: 0, width: '100%',
            }}>
              <SignInForm login={login} setTab={setActiveTab} />
            </div>
            <div style={{
              ...S.slide,
              opacity: activeTab === 'register' ? 1 : 0,
              transform: activeTab === 'register' ? 'translateX(0)' : 'translateX(20px)',
              pointerEvents: activeTab === 'register' ? 'all' : 'none',
              position: activeTab === 'register' ? 'relative' : 'absolute',
              top: 0, left: 0, width: '100%',
            }}>
              <RegisterForm setTab={setActiveTab} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sign In Form ───────────────────────────────────────────────────────────── */
function SignInForm({ login, setTab }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try { await login(email, password); }
    catch { setError('Invalid email or password. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} style={S.form} noValidate>
      <div style={S.fHdr}>
        <h2 style={S.fTitle}>Welcome back</h2>
        <p style={S.fSub}>Sign in to your Business Pool Review account</p>
      </div>
      {error && <div style={S.errBanner}>{error}</div>}
      <SocialButtons />
      <Divider text="or continue with email" />
      <Field id="si-email" label="Email Address" type="email" placeholder="you@company.com" value={email} onChange={setEmail} icon={<IconMail />} required />
      <div style={S.fGroup}>
        <div style={S.fLabelRow}>
          <label style={S.fLabel} htmlFor="si-pw">Password</label>
          <Link to="/forgot-password" style={S.forgotLnk}>Forgot your password?</Link>
        </div>
        <div style={S.inputWrap}>
          <span style={S.iIcon}><IconLock /></span>
          <input id="si-pw" type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="bpr-input" style={{ ...S.input, paddingRight: 44 }} required />
          <button type="button" style={S.eyeBtn} onClick={() => setShowPw(v => !v)}>{showPw ? <IconEyeOff /> : <IconEye />}</button>
        </div>
      </div>
      <SubmitBtn id="btn-signin" loading={loading} label="Sign In" />
      <p style={S.switchTxt}>Don't have an account?{' '}<button type="button" style={S.switchLnk} onClick={() => setTab('register')}>Create one free →</button></p>
    </form>
  );
}

/* ─── Register Form ──────────────────────────────────────────────────────────── */
function RegisterForm({ setTab }) {
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', company:'', jobTitle:'', role:'', password:'', confirmPw:'', terms:false });
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const set = (k) => (v) => { setForm(f => ({ ...f, [k]: v })); setErrors(p => ({ ...p, [k]: '' })); };
  const setCheck = (k) => (e) => set(k)(e.target.checked);
  const setVal = (k) => (e) => set(k)(e.target.value);

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (form.phone && !/^\+?[\d\s\-()]{7,}$/.test(form.phone)) e.phone = 'Invalid number';
    if (!form.company.trim()) e.company = 'Required';
    if (!form.role) e.role = 'Select a role';
    if (!form.password || form.password.length < 8) e.password = 'Min. 8 characters';
    if (form.password !== form.confirmPw) e.confirmPw = 'Passwords do not match';
    if (!form.terms) e.terms = 'You must accept the terms';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setTab('signin'), 2200);
  };

  if (success) return (
    <div style={S.successBox}>
      <div style={S.successIcon}>✓</div>
      <h3 style={S.successTitle}>Account Created!</h3>
      <p style={S.successSub}>Redirecting you to sign in…</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={S.form} noValidate>
      <div style={S.fHdr}>
        <h2 style={S.fTitle}>Create your account</h2>
        <p style={S.fSub}>Join the Business Pool Review community</p>
      </div>
      <SocialButtons label="Register with" />
      <Divider text="or fill in your details" />

      {/* Name row */}
      <div style={S.twoCol}>
        <Field id="rg-fn" label="First Name" placeholder="John" value={form.firstName} onChange={set('firstName')} icon={<IconUser />} error={errors.firstName} required />
        <Field id="rg-ln" label="Last Name" placeholder="Doe" value={form.lastName} onChange={set('lastName')} error={errors.lastName} required />
      </div>

      <Field id="rg-em" label="Email Address" type="email" placeholder="you@company.com" value={form.email} onChange={set('email')} icon={<IconMail />} error={errors.email} required />
      <Field id="rg-ph" label="Phone Number" type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={set('phone')} icon={<IconPhone />} error={errors.phone} />

      <div style={S.twoCol}>
        <Field id="rg-co" label="Company / Business" placeholder="Acme Corp" value={form.company} onChange={set('company')} icon={<IconBriefcase />} error={errors.company} required />
        <Field id="rg-jt" label="Job Title" placeholder="Product Manager" value={form.jobTitle} onChange={set('jobTitle')} />
      </div>

      {/* Role select */}
      <div style={S.fGroup}>
        <label style={S.fLabel} htmlFor="rg-role">Your Role <span style={S.star}>*</span></label>
        <div style={S.inputWrap}>
          <select id="rg-role" value={form.role} onChange={setVal('role')} className="bpr-input"
            style={{ ...S.input, appearance:'none', cursor:'pointer', color: form.role ? '#0f172a' : '#94a3b8', paddingLeft: 14 }}>
            <option value="" disabled>Select your role…</option>
            <option value="business_owner">Business Owner</option>
            <option value="professional">Professional / Employee</option>
            <option value="investor">Investor</option>
            <option value="consultant">Consultant</option>
            <option value="analyst">Market Analyst</option>
            <option value="consumer">Consumer</option>
          </select>
          <span style={{ ...S.iIcon, left:'auto', right:12, pointerEvents:'none' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
        </div>
        {errors.role && <span style={S.fErr}>{errors.role}</span>}
      </div>

      {/* Password */}
      <div style={S.fGroup}>
        <label style={S.fLabel} htmlFor="rg-pw">Password <span style={S.star}>*</span></label>
        <div style={S.inputWrap}>
          <span style={S.iIcon}><IconLock /></span>
          <input id="rg-pw" type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters" value={form.password} onChange={setVal('password')} className="bpr-input" style={{ ...S.input, paddingRight:44, ...(errors.password ? S.inputErr : {}) }} />
          <button type="button" style={S.eyeBtn} onClick={() => setShowPw(v => !v)}>{showPw ? <IconEyeOff /> : <IconEye />}</button>
        </div>
        {errors.password && <span style={S.fErr}>{errors.password}</span>}
        {form.password && <PwStrength pw={form.password} />}
      </div>

      {/* Confirm Password */}
      <div style={S.fGroup}>
        <label style={S.fLabel} htmlFor="rg-cpw">Confirm Password <span style={S.star}>*</span></label>
        <div style={S.inputWrap}>
          <span style={S.iIcon}><IconLock /></span>
          <input id="rg-cpw" type={showCPw ? 'text' : 'password'} placeholder="Re-enter your password" value={form.confirmPw} onChange={setVal('confirmPw')} className="bpr-input" style={{ ...S.input, paddingRight:44, ...(errors.confirmPw ? S.inputErr : {}) }} />
          <button type="button" style={S.eyeBtn} onClick={() => setShowCPw(v => !v)}>{showCPw ? <IconEyeOff /> : <IconEye />}</button>
        </div>
        {errors.confirmPw && <span style={S.fErr}>{errors.confirmPw}</span>}
      </div>

      {/* Terms */}
      <div style={S.fGroup}>
        <label style={S.checkLbl} htmlFor="rg-terms">
          <input id="rg-terms" type="checkbox" checked={form.terms} onChange={setCheck('terms')} style={{ display:'none' }} />
          <span style={{ ...S.checkbox, ...(form.terms ? S.checkboxOn : {}) }}>{form.terms && <IconCheck />}</span>
          <span style={S.termsTxt}>I agree to the{' '}<a href="#" style={S.termsLnk}>Terms of Service</a>{' '}and{' '}<a href="#" style={S.termsLnk}>Privacy Policy</a></span>
        </label>
        {errors.terms && <span style={{ ...S.fErr, marginTop:4 }}>{errors.terms}</span>}
      </div>

      <SubmitBtn id="btn-register" loading={loading} label="Create Free Account" />
      <p style={S.switchTxt}>Already have an account?{' '}<button type="button" style={S.switchLnk} onClick={() => setTab('signin')}>Sign in →</button></p>
    </form>
  );
}

/* ─── Shared Components ──────────────────────────────────────────────────────── */
function Field({ id, label, type='text', placeholder, value, onChange, icon, error, required }) {
  return (
    <div style={S.fGroup}>
      {label && <label style={S.fLabel} htmlFor={id}>{label}{required && <span style={S.star}> *</span>}</label>}
      <div style={S.inputWrap}>
        {icon && <span style={S.iIcon}>{icon}</span>}
        <input id={id} type={type} placeholder={placeholder} value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bpr-input"
          style={{ ...S.input, ...(icon ? {} : { paddingLeft:14 }), ...(error ? S.inputErr : {}) }}
          required={required} />
      </div>
      {error && <span style={S.fErr}>{error}</span>}
    </div>
  );
}

function SocialButtons({ label='Continue with' }) {
  return (
    <div style={S.socRow}>
      {[{ id:'btn-google', Icon:IconGoogle, lbl:`${label} Google` }, { id:'btn-linkedin', Icon:IconLinkedIn, lbl:`${label} LinkedIn` }].map(({ id, Icon, lbl }) => (
        <button key={id} id={id} type="button" className="bpr-social" style={S.socBtn}><Icon /><span>{lbl}</span></button>
      ))}
    </div>
  );
}

function Divider({ text }) {
  return (
    <div style={S.divider}>
      <div style={S.divLine} />
      <span style={S.divTxt}>{text}</span>
      <div style={S.divLine} />
    </div>
  );
}

function SubmitBtn({ id, loading, label }) {
  return (
    <button id={id} type="submit" disabled={loading} className="bpr-submit"
      style={{ ...S.submitBtn, ...(loading ? S.submitOff : {}) }}>
      {loading ? <><span style={S.spinner} />{label.includes('Create') ? 'Creating account…' : 'Signing in…'}</> : <>{label}<span style={S.btnArrow}><IconArrow /></span></>}
    </button>
  );
}

function PwStrength({ pw }) {
  const checks = [pw.length >= 8, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^a-zA-Z0-9]/.test(pw)];
  const s = checks.filter(Boolean).length;
  const colors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  return (
    <div style={{ marginTop:8 }}>
      <div style={{ display:'flex', gap:4, marginBottom:4 }}>
        {[1,2,3,4].map(i => <div key={i} style={{ flex:1, height:3, borderRadius:99, background: i <= s ? colors[s] : '#e2e8f0', transition:'background 0.3s' }} />)}
      </div>
      <span style={{ fontSize:11, color:colors[s], fontWeight:600 }}>{labels[s]}</span>
    </div>
  );
}

/* ─── Style Constants ────────────────────────────────────────────────────────── */
const TEAL = '#0d9488';
const TEAL_D = '#0f766e';

const S = {
  page: { display:'flex', minHeight:'100vh', fontFamily:"'Inter',ui-sans-serif,system-ui,sans-serif", background:'#f8fafc' },

  /* Hero */
  hero: { display:'flex', flexDirection:'column', justifyContent:'center', width:'45%', minHeight:'100vh', background:'linear-gradient(135deg,#134e4a 0%,#0d9488 42%,#0891b2 75%,#1e40af 100%)', padding:'48px 52px', position:'relative', overflow:'hidden' },
  heroContent: { position:'relative', zIndex:2 },
  logoRow: { display:'flex', alignItems:'center', gap:16, marginBottom:48 },
  appName: { fontSize:19, fontWeight:700, color:'#fff', letterSpacing:'-0.3px', lineHeight:1.2 },
  appTagline: { fontSize:11, color:'rgba(255,255,255,0.6)', marginTop:2, letterSpacing:'0.5px', textTransform:'uppercase' },
  heroHeading: { fontSize:46, fontWeight:800, color:'#fff', lineHeight:1.1, letterSpacing:'-1.5px', marginBottom:20 },
  heroAccent: { background:'linear-gradient(90deg,#a7f3d0,#7dd3fc)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' },
  heroSub: { fontSize:14.5, color:'rgba(255,255,255,0.72)', lineHeight:1.75, marginBottom:40, maxWidth:360 },
  statsGrid: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:36 },
  statCard: { background:'rgba(255,255,255,0.1)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:14, padding:'16px 12px', textAlign:'center' },
  statVal: { fontSize:22, fontWeight:800, color:'#fff', letterSpacing:'-0.5px', lineHeight:1, marginBottom:4 },
  statLbl: { fontSize:11, color:'rgba(255,255,255,0.65)', lineHeight:1.3 },
  features: { display:'flex', flexDirection:'column', gap:12 },
  featureRow: { display:'flex', alignItems:'center', gap:10 },
  featureDot: { width:22, height:22, borderRadius:'50%', background:'rgba(167,243,208,0.2)', border:'1.5px solid rgba(167,243,208,0.5)', display:'flex', alignItems:'center', justifyContent:'center', color:'#a7f3d0', flexShrink:0 },
  featureTxt: { fontSize:13.5, color:'rgba(255,255,255,0.82)' },
  orb1: { position:'absolute', top:-100, right:-100, width:350, height:350, borderRadius:'50%', background:'radial-gradient(circle,rgba(56,189,248,0.25) 0%,transparent 70%)', pointerEvents:'none' },
  orb2: { position:'absolute', bottom:-80, left:-80, width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(20,184,166,0.3) 0%,transparent 70%)', pointerEvents:'none' },
  orb3: { position:'absolute', bottom:'40%', right:-60, width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.2) 0%,transparent 70%)', pointerEvents:'none' },

  /* Form Panel */
  formPanel: { flex:1, display:'flex', alignItems:'flex-start', justifyContent:'center', background:'#f8fafc', overflowY:'auto', padding:'40px 24px' },
  formWrap: { width:'100%', maxWidth:480, paddingTop:8 },

  /* Tabs */
  tabBar: { display:'flex', position:'relative', background:'#e2e8f0', borderRadius:12, padding:4, marginBottom:32 },
  tabPill: { position:'absolute', top:4, height:'calc(100% - 8px)', background:'#fff', borderRadius:9, transition:'left 0.28s cubic-bezier(0.4,0,0.2,1),width 0.28s cubic-bezier(0.4,0,0.2,1)', boxShadow:'0 2px 8px rgba(0,0,0,0.1)', zIndex:0 },
  tabBtn: { flex:1, padding:'10px 0', border:'none', background:'transparent', borderRadius:9, fontSize:14, fontWeight:500, color:'#64748b', cursor:'pointer', position:'relative', zIndex:1, transition:'color 0.2s', fontFamily:'inherit' },
  tabBtnOn: { color:'#0f172a', fontWeight:600 },

  /* Slide */
  slide: { transition:'opacity 0.28s ease,transform 0.28s ease' },

  /* Form */
  form: { display:'flex', flexDirection:'column', gap:16 },
  fHdr: { marginBottom:4 },
  fTitle: { fontSize:26, fontWeight:700, color:'#0f172a', letterSpacing:'-0.5px', marginBottom:4 },
  fSub: { fontSize:14, color:'#64748b' },
  errBanner: { background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626', borderRadius:10, padding:'10px 14px', fontSize:13.5 },

  /* Social */
  socRow: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 },
  socBtn: { display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'10px 12px', border:'1.5px solid #e2e8f0', borderRadius:10, background:'#fff', cursor:'pointer', fontSize:13, fontWeight:500, color:'#374151', transition:'all 0.18s', fontFamily:'inherit', whiteSpace:'nowrap' },

  /* Divider */
  divider: { display:'flex', alignItems:'center', gap:12 },
  divLine: { flex:1, height:1, background:'#e2e8f0' },
  divTxt: { fontSize:12, color:'#94a3b8', whiteSpace:'nowrap', fontWeight:500 },

  /* Fields */
  fGroup: { display:'flex', flexDirection:'column', gap:5 },
  fLabelRow: { display:'flex', alignItems:'center', justifyContent:'space-between' },
  fLabel: { fontSize:13.5, fontWeight:600, color:'#374151' },
  star: { color:'#ef4444' },
  forgotLnk: { fontSize:12.5, color:TEAL, textDecoration:'none', fontWeight:500 },
  inputWrap: { position:'relative', display:'flex', alignItems:'center' },
  iIcon: { position:'absolute', left:12, color:'#94a3b8', display:'flex', alignItems:'center', pointerEvents:'none', zIndex:1 },
  input: { width:'100%', height:44, padding:'0 14px 0 38px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:14, color:'#0f172a', background:'#fff', outline:'none', transition:'border-color 0.18s,box-shadow 0.18s', fontFamily:'inherit', boxSizing:'border-box' },
  inputErr: { borderColor:'#fca5a5', background:'#fff7f7' },
  eyeBtn: { position:'absolute', right:12, background:'none', border:'none', cursor:'pointer', color:'#94a3b8', display:'flex', alignItems:'center', padding:4, borderRadius:6 },
  fErr: { fontSize:12, color:'#ef4444', marginTop:2 },
  twoCol: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 },

  /* Submit */
  submitBtn: { display:'flex', alignItems:'center', justifyContent:'center', gap:8, width:'100%', height:48, marginTop:4, background:`linear-gradient(135deg,${TEAL_D},${TEAL})`, color:'#fff', border:'none', borderRadius:12, fontSize:15, fontWeight:600, cursor:'pointer', letterSpacing:'0.1px', boxShadow:'0 4px 16px rgba(13,148,136,0.4)', transition:'all 0.2s ease', fontFamily:'inherit' },
  submitOff: { opacity:0.7, cursor:'not-allowed' },
  btnArrow: { display:'flex', alignItems:'center' },
  spinner: { display:'inline-block', width:16, height:16, border:'2.5px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'bpr-spin 0.7s linear infinite' },

  /* Footer */
  switchTxt: { textAlign:'center', fontSize:13.5, color:'#64748b', margin:'4px 0 8px' },
  switchLnk: { color:TEAL, fontWeight:600, background:'none', border:'none', cursor:'pointer', fontSize:13.5, padding:0, fontFamily:'inherit' },

  /* Terms */
  checkLbl: { display:'flex', alignItems:'flex-start', gap:10, cursor:'pointer' },
  checkbox: { width:18, height:18, borderRadius:5, border:'1.5px solid #cbd5e1', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1, transition:'all 0.15s' },
  checkboxOn: { background:TEAL, borderColor:TEAL, color:'#fff' },
  termsTxt: { fontSize:13, color:'#475569', lineHeight:1.5 },
  termsLnk: { color:TEAL, fontWeight:500, textDecoration:'none' },

  /* Success */
  successBox: { display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'64px 0', gap:12 },
  successIcon: { width:64, height:64, borderRadius:'50%', background:'#d1fae5', color:'#059669', fontSize:28, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, marginBottom:8 },
  successTitle: { fontSize:22, fontWeight:700, color:'#0f172a', margin:0 },
  successSub: { color:'#64748b', fontSize:14, margin:0 },
};
