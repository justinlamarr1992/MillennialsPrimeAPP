/**
 * Post Type Definitions
 *
 * These types define the structure of posts in the application.
 * They are used by both production code and tests.
 */

/**
 * Base post properties shared by all post types
 */
interface BasePost {
  id: string;
  title: string;
  description: string;
  authorName: string;
  authorId: string;
  isPrime: boolean;
  isAdmin: boolean;
  createdAt: string;
  likeCount: number;
  commentCount: number;
}

/**
 * Text post - contains only text content
 */
export interface TextPost extends BasePost {
  type: "text";
}

/**
 * Picture post - contains an image
 */
export interface PicturePost extends BasePost {
  type: "picture";
  imageUrl: string;
}

/**
 * Video post - contains a video
 */
export interface VideoPost extends BasePost {
  type: "video";
  videoId: string; // Bunny.net video ID or URL
}

/**
 * Union type of all post types
 */
export type Post = TextPost | PicturePost | VideoPost;
