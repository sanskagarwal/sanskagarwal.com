export interface Recipe {
    id: string;
    link: string;
    name: string;
    image: string;
    description: string;
    keywords: Keyword[];
    working_time: string;
    waiting_time: string;
    created_at: Date;
    servings: string;
};

export interface Keyword {
    id: string;
    label: string;
}