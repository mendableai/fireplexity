<div align="center">

# Fireplexity

A blazing-fast AI search engine powered by Firecrawl's web scraping API. Get intelligent answers with real-time citations and live data.

<img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjBxbWFxamZycWRkMmVhMGFiZnNuZjMxc3lpNHpuamR4OWlwa3F4NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QbfaTCB1OmkRmIQwzJ/giphy.gif" width="100%" alt="Fireplexity Demo" />

</div>

## Features

- **Real-time Web Search** - Powered by Firecrawl's search API
- **AI Responses** - Streaming answers with GPT-4o-mini
- **Source Citations** - Every claim backed by references
- **Live Stock Data** - Automatic TradingView charts
- **Smart Follow-ups** - AI-generated questions

## Quick Start

### Clone & Install
```bash
git clone https://github.com/mendableai/fireplexity.git
cd fireplexity
npm install
```

### Set API Keys
```bash
cp .env.example .env.local
```

Add to `.env.local`:
```
FIRECRAWL_API_KEY=fc-your-api-key
OPENAI_API_KEY=sk-your-api-key
```

### Run
```bash
npm run dev
```

Visit http://localhost:3000

---

## Docker

You can also run Fireplexity in a Docker container:

```bash
docker build -t fireplexity .
docker run --env-file .env.local -p 3000:3000 fireplexity
```

Make sure to set your API keys in `.env.local` before building the image.

---

## LLM Providers

Fireplexity supports multiple LLM providers. By default, it uses OpenAI, but you can switch to other providers (such as Fireworks, Together, or Groq) by setting the following environment variable in `.env.local`:

```
LLM_PROVIDER=openai   # or fireworks, together, groq
```

You may need to provide additional API keys depending on the provider you choose. See the documentation for each provider for details.

---

## Example Queries & Scraping Tips

Fireplexity can scrape and answer questions about a wide range of topics using real-time web data. Here are some example queries you can try:

- `Summarize the latest news about OpenAI.`
- `What are the top 3 competitors of Firecrawl?`
- `Show me the current stock price and chart for Tesla.`
- `Find recent reviews for the iPhone 15.`
- `Get the weather forecast for Madrid this week.`
- `What are the main findings from the latest Nature article on AI safety?`
- `Compare the pricing of AWS and Google Cloud in 2024.`

**Tips for Optimal Results:**
- Be specific: Include names, dates, or sources if possible (e.g., "Summarize the latest Wired article on quantum computing").
- Ask for summaries or comparisons to get concise, actionable answers.
- For financial data, mention the company name or ticker (e.g., "AAPL stock chart").
- For academic or technical topics, reference the publication or author for more accurate scraping.
- If you want sources, add "with sources" or "with citations" to your query.

## Tech Stack

- **Firecrawl** - Web scraping API
- **Next.js 15** - React framework
- **OpenAI** - GPT-4o-mini (default, configurable)
- **Vercel AI SDK** - Streaming
- **TradingView** - Stock charts
- **Docker** - Containerized deployment
- **Multiple LLM Providers** - OpenAI, Fireworks, Together, Groq

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmendableai%2Ffireplexity)

## Resources

- [Firecrawl Docs](https://docs.firecrawl.dev)
- [Get API Key](https://firecrawl.dev)
- [Discord Community](https://discord.gg/firecrawl)

## License

MIT License

---

Powered by [Firecrawl](https://firecrawl.dev)
