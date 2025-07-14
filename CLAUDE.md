# Prompt para Claude Code - LifeQuest RPG: Personal Development Game

## CONTEXTO Y OBJETIVO
Transformar mi aplicación InnerLevel (React + TypeScript + Tailwind) en **LifeQuest RPG** - un juego de desarrollo personal donde el usuario se convierte en un personaje que entrena habilidades reales mediante cartas especializadas según su arquetipo de personalidad.

---

## 🎮 ARQUITECTURA DE LA APLICACIÓN

### **Navegación Simplificada (5 Funciones)**
```
🏠 Character Hub (Dashboard Principal)
🎴 Card Deck (Mazo de Cartas) 
⚔️ Training Ground (Ejecutar Cartas)
🏆 Character Sheet (Stats y Progreso)
⚙️ Guild Settings (Configuración)
```

### **Stack Tecnológico Mantenido**
- React 18 + TypeScript + Vite
- Tailwind CSS con **tema RPG épico** (slate-900/indigo-900, dorados)
- Context + useReducer para estado
- LocalStorage para persistencia
- Preparado para Claude API (con fallbacks)

---

## 🧙‍♂️ SISTEMA DE CLASES/ARQUETIPOS

### **Test de Personalidad Inicial**
Al primer uso, test de 10 preguntas que determina automáticamente la clase del usuario:

#### **🔮 The Strategist - El Estratega**
*"Planifica cada movimiento, optimiza cada resultado"*
- **Personalidad**: Analítico, metódico, orientado a datos
- **Atributos**: Intelligence (+40% XP aprendizaje), Focus (cartas intensivas), Analytics (métricas avanzadas)
- **Mana**: 120 máximo, 8/hora regeneración
- **Visual**: Azul cristal, interfaces HUD futurista
- **Ideal para**: Tech jobs, análisis, optimización

#### **⚔️ The Warrior - El Guerrero**
*"Disciplina férrea, acción constante"*
- **Personalidad**: Disciplinado, perseverante, orientado a acción
- **Atributos**: Discipline (bonus hábitos), Stamina (regeneración rápida), Resilience (menos penalizaciones)
- **Stamina**: 150 máximo, 10/hora regeneración
- **Visual**: Rojo/dorado, forja medieval
- **Ideal para**: Fitness, hábitos, disciplina personal

#### **🎨 The Creator - El Creador**
*"Innovación y expresión son tu fuerza"*
- **Personalidad**: Creativo, experimental, orientado a proyectos
- **Atributos**: Creativity (bonus proyectos), Inspiration (cartas especiales), Innovation (combos únicos)
- **Inspiration**: 100 máximo, variable (15/hora creativo, 3/hora rutina)
- **Visual**: Multicolor, estudio artístico
- **Ideal para**: Arte, emprendimiento, innovación

#### **🤝 The Connector - El Conector**
*"Tu fuerza está en las relaciones que construyes"*
- **Personalidad**: Social, empático, orientado a relaciones
- **Atributos**: Charisma (bonus social), Network (cartas networking), Empathy (mayor impacto bienestar)
- **Social Energy**: 110 máximo, 12/hora durante interacciones
- **Visual**: Verde/oro, guild hall
- **Ideal para**: Liderazgo, networking, relaciones

#### **🧘‍♂️ The Sage - El Sabio**
*"El crecimiento interior guía el éxito exterior"*
- **Personalidad**: Reflexivo, espiritual, orientado al crecimiento
- **Atributos**: Mindfulness (regeneración mejorada), Wisdom (aprende de fallos), Balance (equilibrio automático)
- **Inner Peace**: 130 máximo, 15/hora durante descanso
- **Visual**: Púrpura/blanco, templo zen
- **Ideal para**: Mindfulness, bienestar, crecimiento espiritual

---

## 🎴 SISTEMA DE CARTAS

### **Estructura de Carta**
```typescript
interface Card {
  id: string;
  name: string;
  description: string;
  classTypes: CharacterClass[]; // Qué clases pueden usarla
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  energyCost: number;
  duration: number; // horas
  impact: number; // XP ganado
  cooldown?: number; // horas
  skillBonus: {
    skillName: string;
    xpBonus: number;
    temporaryBoost?: number;
  }[];
  requirements: {
    level?: number;
    skills?: Record<string, number>;
    prerequisiteCards?: string[];
  };
  conditions: {
    energyLevel?: string; // "> 75%"
    timeRequired?: string;
    mentalState?: string[];
  };
  tags: string[];
}
```

### **Distribución de Cartas**
- **Cartas Base**: 20% (todas las clases pueden usar)
- **Cartas de Clase**: 60% (específicas del arquetipo)
- **Cartas Híbridas**: 20% (desbloqueables por nivel)

