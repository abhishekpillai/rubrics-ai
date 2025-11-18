# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Rubrics AI is an evidence-based interview preparation tool that generates structured interview guides with behaviorally-anchored rating scales (BARS). The application uses AI to implement research-backed hiring practices that reduce bias and improve predictive validity of interviews.

**Tech Stack:**
- Next.js 16.0.3 (App Router)
- TypeScript 5
- Tailwind CSS 4
- OpenRouter API (GPT-5 Mini, Claude 3.5 Sonnet)
- React Context + localStorage for state management

## Development Commands

```bash
# Development
npm run dev          # Start development server on localhost:3000

# Build & Production
npm run build        # Build production bundle
npm start            # Run production server

# Linting
npm run lint         # Run ESLint
```

## Environment Setup

Required environment variables in `.env.local`:
```env
OPENROUTER_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Optional, for OpenRouter rankings
```

## Architecture Overview

### 7-Step Wizard Flow

The application implements a competency-first workflow with automatic generation at key transitions:

1. **Step 1 (JobInput)** → Extracts competencies via LLM
2. **Step 2 (CompetencyEditor)** → Generates role-level rubrics via LLM
3. **Step 3 (RubricEditor)** → Edit BARS rubrics for ALL competencies
4. **Step 4 (InterviewFocus)** → Select 1-3 competencies for THIS interview → Generates questions via LLM
5. **Step 5 (QuestionEditor)** → Edit questions for selected competencies
6. **Step 6 (AgendaBuilder)** → Auto-generates timeline from questions
7. **Step 7 (Results)** → Export (text/markdown/print)

**Auto-trigger Pattern:** Steps 2, 4, and 6 automatically trigger LLM generation on "CONTINUE". Each step validates input before progressing.

**Key Architecture:**
- Rubrics are generated at the **role level** (Step 2) for ALL 3-5 competencies
- Interview focus (Step 4) selects **1-3 competencies** to assess in ONE interview
- Questions and agenda are **interview-specific** based on selected competencies

### State Management

All application state lives in `lib/wizardContext.tsx` using React Context API:

```typescript
WizardState {
  step: 1-7

  // Role-level data
  jobDescription: string
  duration: 30 | 45 | 60
  competencies: Competency[]  // ALL role competencies (3-5)
  rubric: RubricCriterion[]   // Role-level rubrics for ALL competencies

  // Interview-level data
  interviewType?: InterviewType        // Type of THIS interview
  interviewFocus?: string              // Focus description
  selectedCompetencyIds: string[]      // Which competencies THIS interview assesses (1-3)
  questions: Question[]                // Questions for selected competencies only
  agenda: AgendaItem[]                 // Timeline for THIS interview

  // Metadata
  createdAt: ISO string
  lastModified: ISO string
}
```

**Key Patterns:**
- Full state persisted to localStorage on every change
- Cascade deletion: removing a competency removes related questions
- Context hooks: `useWizard()`, `useCompetencies()`, `useQuestions()`
- All state updates go through context methods (never direct mutation)

### Component Structure

```
app/
├── components/
│   ├── WizardLayout.tsx            # Master UI shell with progress bar
│   ├── Step1_JobInput.tsx          # Job description + duration
│   ├── Step2_CompetencyEditor.tsx  # Edit 3-5 role competencies → generates rubrics
│   ├── Step3_RubricEditor.tsx      # Edit BARS rubrics (all competencies)
│   ├── Step4_InterviewFocus.tsx    # Select 1-3 competencies → generates questions
│   ├── Step5_QuestionEditor.tsx    # Edit questions (selected competencies only)
│   ├── Step6_AgendaBuilder.tsx     # Auto-generated timeline
│   └── Step7_Results.tsx           # Export/print interface
├── api/
│   ├── extract/competencies/       # POST - Extract competencies from JD
│   └── generate/
│       ├── questions/              # POST - Generate interview questions
│       └── rubric-from-competencies/ # POST - Generate BARS rubric
└── page.tsx                        # Root client page with WizardProvider

lib/
├── types.ts                        # TypeScript interfaces
├── wizardContext.tsx               # React Context state management
└── llm.ts                          # OpenRouter API integration
```

### LLM Integration (lib/llm.ts)

All LLM calls go through OpenRouter with structured JSON responses:

**Available Functions:**
- `extractCompetencies(jobDescription, quality)` - Extract 3-5 competencies
- `generateQuestions(competencies, duration, quality)` - Create behavioral/situational questions
- `generateRubricFromCompetencies(competencies, quality)` - Generate 4-level BARS

**Model Quality Options:**
- `standard`: `openai/gpt-5-mini` - Fast, cost-effective ($0.25/1M tokens)
- `enhanced`: `anthropic/claude-3.5-sonnet` - Superior reasoning ($3/1M tokens)

**Response Format:** All requests enforce `response_format: { type: 'json_object' }`

### API Route Pattern

All API routes follow this structure:
```typescript
// POST /api/[operation]/[entity]/route.ts
export async function POST(req: Request) {
  // 1. Parse and validate request body
  const { field1, field2 } = await req.json()

  if (!field1) {
    return NextResponse.json(
      { success: false, error: 'field1 is required' },
      { status: 400 }
    )
  }

  // 2. Call lib/llm function
  const { data, model } = await llmFunction(field1, field2)

  // 3. Return standardized response
  return NextResponse.json({
    success: true,
    data,
    model
  })
}
```

**Validation Requirements:**
- `/api/extract/competencies`: jobDescription >= 100 chars
- `/api/generate/questions`: 3-5 competencies, duration in [30, 45, 60]
- `/api/generate/rubric-from-competencies`: competencies array > 0

