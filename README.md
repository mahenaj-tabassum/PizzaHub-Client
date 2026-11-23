# PizzaHub Client — Pizza Ordering & Delivery Platform

PizzaHub is a role-based pizza ordering platform. Customers discover local pizza shops, browse menus and place orders. Restaurants (vendors) publish menu items and manage incoming orders. Admins moderate users, menu items and subscription transactions.

This repository is the **Next.js client**. The Express API lives in the server repository.

## Live Links

- **Live site:** https://pizzahub-client-web.vercel.app
- **Client repository:** https://github.com/mahenaj-tabassum/PizzaHub-Client
- **Server repository:** https://github.com/mahenaj-tabassum/PizzaHub-Server
- **Live API:** https://pizzahub-api-server.vercel.app

## Key Features

**Public**

- Home page with animated hero, category shortcuts, featured items (Premium vendors first), Why Choose PizzaHub, How It Works, Popular Combos, Testimonials
- Browse Menu with debounced search, category filter, location filter, price sorting, pagination, skeleton loaders and empty states
- Item details are private and redirect to Sign In when logged out

**Authentication**

- Better Auth with email/password and Google OAuth
- Role selection at sign-up (Customer or Vendor). Admin can never be created publicly
- Password rules (6+ characters, one uppercase, one lowercase) enforced on both client and server
- Blocked users are redirected to a blocked page and rejected by the API

**Customer**

- Order form with delivery date, address and message
- Duplicate active orders for the same item and date are prevented
- Dashboard with stats, charts, My Orders, order details with status timeline, and cancel while pending

**Vendor**

- Add, edit, delete and hide menu items (images uploaded to ImgBB)
- Free plan: max 3 active items. Premium: unlimited
- Accept or reject pending orders (once only)
- Stripe subscription with Billing Portal management

**Admin**

- Platform stats and charts
- Manage users (search, role filter, block and unblock)
- Approve, reject, activate, deactivate or delete menu items
- Read-only transactions table

**Extras**

- Dark / light mode, order status timeline, toast notifications, custom 404 and error pages

## Technology Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling / UI:** Tailwind CSS 4, shadcn/ui, `@base-ui/react`, `lucide-react`, `react-icons`, `tw-animate-css`, `class-variance-authority`, `clsx`, `tailwind-merge`
- **Animation:** `motion`
- **Auth:** `better-auth`, `@better-auth/mongo-adapter`, `jose`, `mongodb`
- **Forms and validation:** `react-hook-form`, `@hookform/resolvers`, `zod`
- **Charts:** `recharts`
- **Other:** `next-themes`, `react-toastify`, `date-fns`

## Installation

```bash
git clone https://github.com/mahenaj-tabassum/PizzaHub-Client.git
cd PizzaHub-Client
npm install
cp .env.example .env.local
# fill in the values (see below)
```

## Run Locally

```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # run the production build
```

The server must be running too. See the server README.

## Environment Variables

Create `.env.local` (never commit it):

```
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_APP_URL=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

MONGODB_URI=
DB_NAME=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

IMGBB_API_KEY=
```

| Variable                                   | Purpose                                                      |
| ------------------------------------------ | ------------------------------------------------------------ |
| `NEXT_PUBLIC_API_URL`                      | Base URL of the Express server                               |
| `NEXT_PUBLIC_APP_URL`                      | URL of this client                                           |
| `BETTER_AUTH_SECRET`                       | Random secret (32+ chars) used by Better Auth                |
| `BETTER_AUTH_URL`                          | Public URL of this client (also the JWT issuer and audience) |
| `MONGODB_URI`, `DB_NAME`                   | Same database the server uses                                |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth credentials                                     |
| `IMGBB_API_KEY`                            | Used by `/api/upload/profile` for profile photos             |

Google OAuth redirect URI: `https://YOUR-CLIENT-URL/api/auth/callback/google`

## Creating the Admin Account

Admin accounts cannot be created through public sign-up.

1. Sign up normally as a Customer with the admin email.
2. In MongoDB, open the `users` collection and change that user's `role` from `"customer"` to `"admin"`.
3. Sign out and sign in again.

## Challenge Implementation

### Advanced search and sorting

The menu page keeps its filters in the URL, so results are shareable and survive a reload.

```
/menu?q=margherita&category=classic&location=Agrabad&sort=price_asc&page=2
```

| Param      | Meaning                                                                       |
| ---------- | ----------------------------------------------------------------------------- |
| `q`        | Case-insensitive match on item name or description                            |
| `category` | One of `classic`, `vegetarian`, `meat-lovers`, `specialty`, `sides`, `drinks` |
| `location` | Case-insensitive match on location                                            |
| `sort`     | `price_asc`, `price_desc`, or empty for newest                                |
| `page`     | Page number (12 items per page)                                               |

Flow: `MenuFilters` (debounced input) updates the URL with `router.replace` → the server component `MenuPage` reads `searchParams` → `getMenuItems()` calls `GET /api/menu` on the Express server → the server escapes the regex, validates the params and runs a MongoDB aggregation.

### JWT / token verification flow

1. After sign-in, the client asks Better Auth for a JWT with `authClient.token()`.
2. `apiFetch()` sends it as `Authorization: Bearer <token>`.
3. The Express server verifies it with `jose` against the Better Auth JWKS endpoint (signature, issuer, audience, expiry).
4. The user is loaded from MongoDB and attached to `req.user`.
5. `checkBlocked` rejects blocked users (403), then `requireRole` enforces the role (403).
6. Missing, invalid or expired tokens return **401**.

On the client, `app/dashboard/*/layout.tsx` calls `requireRole()` on the server, and `proxy.ts` provides a first-layer cookie check.


## Deployment Notes

- Set every environment variable in the hosting dashboard.
- Add the production URL to `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL` and the Google OAuth redirect URIs.
- Remember to create the admin account on the **production** database.
