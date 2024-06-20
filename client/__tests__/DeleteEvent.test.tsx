// @vitest-environment jsdom

import { beforeAll, describe, it, expect } from "vitest";
import nock from "nock";
import userEvent from "@testing-library/user-event";
import { setupApp } from "./setup";

beforeAll(() => nock.disableNetConnect())

describe('Delete the Event', () => {
    it('will delete the event', async() => {
        const scope = nock('http://localhost')
        .persist()
        .get('/api/v1/events/1')
        .reply(200,{
            id: 1,
            locationId: 1,
            day: 'friday',
            time: '2pm - 3pm',
            name: 'Slushie Apocalypse I',
            description:
              'This is totally a description of this really awesome event that will be taking place during this festival at the Yella Yurt. Be sure to not miss the free slushies cause they are rad!',
          })

       const deleteEvent = nock('http://localhost')
       .delete('/api/v1/events/1')
       .reply(204)
       
       const screen = setupApp('/events/1/edit')
       const del = await screen.findByText('Delete event')
       await userEvent.click(del)

       expect(scope.isDone()).toBe(true)
       expect(deleteEvent.isDone()).toBe(true)
    })
})