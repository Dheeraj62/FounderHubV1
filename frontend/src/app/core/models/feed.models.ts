export interface FeedActor {
  userId: string;
  username: string;
  role: string;
  linkedInVerified: boolean;
}

export interface FeedIdea {
  id: string;
  founderId: string;
  founderUsername: string;
  title: string;
  industry: string;
  stage: string;
  previouslyRejected: boolean;
}

export interface FeedUpdate {
  id: string;
  founderId: string;
  founderUsername: string;
  content: string;
}

export interface FeedItem {
  id: string;
  type: string;
  createdAt: string;
  actor: FeedActor;
  idea?: FeedIdea;
  update?: FeedUpdate;
  interestStatus?: string;
}

