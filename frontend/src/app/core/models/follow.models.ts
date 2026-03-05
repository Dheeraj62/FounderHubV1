export type FollowType = 'FOUNDER' | 'INVESTOR' | 'IDEA';

export interface FollowRequest {
  followingId: string;
  type: FollowType;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  type: FollowType;
  createdAt: string;
}

