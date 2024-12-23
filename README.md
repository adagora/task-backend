# Starwars GraphQL API

## run the app with

```
./start-dev-local.sh
```

GraphQL explorer: http://localhost:3000/graphql
example schema:

```
query GetFilms {
  {
    films {
      items {
        title
      }
    }
  }
}
```

```
query GetFilmsWithPagination {
  films(pagination: { page: 2, perPage: 3 }) {
    items {
      title
      episode_id
      director
    }
    pagination {
      currentPage
      perPage
      totalItems
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
}
```

```
query GetFilmsWithFilterAndPagination {
  films(
    pagination: { page: 1, perPage: 2 }
    filter: { director: "George Lucas" }
  ) {
    items {
      title
      episode_id
      director
    }
    pagination {
      currentPage
      perPage
      totalItems
      totalPages
      hasNextPage
      hasPreviousPage
    }
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
