export interface Task {
    board: string;
    title: string;
    description?: string;
    category: string;
    urgency: string;
    dueTo: Date;
    responsibility: string;
    createdAt: Date;
    creator: string;
    isPinnedToBoard: boolean;
}

