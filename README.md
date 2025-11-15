# Rubrics AI - Interview Preparation Tool

Generate comprehensive interview agendas and evaluation rubrics tailored to your specific hiring needs using AI.

## Features

- **AI-Powered Rubric Generation**: Create detailed evaluation criteria based on job descriptions
- **Structured Interview Agendas**: Get time-allocated interview schedules
- **Multiple AI Models**: Choose between GPT-5 Mini (fast & cost-effective) or Claude 3.5 Sonnet (superior reasoning)
- **Comprehensive Output**:
  - Interview agenda with time allocations
  - Detailed evaluation rubric with weighted criteria
  - Key competencies to assess
  - Red flags to watch for

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Provider**: OpenRouter (supports GPT-5, Claude, and more)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenRouter API key ([Get one here](https://openrouter.ai/keys))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd rubrics-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Add your OpenRouter API key to `.env.local`:
```env
OPENROUTER_API_KEY=your_actual_api_key_here
```

### Running Locally

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Enter Job Description**: Paste the full job description including responsibilities and requirements
2. **Specify Interview Focus**: Describe what you want to assess (technical skills, cultural fit, etc.)
3. **Choose AI Model**:
   - **GPT-5 Mini**: Faster, more cost-effective ($0.25/1M input tokens)
   - **Claude 3.5 Sonnet**: Superior reasoning for complex evaluations ($3/1M input tokens)
4. **Generate**: Click "Generate Interview Guide"
5. **Review & Use**: Print or save the generated agenda and rubric

## Project Structure

```
rubrics-ai/
├── app/
│   ├── components/
│   │   ├── InterviewForm.tsx      # Input form for JD and specifics
│   │   └── ResultsDisplay.tsx     # Display generated results
│   ├── api/
│   │   └── generate/
│   │       └── route.ts            # API endpoint for LLM calls
│   ├── page.tsx                    # Main application page
│   └── layout.tsx                  # Root layout
├── lib/
│   ├── llm.ts                      # OpenRouter client utility
│   └── types.ts                    # TypeScript type definitions
└── .env.local                      # Environment variables (not in git)
```

## API Models

### GPT-5 Mini
- **Best for**: Fast prototyping, cost optimization
- **Pricing**: $0.25/1M input, $2/1M output
- **Strengths**: Speed, low cost, good general performance

### Claude 3.5 Sonnet
- **Best for**: Complex evaluations, nuanced rubrics
- **Pricing**: $3/1M input, $15/1M output
- **Strengths**: Superior reasoning, excellent at evaluation criteria

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variable `OPENROUTER_API_KEY` in Vercel project settings
4. Deploy!

Vercel will automatically deploy on every push to your main branch.

### Manual Deployment

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | Yes | Your OpenRouter API key |
| `NEXT_PUBLIC_APP_URL` | No | Your app URL (for OpenRouter rankings) |

## Roadmap

- [ ] Question bank generation with filtering
- [ ] Voice AI integration for natural language input (Pipecat)
- [ ] Export to PDF/Docx
- [ ] Save and manage multiple interview templates
- [ ] Authentication and user accounts
- [ ] Database integration for saved rubrics
- [ ] Collaborative interview preparation

## Cost Estimates

Based on typical usage:
- **100 rubrics with GPT-5 Mini**: ~$0.25 - $0.50
- **100 rubrics with Claude 3.5 Sonnet**: ~$3 - $5

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.

## Support

For issues or questions:
- Open an issue on GitHub
- Check [OpenRouter documentation](https://openrouter.ai/docs)
- Review [Next.js documentation](https://nextjs.org/docs)
