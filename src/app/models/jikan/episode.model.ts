export interface JikanEpisode {
    mal_id: number;
    title: string;
    episode: string;
    url: string;
    aired: string;
}
  
  export interface JikanEpisodeResponse {
    data: JikanEpisode[];
    pagination: {
        last_visible_page: number;
        has_next_page: boolean;
    };
}