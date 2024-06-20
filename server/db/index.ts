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
    'events.location_id as locationId',
    'locations.id as location_id',
    'locations.name as name',
  )
  .where({ day })
  
  return events as EventWithLocation[]
}

export async function getLocationById(id: number): Promise<Location> {
  return await connection('locations')
    .where({ id })
    .select(
      '*'
    )
    .first()
}

export async function updateLocation(id: number, name: string, description: string): Promise<Location> {
  return await connection('locations')
  .where({ id })
  .update({ name, description })
}

export async function addNewEvent(name: string, description: string, time: string, location_id: number, day: string): Promise<Event> {
  return await connection('events')
    .insert({name, description, time, location_id, day})
    .returning('id')
}

export async function deleteEvent(id: number) {
  return await connection('events')
  .where({ id })
  .del()
}

export async function getEventById(id: number): Promise<Event> {
  return await connection('events')
    .where({ id })
    .first()
    .select(
      'id',
      'location_id as locationId',
      'day',
      'time',
      'name',
      'description',
    )
}

export async function updateEvent(updatedEvent: Event) {
  return await connection('events').where({ id: updatedEvent.id }).update({
    name: updatedEvent.name,
    description: updatedEvent.description,
    day: updatedEvent.day,
    time: updatedEvent.time,
    location_id: updatedEvent.locationId,
  })
}