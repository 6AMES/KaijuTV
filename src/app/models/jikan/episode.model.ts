export interface JikanEpisode {
    mal_id: number;
    url: string;
    title: string;
    aired: string;
    score: number;
    filler: boolean;
    recap: boolean;
    images?: {
        jpg?: {
            image_url: string;
        };
        webp?: {
            image_url: string;
        };
    };
}

export interface JikanEpisodeResponse {
    data: JikanEpisode[];
    pagination: {
        last_visible_page: number;
        has_next_page: boolean;
    };
}