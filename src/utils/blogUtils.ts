import Parser from 'rss-parser';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const parser = new Parser();

export interface BlogPost {
  title: string;
  description: string;
  date: string;
  link: string;
  image: string;
}

export async function getBlogPosts(blogspotUrl: string): Promise<BlogPost[]> {
  try {
    const feed = await parser.parseURL(`${blogspotUrl}/feeds/posts/default?alt=rss`);
    
    return feed.items.map(item => {
      // Extract first image from content if available, with fallback for Blogspot's default image handling
      let image = 'https://via.placeholder.com/800x400';
      
      if (item.content) {
        // Try to find image in content
        const imageMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
        if (imageMatch) {
          image = imageMatch[1];
          // Handle Blogspot's s1600 images
          if (image.includes('blogger.googleusercontent.com')) {
            image = image.replace(/\/s\d+(-c)?\//, '/s800/');
          }
        }
      }
      
      // Format date
      const date = item.pubDate ? format(new Date(item.pubDate), 'd MMM yyyy', { locale: ptBR }) : '';
      
      // Extract description (remove HTML tags and limit length)
      const description = item.contentSnippet?.replace(/<[^>]*>/g, '').slice(0, 200) + '...' || '';

      return {
        title: item.title || '',
        description,
        date,
        link: item.link || '',
        image
      };
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}