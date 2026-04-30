# Firebase SQL Connect

Firebase's first relational database solution for
developers who want to create secure and scalable apps with Cloud SQL for
PostgreSQL and type-safe mobile and web SDKs. [Learn more](https://firebase.google.com/products/data-connect).

Firebase SQL Connect is a relational database service for mobile and web
apps that lets you build and scale using a fully-managed PostgreSQL
database powered by Cloud SQL. It provides secure schema, query and
mutation management using GraphQL technology that integrates well with
Firebase Authentication. You can quickly integrate this product into your mobile and
web apps with SDK support in Kotlin Android, iOS, Flutter, and web.

SQL Connect lets you declare your application's data model and the
exact queries needed by your application. Using your data model we automatically
create a PostgreSQL database schema to fit your data model, secure server
endpoints that talk to the database, and type-safe SDKs for your client
application that talk to the server endpoints. It's like a "self-driving app
server" made-to-order for your specific application.

## Key capabilities

|---|---|
| Backed by Cloud SQL for PostgreSQL | Rely on a fully-managed database service that helps you set up, maintain, manage, and administer your PostgreSQL relational databases on Google Cloud. |
| Vector search | SQL Connect supports vector search for developers to build AI-powered applications. |
| Multiple platform SDKs | Firebase SQL Connect offers multi-platform SDKs, for Kotlin Android, iOS, Flutter, and web. |
| User-based authentication | SQL Connect supports end-user authentication, ensuring that only authorized users can access the data. |
| Visual Studio Code extension | Offers easy schema development, and query and mutation management, directly from your Visual Studio Code editor using GraphQL. |
| Emulator | Firebase SQL Connect includes an emulator that lets you test your app with a local database without having to deploy to production. |
| AI assistance from Gemini in Firebase | Use Gemini in Firebase to generate queries and mutations on-demand using natural language and test them directly in the Firebase console. Learn more at [Use AI assistance for SQL Connect for queries and mutations](https://firebase.google.com/docs/sql-connect/ai-assistance). |

## How does it work?

The top-level resource for Firebase SQL Connect is a _service_ , which
represents a managed GraphQL API that can be defined by developers and called by
end users. Your _schema_ is the app data model for a service, represented
primarily as a collection of GraphQL source files, as well as specific
configuration for attached datasources (such as Cloud SQL instances). There can
be only one schema per service. Finally, your _connectors_ are collections of
queries and mutations that have been defined to operate against a service's
schema. There can be many connectors per service (for instance if you have a
"rider" app and a "driver" app for your rideshare company).

Your SQL Connect schema maps explicitly to a specific underlying
PostgreSQL database schema. SQL Connect includes tooling to
automatically generate the SQL DDL needed to perform schema migrations based on
changes to the app schema. Based on your app schema, SQL Connect
automatically generates additional GraphQL schema to query and manipulate the
data model.

Once your app schema is defined, you can write predefined queries and mutations
that are executed to read and write data in the application.
SQL Connect queries and mutations are not submitted by client code
and executed on the server. Instead, when deployed, these SQL Connect
operations are stored on the server, like Cloud Functions. This simplifies code
management, and development of your client code. In privileged environments,
like the Firebase console and using our SQL Connect VS Code extension,
you can execute ad hoc operations with appropriate Google IAM credentials for
administrative operations.

For client code, each supported platform has a _core SDK_ that handles
connecting to the backend, issuing requests, and processing responses. These
SDKs are not schema-aware and must be supplied with operation names and
variables as unstructured data. Each supported platform also has a
_generated SDK_. As you define your data model and operations, tooling on your
machine will automatically generate strongly-typed SDKs specific to the
application. These SDKs will "wrap" the core SDKs for type safety, ergonomics,
and other features such as data validation and more down the road.

## Implementation path

|---|---|---|
| | Prototype your schema | Prototype your database schema, including designs using vector types, starting in a local environment with tooling |
| | Prototype your operations | Build predefined query and mutation operations for client apps based on automatically-generated queries and mutations |
| | Generate type-safe SDKs | Generate and test type-safe SDKs from your schema and operations, then implement client-side code |
| | Deploy schema and operations | Deploy the schema and operations for your Firebase SQL Connect service |
| | Deploy clients | Deploy your client code |

## Next steps

- Try out SQL Connect right now: explore a quickstart app repository and build a fully-featured SQL Connect app by following our [codelab for web](https://firebase.google.com/codelabs/firebase-dataconnect-web), [codelab for iOS](https://firebase.google.com/codelabs/firebase-dataconnect-ios), or [codelab for Android](https://firebase.google.com/codelabs/firebase-dataconnect-android).
- If you'd like to see the Firebase SQL Connect development flow in action, read through the [Get started guide](https://firebase.google.com/docs/sql-connect/quickstart).
- Learn about SQL Connect [pricing and billing](https://firebase.google.com/docs/sql-connect/pricing).