### **Ejemplos de Cartas por Clase**

#### **Strategist Cards**:
```
📊 "Data Analysis Sprint" (Common, 30 energía, 2h)
- Analiza datos o métricas durante 2 horas
- +Intelligence XP, +Focus temporal

🔬 "Research Deep Dive" (Rare, 60 energía, 4h) 
- Investigación intensiva sobre tema específico
- +Intelligence XP masivo, cooldown 48h

🧠 "Strategic Mastery Synthesis" (Legendary, 100 energía, 8h)
- Proyecto maestro combinando conocimientos
- +Todos los stats, título especial, cooldown 1 mes
```

#### **Warrior Cards**:
```
⚔️ "Daily Discipline Strike" (Common, 25 energía, 1h)
- Completar rutina matutina perfecta
- +Discipline XP, +Stamina regeneration boost

🏃‍♂️ "Endurance Training" (Uncommon, 40 energía, 2h)
- Entrenamiento físico o mental intensivo
- +Stamina XP, +Resilience boost

🛡️ "Unbreakable Fortress" (Epic, 80 energía, 3h)
- Mantener disciplina durante día completo
- +Discipline masivo, unlock cartas legendarias
```

*(Similar para Creator, Connector, Sage)*

---

## 📊 SISTEMA DE PROGRESIÓN

### **Character Progression**
```typescript
interface Character {
  id: string;
  name: string;
  class: CharacterClass;
  level: number; // 1-50
  experience: number;
  skillPoints: number;
  avatar: string; // URL del avatar según clase y nivel
  
  // Energía específica por clase
  energy: {
    current: number;
    maximum: number;
    regenerationRate: number;
    lastUpdate: Date;
  };
  
  // Habilidades específicas por clase
  skills: Record<string, {
    level: number;
    experience: number;
    totalXP: number;
  }>;
  
  // Inventario y progreso
  deck: Card[];
  activeDeck: string[]; // IDs de cartas equipadas
  completedCards: CardCompletion[];
  achievements: Achievement[];
  
  // Estado del juego
  currentGoals: Goal[];
  dailyProgress: DailyProgress;
  streak: number;
  prestigeLevel: number;
}
```

### **Skills por Clase**
- **Strategist**: Intelligence, Focus, Analytics, Strategy
- **Warrior**: Discipline, Stamina, Resilience, Consistency
- **Creator**: Creativity, Innovation, Execution, Vision
- **Connector**: Charisma, Network, Empathy, Leadership  
- **Sage**: Mindfulness, Wisdom, Balance, Intuition

### **Niveles y Desbloqueables**
- **Nivel 1-10**: Novice (cartas básicas)
- **Nivel 11-25**: Adept (cartas avanzadas + combos)
- **Nivel 26-40**: Expert (cartas épicas + híbridas)
- **Nivel 41-50**: Master (cartas legendarias + prestigio)

---

## 🏠 COMPONENTES PRINCIPALES

### **1. Character Hub (Dashboard)**
Componente: `src/components/CharacterHub.tsx`

**Elementos**:
- **Avatar grande** con clase, nivel y barra XP
- **Energy/Mana bar** con regeneración en tiempo real
- **Skills overview** con barras de progreso por habilidad principal
- **Daily recommendations** (3-4 cartas sugeridas por IA)
- **Active goals progress** con barras visuales
- **Quick stats**: Streak, cartas completadas hoy, próximo level up

### **2. Card Deck (Mazo)**
Componente: `src/components/CardDeck.tsx`

**Elementos**:
- **Grid de cartas** con filtros por tipo, rareza, energía requerida
- **Active deck** (cartas equipadas para usar hoy)
- **Card details modal** con stats completos y requisitos
- **"Draw cards" button** para obtener cartas diarias nuevas
- **Sorting/filtering** por clase, costo energético, impacto

### **3. Training Ground (Ejecución)**
Componente: `src/components/TrainingGround.tsx`

**Elementos**:
- **Card selector** para elegir carta a ejecutar
- **Execution modal** con timer, instrucciones, progreso
- **Real-time feedback** durante ejecución
- **Completion screen** con XP ganado, level ups, logros
- **Energy forecast** mostrando costo y regeneración

### **4. Character Sheet (Stats)**
Componente: `src/components/CharacterSheet.tsx`

**Elementos**:
- **Detailed stats** por cada habilidad con gráficos
- **Achievement gallery** con títulos y logros desbloqueados
- **Progression tree** mostrando próximos desbloqueables
- **Historical data** con gráficos de progreso temporal
- **Class comparison** (opcional) con otros arquetipos

### **5. Guild Settings**
Componente: `src/components/GuildSettings.tsx`

