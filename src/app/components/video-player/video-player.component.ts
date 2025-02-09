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
  @Input() videoUrl: string | null = null;
}
