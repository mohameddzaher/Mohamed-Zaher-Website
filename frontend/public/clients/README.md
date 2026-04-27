# Client Logos

Drop client/partner logos here when the remote sources (Clearbit / SimpleIcons) don't have them, or when you want to override the auto-fetched version with your own asset.

## Naming

Use the `slug` field from `frontend/src/lib/data.ts → CLIENT_LOGOS`.
The `Clients` section will look for, in order:

1. Each URL in `logos[]` (Clearbit, SimpleIcons, etc.)
2. `/clients/{slug}.svg`
3. `/clients/{slug}.png`
4. Styled wordmark fallback (the brand name in its brand colour)

So if Clearbit doesn't have `keeta.com` and you want a real logo, save the file as:

```
frontend/public/clients/keeta.svg     ← preferred (sharper, smaller)
frontend/public/clients/keeta.png     ← also works
```

## Current slugs

| Slug            | Brand          |
| --------------- | -------------- |
| `amazon`        | Amazon         |
| `dhl`           | DHL            |
| `keeta`         | Keeta          |
| `hungerstation` | HungerStation  |
| `ninja`         | Ninja          |
| `nextracker`    | NexTracker     |

## Format tips

- **SVG preferred** — scales perfectly at any size, tiny payload.
- **PNG with transparent background** if SVG isn't available — at least 240px wide.
- **No padding inside the file** — the section adds its own breathing room.
- **Full-colour logos work on both dark and light section tones** — the section dims them to ~60-70% opacity at rest and fades to 100% on hover.

## Adding a new client

1. Open `frontend/src/lib/data.ts`
2. Append to `CLIENT_LOGOS` with a fresh `slug`, brand colour, and any remote logo URLs you want to try first
3. Drop `slug.svg` (or `.png`) here as a guaranteed fallback
4. Done — the marquee picks it up automatically
