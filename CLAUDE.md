# Prompt para Claude Code - Transformación InnerLevel → LifeQuest Cards

## CONTEXTO ACTUAL
Tengo una aplicación React + TypeScript llamada InnerLevel que es un tracker de crecimiento personal con:
- Sistema de puntos y gamificación
- Context + useReducer para estado
- LocalStorage para persistencia
- Supabase preparado pero usando localStorage
- Tailwind CSS (cambiar de púrpura a tema RPG épico)
- Componentes: Dashboard, Habits, Goals, Analytics, etc.

## OBJETIVO
Transformar InnerLevel en "LifeQuest Cards" - un RPG de cartas para desarrollo personal con:

### 1. NUEVO SISTEMA DE CARTAS
Mantener la arquitectura existente pero agregar:

```typescript
// Nuevos tipos en src/types/index.ts
interface Card {
  id: string;
  name: string;
  description: string;
  type: 'action' | 'power' | 'recovery' | 'event' | 'equipment';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  energyCost: number;
  duration: number; // horas
  impact: number; // puntos hacia quest
  cooldown?: number; // horas
  conditions?: {
    requiredEnergyLevel?: string; // "> 75%"
    timeRequired?: string;
    mentalState?: string[];
    prerequisiteCards?: string[];
  };
  effects?: {
    type: 'energy' | 'multiplier' | 'unlock' | 'bonus';
    target: string;
    value: number;
    duration?: number;
  }[];
  tags: string[];
  createdAt: Date;
  aiGenerated: boolean;
  usageCount: number;
  lastUsed?: Date;
  isOnCooldown: boolean;
}

interface Quest {
  id: string;
  name: string;
  description: string;
  type: 'career' | 'health' | 'relationships' | 'skills' | 'creative';
  difficulty: 'easy' | 'medium' | 'hard' | 'epic' | 'legendary';
  estimatedDuration: number; // días
  deadline?: Date;
  progress: number; // 0-100
  status: 'active' | 'completed' | 'paused' | 'failed';
  milestones: {
    id: string;
    name: string;
    requiredProgress: number;
    rewards: { type: string; value: number }[];
    completed: boolean;
  }[];
  rewards: {
    experience: number;
    cards: string[];
    unlocks: string[];
  };
  createdAt: Date;
}

interface EnergyState {
  current: number;
  maximum: number;
  regenerationRate: number; // por hora
  lastUpdate: Date;
  dailyUsage: {
    date: string;
    usage: { time: string; amount: number; activity: string }[];
  }[];
}

interface UserInventory {
  cards: Card[];
  activeCards: string[]; // IDs de cartas actualmente en uso
  favoriteCards: string[];
}
```

### 2. NUEVOS COMPONENTES
Crear estos componentes manteniendo el estilo visual existente:

#### A. Dashboard Principal (modificar Dashboard.tsx)
- **EnergyMeter**: Barra de energía con regeneración en tiempo real
- **QuestProgress**: Progreso de quests activas con barras animadas
- **DailyRecommendations**: 3-4 cartas recomendadas para hoy
- **QuickStats**: Nivel, experiencia, cartas desbloqueadas

#### B. Nuevas páginas del sistema:
- **CardInventory** (`src/components/CardInventory.tsx`):
  - Grid de cartas con filtros por tipo, rareza, energía
  - Drag & drop para organizar
  - Vista detalle de carta con stats y condiciones
  
- **QuestDesigner** (`src/components/QuestDesigner.tsx`):
  - Formulario para crear nueva quest
  - Input: objetivo, plazo, tiempo disponible
  - Preview de plan generado por IA
  
- **CardGenerator** (`src/components/CardGenerator.tsx`):
  - Panel de generación diaria de cartas
  - Análisis del día (energía, tiempo, mood)
  - Vista previa de cartas sugeridas

#### C. Componentes de Carta:
- **CardComponent** (`src/components/cards/CardComponent.tsx`):
  - Diseño tipo TCG con rareza, energía, efectos
  - Animaciones hover y selección
  - Estados: disponible, cooldown, usado
  
- **CardExecutor** (`src/components/cards/CardExecutor.tsx`):
  - Modal para ejecutar carta
  - Timer, progreso, feedback
  - Confirmación de completion

### 3. SERVICIOS NUEVOS

