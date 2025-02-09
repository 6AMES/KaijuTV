export interface AnimeFLVServer {
    name: string;
    download: string;
    embed: string;
}

export interface AnimeFLVEpisode {
    title: string;
    number: number;
    servers: AnimeFLVServer[];
}

export interface AnimeFLVEpisodeResponse {
    success: boolean;
    data: AnimeFLVEpisode;
}