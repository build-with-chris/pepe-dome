# Supabase Storage für Bild-Uploads

Die App speichert hochgeladene Bilder (z. B. Artikel, Events) in **Supabase Storage**, wenn die nötigen Umgebungsvariablen gesetzt sind.

## 1. Bucket in Supabase anlegen

1. [Supabase Dashboard](https://supabase.com/dashboard) → dein Projekt → **Storage**.
2. **New bucket** → Name: **`uploads`** (exakt so, wird im Code verwendet).
3. **Public bucket** aktivieren (damit die Bild-URLs ohne Auth abrufbar sind).
4. **Create bucket** klicken.

Optional: Unter **Policies** kannst du für den Bucket eine Policy setzen, die nur dem Service Role Upload erlaubt (z. B. „Allow upload for service role“). Standardmäßig erlaubt ein öffentlicher Bucket Lesezugriff; Upload macht die API mit dem Service Role Key.

## 2. Umgebungsvariablen setzen

**Lokal (`.env`):**

```env
# Supabase Projekt-URL (wie bei der Datenbank)
NEXT_PUBLIC_SUPABASE_URL="https://wwawsyhykrbvfgvhqbev.supabase.co"

# Service Role Key (geheim halten – nur Server)
# Supabase Dashboard → Project Settings → API → "service_role" (secret)
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
```

**Vercel (Production):**

1. Vercel → dein Projekt → **Settings** → **Environment Variables**.
2. `NEXT_PUBLIC_SUPABASE_URL` = deine Supabase Projekt-URL.
3. `SUPABASE_SERVICE_ROLE_KEY` = der **service_role** Key aus Supabase (Project Settings → API).

Der **anon** Key reicht für Storage-Uploads aus dem Backend nicht; für die API-Route wird der **service_role** Key benötigt.

## 3. Verhalten

- **Mit gesetzten Variablen:** Upload geht an Supabase Storage (Bucket `uploads`), die API liefert die öffentliche URL des Bildes zurück.
- **Ohne Variablen (lokal):** Dateien werden in `public/uploads` gespeichert (nur für lokale Entwicklung).
- **Ohne Variablen auf Vercel:** Die API antwortet mit 503 und Hinweis, Supabase Storage zu konfigurieren.

Nach dem Setzen der Variablen und einem neuen Deploy funktionieren die Bild-Uploads unter **Admin → Artikel** (und überall dort, wo `/api/admin/upload` genutzt wird) mit Supabase Storage.
