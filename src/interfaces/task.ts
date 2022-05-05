export interface Task {
    board: string;
    title: string;
    description?: string;
    category: string;
    urgency: string;
    dueTo: Date | string;
    responsibility: string;
    createdAt: Date | string;
    creator: string;
    isPinnedToBoard: boolean;
    customIdName?: string;
}