#### A. AIService (`src/services/aiService.ts`)
```typescript
class AIService {
  async generateQuest(objective: string, timeline: number, availability: number) {
    // Integración con Claude API para generar plan estructurado
    const prompt = `Crear quest para objetivo: ${objective}...`;
    return await this.callClaude(prompt);
  }
  
  async generateDailyCards(userContext: any) {
    // Generar 3-5 cartas basadas en energía, tiempo, progreso
    const prompt = `Generar cartas para contexto: ${JSON.stringify(userContext)}...`;
    return await this.callClaude(prompt);
  }
}
```

#### B. CardEngine (`src/services/cardEngine.ts`)
```typescript
class CardEngine {
  executeCard(card: Card, userState: any): CardResult {
    // Lógica de ejecución, validación de condiciones
    // Consumo de energía, aplicación de efectos
    // Actualización de progreso de quest
  }
  
  checkCooldowns(): void {
    // Verificar y liberar cartas de cooldown
  }
  
  calculateRecommendations(userState: any): Card[] {
    // Algoritmo de recomendación basado en contexto
  }
}
```

#### C. EnergyManager (`src/services/energyManager.ts`)
```typescript
class EnergyManager {
  updateEnergy(): number {
    // Calcular energía regenerada desde último update
    // Aplicar efectos de cartas activas
  }
  
  consumeEnergy(amount: number): boolean {
    // Validar y consumir energía
  }
  
  predictEnergyUsage(cards: Card[]): EnergyForecast {
    // Predecir uso de energía para cartas seleccionadas
  }
}
```

### 4. ACTUALIZACIÓN DEL CONTEXTO

Modificar `src/context/AppContext.tsx` para incluir:
```typescript
interface AppState {
  // Estado existente +
  cards: {
    inventory: Card[];
    activeCards: string[];
    cooldowns: Record<string, Date>;
  };
  quests: {
    active: Quest[];
    completed: Quest[];
  };
  energy: EnergyState;
  recommendations: {
    daily: Card[];
    lastGenerated: Date;
  };
}

// Nuevas acciones
type Action = 
  | { type: 'ADD_CARD'; payload: Card }
  | { type: 'EXECUTE_CARD'; payload: { cardId: string; feedback: any } }
  | { type: 'CREATE_QUEST'; payload: Quest }
  | { type: 'UPDATE_QUEST_PROGRESS'; payload: { questId: string; points: number } }
  | { type: 'UPDATE_ENERGY'; payload: number }
  | { type: 'GENERATE_RECOMMENDATIONS' }
  // ... acciones existentes
```

### 5. INTEGRACIÓN CON CLAUDE API

Agregar a `.env`:
```
VITE_CLAUDE_API_KEY=your_api_key
```

Crear `src/lib/claude.ts`:
```typescript
export class ClaudeClient {
  async complete(prompt: string): Promise<string> {
    // Integración con Claude API
    // Manejo de errores y rate limiting
  }
}
```

### 6. NAVEGACIÓN ACTUALIZADA - TEMA RPG

Modificar sidebar con iconografía RPG:
- ⚔️ **War Room** (Dashboard) - Centro de comando del aventurero
- 🎴 **Card Grimoire** (Card Inventory) - Libro de hechizos/cartas
- 🗡️ **Active Quests** - Misiones en progreso
- 📜 **Quest Scribe** (Quest Designer) - Crear nuevas aventuras
- 🔮 **Daily Oracle** (Daily Generator) - Generador de cartas diarias
- 📊 **Chronicles** (Analytics) - Estadísticas y progreso
- ⚙️ **Guild Settings** (Settings) - Configuración del guild

#### Iconografía específica:
- **Energía**: ⚡ Lightning bolt con efecto mágico
- **Experiencia**: ✨ Estrella brillante
- **Cartas**: 🎴 Con overlays de elementos mágicos
- **Quests**: 🏆 Trofeos y pergaminos
- **Progreso**: 📈 Con gemas incrustadas

### 7. DATOS DE EJEMPLO

Crear `src/data/sampleData.ts` con:
- Quest ejemplo: "Conseguir trabajo en ciencia de datos"
- 20+ cartas base de diferentes tipos y rarezas
- Usuarios de ejemplo con progreso
- Templates de quests comunes

### 8. CARACTERÍSTICAS VISUALES - TEMA RPG ÉPICO

