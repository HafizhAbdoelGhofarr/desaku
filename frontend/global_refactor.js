const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const frontendAppDir = path.join(__dirname, 'app');

walkDir(frontendAppDir, function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Remove Brutalist Shadows & Thick Borders (just in case they exist anywhere)
    content = content.replace(/border-4 border-slate-900/g, "border border-slate-200");
    content = content.replace(/border-2 border-slate-900/g, "border border-slate-200");
    content = content.replace(/border-b-4 border-slate-900/g, "border-b border-slate-200");
    
    content = content.replace(/shadow-\[8px_8px_0_0_#[0-9a-fA-F]+\]/g, "shadow-sm");
    content = content.replace(/shadow-\[12px_12px_0_0_#[0-9a-fA-F]+\]/g, "shadow-sm");
    content = content.replace(/shadow-\[4px_4px_0_0_#[0-9a-fA-F]+\]/g, "shadow-sm");
    
    // 2. Remove AI-template heavy shadows and roundings
    content = content.replace(/rounded-3xl/g, "rounded-2xl");
    content = content.replace(/shadow-2xl/g, "shadow-xl"); // soften huge shadows
    // Replace shadow-md shadow-emerald-200 with normal shadow-md
    content = content.replace(/shadow-md shadow-emerald-200/g, "shadow-md shadow-indigo-200/50");
    content = content.replace(/shadow-lg shadow-emerald-600\/20/g, "shadow-md shadow-indigo-600/20");

    // 3. Fix primary button colors (Emerald -> Indigo) 
    // Button bg replacements
    content = content.replace(/bg-emerald-600/g, "bg-indigo-600");
    content = content.replace(/hover:bg-emerald-700/g, "hover:bg-indigo-700");
    content = content.replace(/bg-emerald-700 hover:bg-emerald-800/g, "bg-indigo-600 hover:bg-indigo-700");
    content = content.replace(/bg-emerald-700/g, "bg-indigo-600");
    
    // Text accents
    content = content.replace(/text-emerald-400/g, "text-indigo-400");
    // Only replace some specific text-emerald-800 if they are in headers, but let's be safe.
    // In layouts (active links)
    content = content.replace(/bg-emerald-50 text-emerald-700/g, "bg-indigo-50 text-indigo-700");
    content = content.replace(/bg-emerald-100 text-emerald-800 border-emerald-200/g, "bg-indigo-50 text-indigo-700 border-indigo-100");
    content = content.replace(/bg-emerald-100 text-emerald-800/g, "bg-indigo-100 text-indigo-800");

    // Focus rings
    content = content.replace(/focus:ring-emerald-500/g, "focus:ring-indigo-500");
    content = content.replace(/border-emerald-500/g, "border-indigo-500");
    content = content.replace(/border-emerald-200/g, "border-slate-200");
    content = content.replace(/border-emerald-100/g, "border-slate-100");

    // 5. Gradients - neutralize wild gradients
    content = content.replace(/bg-gradient-to-[a-z]+ from-emerald-[0-9]+ to-[a-z]+-[0-9]+/g, "bg-indigo-900");
    content = content.replace(/bg-gradient-to-[a-z]+ from-emerald-[0-9]+ via-[a-z]+-[0-9]+ to-[a-z]+-[0-9]+/g, "bg-indigo-900");
    content = content.replace(/bg-gradient-to-[a-z]+ from-emerald-[0-9]+\/60 to-[a-z]+-[0-9]+/g, "bg-indigo-900/90");

    // For landing page specific weird gradient
    content = content.replace(/bg-gradient-to-b from-emerald-50 to-white/g, "bg-slate-50");
    content = content.replace(/text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500/g, "text-indigo-600");

    // Grid backgrounds (dots) from layouts
    content = content.replace(/bg-\[url\('\/grid\.svg'\)\] bg-center/g, "");
    content = content.replace(/bg-slate-50 relative/g, "bg-slate-50");
    content = content.replace(/<div className="absolute inset-0 bg-slate-50\/80 backdrop-blur-3xl z-[-1]"><\/div>/g, "");
    content = content.replace(/<div className="absolute inset-0 z-\[-1\] bg-\[url\('\/grid\.svg'\)\] bg-center opacity-30"><\/div>/g, "");
    
    // Admin Dashboard specific fix for Province Filter
    if (filePath.includes('admin') && filePath.includes('dashboard')) {
      // Remove the province block in JSX
      const provBlockRegex = /<div>\s*<label className="block[^>]*>\s*PROVINSI\s*<\/label>\s*<select[\s\S]*?<\/select>\s*<\/div>/g;
      content = content.replace(provBlockRegex, "");
      
      // Update grid from sm:grid-cols-3 to sm:grid-cols-2
      content = content.replace(/sm:grid-cols-3 gap-3/g, "sm:grid-cols-2 gap-4");
      
      // Clean up top label
      content = content.replace(/Wilayah Kerja: \{selectedKabupaten !== "all" \? selectedKabupaten : selectedProvince !== "all" \? selectedProvince : "Seluruh Indonesia"\}/g, "Wilayah Kerja: {selectedKabupaten !== 'all' ? selectedKabupaten : 'Semua Kabupaten / Kota'}");
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Refactored:', filePath);
    }
  }
});
