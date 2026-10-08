const fs = require('fs');
const path = 'C:\\\\Users\\\\USER\\\\Desktop\\\\TapRide-system\\\\frontend\\\\src\\\\pages\\\\AuthPortal.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Remove all dark: classes
code = code.replace(/dark:[a-zA-Z0-9_\-\[\]\#]+/g, '');
code = code.replace(/  +/g, ' '); // Clean up double spaces

// 2. Replace the broken logo image with Manuka's 'T' logo
const newLogo = `<div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 font-bold text-xl shadow-sm">T</div>`;
const newMobileLogo = `<div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">T</div>`;

let parts = code.split('<img src="/logo.png" alt="TapRide Logo" className="w-10 h-10 rounded-xl shadow-sm" />');
if (parts.length === 3) {
    code = parts[0] + newLogo + parts[1] + newMobileLogo + parts[2];
}

// 3. Improve Typography and Spacing to match Figma
code = code.replace(/text-xs font-bold text-gray-900/g, 'text-sm font-semibold text-slate-700');
code = code.replace(/text-gray-900/g, 'text-slate-900');
code = code.replace(/text-gray-500/g, 'text-slate-500');
code = code.replace(/border-gray-200/g, 'border-slate-200');
code = code.replace(/border-gray-300/g, 'border-slate-300');
code = code.replace(/bg-gray-50/g, 'bg-slate-50');
code = code.replace(/text-xs font-bold rounded-lg/g, 'text-sm font-semibold rounded-lg');
code = code.replace(/px-4 py-3 text-sm/g, 'px-4 py-2.5 text-base shadow-sm');
code = code.replace(/bg-\[\#f8fafc\]/g, 'bg-slate-50');
code = code.replace(/bg-\[\#121622\]/g, 'bg-white');

fs.writeFileSync(path, code);
console.log('Fixed!');
