import knexFile from './knexfile.js'
import knex from 'knex'
import type { Location, LocationData } from '../../models/Location.ts'
import type { Event, EventWithLocation, EventData } from '../../models/Event.ts'


type Environment = 'production' | 'test' | 'development'

const environment = (process.env.NODE_ENV || 'development') as Environment
const config = knexFile[environment]
export const connection = knex(config)

export async function getAllLocations() {
  const locations: unknown[] = await connection('locations')
    .select(
      '*'
    ) 
    // TODO: replace this with your knex query
  return locations as Location[]
}

export async function getEventsForDay(day: string) {
  const events: unknown[] = await connection('events')
  .join('locations', 'events.location_id', 'locations.id')
  .select(
    'events.id as id',
    'events.day as day',
    'events.time as time',
    'events.name as eventName',
    'events.description as description',
    'location.name as locationName',
    'events.location_id as locationId',
    'locations.id as location_id',
    'locations.name as name',
  )
  .where({ day })
  
  return events as EventWithLocation[]
}
