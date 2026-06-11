import type { Metadata } from 'next'
import DroneRaceClient from './DroneRaceClient'

export const metadata: Metadata = {
  title: 'Sky-Rush Drone Race | FPV Obstacle Racing',
  description:
    'Participate in the FPV Drone Racing obstacle course challenge at Yuva Tech-Fest SRM IST Tiruchirappalli. Check drone specifications, safety rules, and win cash prizes.',
  keywords: ['drone racing', 'FPV drone', 'obstacle course', 'quadcopter', 'aero modeling', 'SRM IST', 'Yuva Tech-Fest'],
  openGraph: {
    title: 'Sky-Rush Drone Race | FPV Obstacle Racing',
    description: 'FPV drone racing obstacle challenge and cash prizes at Yuva Tech-Fest.',
    type: 'website',
  },
}

export default function DroneRacePage() {
  return <DroneRaceClient />
}
