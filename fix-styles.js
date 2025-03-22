// This script will help diagnose CSS issues
const fs = require('fs');
const path = require('path');

// Check if globals.css is properly imported in layout.tsx
try {
  const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  
  console.log('Checking app/layout.tsx for CSS import...');
  
  if (!layoutContent.includes('./globals.css')) {
    console.error('❌ Missing globals.css import in app/layout.tsx');
  } else {
    console.log('✅ globals.css is imported in layout.tsx');
  }
  
  // Check if the import is before or after other imports
  const lines = layoutContent.split('\n');
  let cssImportLine = -1;
  let otherImportLines = [];
  
  lines.forEach((line, index) => {
    if (line.includes('./globals.css')) {
      cssImportLine = index;
    } else if (line.includes('import') && !line.includes('type')) {
      otherImportLines.push(index);
    }
  });
  
  if (cssImportLine > -1) {
    console.log(`CSS import is on line ${cssImportLine + 1}`);
    
    // Check if any imports come after the CSS import
    const importsAfterCss = otherImportLines.filter(line => line > cssImportLine);
    if (importsAfterCss.length > 0) {
      console.log('⚠️ Some imports come after the CSS import. This might cause issues.');
    }
  }
  
} catch (error) {
  console.error('Error checking layout.tsx:', error.message);
}

// Check if tailwind.config.js is properly configured
try {
  const tailwindPath = path.join(process.cwd(), 'tailwind.config.ts');
  const tailwindContent = fs.readFileSync(tailwindPath, 'utf8');
  
  console.log('\nChecking tailwind.config.ts...');
  
  if (!tailwindContent.includes('./app/**/*.{ts,tsx}')) {
    console.error('❌ Missing app directory in tailwind content paths');
  } else {
    console.log('✅ app directory is included in tailwind content paths');
  }
  
  if (!tailwindContent.includes('./components/**/*.{ts,tsx}')) {
    console.error('❌ Missing components directory in tailwind content paths');
  } else {
    console.log('✅ components directory is included in tailwind content paths');
  }
  
} catch (error) {
  console.error('Error checking tailwind.config.ts:', error.message);
}

// Check if postcss.config.js exists
try {
  const postcssPath = path.join(process.cwd(), 'postcss.config.js');
  if (fs.existsSync(postcssPath)) {
    console.log('\n✅ postcss.config.js exists');
    
    const postcssContent = fs.readFileSync(postcssPath, 'utf8');
    if (!postcssContent.includes('tailwindcss')) {
      console.error('❌ tailwindcss plugin missing in postcss.config.js');
    } else {
      console.log('✅ tailwindcss plugin is configured in postcss.config.js');
    }
    
    if (!postcssContent.includes('autoprefixer')) {
      console.error('❌ autoprefixer plugin missing in postcss.config.js');
    } else {
      console.log('✅ autoprefixer plugin is configured in postcss.config.js');
    }
  } else {
    console.log('\n⚠️ postcss.config.js does not exist. Creating it...');
    
    const postcssContent = `
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;
    
    fs.writeFileSync(postcssPath, postcssContent.trim());
    console.log('✅ Created postcss.config.js with tailwindcss and autoprefixer');
  }
} catch (error) {
  console.error('Error checking postcss.config.js:', error.message);
}

console.log('\n📋 Next steps:');
console.log('1. Make sure globals.css is imported at the top of app/layout.tsx');
console.log('2. Run "npm run dev" with the --turbo flag: npm run dev -- --turbo');
console.log('3. Clear your browser cache completely or try in incognito mode');
console.log('4. If still not working, try "npm run build" then "npm start"');