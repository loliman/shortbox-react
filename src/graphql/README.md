# GraphQL document workflow

Single source for frontend GraphQL operations is:

- `typed-documents.graphql`

Generated output:

- `typed-documents.generated.ts` (created by contract codegen)

Runtime imports in app code:

- `queriesTyped.ts`
- `mutationsTyped.ts`

Do not add legacy inline `gql` document files (`queries.ts`, `mutations.ts`) again.
Keeping only one document source avoids schema drift and duplicate maintenance.
