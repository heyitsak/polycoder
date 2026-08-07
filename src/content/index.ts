import type { Track } from '../types'
import { cLevels } from './tracks/c'
import { cppLevels } from './tracks/cpp'
import { javaLevels } from './tracks/java'
import { pythonLevels } from './tracks/python'
import { jsLevels } from './tracks/js'
import { dsaLevels, dsaTopics } from './tracks/dsa'
import { sqlLevels, sqlTopics } from './tracks/sql'

export const RANKS = ['Novice', 'Learner', 'Competent', 'Advanced', 'Expert', 'Grandmaster', 'Absolute Grandmaster']

const CODE_TOPICS = [
  { id: 'foundations', name: 'Foundations', blurb: 'First program' },
  { id: 'variables', name: 'Variables & Math', blurb: 'Store & compute' },
  { id: 'conditions', name: 'Conditions', blurb: 'Decisions' },
  { id: 'loops', name: 'Loops', blurb: 'Repeat work' },
  { id: 'arrays', name: 'Arrays', blurb: 'Many values' },
  { id: 'strings', name: 'Strings', blurb: 'Text as data' },
  { id: 'advanced', name: 'Advanced', blurb: 'Think fast' },
]

export const TRACKS: Track[] = [
  { id: 'c', name: 'C', tagline: 'The foundation language', color: '#3b82f6', icon: '📘', kind: 'code', pistonLanguage: 'c', rankNames: RANKS, topics: CODE_TOPICS, levels: cLevels },
  { id: 'cpp', name: 'C++', tagline: 'Objects meet speed', color: '#ec4899', icon: '⚙️', kind: 'code', pistonLanguage: 'cpp', rankNames: RANKS, topics: CODE_TOPICS, levels: cppLevels },
  { id: 'java', name: 'Java', tagline: 'The enterprise classic', color: '#f59e0b', icon: '☕', kind: 'code', pistonLanguage: 'java', rankNames: RANKS, topics: CODE_TOPICS, levels: javaLevels },
  { id: 'python', name: 'Python', tagline: 'Readable. Powerful. Everywhere.', color: '#22c55e', icon: '🐍', kind: 'code', pistonLanguage: 'python', rankNames: RANKS, topics: CODE_TOPICS, levels: pythonLevels },
  { id: 'js', name: 'JavaScript', tagline: 'The language of the web', color: '#eab308', icon: '⚡', kind: 'code', pistonLanguage: 'js', rankNames: RANKS, topics: CODE_TOPICS, levels: jsLevels },
  { id: 'sql', name: 'SQL', tagline: 'Talk to databases', color: '#8b5cf6', icon: '🗄️', kind: 'sql', pistonLanguage: 'sql', rankNames: RANKS, topics: sqlTopics, levels: sqlLevels },
  { id: 'dsa', name: 'DSA', tagline: 'Algorithms & problem solving', color: '#ef4444', icon: '🧠', kind: 'code', pistonLanguage: 'python', rankNames: RANKS, topics: dsaTopics, levels: dsaLevels },
]

export function getTrack(id: string): Track | undefined {
  return TRACKS.find(t => t.id === id)
}

export interface Semester {
  sem: number
  name: string
  subjects: {
    id: string
    name: string
    type: 'code' | 'core' | 'theory'
    trackId?: string
    blurb: string
  }[]
}

export const SEMESTERS: Semester[] = [
  {
    sem: 1, name: 'Semester 1',
    subjects: [
      { id: 's1-m1', name: 'Applied Mathematics-I', type: 'theory', blurb: 'Algebra, sets, functions, trig' },
      { id: 's1-c1', name: 'Communication Skills-I', type: 'theory', blurb: 'English, grammar, presentation' },
      { id: 's1-fo', name: 'Fundamentals of ICT', type: 'code', trackId: 'js', blurb: 'Computers, internet, intro app' },
      { id: 's1-p1', name: 'Applied Physics-I', type: 'theory', blurb: 'Mechanics, heat, sound' },
      { id: 's1-p1c', name: 'Applied Chemistry-I', type: 'theory', blurb: 'Atoms, bonds, reactions' },
    ],
  },
  {
    sem: 2, name: 'Second Semester',
    subjects: [
      { id: 's2-m2', name: 'Applied Mathematics-II', type: 'theory', blurb: 'Matrices, calculus, statics' },
      { id: 's2-eg', name: 'Engineering Graphics', type: 'theory', blurb: 'Drawing, projection, CAD' },
      { id: 's2-c', name: 'C Programming', type: 'code', trackId: 'c', blurb: 'Start at the root: C' },
      { id: 's2-de', name: 'Digital Electronics', type: 'theory', blurb: 'Logic gates, circuits' },
      { id: 's2-c2', name: 'Communication Skills-II', type: 'theory', blurb: 'Technical writing, interviews' },
    ],
  },
  {
    sem: 3, name: 'Third Semester',
    subjects: [
      { id: 's3-ds', name: 'Data Structures', type: 'code', trackId: 'dsa', blurb: 'Arrays → trees → graphs' },
      { id: 's3-c', name: 'Data Structures in C', type: 'code', trackId: 'c', blurb: 'Implement with pointers' },
      { id: 's3-ddb', name: 'DBMS', type: 'code', trackId: 'sql', blurb: 'Design and query databases' },
      { id: 's3-dm', name: 'Discrete Mathematics', type: 'theory', blurb: 'Logic, sets, relations, graphs' },
      { id: 's3-co', name: 'Computer Organisation', type: 'theory', blurb: 'CPU, memory, I/O' },
    ],
  },
  {
    sem: 4, name: 'Fourth Semester',
    subjects: [
      { id: 's4-oop', name: 'OOP with Java', type: 'code', trackId: 'java', blurb: 'Classes, inheritance, interfaces' },
      { id: 's4-python', name: 'Python Programming', type: 'code', trackId: 'python', blurb: 'Python for problem solving' },
      { id: 's4-web', name: 'Web Development', type: 'code', trackId: 'js', blurb: 'HTML, CSS, JavaScript' },
      { id: 's4-os', name: 'Operating Systems', type: 'theory', blurb: 'Processes, memory, scheduling' },
      { id: 's4-se', name: 'Software Engineering', type: 'theory', blurb: 'SDLC, testing, UML' },
    ],
  },
  {
    sem: 5, name: 'Fifth Semester',
    subjects: [
      { id: 's5-advweb', name: 'Advanced Web Technologies', type: 'code', trackId: 'js', blurb: 'Node, React, APIs' },
      { id: 's5-mobile', name: 'Mobile App Development', type: 'theory', blurb: 'Android, lifecycle, UI' },
      { id: 's5-cn', name: 'Computer Networks', type: 'theory', blurb: 'TCP/IP, routing, security' },
      { id: 's5-iot', name: 'Internet of Things', type: 'theory', blurb: 'Sensors, embedded, MQTT' },
      { id: 's5-ai', name: 'AI & ML Basics', type: 'theory', blurb: 'Intro to intelligence' },
    ],
  },
  {
    sem: 6, name: 'Sixth Semester',
    subjects: [
      { id: 's6-proj', name: 'Major Project', type: 'code', trackId: 'dsa', blurb: 'Ship something real' },
      { id: 's6-cc', name: 'Cloud & Big Data', type: 'theory', blurb: 'Cloud services, data pipelines' },
      { id: 's6-cyber', name: 'Cyber Security', type: 'theory', blurb: 'Threats, encryption, ethics' },
      { id: 's6-int', name: 'Internship / Industrial Training', type: 'core', blurb: 'Work in the industry' },
    ],
  },
]