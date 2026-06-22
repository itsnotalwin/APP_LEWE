/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Groq SDK
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// AI Coach endpoint
app.post('/api/coach', async (req, res) => {
  try {
    const { habits, tasks, transactions, journal, focus, userKey } = req.body;

    // Check for API key (prioritizing user-provided custom key if available, otherwise env)
    const activeKey = userKey || process.env.GROQ_API_KEY;
    if (!activeKey || activeKey === 'MY_GROQ_API_KEY') {
      return res.status(200).json({
        success: false,
        error: 'Missing API Key',
        markdown: `### 🧘 Self-Reflection Required

To unlock the premium **AI Life Coach Audit**, please configure your **Groq API Key** in the **Settings** tab.

**Why this is required:**
1. This app runs completely offline in your browser, keeping your habits, tasks, and finances 100% private.
2. In order to analyze this data under our secure, private shell with Groq, we need an API token.
3. Don't worry! All data stays strictly yours, and the key is stored securely in your browser's local state.

#### 💡 Manual Coach Insight (Fallback):
- **Habits Check**: You have **${habits?.filter((h: any) => h.history[new Date().toISOString().split('T')[0]]).length || 0}** habits checked today. Keep pushing!
- **Primary Focus**: "${focus?.text || 'No focus set for today yet.'}"
- **Tasks Pending**: You have **${tasks?.filter((t: any) => !t.completed).length || 0}** outstanding tasks. Prioritize the high-urgency ones!`,
      });
    }

    // Set client to use private userKey if available
    const activeClient = userKey ? new Groq({ apiKey: userKey }) : groq;

    const systemPrompt = `You are "Life OS Assistant" — a premium, objective, highly analytical, yet deeply supportive life strategy coach. 
Analyze the user's daily tracker state, habits, tasks, finances, and journal notes.
Provide a professional, concise, and beautifully structured Daily Audit in clean Markdown.

Adhere strictly to these styling constraints:
- Use precise display titles and bullet points.
- Use "RANDS (ZAR)" or "R" for all currency mentions.
- NEVER use generic, enthusiastic "AI slop" or hyperbolic preachy warnings.
- Keep the tone grounded, objective, and deeply motivating.
- Avoid listing code paths, internal database details, or raw IDs.

Data Context:
- Today's date: ${new Date().toISOString().split('T')[0]}
- Today's Primary Focus: "${focus?.text || 'Not set'}" (Completed: ${focus?.completed ? 'Yes' : 'No'})
- Habits List (Today's completion status): ${JSON.stringify(habits?.map((h: any) => ({ name: h.name, completedToday: !!h.history[new Date().toISOString().split('T')[0]], streak: h.streak })) || '[]')}
- Current Uncompleted Tasks: ${JSON.stringify(tasks?.filter((t: any) => !t.completed).map((t: any) => ({ title: t.title, priority: t.priority })) || '[]')}
- Recent Transactions: ${JSON.stringify(transactions?.slice(0, 5).map((t: any) => ({ desc: t.desc, amount: t.amount, type: t.type })) || '[]')}
- Journal/Mood: ${journal?.[0] ? JSON.stringify({ mood: journal[0].mood, reflections: journal[0].reflections?.gratitude }) : 'None'}

Format your output EXACTLY as follows:
## 📊 Life OS Strategy Review

### 🎯 Focus & Vibe Analysis
[Identify their current mental momentum based on mood and focus.]

### 🔥 Habit Momentum & Streaks
[Formulate a concise summary of their current streaks. Highlight consistent areas.]

### 📌 Core Task Action-Guides
- **Primary Suggestion**: [Specific pending high/medium priority task to tackle next]
- **Efficiency Tip**: [1 sentence on managing today's workload]

### 🪙 Capital Flow Check
[Provide a quick, concise audit of expenses/deposit dynamics this week.]

### 🧘 Daily Tactical Recommendation
[1 actionable step they can execute in the next 15 minutes.]`;

    const chatCompletion = await activeClient.chat.completions.create({
      messages: [{ role: 'user', content: systemPrompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
    });

    res.json({
      success: true,
      markdown: chatCompletion.choices[0]?.message?.content || '',
    });
  } catch (err: any) {
    console.error('Error in AI Coach:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'System error encountered.',
    });
  }
});

// Vite Middleware & Production Serving Logic
async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Life OS Server running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
});
