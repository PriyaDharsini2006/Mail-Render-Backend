

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

.env.example
DATABASE_URL="your_database_url_here"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your_email_here"
SMTP_PASS="your_app_password_here"
SMTP_SECURE=false
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your_email_here"
EMAIL_PASS="your_app_password_here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.



## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
