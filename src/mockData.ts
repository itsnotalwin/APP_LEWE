/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Habit, Task, Project, Transaction, JournalEntry, DailyFocus } from './types';

// Utility to get format YYYY-MM-DD relative to today
export function getRelativeDateString(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

export function generateSeedData() {
  const todayStr = getRelativeDateString(0);
  const yesterdayStr = getRelativeDateString(-1);
  const twoDaysAgoStr = getRelativeDateString(-2);
  const threeDaysAgoStr = getRelativeDateString(-3);
  const fourDaysAgoStr = getRelativeDateString(-4);
  const fiveDaysAgoStr = getRelativeDateString(-5);

  const habits: Habit[] = [
    {
      id: 'h1',
      name: 'Morning Meditation (15 min)',
      category: 'Health',
      streak: 4,
      maxStreak: 12,
      history: {
        [todayStr]: true,
        [yesterdayStr]: true,
        [twoDaysAgoStr]: true,
        [threeDaysAgoStr]: true,
        [fourDaysAgoStr]: false,
        [fiveDaysAgoStr]: true,
      },
      createdAt: getRelativeDateString(-15),
    },
    {
      id: 'h2',
      name: 'Read 20 Pages',
      category: 'Growth',
      streak: 3,
      maxStreak: 8,
      history: {
        [todayStr]: false,
        [yesterdayStr]: true,
        [twoDaysAgoStr]: true,
        [threeDaysAgoStr]: true,
        [fourDaysAgoStr]: true,
        [fiveDaysAgoStr]: false,
      },
      createdAt: getRelativeDateString(-15),
    },
    {
      id: 'h3',
      name: 'Strength Workout / Gym',
      category: 'Health',
      streak: 1,
      maxStreak: 5,
      history: {
        [todayStr]: true,
        [yesterdayStr]: false,
        [twoDaysAgoStr]: true,
        [threeDaysAgoStr]: false,
        [fourDaysAgoStr]: true,
        [fiveDaysAgoStr]: false,
      },
      createdAt: getRelativeDateString(-15),
    },
    {
      id: 'h4',
      name: 'Track Expenses Daily',
      category: 'Finance',
      streak: 5,
      maxStreak: 20,
      history: {
        [todayStr]: true,
        [yesterdayStr]: true,
        [twoDaysAgoStr]: true,
        [threeDaysAgoStr]: true,
        [fourDaysAgoStr]: true,
        [fiveDaysAgoStr]: true,
      },
      createdAt: getRelativeDateString(-15),
    },
    {
      id: 'h5',
      name: 'Write Daily Review',
      category: 'Personal',
      streak: 2,
      maxStreak: 10,
      history: {
        [todayStr]: false,
        [yesterdayStr]: true,
        [twoDaysAgoStr]: true,
        [threeDaysAgoStr]: false,
        [fourDaysAgoStr]: true,
        [fiveDaysAgoStr]: true,
      },
      createdAt: getRelativeDateString(-15),
    },
  ];

  const projects: Project[] = [
    {
      id: 'p1',
      name: 'Launch Portfolio',
      description: 'Build and optimize personal website & dynamic resume.',
      category: 'Work',
      color: '#3B82F6', // Blue
    },
    {
      id: 'p2',
      name: 'Half Marathon Training',
      description: 'Prepare physical stamina for the 21K autumn run.',
      category: 'Health',
      color: '#10B981', // Emerald
    },
    {
      id: 'p3',
      name: 'Personal Finance Reset',
      description: 'Audit monthly expenses and set up sustainable investing targets.',
      category: 'Finance',
      color: '#F59E0B', // Amber
    }
  ];

  const tasks: Task[] = [
    {
      id: 't1',
      title: 'Outline portfolio layout and wireframes',
      description: 'Map out homepage bento grids and about page content.',
      completed: true,
      priority: 'high',
      category: 'Work',
      projectId: 'p1',
      dueDate: yesterdayStr,
      completedAt: yesterdayStr,
    },
    {
      id: 't2',
      title: 'Draft Project Case Studies',
      description: 'Write descriptions and select premium screenshots for my 3 major projects.',
      completed: false,
      priority: 'high',
      category: 'Work',
      projectId: 'p1',
      dueDate: getRelativeDateString(1),
    },
    {
      id: 't3',
      title: '5km Interval Cardio Run',
      description: 'Perform 5 blocks of 800m fast pace sprints with 2-minute recovery jogs.',
      completed: true,
      priority: 'medium',
      category: 'Health',
      projectId: 'p2',
      dueDate: todayStr,
      completedAt: todayStr,
    },
    {
      id: 't4',
      title: 'Review insurance & subscription terms',
      description: 'Cancel unused memberships and optimize streaming services.',
      completed: false,
      priority: 'low',
      category: 'Finance',
      projectId: 'p3',
      dueDate: getRelativeDateString(3),
    },
    {
      id: 't5',
      title: 'Buy fresh groceries & meal prep',
      description: 'Stock up on organic chicken, spinach, salmon, sweet potatoes, and blueberries.',
      completed: false,
      priority: 'medium',
      category: 'Health',
      dueDate: todayStr,
    },
    {
      id: 't6',
      title: 'Schedule dentist checkup',
      description: 'Routine scaling and overall wisdom teeth monitoring.',
      completed: true,
      priority: 'low',
      category: 'Personal',
      dueDate: twoDaysAgoStr,
      completedAt: twoDaysAgoStr,
    }
  ];

  const transactions: Transaction[] = [
    {
      id: 'tr1',
      desc: 'Client Web Design Project Deposit',
      amount: 1250,
      category: 'Income',
      date: threeDaysAgoStr,
      type: 'income',
    },
    {
      id: 'tr2',
      desc: 'Local Organic Groceries Store',
      amount: -84.20,
      category: 'Food',
      date: todayStr,
      type: 'expense',
    },
    {
      id: 'tr3',
      desc: 'Premium Coffee Shop',
      amount: -6.50,
      category: 'Leisure',
      date: yesterdayStr,
      type: 'expense',
    },
    {
      id: 'tr4',
      desc: 'Monthly Gym Access Sub',
      amount: -45.00,
      category: 'Health',
      date: fourDaysAgoStr,
      type: 'expense',
    },
    {
      id: 'tr5',
      desc: 'Workspace Hosting Cloud Server',
      amount: -15.00,
      category: 'Subscriptions',
      date: twoDaysAgoStr,
      type: 'expense',
    },
    {
      id: 'tr6',
      desc: 'Bookstore - Psychology and Productivity Hardcovers',
      amount: -32.80,
      category: 'Education',
      date: yesterdayStr,
      type: 'expense',
    },
  ];

  const journal: JournalEntry[] = [
    {
      id: 'j1',
      date: yesterdayStr,
      mood: 'productive',
      title: 'Focus Unleashed & Growth Gains',
      content: 'Woke up early around 6:00 AM. Completed my morning routine with complete mindfulness. Spent a very solid block of 4 hours deep work on portfolio layouts. Physical energy felt optimal during the cardio sprints.',
      reflections: {
        gratitude: 'Deeply grateful for steady focus intervals, a warm cup of filter brew, and an encouraging talk with standard team members.',
        improvements: 'Limit phone scrolling during short rest cycles as it dilutes cognitive reload.',
        focusRating: 5,
      },
    },
    {
      id: 'j2',
      date: twoDaysAgoStr,
      mood: 'calm',
      title: 'Quiet Reflections and Slow Pace',
      content: 'Felt a bit tired in the morning so I prioritized sleep and recovery over gym strain. Spent a quiet reading hour in the park. Sometimes moving slower is going further.',
      reflections: {
        gratitude: 'Grateful for public neighborhood parks and the luxury of choosing my own daily velocity.',
        improvements: 'Could drink more clean water throughout the afternoon.',
        focusRating: 4,
      },
    },
    {
      id: 'j3',
      date: threeDaysAgoStr,
      mood: 'happy',
      title: 'Celebrated Milestones!',
      content: 'Successfully locked down the contract deposit for the upcoming Web Design project! Celebrating this momentum by taking a close friend out for dinner. Healthy progress in all quadrants.',
      reflections: {
        gratitude: 'Grateful for client trust, professional growth milestones, and creative agency.',
        improvements: 'Keep a portion of client income automatically stashed in tax and retirement savings accounts.',
        focusRating: 4,
      },
    }
  ];

  const focus: DailyFocus = {
    text: 'Formulate core architecture details and implement the habit logs.',
    completed: false,
    date: todayStr,
  };

  return { habits, tasks, projects, transactions, journal, focus };
}
