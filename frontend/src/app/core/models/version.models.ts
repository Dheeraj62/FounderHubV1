export interface IdeaVersion {
    id: string;
    ideaId: string;
    versionNumber: number;
    problem: string;
    solution: string;
    whatChanged: string;
    createdAt: string;
}

export interface CreateVersionRequest {
    problem: string;
    solution: string;
    whatChanged: string;
}
