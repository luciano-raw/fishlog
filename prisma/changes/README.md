# Existing database updates

This project started without a Prisma migration baseline. Do not run `migrate reset` or assume `migrate deploy` will initialize the existing populated database.

`20261020_lures_admin_shops.sql` adds nullable catch lure types, a user role (default `USER`), and shops. Existing catches remain valid without a lure selection.

`scripts/apply-fishing-update.mjs` applies the additive SQL and grants `ADMIN` to one existing account, in a transaction. First independently verify the exact user ID and email in the correct Clerk instance. Use `--check` before `--apply`:

```sh
node scripts/apply-fishing-update.mjs <verified-clerk-id> <verified-email> --check
node scripts/apply-fishing-update.mjs <verified-clerk-id> <verified-email> --apply
```

The script uses the configured `DATABASE_URL`, does not create accounts, and fails if the existing ID/email do not match. Run it only against the intended database before deploying code that queries the new columns. It is an operator script, not an application endpoint. No email allowlist or browser-controlled role assignment is used by the app.

The SQL revokes Supabase's default client-facing table grants on `User` and `Shop`. Both tables are accessed through the Next.js/Prisma server; browser Supabase usage is for Storage. Check the grants after applying with `node scripts/check-shop-permissions.mjs`.
