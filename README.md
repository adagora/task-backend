run the app with `./start-dev-local.sh`

GraphQL explorer:

```
http://localhost:3000/graphql

example:

query {
  films(pagination: { page: 1, perPage: 10 }) {
    title
    episode_id
    opening_crawl
    director
    producer
    release_date
  }
}
```

```
query {
  films(pagination: { page: 1 }, filter: { director: "Lucas" }) {
    title
    director
  }
}
```

get a single resource by ID

```
query {
  film(id: "1") {
    title
    director
  }
}
```
