## Getting Started

### Installation
To run the GraphQL API locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/AyoubKaz07/b464-back.git
2. Install dependencies
   ```npm install```

### Database Setup

For local development, you should setup a local instance of the database

1. **Install MongoDB**
  ```npm install mongodb```
  - Add your connection string into your application code (from MongoDB Atlas) in ```.env```
    ```mongodb+srv://username:<password>@ProjectsName.6dirvkv.mongodb.net/?retryWrites=true&w=majority```
2. **Install Redis**
  - Install Redis by following the instructions provided on the [official Redis website](https://redis.io/docs/install/install-redis/)
  - Start the Redis server locally. The default port is 6379.
  - In Command line ```redis-server```


### Environment Variables
  - To use the NewsLetter feature, you should get from Google API
  ```EMAIL_FROM - EMAIL_USERNAME - EMAIL_PASSWORD```


## Start GraphQL API server
  - Run ```npm run dev```
  - Access the GraphQL endpoint in your browser or using a tool like [GraphQL Playground](https://studio.apollographql.com/)
    http://localhost:3000/graphql

## GraphQL API Documentation

### Generated Documentation

The GraphQL API documentation is automatically generated using [SpectaQL](https://github.com/anvilco/spectaql), providing a comprehensive overview of available queries, mutations, and data models.

You can access the generated documentation by visiting the [GitHub Pages for GraphQL API Docs](https://ayoubkaz07.github.io/b464-back/).
