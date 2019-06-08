import { mockServer, MockList } from 'graphql-tools';
import schema from './schema';

const server = mockServer(schema, {
  Post: () => ({
    id: () =>
      Math.random()
        .toString(36)
        .substring(7),
    title: () => 'Hello World',
    slug: () => 'hello-world'
  }),
  Query: () => ({
    posts: () => new MockList(5)
  })
});

beforeEach(() => {
  // setup a fetch mock
  (global as any).fetch = jest.fn(async function mockedAPI(url: string, opts: RequestInit) {
    const body = JSON.parse(opts.body as string);
    const res = await server.query(body.query, body.variables);

    return Promise.resolve({
      json() {
        return res;
      }
    });
  });
});
