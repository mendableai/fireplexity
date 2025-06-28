export interface SearchResult {
  url: string
  title: string
  description?: string
  content?: string
  publishedDate?: string
  author?: string
  markdown?: string
  image?: string
  favicon?: string
  siteName?: string
}

export interface OpenRouterModel {
  id: string;
  name: string;
  description: string;
  context_length?: number;
  pricing?: {
    prompt: string;
    completion: string;
    request?: string;
    image?: string;
  };
  // Add other fields if necessary based on API response
}