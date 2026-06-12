import type { Metadata } from 'next'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import EventDetailsClient from './EventDetailsClient'

interface Props {
  params: Promise<{ eventId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const eventId = resolvedParams.eventId
  
  try {
    const docRef = doc(db, 'events', eventId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        title: `${data.title} | Yuva Tech-Fest`,
        description: data.tagline || data.description,
      }
    }
  } catch (error) {
    console.error("Error generating dynamic metadata:", error)
  }

  return {
    title: 'Event Details | Yuva Tech-Fest',
    description: 'Explore schedules, tracks, rules, and guidelines at Yuva Tech-Fest.',
  }
}

export default async function EventPage({ params }: Props) {
  const resolvedParams = await params
  return <EventDetailsClient eventId={resolvedParams.eventId} />
}