Transformar completamente el estilo a un tema de RPG/Fantasy:

#### A. Paleta de Colores Principal:
- **Background**: Gradiente oscuro épico (`from-slate-900 via-slate-800 to-indigo-900`)
- **Paneles**: Fondo semi-transparente con borde dorado (`bg-slate-800/90 border border-amber-500/30`)
- **Texto**: Dorado claro para títulos (`text-amber-200`), plateado para contenido (`text-slate-200`)
- **Acentos**: Azul mágico (`#3B82F6`) y verde esmeralda (`#10B981`)

#### B. Colores de Rareza (Estilo RPG):
- **Common**: Plateado/Gris (`#94A3B8`) - borde sutil
- **Uncommon**: Verde Esmeralda (`#10B981`) - glow verde suave
- **Rare**: Azul Cristal (`#3B82F6`) - glow azul mágico
- **Epic**: Púrpura Místico (`#A855F7`) - glow púrpura intenso
- **Legendary**: Dorado Divino (`#F59E0B`) - glow dorado pulsante

#### C. Elementos de UI Épicos:
- **Cartas**: Bordes ornamentados, esquinas redondeadas con detalles metálicos
- **Botones**: Estilo medieval con gradientes metálicos y hover effects
- **Barras de progreso**: Gemas incrustadas y efectos de brillo
- **Iconos**: Lucide icons con overlays de elementos RPG (espadas, escudos, pergaminos)

#### D. Efectos Visuales:
- **Partículas**: Destellos dorados para acciones importantes
- **Glow Effects**: Auras de colores según rareza de cartas
- **Animaciones**: 
  - Cartas que "flotan" con sombras dinámicas
  - Transitions tipo "portal mágico"
  - Hover effects con escalado sutil y brillo
- **Texturas**: Fondos con patrones sutiles tipo pergamino o metal

#### E. Tipografía RPG:
- **Títulos**: Font-weight bold con text-shadow dorado
- **Headers**: Letras capitales decorativas
- **Contenido**: Clean pero con acentos metálicos

#### F. Layout Fantasy:
- **Sidebar**: Diseño tipo "panel de guild" con bordes ornamentados
- **Main Content**: "Pergamino mágico" con esquinas redondeadas
- **Modals**: "Ventanas de spell book" con marcos decorativos
- **Cards**: Diseño tipo "cartas de tarot mágicas" con simbolos místicos

### 9. FUNCIONALIDADES CLAVE

#### A. Flujo principal diario:
1. Usuario abre app → Energía se actualiza automáticamente
2. Ve recomendaciones del día basadas en energía/tiempo
3. Selecciona carta → Valida condiciones → Ejecuta
4. Completa actividad → Da feedback → Gana puntos hacia quest
5. Sistema aprende y ajusta futuras recomendaciones

#### B. Creación de quest:
1. Usuario define objetivo en QuestDesigner
2. IA analiza y genera plan estructurado
3. Usuario revisa y confirma quest
4. Sistema genera cartas iniciales
5. Quest se activa en dashboard

#### C. Generación de cartas:
1. Sistema analiza contexto diario (energía, tiempo, humor)
2. IA genera 3-5 cartas apropiadas
3. Usuario puede regenerar o aceptar sugerencias
4. Cartas se agregan al inventario

### 10. PERSISTENCIA

Mantener localStorage con nuevas keys:
- `innerlevel_cards` - Inventario de cartas
- `innerlevel_quests` - Quests activas y completadas
- `innerlevel_energy` - Estado de energía
- `innerlevel_recommendations` - Recomendaciones del día

### INSTRUCCIONES ESPECÍFICAS:

1. **Mantener toda la funcionalidad existente** de InnerLevel como base
2. **Integrar gradualmente** las nuevas características sin romper lo existente
3. **Reutilizar componentes** cuando sea posible (Dashboard, Analytics)
4. **Implementar tema RPG épico** con paleta oscura, dorados y efectos mágicos
5. **Crear datos de ejemplo** funcionales para testing inmediato
6. **Preparar integración** con Claude API pero con fallback local
7. **Implementar sistema de migración** para convertir datos existentes

La aplicación debe ser **completamente funcional** con datos de ejemplo, **visualmente épica** con auténtico estilo RPG/Fantasy, y **lista para integración** con Claude API cuando esté disponible.