**Elementos**:
- **Goal management** (cambiar objetivos principales)
- **Notification preferences** por tipo de carta/logro
- **Avatar customization** con opciones desbloqueadas
- **Data export/import** y opciones de prestigio
- **Class retake** (opcional, penalización por cambio)

---

## 🧠 SISTEMA DE IA Y RECOMENDACIONES

### **AIService Expandido**
```typescript
class AIService {
  async generateDailyRecommendations(character: Character): Promise<Card[]> {
    const context = {
      class: character.class,
      level: character.level,
      currentEnergy: character.energy.current,
      skillLevels: character.skills,
      recentProgress: character.dailyProgress,
      activeGoals: character.currentGoals,
      timeOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay()
    };
    
    // Prompt específico para cada clase
    const classPrompts = {
      strategist: "Genera cartas optimizadas para maximizar progreso analítico...",
      warrior: "Genera cartas que mantengan disciplina y momentum...",
      creator: "Genera cartas que potencien creatividad e innovación...",
      connector: "Genera cartas que fortalezcan relaciones y network...",
      sage: "Genera cartas que promuevan balance y crecimiento interior..."
    };
    
    return await this.callClaude(classPrompts[character.class]);
  }
  
  async createPersonalizedCards(goal: string, character: Character): Promise<Card[]> {
    // Genera cartas específicas para objetivo + clase
    const prompt = `
    Objetivo: ${goal}
    Clase: ${character.class}
    Nivel: ${character.level}
    Habilidades actuales: ${JSON.stringify(character.skills)}
    
    Genera 5-8 cartas progresivas específicamente para este objetivo,
    optimizadas para la clase ${character.class} con mecánicas RPG auténticas.
    `;
    
    return await this.callClaude(prompt);
  }
}
```

### **Sistema de Recomendaciones Inteligentes**
- **Análisis contextual**: Hora, día, energía, humor
- **Optimización por clase**: Cartas que maximizan strengths del arquetipo
- **Progreso adaptativo**: Dificultad aumenta con el nivel
- **Goal-driven**: Prioriza cartas relevantes al objetivo principal

---

## 🎨 DISEÑO VISUAL ÉPICO

### **Tema Global RPG**
- **Background**: `from-slate-900 via-slate-800 to-indigo-900`
- **Paneles**: `bg-slate-800/90 border border-amber-500/30`
- **Texto**: Títulos `text-amber-200`, contenido `text-slate-200`
- **Acentos**: Dorado `#F59E0B`, azul mágico `#3B82F6`

### **Colores por Rareza**
```css
.card-common { border-color: #94A3B8; box-shadow: 0 0 10px rgba(148, 163, 184, 0.3); }
.card-uncommon { border-color: #10B981; box-shadow: 0 0 15px rgba(16, 185, 129, 0.4); }
.card-rare { border-color: #3B82F6; box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
.card-epic { border-color: #A855F7; box-shadow: 0 0 25px rgba(168, 85, 247, 0.6); }
.card-legendary { border-color: #F59E0B; box-shadow: 0 0 30px rgba(245, 158, 11, 0.8); animation: glow 2s ease-in-out infinite alternate; }
```

### **Elementos Específicos por Clase**
- **Strategist**: Bordes azul cristal, iconos de datos/gráficos
- **Warrior**: Bordes rojo/dorado, iconos de espadas/escudos
- **Creator**: Bordes multicolor, iconos de arte/innovación
- **Connector**: Bordes verde/oro, iconos sociales/network
- **Sage**: Bordes púrpura/blanco, iconos zen/balance

### **Animaciones RPG**
- **Level up**: Explosión de partículas doradas
- **Card completion**: Glow effect + sound effect sim
- **Energy regeneration**: Pulse suave en barra de energía
- **Skill progress**: Barra que se llena con partículas
- **Achievement unlock**: Modal épico con fanfare visual

---

## 🧪 TEST DE PERSONALIDAD

### **Componente**: `src/components/PersonalityTest.tsx`
**10 preguntas** que determinan automáticamente la clase:

```typescript
const personalityQuestions = [
  {
    question: "Cuando enfrentas un desafío grande, tu primera reacción es:",
    options: [
      { text: "Analizar todas las variables y crear un plan detallado", class: "strategist" },
      { text: "Dividirlo en tareas pequeñas y empezar inmediatamente", class: "warrior" },
      { text: "Buscar una solución creativa e innovadora", class: "creator" },
      { text: "Hablar con otros para obtener perspectivas diferentes", class: "connector" },
      { text: "Reflexionar sobre por qué este desafío apareció en tu vida", class: "sage" }
    ]
  },
  // ... 9 preguntas más
];
```

**Resultado**: La clase con más respuestas se asigna automáticamente, con explicación personalizada de por qué esa clase encaja con la personalidad.

---

## 📱 FLUJO DE USUARIO COMPLETO

