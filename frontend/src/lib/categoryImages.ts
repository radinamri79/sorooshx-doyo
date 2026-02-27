/** Shared Unsplash images keyed by category slug */
export const categoryImages: Record<string, string> = {
  featured:             "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=70",
  handyman:             "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=70",
  moving:               "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=70",
  "furniture-assembly": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=70",
  mounting:             "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=800&q=70",
  cleaning:             "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=800&q=70",
  "shopping-delivery":  "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?auto=format&fit=crop&w=800&q=70",
  "ikea-services":      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=70",
  yardwork:             "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=70",
  holidays:             "https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=800&q=70",
  "winter-tasks":       "https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=800&q=70",
  "personal-assistant": "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=800&q=70",
  "baby-prep":          "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=70",
  "online-tasks":       "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=70",
  office:               "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=70",
  contactless:          "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=70",
};

export function getCategoryImage(slug: string): string {
  return categoryImages[slug] ?? categoryImages["featured"];
}
