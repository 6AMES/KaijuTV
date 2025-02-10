import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';

@Component({
  selector: 'app-video-player',
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.css'
})
export class VideoPlayerComponent {
  @Input() servers: { name: string; embed?: string; download?: string }[] = [];
  @Input() selectedVideoUrl: string | null = null;

  ngOnInit(): void {
    const megaServer = this.servers.find(server => server.name === 'MEGA' && server.embed);
    this.selectedVideoUrl = megaServer ? megaServer.embed! : null;
  }

  selectServer(server: { name: string; embed?: string }) {
    if (server.embed) {
      this.selectedVideoUrl = server.embed;
    }
  }
}
