/**
 * Per-project image map (so no two cards share the same Unsplash photo).
 * Admin can override via Project.image in DB. Falls back to a generic image if no slug match.
 */

const PROJECT_BY_SLUG: Record<string, string> = {
  meylor: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop",
  joyride: "https://images.unsplash.com/photo-1558877385-81a1c7e67d72?q=80&w=1200&auto=format&fit=crop",
  tapix: "https://images.unsplash.com/photo-1593344484962-796055d4a3a4?q=80&w=1200&auto=format&fit=crop",
  "energize-logistics": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop",
  "last-piece": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
  "kit-factory": "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1200&auto=format&fit=crop",
  "mitsubishi-system": "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200&auto=format&fit=crop",
  "energize-future": "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop",
  "telal-real-estate": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop",
  ets: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
  "little-leaders": "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1200&auto=format&fit=crop",
  "energize-design": "https://images.unsplash.com/photo-1561070791-2526d30994b8?q=80&w=1200&auto=format&fit=crop",
  "energize-global": "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=1200&auto=format&fit=crop",
  "e-marketing": "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?q=80&w=1200&auto=format&fit=crop",
  "energize-events": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop",
  "primo-shops": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&auto=format&fit=crop",
  macalloria: "https://images.unsplash.com/photo-1521577352947-9bb58764b69a?q=80&w=1200&auto=format&fit=crop",
  "royal-med": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop",
  doctabs: "https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?q=80&w=1200&auto=format&fit=crop",
  "trans-expert": "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?q=80&w=1200&auto=format&fit=crop",
  outfit: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop",
  "ezraa-app": "https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=1200&auto=format&fit=crop",
  "bank-system": "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=1200&auto=format&fit=crop",
  "retetive-website": "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1200&auto=format&fit=crop",
  "simpson-draw": "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=1200&auto=format&fit=crop",
};

const VENTURE_BY_SLUG: Record<string, string> = {
  ets: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
  tapix: "https://images.unsplash.com/photo-1593344484962-796055d4a3a4?q=80&w=1200&auto=format&fit=crop",
  "gulf-trend": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop",
  "dida-silver": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop",
  "energize-logistics": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop",
};

const NEWS_IMAGES = [
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1491336477066-31156b5e4f35?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?q=80&w=1200&auto=format&fit=crop",
];

function hashOf(s: string): number {
  let h = 0;
  for (const c of s) h = (h + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

const FALLBACK = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop";

export function projectImage(slug: string, override?: string): string {
  if (override) return override;
  return PROJECT_BY_SLUG[slug] ?? FALLBACK;
}

export function ventureImage(slug: string, override?: string): string {
  if (override) return override;
  return VENTURE_BY_SLUG[slug] ?? FALLBACK;
}

export function newsImage(slug: string, override?: string): string {
  if (override) return override;
  return NEWS_IMAGES[hashOf(slug) % NEWS_IMAGES.length]!;
}
