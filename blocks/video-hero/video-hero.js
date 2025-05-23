import { readBlockConfig } from '../../scripts/aem.js';

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  const videoHeroContainer = document.createElement('div');
  const videoHero = document.createElement('video');
  videoHero.setAttribute('playsinline', '');
  videoHero.setAttribute('autoplay', '');
  videoHero.setAttribute('muted', '');
  videoHero.setAttribute('loop', '');

  videoHero.classList.add('video-hero');
  const source = document.createElement('source');
  source.setAttribute('src', cfg.video);
  source.setAttribute('type', 'video/mp4');
  videoHero.appendChild(source);

  const playButton = document.createElement('button');
  playButton.className = 'video-play-button';
  playButton.innerHTML = 'Play';
  videoHero.appendChild(playButton);

  videoHeroContainer.append(videoHero);
  videoHeroContainer.className = 'video-hero-video';

  /**
  videoHero.addEventListener('loadeddata', () => {
    videoHero.play().catch((error) => {
      console.error('Error playing video:', error);
    });
  });
  */
  // content div container
  const contentDivContainer = document.createElement('div');
  contentDivContainer.className = 'video-hero-content-container';

  // content div
  const contentDiv = document.createElement('div');
  contentDiv.className = 'video-hero-content';
  // product div
  const headingDiv = document.createElement('div');
  headingDiv.className = 'video-hero-product';
  contentDivContainer.appendChild(headingDiv);
  const product = document.createElement('span');
  product.innerText = cfg.product;
  product.className = 'heading';
  headingDiv.append(product);
  // heading div
  const heading = document.createElement('div');
  heading.className = 'video-hero-heading';
  contentDivContainer.appendChild(heading);
  const headingText = document.createElement('h1');
  headingText.innerText = cfg.headline;
  headingText.className = 'heading';
  heading.append(headingText);
  // description div
  const description = document.createElement('div');
  description.className = 'video-hero-description';
  contentDivContainer.appendChild(description);
  const descriptionText = document.createElement('h2');
  descriptionText.innerText = cfg.description;
  descriptionText.className = 'description';
  description.append(descriptionText);
  // button div
  const buttonDiv = document.createElement('div');
  buttonDiv.className = 'video-hero-button';
  contentDivContainer.appendChild(buttonDiv);
  const button = document.createElement('a');
  button.className = 'button';
  button.innerText = cfg.ctatext;
  button.setAttribute('href', cfg.ctalink);
  buttonDiv.appendChild(button);
  contentDiv.appendChild(contentDivContainer);

  block.replaceWith(videoHeroContainer);
  videoHeroContainer.insertAdjacentElement('afterend', contentDiv);
}
