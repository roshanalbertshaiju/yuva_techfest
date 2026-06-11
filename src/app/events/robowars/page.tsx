import type { Metadata } from 'next'
import RobowarsClient from './RobowarsClient'

export const metadata: Metadata = {
  title: 'Robo-Wars Arena | Combat Robotics Tournament',
  description:
    'Enter the Robo-Wars Arena combat robotics tournament at Yuva Tech-Fest SRM IST Tiruchirappalli. View weight classes, arena specs, and battle rules.',
  keywords: ['robo wars', 'combat robotics', 'robot wars', 'battlebots', 'robot design', 'engineering challenge', 'SRM IST', 'Yuva Tech-Fest'],
  openGraph: {
    title: 'Robo-Wars Arena | Combat Robotics Tournament',
    description: 'Enter the combat robotics tournament and win cash rewards at Yuva Tech-Fest.',
    type: 'website',
  },
}

export default function RobowarsPage() {
  return <RobowarsClient />
}
