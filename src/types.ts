/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Habit {
  id: string;
  name: string;
  category: string;
  streak: number;
  maxStreak: number;
  history: Record<string, boolean>; // YYYY-MM-DD -> completed (true)
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'Work' | 'Personal' | 'Health' | 'Finance' | 'Growth';
  dueDate?: string;
  projectId?: string;
  completedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  category: string;
  color: string;
}

export interface Transaction {
  id: string;
  desc: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  type: 'income' | 'expense';
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  mood: 'happy' | 'calm' | 'energetic' | 'tired' | 'productive' | 'anxious' | 'neutral';
  content: string;
  title?: string;
  reflections: {
    gratitude: string;
    improvements: string;
    focusRating: number; // 1-5
  };
}

export interface DailyFocus {
  text: string;
  completed: boolean;
  date: string; // YYYY-MM-DD
}

export interface LifeOSData {
  habits: Habit[];
  tasks: Task[];
  projects: Project[];
  transactions: Transaction[];
  journal: JournalEntry[];
  focus: DailyFocus;
  apiKeys?: {
    groq?: string;
  };
}
