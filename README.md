<div align="center">
<img alt="Portfolio" src="https://github.com/dillionverma/portfolio/assets/16860528/57ffca81-3f0a-4425-b31d-094f61725455" width="90%">
</div>

# Portfolio [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdillionverma%2Fportfolio)

Built with next.js, [shadcn/ui](https://ui.shadcn.com/), and [magic ui](https://magicui.design/), deployed on Vercel.

# Features

- Setup only takes a few minutes by editing the [single config file](./src/data/resume.tsx)
- Built using Next.js 14, React, Typescript, Shadcn/UI, TailwindCSS, Framer Motion, Magic UI
- Responsive for different devices
- Optimized for Next.js and Vercel

# Getting Started Locally

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/dillionverma/portfolio
   ```

2. Move to the cloned directory

   ```bash
   cd portfolio
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Start the local Server:

   ```bash
   pnpm dev
   ```

5. Open the [Config file](./src/data/resume.tsx) and make changes

# Admin panel

Work experience, skills and projects are managed at `/admin` and stored in MongoDB. Admin logins live in the database too (passwords are stored as scrypt hashes), not in env vars.

1. Copy `.env.example` to `.env` (or `.env.local`) and set `MONGODB_URI` and `AUTH_SECRET`.
2. `pnpm create-admin` prompts for an email and password (hidden input) and creates the admin. Run it again with the same email to reset the password.
3. `pnpm dev` and sign in at `/admin`.

Notes:

- When `MONGODB_URI` isn't set or MongoDB can't be reached, the public site falls back to the content in `resume.tsx`. Once connected, MongoDB is the source of truth, so add your entries in the admin.
- Edits show up on the site immediately; direct database edits are picked up within a minute.
- Deleting an admin from the `admins` collection signs them out straight away.
- On Vercel, add `MONGODB_URI` and `AUTH_SECRET` to the project and allow Vercel's IPs in Atlas network access.
- Logos, project images and skill icons are uploaded from the admin (PNG, JPEG, WEBP or GIF, up to 2 MB) and stored in MongoDB. Project videos are still a link.

# License

Licensed under the [MIT license](https://github.com/dillionverma/portfolio/blob/main/LICENSE.md).
