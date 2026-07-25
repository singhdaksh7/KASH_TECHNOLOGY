# KASH Technologies Website

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) containing the interactive product showroom for KASH Technologies.

## Getting Started

First, install dependencies:

```bash
npm install
```

Copy `.env.example` to `.env.local` and fill in the required environment variables:

```bash
cp .env.example .env.local
```

### Environment Variables

- `NEXT_PUBLIC_SITE_URL`: The production URL (e.g., https://kash-technology.com) for metadata and sitemaps.
- `CONTACT_EMAIL`: The email address that will receive inquiries.
- `RESEND_API_KEY`: Your Resend API key for delivering contact form emails. If omitted, the contact form will show a safe "not configured" message to users.
- `CONTACT_FROM_EMAIL`: The verified sender domain address for Resend (e.g., KASH Technologies <website@kash-technology.com>).

### Project Status

- [x] Foundation completed
- [x] Homepage completed
- [x] Exora interactive demo completed
- [x] SchoolSync interactive demo completed
- [x] Launchpad interactive demo completed
- [x] Case-study pages completed
- [x] Contact form and SEO completed
- [x] Premium SchoolSync refinements completed
- [ ] Deployment pending

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build & Deploy

Run standard Next.js build commands:

```bash
npm run build
npm start
```

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com).

