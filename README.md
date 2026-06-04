# 🍝 Brainrot Kitchen

```text
                ✨

          (\_/) 
         ( •.• )
        / >🍝

       Brainrot Witch

     ┌───────────────┐
     │ Context       │
     │ Skills        │
     │ Prompts       │
     │ Workers       │
     │ Gemini        │
     └───────────────┘

      It started with:
      "How do agents work?"

      Things escalated.
```

A small cooking application built while learning how AI agents actually work.

Not only prompts.

Also context, skills, tools, workflows, debugging, releases, deployment and all the unexpected things hiding between a browser and an LLM.

## Current Stack

* HTML
* CSS
* Vanilla JavaScript
* GitHub Pages
* Cloudflare Workers
* Gemini

## Architecture

```text
GitHub Pages
      │
      ▼
Frontend
      │
      ▼
Cloudflare Worker
      │
      ▼
Gemini
```

## Live Demo

Frontend:

https://eveyonline.github.io/brainrot-kitchen/

Backend:

https://brainrot-kitchen.eve-vinclair.workers.dev

Current release:

**v0.3.2**

## Things I learned the hard way

* API keys do not belong in frontend code
* CORS always has opinions
* Service Workers remember everything
* Production behaves differently from localhost
* Small projects become real projects surprisingly fast

## Why this project exists

I started this project to understand AI coding agents.

Along the way I learned about:

* Git & GitHub
* Cloudflare Workers
* Service Workers
* Secrets management
* Releases
* Browser caches
* CORS

And I'm still learning.

```
```
