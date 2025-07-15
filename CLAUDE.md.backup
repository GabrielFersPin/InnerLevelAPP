#!/usr/bin/env node

/**
 * 🧙‍♂️ LIFEQUEST RPG TRANSFORMATION SCRIPT
 * Transforma toda la terminología de IA a conceptos RPG épicos
 * 
 * Uso: node transform-to-rpg.js
 */

const fs = require('fs');
const path = require('path');

// 🎯 CONFIGURACIÓN DE TRANSFORMACIONES
const TRANSFORMATIONS = {
  // Nombres de archivos y carpetas
  fileRenames: {
    'AICardGenerator.tsx': 'MysticForge.tsx',
    'AICardGenerator.js': 'MysticForge.js',
    'aiService.ts': 'arcaneEngine.ts',
    'aiService.js': 'arcaneEngine.js',
    'useAIRecommendations.ts': 'useOracleGuidance.ts',
    'useAIRecommendations.js': 'useOracleGuidance.js',
    'aiHelpers.ts': 'mysticHelpers.ts',
    'aiHelpers.js': 'mysticHelpers.js',
    'AIAnalysis.tsx': 'SageWisdom.tsx',
    'AIAnalysis.js': 'SageWisdom.js'
  },

  // Transformaciones de texto (orden importa para evitar conflictos)
  textReplacements: [
    // Componentes y Clases
    { from: /AICardGenerator/g, to: 'MysticForge' },
    { from: /AI Card Generator/g, to: 'Mystic Forge' },
    { from: /AIService/g, to: 'ArcaneEngine' },
    { from: /AI Service/g, to: 'Arcane Engine' },
    { from: /AIAnalysis/g, to: 'SageWisdom' },
    { from: /AI Analysis/g, to: 'Sage Wisdom' },
    
    // Variables y funciones
    { from: /generateAICards/g, to: 'forgeMysticCards' },
    { from: /getAIRecommendations/g, to: 'seekOracleGuidance' },
    { from: /processAIResponse/g, to: 'decipherAncientScroll' },
    { from: /analyzeWithAI/g, to: 'consultSageWisdom' },
    { from: /callAIService/g, to: 'invokeArcaneEngine' },
    { from: /aiGenerating/g, to: 'forging' },
    { from: /aiGenerated/g, to: 'forged' },
    { from: /aiRecommendations/g, to: 'oracleGuidance' },
    { from: /aiResponse/g, to: 'ancientScroll' },
    { from: /aiAnalysis/g, to: 'sageWisdom' },
    { from: /aiCards/g, to: 'forgedCards' },
    { from: /aiPrompt/g, to: 'incantation' },
    { from: /aiError/g, to: 'mysticDisruption' },

    // Textos de interfaz - Títulos y Headers
    { from: /"Generate Cards with AI"/g, to: '"Forge Legendary Cards"' },
    { from: /"AI Card Generator"/g, to: '"🔮 Mystic Forge"' },
    { from: /"AI Recommendations"/g, to: '"🧙‍♂️ Oracle\'s Guidance"' },
    { from: /"AI Analysis"/g, to: '"📜 Sage\'s Wisdom"' },
    { from: /"AI Assistant"/g, to: '"🗡️ Guild Master"' },
    { from: /"AI Suggestions"/g, to: '"🌟 Mystic Guidance"' },

    // Botones y acciones
    { from: /"Generate AI Cards"/g, to: '"⚡ Forge New Cards"' },
    { from: /"Ask AI for Help"/g, to: '"🧙‍♂️ Seek Oracle\'s Wisdom"' },
    { from: /"Analyze with AI"/g, to: '"📜 Consult the Sages"' },
    { from: /"Get AI Suggestions"/g, to: '"🌟 Receive Mystic Guidance"' },
    { from: /"AI Powered"/g, to: '"⚡ Arcane Powered"' },

    // Estados de carga
    { from: /"AI is generating cards\.\.\."/g, to: '"🔮 The forge burns bright, crafting your cards..."' },
    { from: /"AI is analyzing\.\.\."/g, to: '"📜 The sages peer into ancient wisdom..."' },
    { from: /"AI is thinking\.\.\."/g, to: '"🧙‍♂️ The Oracle peers into the threads of fate..."' },
    { from: /"Processing AI request\.\.\."/g, to: '"⚡ Ancient energies swirl around the mystical forge..."' },
    { from: /"AI is processing\.\.\."/g, to: '"🔮 Arcane forces weave your destiny..."' },
    { from: /"Generating with AI\.\.\."/g, to: '"✨ Channeling mystical energies..."' },

    // Mensajes de error
    { from: /"AI service unavailable"/g, to: '"🌙 The mystical energies are dormant. Try again later..."' },
    { from: /"AI generation failed"/g, to: '"⚡ The arcane forge needs time to recharge its power..."' },
    { from: /"AI API error"/g, to: '"🔮 The connection to the mystical realm is unstable..."' },
    { from: /"AI not responding"/g, to: '"🧙‍♂️ The Oracle is consulting the cosmic winds..."' },
    { from: /"AI request timeout"/g, to: '"⏳ The mystical ritual requires more time to complete..."' },

    // Descripciones y textos explicativos
    { from: /"Let AI create personalized cards"/g, to: '"Channel ancient energies to craft legendary cards"' },
    { from: /"AI will analyze your progress"/g, to: '"The Sages will divine wisdom from your journey"' },
    { from: /"AI-powered recommendations"/g, to: '"Oracle-guided mystical counsel"' },
    { from: /"Advanced AI analysis"/g, to: '"Deep arcane wisdom synthesis"' },
    { from: /"AI learns from your patterns"/g, to: '"The mystical forces attune to your essence"' },

    // Términos técnicos generales
    { from: /Machine Learning/g, to: 'Mystic Learning' },
    { from: /machine learning/g, to: 'mystic learning' },
    { from: /Algorithm/g, to: 'Battle Strategy' },
    { from: /algorithm/g, to: 'battle strategy' },
    { from: /Data Processing/g, to: 'Alchemical Transmutation' },
    { from: /data processing/g, to: 'alchemical transmutation' },
    { from: /Neural Network/g, to: 'Arcane Network' },
    { from: /neural network/g, to: 'arcane network' },

    // Comentarios en código
    { from: /\/\/ AI related/g, to: '// Mystical forces related' },
    { from: /\/\/ Call AI service/g, to: '// Invoke arcane engine' },
    { from: /\/\/ AI processing/g, to: '// Mystical transmutation' },
    { from: /\/\/ AI generation/g, to: '// Mystical forging' },

    // Console logs
    { from: /console\.log\('AI/g, to: "console.log('🔮 Mystic" },
    { from: /console\.error\('AI/g, to: "console.error('⚡ Arcane" },
    { from: /console\.warn\('AI/g, to: "console.warn('🌙 Mystical" },

    // Imports y exports
    { from: /from ['"](.*\/)ai([^'"]*)['"]/g, to: 'from "$1arcane$2"' },
    { from: /import.*aiService/g, to: (match) => match.replace('aiService', 'arcaneEngine') },
    { from: /export.*aiService/g, to: (match) => match.replace('aiService', 'arcaneEngine') },
  ]
};

// 🎨 MENSAJES ÉPICOS POR CLASE
const CLASS_SPECIFIC_MESSAGES = {
  strategist: {
    forging: '"🔮 The Crystal Seer gazes into probability matrices..."',
    complete: '"✨ The data streams have crystallized into perfect strategy cards!"',
    guidance: '"📊 The analytical spirits whisper optimal paths..."'
  },
  warrior: {
    forging: '"⚔️ The Battle Forge roars to life, tempering steel and spirit..."',
    complete: '"🛡️ Your discipline has forged unbreakable habit cards!"',
    guidance: '"💪 The war spirits guide you toward victory..."'
  },
  creator: {
    forging: '"🎨 The Muses dance around the Inspiration Loom..."',
    complete: '"🌈 Pure creativity has been woven into magnificent cards!"',
    guidance: '"✨ The artistic spirits reveal new realms of possibility..."'
  },
  connector: {
    forging: '"🤝 The Social Nexus resonates with connection energies..."',
    complete: '"🌐 Bonds of fellowship have crystallized into network cards!"',
    guidance: '"💫 The spirits of unity show paths to strengthen relationships..."'
  },
  sage: {
    forging: '"🧘‍♂️ The Ancient Library opens its ethereal pages..."',
    complete: '"📚 Timeless wisdom has materialized into enlightenment cards!"',
    guidance: '"🌟 The eternal sages share insights from beyond time..."'
  }
};

// 🛠️ UTILIDADES
function findFiles(dir, extensions = ['.tsx', '.ts', '.js', '.jsx', '.json', '.md']) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Saltar node_modules y .git
      if (!['node_modules', '.git', 'dist', 'build'].includes(file)) {
        results = results.concat(findFiles(filePath, extensions));
      }
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

function backupFile(filePath) {
  const backupPath = filePath + '.backup';
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
  }
}

function transformFileContent(content) {
  let transformedContent = content;
  
  // Aplicar todas las transformaciones de texto
  TRANSFORMATIONS.textReplacements.forEach(({ from, to }) => {
    transformedContent = transformedContent.replace(from, to);
  });
  
  return transformedContent;
}

function renameFiles(baseDir) {
  const renamedFiles = [];
  
  // Buscar archivos que necesitan ser renombrados
  Object.entries(TRANSFORMATIONS.fileRenames).forEach(([oldName, newName]) => {
    const files = findFiles(baseDir);
    files.forEach(filePath => {
      if (path.basename(filePath) === oldName) {
        const newPath = path.join(path.dirname(filePath), newName);
        
        console.log(`📁 Renaming: ${filePath} → ${newPath}`);
        
        // Hacer backup del archivo original
        backupFile(filePath);
        
        // Renombrar archivo
        fs.renameSync(filePath, newPath);
        renamedFiles.push({ old: filePath, new: newPath });
      }
    });
  });
  
  return renamedFiles;
}

function updateImports(baseDir, renamedFiles) {
  const files = findFiles(baseDir);
  
  files.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // Actualizar imports de archivos renombrados
    renamedFiles.forEach(({ old, new: newPath }) => {
      const oldImport = path.basename(old, path.extname(old));
      const newImport = path.basename(newPath, path.extname(newPath));
      
      const importRegex = new RegExp(`from\\s+['"]([^'"]*\\/)${oldImport}(['"])`, 'g');
      const newContent = content.replace(importRegex, `from '$1${newImport}$2`);
      
      if (newContent !== content) {
        content = newContent;
        updated = true;
      }
    });
    
    if (updated) {
      console.log(`🔗 Updating imports in: ${filePath}`);
      backupFile(filePath);
      fs.writeFileSync(filePath, content, 'utf8');
    }
  });
}

// 🚀 FUNCIÓN PRINCIPAL
function transformToRPG() {
  const startTime = Date.now();
  console.log('🧙‍♂️ Starting LifeQuest RPG Transformation...\n');
  
  const baseDir = process.cwd();
  console.log(`📂 Working directory: ${baseDir}\n`);
  
  try {
    // Paso 1: Crear backup completo
    console.log('📋 Step 1: Creating backups...');
    
    // Paso 2: Renombrar archivos
    console.log('📁 Step 2: Renaming files...');
    const renamedFiles = renameFiles(baseDir);
    console.log(`✅ Renamed ${renamedFiles.length} files\n`);
    
    // Paso 3: Transformar contenido de archivos
    console.log('🔮 Step 3: Transforming file contents...');
    const files = findFiles(baseDir);
    let transformedCount = 0;
    
    files.forEach(filePath => {
      const content = fs.readFileSync(filePath, 'utf8');
      const transformedContent = transformFileContent(content);
      
      if (transformedContent !== content) {
        backupFile(filePath);
        fs.writeFileSync(filePath, transformedContent, 'utf8');
        transformedCount++;
        console.log(`✨ Transformed: ${filePath}`);
      }
    });
    
    console.log(`✅ Transformed ${transformedCount} files\n`);
    
    // Paso 4: Actualizar imports
    console.log('🔗 Step 4: Updating imports and references...');
    updateImports(baseDir, renamedFiles);
    console.log('✅ Updated all imports\n');
    
    // Paso 5: Crear archivo de mapeo de clases
    console.log('📜 Step 5: Creating class-specific messages...');
    const classMessagesPath = path.join(baseDir, 'src', 'data', 'classMessages.ts');
    
    // Crear directorio si no existe
    const dataDir = path.dirname(classMessagesPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const classMessagesContent = `// 🧙‍♂️ Generated by LifeQuest RPG Transformation Script
// Class-specific mystical messages

export const ClassMessages = ${JSON.stringify(CLASS_SPECIFIC_MESSAGES, null, 2)};

export function getMysticMessage(userClass: string, messageType: string): string {
  const classMessages = ClassMessages[userClass as keyof typeof ClassMessages];
  if (classMessages && classMessages[messageType as keyof typeof classMessages]) {
    return classMessages[messageType as keyof typeof classMessages];
  }
  
  // Fallback genérico
  const fallbacks = {
    forging: "🔮 Ancient energies swirl, crafting your destiny...",
    complete: "✨ The mystical forces have woven powerful cards!",
    guidance: "🌟 The cosmic wisdom guides your path..."
  };
  
  return fallbacks[messageType as keyof typeof fallbacks] || "✨ The magic flows through you...";
}
`;
    
    fs.writeFileSync(classMessagesPath, classMessagesContent, 'utf8');
    console.log(`✅ Created: ${classMessagesPath}\n`);
    
    // Estadísticas finales
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('🎉 TRANSFORMATION COMPLETE! 🎉\n');
    console.log('📊 Summary:');
    console.log(`   ⏱️  Duration: ${duration} seconds`);
    console.log(`   📁 Files renamed: ${renamedFiles.length}`);
    console.log(`   🔮 Files transformed: ${transformedCount}`);
    console.log(`   📜 Total files processed: ${files.length}\n`);
    
    console.log('🧙‍♂️ Your app has been transformed into an epic RPG experience!');
    console.log('✨ All AI terminology has been replaced with mystical concepts.');
    console.log('🛡️ Original files backed up with .backup extension.');
    console.log('\n🎮 Your LifeQuest RPG adventure awaits! 🗡️✨');
    
  } catch (error) {
    console.error('❌ Transformation failed:', error);
    console.log('\n🔮 Don\'t worry! Your original files are safely backed up.');
    process.exit(1);
  }
}

// 🎯 FUNCIONES DE UTILIDAD ADICIONALES
function rollbackTransformation() {
  console.log('🔄 Rolling back transformation...');
  const baseDir = process.cwd();
  const files = findFiles(baseDir);
  
  files.forEach(filePath => {
    const backupPath = filePath + '.backup';
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, filePath);
      fs.unlinkSync(backupPath);
      console.log(`↩️  Restored: ${filePath}`);
    }
  });
  
  console.log('✅ Rollback complete!');
}

function cleanBackups() {
  console.log('🧹 Cleaning backup files...');
  const baseDir = process.cwd();
  const files = findFiles(baseDir, ['.backup']);
  
  files.forEach(backupFile => {
    fs.unlinkSync(backupFile);
    console.log(`🗑️  Removed: ${backupFile}`);
  });
  
  console.log('✅ Backup cleanup complete!');
}

// 🎮 CLI Interface
function showHelp() {
  console.log(`
🧙‍♂️ LifeQuest RPG Transformation Script

Usage: node transform-to-rpg.js [command]

Commands:
  transform  (default) - Transform AI terminology to RPG
  rollback            - Restore original files from backups  
  clean               - Remove all backup files
  help                - Show this help message

Examples:
  node transform-to-rpg.js
  node transform-to-rpg.js rollback
  node transform-to-rpg.js clean
`);
}

// 🚀 EJECUTAR SCRIPT
if (require.main === module) {
  const command = process.argv[2] || 'transform';
  
  switch (command) {
    case 'transform':
      transformToRPG();
      break;
    case 'rollback':
      rollbackTransformation();
      break;
    case 'clean':
      cleanBackups();
      break;
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
    default:
      console.log(`❌ Unknown command: ${command}`);
      showHelp();
      process.exit(1);
  }
}