import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QrCode, Wallet, Smartphone, ShieldCheck } from 'lucide-react';
import ActionModal from '../components/ActionModal';

type AuthMode = 'login' | 'register' | 'forgot';
type Role = 'passenger' | 'conductor' | 'operator';

export default function AuthPortal() {
 const navigate = useNavigate();
 const location = useLocation();
 const [authMode, setAuthMode] = useState<AuthMode>(location.pathname === '/register' ? 'register' : 'login');
 const [activeRole, setActiveRole] = useState<Role>('passenger');
 
 // State for forms
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [confirmPassword, setConfirmPassword] = useState('');
 
 // Dynamic fields
 const [firstName, setFirstName] = useState('');
 const [lastName, setLastName] = useState('');
 const [phone, setPhone] = useState('');
 const [nic, setNic] = useState('');
 const [companyName, setCompanyName] = useState('');
 const [brn, setBrn] = useState('');
 const [fleetSize, setFleetSize] = useState('');
 const [license, setLicense] = useState('');
 const [assignedBus, setAssignedBus] = useState('');

 const [modalOpen, setModalOpen] = useState(false);
 const [modalContent, setModalContent] = useState({ title: '', msg: '' });

 const handleAction = (title: string, msg: string) => {
 setModalContent({ title, msg });
 setModalOpen(true);
 };

 const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (file) {
 if (file.type !== 'application/pdf') {
 handleAction('Security Alert', 'Only strict PDF files are allowed for security reasons.');
 e.target.value = '';
 } else if (file.size > 2 * 1024 * 1024) {
 handleAction('File Too Large', 'The selected PDF exceeds the strict 2MB limit.');
 e.target.value = '';
 }
 }
 };

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 if (authMode === 'forgot') {
 handleAction('Reset Link Sent', 'If an account exists for this email, a password reset link has been sent.');
 } else if (authMode === 'register') {
 if (password !== confirmPassword) {
 handleAction('Validation Error', 'Passwords do not match. Please try again.');
 return;
 }
 handleAction('Registration Received', 'Your account details and KYC documents have been submitted for review.');
 } else {
 // Login route bypass simulation for demo
 if (activeRole === 'passenger') navigate('/passenger');
 if (activeRole === 'conductor') navigate('/conductor');
 if (activeRole === 'operator') navigate('/operator');
 }
 };

 const roles: { id: Role, label: string }[] = [
 { id: 'passenger', label: 'Passenger' },
 { id: 'conductor', label: 'Conductor' },
 { id: 'operator', label: 'Bus Owner' }
 ];

 return (
 <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 font-sans">
 <ActionModal 
 isOpen={modalOpen} 
 onClose={() => setModalOpen(false)} 
 title={modalContent.title} 
 message={modalContent.msg} 
 />

 <div className="w-full max-w-[1100px] bg-white rounded-[24px] shadow-2xl flex overflow-hidden border border-gray-100 ">
 
 {/* LEFT PANEL - BRANDING (Hidden on Mobile) */}
 <div className="hidden md:flex w-1/2 bg-blue-600 p-12 flex-col justify-between relative overflow-hidden">
 {/* Background decorative elements */}
 <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
 <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-700 rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/3"></div>
 
 <div className="relative z-10">
 <div className="flex items-center gap-3 mb-16 cursor-pointer" onClick={() => navigate('/')}>
 <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 font-bold text-xl shadow-sm">T</div>
 <span className="text-xl font-bold text-white tracking-wide">TapRide</span>
 </div>

 <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
 {authMode === 'login' ? (
 <>Smarter journeys.<br />Seamless travel.</>
 ) : (
 <>Start your<br />smarter journey.</>
 )}
 </h1>
 <p className="text-blue-100 text-sm lg:text-base mb-12 max-w-sm leading-relaxed">
 {authMode === 'login' 
 ? 'A modern digital public transport platform designed to make bus travel faster, easier, and more convenient.' 
 : 'Create your TapRide account and experience a simpler, smarter way to manage public transport journeys.'}
 </p>

 <div className="space-y-5">
 {[
 { icon: QrCode, text: 'Fast QR-based boarding' },
 { icon: Wallet, text: 'Secure digital wallet & payments' },
 { icon: Smartphone, text: 'Digital journey records' },
 { icon: ShieldCheck, text: 'Smart fare management' }
 ].map((feature, idx) => (
 <div key={idx} className="flex items-center gap-4 text-blue-50">
 <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
 <feature.icon className="w-4 h-4" />
 </div>
 <span className="text-sm font-medium">{feature.text}</span>
 </div>
 ))}
 </div>
 </div>

 <div className="relative z-10 text-xs text-blue-200/60 font-medium">
 © 2026 TapRide. Smart Public Transport Platform.
 </div>
 </div>

 {/* RIGHT PANEL - FORM */}
 <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center max-h-[90vh] overflow-y-auto custom-scrollbar">
 
 {/* Mobile Logo */}
 <div className="md:hidden flex items-center gap-3 mb-8" onClick={() => navigate('/')}>
 <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">T</div>
 <span className="text-xl font-bold text-slate-900 ">TapRide</span>
 </div>

 <div className="mb-8">
 <h2 className="text-3xl font-bold text-slate-900 mb-2">
 {authMode === 'login' ? 'Welcome back' : authMode === 'register' ? 'Create your account' : 'Reset password'}
 </h2>
 <p className="text-sm text-slate-500 ">
 {authMode === 'login' 
 ? 'Sign in to continue to your TapRide account.' 
 : authMode === 'register' 
 ? 'Register with TapRide to get started.' 
 : 'Enter your email to receive reset instructions.'}
 </p>
 </div>

 <form onSubmit={handleSubmit} className="space-y-6">
 
 {/* ROLE SELECTOR */}
 {authMode !== 'forgot' && (
 <div>
 <label className="block text-sm font-semibold text-slate-700 mb-3">
 {authMode === 'login' ? 'Login as' : 'Select account type'}
 </label>
 <div className="flex bg-slate-50 /50 p-1 rounded-xl border border-gray-100 ">
 {roles.map(r => (
 <button
 key={r.id}
 type="button"
 onClick={() => setActiveRole(r.id)}
 className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
 activeRole === r.id 
 ? 'bg-white text-blue-600 shadow-sm border border-slate-200 ' 
 : 'text-slate-500 hover:text-gray-700 :text-gray-300'
 }`}
 >
 {r.label}
 </button>
 ))}
 </div>
 </div>
 )}

 {/* DYNAMIC REGISTRATION FIELDS */}
 {authMode === 'register' && (
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-semibold text-slate-700 mb-2">First name</label>
 <input type="text" pattern="^[^<>;%*()]+$" title="For security, special characters like < > ; % * are not allowed." value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" placeholder="John" required />
 </div>
 <div>
 <label className="block text-sm font-semibold text-slate-700 mb-2">Last name</label>
 <input type="text" pattern="^[^<>;%*()]+$" title="For security, special characters like < > ; % * are not allowed." value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" placeholder="Doe" required />
 </div>
 </div>
 )}

 {/* EMAIL FIELD */}
 <div>
 <label className="block text-sm font-semibold text-slate-700 mb-2">Email address</label>
 <input 
 type="email" pattern="^[^<>;%*()]+$" title="For security, special characters like < > ; % * are not allowed."
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
 placeholder="you@example.com"
 required
 />
 </div>

 {/* KYC EXTENDED FIELDS (Only in register mode) */}
 {authMode === 'register' && activeRole === 'passenger' && (
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-semibold text-slate-700 mb-2">Phone number</label>
 <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" placeholder="+94 7X XXX XXXX" required />
 </div>
 <div>
 <label className="block text-sm font-semibold text-slate-700 mb-2">NIC / ID number</label>
 <input type="text" pattern="^[^<>;%*()]+$" title="For security, special characters like < > ; % * are not allowed." value={nic} onChange={(e) => setNic(e.target.value)} className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" placeholder="199XXXXXXXXX" required />
 </div>
 </div>
 )}

 {authMode === 'register' && activeRole === 'operator' && (
 <>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name</label>
 <input type="text" pattern="^[^<>;%*()]+$" title="For security, special characters like < > ; % * are not allowed." value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" placeholder="Superline Travels" required />
 </div>
 <div>
 <label className="block text-sm font-semibold text-slate-700 mb-2">Phone number</label>
 <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" placeholder="+94 7X XXX XXXX" required />
 </div>
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-semibold text-slate-700 mb-2">Business Reg (BRN)</label>
 <input type="text" pattern="^[^<>;%*()]+$" title="For security, special characters like < > ; % * are not allowed." value={brn} onChange={(e) => setBrn(e.target.value)} className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" placeholder="PV-123456" required />
 </div>
 <div>
 <label className="block text-sm font-semibold text-slate-700 mb-2">Fleet Size</label>
 <input type="number" value={fleetSize} onChange={(e) => setFleetSize(e.target.value)} className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" placeholder="e.g. 5" min="1" required />
 </div>
 </div>
 <div>
 <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Reg Docs (PDF)</label>
 <input type="file" accept="application/pdf" onChange={handleFileUpload} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-slate-200 rounded-xl bg-white p-1.5" required />
 </div>
 </>
 )}

 {authMode === 'register' && activeRole === 'conductor' && (
 <>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-semibold text-slate-700 mb-2">NIC / ID number</label>
 <input type="text" pattern="^[^<>;%*()]+$" title="For security, special characters like < > ; % * are not allowed." value={nic} onChange={(e) => setNic(e.target.value)} className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" placeholder="199XXXXXXXXX" required />
 </div>
 <div>
 <label className="block text-sm font-semibold text-slate-700 mb-2">License No.</label>
 <input type="text" pattern="^[^<>;%*()]+$" title="For security, special characters like < > ; % * are not allowed." value={license} onChange={(e) => setLicense(e.target.value)} className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" placeholder="NTC-C-XXXX" required />
 </div>
 </div>
 <div>
 <label className="block text-sm font-semibold text-slate-700 mb-2">Assigned Bus Plate</label>
 <input type="text" pattern="^[^<>;%*()]+$" title="For security, special characters like < > ; % * are not allowed." value={assignedBus} onChange={(e) => setAssignedBus(e.target.value)} className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" placeholder="NC-XXXX" required />
 </div>
 <div>
 <label className="block text-sm font-semibold text-slate-700 mb-2">Upload License (PDF)</label>
 <input type="file" accept="application/pdf" onChange={handleFileUpload} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-slate-200 rounded-xl bg-white p-1.5" required />
 </div>
 </>
 )}

 {/* PASSWORD FIELDS */}
 {authMode !== 'forgot' && (
 <div className={authMode === 'register' ? "grid grid-cols-2 gap-4" : ""}>
 <div>
 <div className="flex justify-between items-center mb-2">
 <label className="block text-sm font-semibold text-slate-700 ">Password</label>
 </div>
 <input 
 type="password" 
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
 placeholder="Enter your password"
 required
 />
 {authMode === 'register' && (
 <p className="text-[10px] text-gray-400 mt-2">Use at least 8 characters.</p>
 )}
 </div>
 {authMode === 'register' && (
 <div>
 <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm password</label>
 <input 
 type="password" 
 value={confirmPassword}
 onChange={(e) => setConfirmPassword(e.target.value)}
 className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
 placeholder="Confirm password"
 required
 />
 </div>
 )}
 </div>
 )}

 {/* OPTIONS (Remember Me / Terms) */}
 {authMode === 'login' && (
 <div className="flex items-center justify-between">
 <label className="flex items-center gap-2 cursor-pointer">
 <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
 <span className="text-xs text-gray-600 ">Remember me</span>
 </label>
 <button type="button" onClick={() => setAuthMode('forgot')} className="text-xs font-bold text-blue-600 hover:text-blue-700">
 Forgot password?
 </button>
 </div>
 )}
 {authMode === 'register' && (
 <label className="flex items-start gap-3 cursor-pointer mb-6">
 <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5" required />
 <span className="text-xs text-slate-500 leading-relaxed">
 I agree to the <a href="/terms" className="font-bold text-blue-600 hover:underline">Terms of Service</a> and <a href="/privacy" className="font-bold text-blue-600 hover:underline">Privacy Policy</a> of TapRide.
 </span>
 </label>
 )}

 {/* SUBMIT BUTTON */}
 <button 
 type="submit" 
 className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md shadow-blue-600/20 transition-all text-sm"
 >
 {authMode === 'login' ? 'Sign in to TapRide' : authMode === 'register' ? 'Create TapRide Account' : 'Send Reset Link'}
 </button>

 {/* FOOTER TOGGLE */}
 <div className="pt-4 text-center">
 <span className="text-xs text-slate-500 ">
 {authMode === 'login' ? "Don't have a TapRide account? " : authMode === 'register' ? "Already have an account? " : "Remembered your password? "}
 </span>
 <button 
 type="button"
 onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} 
 className="text-xs font-bold text-blue-600 hover:text-blue-700"
 >
 {authMode === 'login' ? 'Create an account' : authMode === 'register' ? 'Sign in' : 'Sign in'}
 </button>
 </div>

 </form>
 </div>
 </div>
 </div>
 );
}
