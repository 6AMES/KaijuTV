export interface JikanAnime {
    mal_id: number;
    title: string;
    title_english: string;
    title_japanese: string;
    synopsis: string;
    trailer_url: string;
    episodes: number;
    score: number;
    images: {
        jpg: {
            image_url: string;
            small_image_url: string;
            large_image_url: string;
        };
    };
}