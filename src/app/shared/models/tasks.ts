export class Task {
    id: number;
    start_date: string;
    text: string;
    duration: number;
    start_time: string;
    end_time: string;
    incidentId: number;
    // parent: number;
}

export class Link {
    id: number;
    source: number;
    target: number;
    type: string;
}