## Key Concepts

### Competency-First Design

The app enforces an evidence-based approach:
- **3-5 competencies** per role (enforced by validation)
- **Behavioral descriptions** (observable, measurable)
- **Weight system** (1-5 scale) influences question allocation
- **Required flags** mark must-have competencies

### BARS (Behaviorally Anchored Rating Scales)

The rubric uses a 4-level system per competency:
- **POOR** - Observable behaviors indicating inadequate performance
- **MIXED** - Some strengths, some gaps
- **GOOD** - Meets expectations with observable behaviors
- **EXCELLENT** - Exceeds expectations with clear evidence

Each level includes:
- Description (1-2 sentences)
- Behavioral indicators (2-3 observable actions)

**Non-signals:** Things NOT to evaluate (accent, nervousness, educational pedigree unless job-relevant)

### Time Budget Validation

Step 3 enforces time constraints:
- Questions must fit within `(duration - 10 minutes)` to leave buffer
- Visual indicator turns red when over budget
- Time allocation based on competency weights

## Data Types (lib/types.ts)

### Core Interfaces

```typescript
interface Competency {
  id: string
  name: string
  description: string  // Behavioral description
  weight: number       // 1-5 scale
  isRequired?: boolean
}

interface Question {
  id: string
  text: string
  type: 'behavioral' | 'situational'
  competencyId: string
  timeAllocation: number  // Minutes
  difficulty?: 'easy' | 'medium' | 'hard'
}

interface RubricLevel {
  level: 'poor' | 'mixed' | 'good' | 'excellent'
  description: string
  indicators: string[]  // Observable behaviors
}

interface RubricCriterion {
  id: string
  competencyId: string
  competencyName: string
  weight: number
  levels: RubricLevel[]  // Always 4 levels
  nonSignals?: string[]
}

interface AgendaItem {
  timeAllocation: string  // e.g., "5 minutes"
  activity: string
  purpose: string
  questionId?: string
}
```

## Important Patterns & Conventions

### 1. Inline Editing Pattern
Components use inline editing without modals:
- Border appears on focus (transparent → black)
- Immediate saves to context state
- Used in Step 2 (competencies) and Step 3 (questions)

### 2. Progressive Loading UX
Each step shows loading states during LLM calls:
- Loading spinner with status message
- Disabled buttons during generation
- Error messages with retry capability

### 3. Referential Integrity
- Deleting a competency cascades to delete related questions
- Questions link to competencies via `competencyId`
- Rubric criteria link to competencies via `competencyId`

### 4. Visual Design System
- Monospace typography (`font-mono`)
- All-caps labels and headers
- Black borders (2px major sections, 1px details)
- Alternating backgrounds (white/gray-50) for readability
- Minimalist, functional aesthetic

### 5. State Update Pattern
Always use context methods to update state:
```typescript
const { updateCompetency, deleteCompetency } = useCompetencies()

// ✅ Correct
updateCompetency(id, { name: 'New Name' })

// ❌ Wrong - never mutate state directly
competencies[0].name = 'New Name'
```

### 6. Auto-Generation with useEffect
Step 6 auto-generates agenda on mount:
```typescript
useEffect(() => {
  if (questions.length > 0 && agenda.length === 0) {
    // Build agenda from questions
    setAgenda(generatedAgenda)
  }
}, [questions, agenda])
```

### 7. Export Architecture
All exports are client-side (no server storage):
- **Plain text:** `navigator.clipboard.writeText()`
- **Markdown:** Blob download with `text/markdown` MIME type
- **Print:** `window.print()` browser dialog

## Common Development Tasks

### Adding a New Step
1. Create `Step[N]_[Name].tsx` in `app/components/`
2. Add to WizardContent switch statement in `page.tsx`
3. Update WizardLayout progress bar (increment max steps)
4. Update state interface in `lib/types.ts` if needed
5. Add validation logic before step transition

### Adding a New LLM Function
1. Add function to `lib/llm.ts`:
   ```typescript
   export async function myLLMFunction(input: string, quality: ModelQuality) {
     const systemPrompt = "Your role and constraints..."
     const userPrompt = `Task: ${input}`
     // ... fetch logic
     return { data: parsed.key, model: data.model }
   }
   ```
2. Create API route in `app/api/[verb]/[noun]/route.ts`
3. Add validation and error handling
4. Call from component with loading state

### Modifying Prompt Engineering
All system prompts are in `lib/llm.ts`. Key principles:
- Emphasize behavioral language (observable, measurable)
- Prohibit bias-prone attributes
- Request specific JSON structure
- Include research backing
- Use temperature 0.7-0.8 for creative tasks

### Adding New Validation
Validation happens at two levels:
1. **Component-level:** Check before calling `nextStep()`
2. **API-level:** Validate in route.ts before calling LLM

Always provide clear error messages to guide user actions.

## Testing Notes

When adding tests (future):
- Mock localStorage for WizardContext tests
- Mock fetch/OpenRouter for API route tests
- Test step transitions and validation logic
- Test cascade deletion of competencies → questions
- Test time budget calculation
- Test export formatting (plain text, markdown)

## Research-Backed Principles

This app emphasizes evidence-based hiring practices:
- **Structured interviews** reduce bias vs. unstructured
- **Behavioral questions** predict performance better than hypotheticals
- **Competency-based evaluation** focuses on job-relevant skills
- **BARS** provide objective rating criteria
- **Non-signals** explicitly exclude bias-prone attributes

When adding features, maintain this research-backed philosophy.
