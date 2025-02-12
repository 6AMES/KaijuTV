import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-slider',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './hero-slider.component.html',
  styleUrls: ['./hero-slider.component.css']
})
export class HeroSliderComponent implements OnInit, OnDestroy {
  slides = [
    {
      title: '../../../assets/images/IMayBeAGuildReceptionist-S1-KV1-UW-Logo-EN.png',
      description: 'Alina pensaba que había encontrado el trabajo perfecto como recepcionista del gremio...',
      image: '../../../assets/images/IMayBeAGuildReceptionist-S1-KV1-UW-LTR.png',
      link: '/anime/55997'
    },
    {
      title: '../../../assets/images/IWanttoEscapefromPrincessLessons-S1-KV1-UW-Logo-EN.png',
      description: 'A Leticia Dorman, hija de un duque, no le hace mucha ilusión estar prometida con un príncipe...',
      image: '../../../assets/images/IWanttoEscapefromPrincessLessons-S1-KV1-UW-LTR.png',
      link: '/anime/57050'
    },
    {
      title: '../../../assets/images/TrillionGame-S1-KV1-UW-Logo.png',
      description: 'Haru y Gaku, dos antiguos compañeros de clase, están dispuestos a hacer cualquier cosa...',
      image: '../../../assets/images/TrillionGame-S1-KV1-UW-LTR.png',
      link: '/anime/56662'
    },
    {
      title: '../../../assets/images/WelcometoJapanMsElf-S1-KV2-UW-Logo-EN.png',
      description: '¡¿A la señorita elfa le fascina la cultura japonesa?! Kitase Kazuhiro, un adulto trabajador...',
      image: '../../../assets/images/WelcometoJapanMsElf-S1-KV2-UW-LTR.png',
      link: '/anime/57648'
    },
    {
      title: '../../../assets/images/Zenshu-S1-KV1-UW-Logo-EN.png',
      description: 'Una directora de anime en ascenso estancada en su proyecto de comedia romántica...',
      image: '../../../assets/images/Zenshu-S1-KV1-UW-LTR.png',
      link: '/anime/58502'
    }
  ];

  currentIndex = 0;
  autoSlideInterval: any;

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    clearInterval(this.autoSlideInterval);
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Cambia de slide cada 5 segundos
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  stopAutoSlide() {
    clearInterval(this.autoSlideInterval);
  }
}
