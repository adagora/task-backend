# Starwars GraphQL API

run the app with `./start-dev-local.sh`

GraphQL explorer: http://localhost:3000/graphql
example schema:

```
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

```
query {
  film(id: "1") {
    title
    director
  }
}
```

```
query {
  analyzeOpeningCrawl {
    uniqueWordPairs {
      word
      count
    }
    mostMentionedCharacters
  }
}
```

db:

```
psql -h localhost -p 5432 -U postgres -d postgres
\dt
```
