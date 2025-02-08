import { AnimeFLVServer } from './server.model';

export interface AnimeFLVEpisode {
  title: string;
  number: number;
  servers: AnimeFLVServer[];
}