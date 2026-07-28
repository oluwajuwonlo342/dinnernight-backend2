# Deploying for Free — Step by Step

This gets you a live link using MongoDB Atlas + Render (backend) + Vercel (frontend), all free tiers.
Total time: ~20 minutes.

---

## 1. Push the project to GitHub

```bash
cd dinner-night-awards
git init
git add .
git commit -m "Initial commit"
```

Create an empty repo on [github.com/new](https://github.com/new), then:

```bash
git remote add origin https://github.com/<your-username>/<repo-name>.git
git branch -M main
git push -u origin main
```

---

## 2. Create your free MongoDB database (Atlas)

1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster → **M0 Free** tier → any nearby region
3. **Database Access** → add a database user (save the username/password)
4. **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`)
5. **Connect** → **Drivers** → copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/dinner_night_awards?retryWrites=true&w=majority
   ```
   Replace `<username>`/`<password>` and keep `/dinner_night_awards` as the database name.

Keep this string handy — it's your `MONGO_URI`.

---

## 3. Deploy the backend (Render)

1. Go to [render.com](https://render.com) → sign up/log in with GitHub
2. **New** → **Web Service** → pick your repo
3. Render should detect `render.yaml` automatically (root of the repo) and pre-fill settings.
   If not, set manually:
   - **Root directory:** `backend`
   - **Build command:** `npm install`
   - **Start command:** `npm start`
4. Under **Environment**, set:
   | Key | Value |
   |---|---|
   | `MONGO_URI` | your Atlas connection string from step 2 |
   | `JWT_SECRET` | any long random string (Render can auto-generate this) |
   | `JWT_EXPIRES_IN` | `7d` |
   | `CLIENT_URL` | leave blank for now — you'll fill this in after step 4 |
   | `ADMIN_USERNAME` | your choice, e.g. `admin` |
   | `ADMIN_PASSWORD` | a strong password |
5. Click **Deploy**. When it's live, copy the URL Render gives you, e.g.
   `https://dinner-night-awards-api.onrender.com`

**Create the admin account** (one-time): in Render, open your service → **Shell** tab → run:
```bash
npm run seed:admin
```

---

## 4. Deploy the frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) → sign up/log in with GitHub
2. **Add New** → **Project** → pick the same repo
3. Set **Root Directory** to `frontend`
4. Vercel auto-detects Vite (build command `npm run build`, output `dist`) via `vercel.json`
5. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://dinner-night-awards-api.onrender.com/api` (your Render URL + `/api`) |
6. Click **Deploy**. You'll get a live link like `https://dinner-night-awards.vercel.app`

---

## 5. Connect the two

Go back to **Render** → your backend service → **Environment** → set:
```
CLIENT_URL=https://dinner-night-awards.vercel.app
```
Save — Render will redeploy automatically. This lets the backend accept requests from your live frontend
(CORS).

---

## 6. Test it

- Visit your Vercel URL → register a student → log in
- Visit `https://your-vercel-url/admin/login` → log in with the `ADMIN_USERNAME`/`ADMIN_PASSWORD` you set
- Create a category and a nominee (with an image) → confirm it shows up on the student dashboard

---

## Notes

- **Render free tier sleeps** after 15 minutes of inactivity — the first request after idle can take
  10–30 seconds to wake up. That's normal on the free plan.
- If images don't load after deploy, double check `VITE_API_URL` is set correctly on Vercel and redeploy
  the frontend (env var changes require a redeploy).
- To update either side later, just `git push` — both Render and Vercel auto-deploy on push to `main`.
