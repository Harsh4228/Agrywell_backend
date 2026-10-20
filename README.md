# Agriwell API

Express + MongoDB (Mongoose) REST API powering the Agriwell website and admin dashboard.

## Getting started

```bash
cp .env.example .env     # fill in MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD …
npm install
npm run seed:admin       # create (or reset the password of) the admin account
npm run dev
```

## Structure

```
server.js                 Entry point: DB connection, HTTP server, graceful shutdown
src/
  app.js                  Express app: helmet, CORS allow-list, compression, logging, rate limiting
  config/                 Validated environment variables, DB connection
  routes/index.js         All routes in one place
  controllers/            Request handlers (crudFactory provides standard CRUD)
  models/                 Mongoose schemas
  validators/schemas.js   zod request validation
  middleware/             auth, validation, uploads, rate limits, error handling
scripts/seed-admin.js     Admin account bootstrap
```

## API overview

All responses use `{ success, data }` (or `{ success: false, message, details? }` on error).
Write endpoints require `Authorization: Bearer <token>`.

| Resource            | Public                         | Admin                                  |
| ------------------- | ------------------------------ | -------------------------------------- |
| Auth                | `POST /api/auth/login`         | `GET /api/auth/me`, `PUT /api/auth/password` |
| Products            | `GET /api/products[/:id]`      | `POST`, `PUT /:id`, `DELETE /:id`       |
| Upcoming products   | `GET /api/upcoming-products`   | `POST`, `PUT /:id`, `DELETE /:id`       |
| Facilities          | `GET /api/facilities`          | `POST`, `PUT /:id`, `DELETE /:id`       |
| Crop solutions      | `GET /api/crop-solutions`      | `POST`, `PUT /:id`, `DELETE /:id`       |
| Videos              | `GET /api/videos`              | `POST`, `PUT /:id`, `DELETE /:id`       |
| PDFs                | `GET /api/pdfs`, `GET /api/pdfs/:id/download` | `POST` (multipart `file`), `PUT /:id`, `DELETE /:id` |
| Stats               | `GET /api/stats`               | `PUT /api/stats`                        |
| Contact             | `POST /api/contact`            | `GET /api/inquiries`, `PATCH /:id`, `DELETE /:id` |
| Dashboard           | —                              | `GET /api/dashboard/summary`            |
| Health              | `GET /api/health`              |                                        |

## Production notes

- Set `NODE_ENV=production`, a 32+ character `JWT_SECRET` and `CORS_ORIGINS` (website + admin URLs).
- Uploaded PDFs are stored on local disk in `uploads/`. On hosts with ephemeral disks (e.g. Render free tier) files are lost on redeploy — attach a persistent disk or move uploads to object storage (S3, Cloudinary, R2).
- To email inquiries to any address, verify your domain in Resend and set `CONTACT_FROM_EMAIL`.