### **Primera Vez (Onboarding)**:
1. **Welcome screen** épico con trailer del concepto
2. **Personality test** (10 preguntas, 3-5 minutos)
3. **Class reveal** con animación épica y explicación
4. **Avatar selection** según clase asignada
5. **First goal setting** ("¿Qué quieres lograr?")
6. **Tutorial interactivo** con primera carta

### **Uso Diario**:
1. **Login**: Energía regenerada, cartas nuevas disponibles
2. **Character Hub**: Ver progreso, recomendaciones del día
3. **Card selection**: Elegir 2-4 cartas para el día
4. **Training**: Ejecutar cartas con timer y feedback
5. **Evening review**: Progreso del día, preparación mañana

### **Progresión a Largo Plazo**:
- **Weekly**: Nuevas cartas desbloqueadas por progreso
- **Monthly**: Evaluación de goals, nuevos objetivos
- **Level milestones**: Cartas épicas, títulos, avatares
- **Prestigio**: Reset completo con bonificadores permanentes

---

## 🗂️ ESTRUCTURA DE ARCHIVOS

```
src/
├── components/
│   ├── onboarding/
│   │   ├── PersonalityTest.tsx
│   │   ├── ClassReveal.tsx
│   │   └── Tutorial.tsx
│   ├── character/
│   │   ├── CharacterHub.tsx
│   │   ├── CharacterSheet.tsx
│   │   ├── EnergyMeter.tsx
│   │   └── SkillBars.tsx
│   ├── cards/
│   │   ├── CardDeck.tsx
│   │   ├── CardComponent.tsx
│   │   ├── CardExecutor.tsx
│   │   └── CardRecommendations.tsx
│   ├── training/
│   │   ├── TrainingGround.tsx
│   │   ├── ExecutionModal.tsx
│   │   └── ProgressTracker.tsx
│   └── ui/
│       ├── RPGButton.tsx
│       ├── ProgressBar.tsx
│       └── Modal.tsx
├── data/
│   ├── characterClasses.ts
│   ├── baseCards.ts
│   ├── personalityTest.ts
│   └── achievements.ts
├── services/
│   ├── aiService.ts
│   ├── characterManager.ts
│   ├── cardEngine.ts
│   └── progressTracker.ts
├── types/
│   ├── character.types.ts
│   ├── card.types.ts
│   └── game.types.ts
└── utils/
    ├── experienceCalculator.ts
    ├── classHelpers.ts
    └── energyManager.ts
```

---

## 🎯 DATOS DE EJEMPLO INCLUIDOS

### **Contenido Inicial**:
- **5 clases completas** con 15-20 cartas cada una
- **Test de personalidad** funcional con lógica de asignación
- **3 objetivos template** por clase (career, health, creative)
- **Sistema de achievements** con 30+ logros desbloqueables
- **Avatares base** por clase y nivel
- **Tutorial interactivo** completo

### **Cartas de Ejemplo Específicas**:
```
Strategist: "SQL Mastery Lab", "Data Portfolio Builder", "Strategic Interview Prep"
Warrior: "Morning Discipline Ritual", "Habit Fortress", "Endurance Challenge"
Creator: "Creative Flow Session", "Innovation Sprint", "Project Launch"
Connector: "Network Expansion", "Meaningful Conversation", "Leadership Practice"
Sage: "Mindfulness Meditation", "Wisdom Reading", "Balance Restoration"
```

---

## 🚀 IMPLEMENTACIÓN PRIORITARIA

### **Phase 1 (Funcional Básico)**:
1. ✅ Sistema de clases y test de personalidad
2. ✅ Character Hub con stats y energía
3. ✅ Card Deck básico con ejecución
4. ✅ Training Ground con timer
5. ✅ Progresión XP y level ups

### **Phase 2 (AI Integration)**:
6. ✅ Recomendaciones diarias por IA
7. ✅ Generación de cartas personalizadas
8. ✅ Goal setting con cartas automáticas

### **Phase 3 (Advanced Features)**:
9. ✅ Achievement system completo
10. ✅ Card combinations y synergies
11. ✅ Prestigio system

---

## 📋 INSTRUCCIONES ESPECÍFICAS PARA CLAUDE CODE

1. **Mantener arquitectura existente** de InnerLevel como base
2. **Implementar onboarding completo** con test de personalidad
3. **Crear las 5 páginas principales** con navegación simplificada
4. **Incluir datos de ejemplo** para todas las clases y cartas
5. **Preparar integración AI** con fallbacks locales
6. **Aplicar tema visual RPG** consistente en toda la app
7. **Implementar sistema de progresión** completamente funcional
8. **Agregar animaciones sutiles** para feedback visual

**La aplicación debe ser inmediatamente usable y adictiva, con progresión real desde el primer día.**

---
