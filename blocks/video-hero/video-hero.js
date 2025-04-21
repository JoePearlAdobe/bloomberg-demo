import { readBlockConfig } from '../../scripts/aem.js';

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  const videoHeroContainer = document.createElement('div');
  const videoHero = document.createElement('video');
  videoHero.setAttribute('autoplay', '');
  videoHero.setAttribute('loop', '');
  videoHero.setAttribute('muted', '');
  videoHero.setAttribute('playsinline', '');
  videoHero.classList.add('video-hero');
  const source = document.createElement('source');
  source.setAttribute('src', cfg.video);
  videoHero.appendChild(source);
  videoHeroContainer.append(videoHero);
  videoHeroContainer.className = 'video-hero-container';

  block.replaceWith(videoHeroContainer);
  console.log(cfg); // eslint-disable-line no-console
}
