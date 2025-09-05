# TS Fullstack Boilerplate - Work in Progress

## Purpose
This project is a full stack starting point for TS based applications that need fast development time.

## State of the Project
This project has been used as a starting point for my projects for my clients, however it has not always been updated as those individual codebases make architectural improvements. While this is a great starting point for fast paced projects, it also has a couple of pitfalls.

### Pitfall - Filtering/Where Queries are Verbose
The default Query DTOs and service setup allow both simple and complex queries on the client side by using prisma 'where' types in our DTO. However this also means that complex queries are large and heavily nested, therfore they are not always easy to understand at first. A good solution here would be to add a setup for mapped queries, where you could expose a single query key that gets mapped to a more complex query on the backend.

### Pitfall 2 - Prisma Lock In
This project uses prisma extensively, especially in type mappings. While it would not be impossible to swap out prisma for raw SQL or a different ORM, it would require a lot of overhead.

### Overengineering at the Benefit of Dev Speed
There are parts of this project that could be considered overly engineered or overly abstracted. The benefit of this is that I can quickly add resources to our REST API and integrate them into the fronted. While I have not had any issues arise as a result of this, I could see a steep learning curve if this were to be transfered to a new developer or team of developers.


## Improvements / Next Steps
- Add separate SQL query builder or raw query tooling for high performance queries (avoid prisma overhead)
- Simplify filtering
- Improved/simplified query permissioning
- Upgrade prisma to have separated generated folder outside of node_modules