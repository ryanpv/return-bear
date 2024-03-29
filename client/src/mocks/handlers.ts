import { rest } from 'msw';

export const handlers = [
  // POST status response test
  rest.post('http://localhost:3003/phone/data', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        prefix: 1,
        operator: 'operator',
        country_code: 1,
        country: 'Canada',
        region: 'region'
      })
    )
  })
]