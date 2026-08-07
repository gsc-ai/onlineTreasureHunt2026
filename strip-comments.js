const fs = require('fs');
const files = [
  'src/App.jsx',
  'src/components/ClueCard.jsx',
  'src/components/ProgressBar.jsx'
];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  // Remove single line // comments (but not within strings/JSX text)
  content = content.replace(/^\s*\/\/.*/gm, '');
  // Remove JSX comments
  content = content.replace(/^\s*\{\/\*.*?\*\/\}\s*/gm, '');
  // Remove inline comments
  content = content.replace(/\s*\/\/ Wait for unlock.*/g, '');
  content = content.replace(/\s*\/\/ Remove shake class.*/g, '');
  
  // Clean up multiple empty lines
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  fs.writeFileSync(f, content);
});
console.log('Comments removed.');
