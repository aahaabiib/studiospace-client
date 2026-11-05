# StudioSpace

A peer-to-peer marketplace where creators rent photo studios, film stages, podcast lounges, music suites and art workshops by the hour.

**Live site:** https://studiospace-client-sigma-beige.vercel.app


## Features
- Email/password and Google login with BetterAuth
- JWT in an HTTPOnly cookie; protected API routes return 401 when unauthorized
- Explore studios with search, category filter and sorting
- Double-booking prevention against confirmed bookings
- Host dashboard to confirm, complete or decline booking requests
- Add, edit and delete your own studio listings with image upload
- My Bookings with status badges and cancel for pending requests
- Wishlist and downloadable PDF invoices
- Dark/light theme and fully responsive layout

## Tech Stack
**Client:** Next.js (App Router), Tailwind CSS, BetterAuth, Swiper, Sonner, Lucide
**Server:** Node.js, Express, Mongoose, JWT
**Database:** MongoDB Atlas
**Deploy:** Vercel 

## Run locally StudioSpace-client && StudioSpace-server 

git clone https://github.com/aahaabiib/studiospace-client.git
cd StudioSpace/server && npm install

git clone https://github.com/aahaabiib/studiospace-server.git
cd ../client && npm install

`server/.env`
```
PORT=5000
MONGODB_URI=
JWT_SECRET=
CLIENT_URL=http://localhost:3000
```

`client/.env.local`
```
MONGODB_URI=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
JWT_SECRET=
API_URL=http://127.0.0.1:5000
NEXT_PUBLIC_IMGBB_KEY=
```
`JWT_SECRET` 



## Examiner test account
- Email: examiner@studiospace.com
- Password: Examiner
