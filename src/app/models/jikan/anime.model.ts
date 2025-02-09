export interface JikanAnime {
    mal_id: number;
    title: string;
    title_english: string;
    title_japanese: string;
    synopsis: string;
    background: string;
    images: {
        jpg: {
            image_url: string;
            small_image_url: string;
            large_image_url: string;
        };
    };
    score: number;
    episodes: number;
    status: string;
    rating: string;
    genres: { name: string }[];
    trailer: {
        youtube_id: string;
        url: string;
        embed_url: string;
    };
}