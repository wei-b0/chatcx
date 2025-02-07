export interface Document {
  id: string | undefined;
  text: string | undefined;
  embedding: number[];
  metadata: {
    timestamp: number | undefined;
    is_reply: boolean | undefined;
    is_retweet: boolean | undefined;
    is_quoted: boolean | undefined;
    username: string | undefined;
    engagement: {
      likes: number | undefined;
      retweets: number | undefined;
      replies: number | undefined;
      views: number | undefined;
      bookmark_count: number | undefined;
    };
    keywords: string[];
    sentiment: string;
  };
}
