export const formatImgUrl = (url?: string): string => {
  if (!url) return '/dc25c9c8-5452-4cf6-a901-9f26c6f8360d.jpeg';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
    return url;
  }
  return `/${url}`;
};

export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackUrl: string = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
) => {
  const target = e.currentTarget;
  if (!target.dataset.fallbackTried) {
    target.dataset.fallbackTried = 'true';
    target.src = fallbackUrl;
  }
};
