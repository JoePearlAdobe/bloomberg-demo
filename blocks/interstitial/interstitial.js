import { readBlockConfig } from '../../scripts/aem.js';

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.parentElement.style.backgroundImage = `url(${cfg.image})`;

  const interstitialWrapper = document.createElement('div');
  interstitialWrapper.className = 'interstitial';
  const content = document.createElement('div');
  content.className = 'content';
  interstitialWrapper.appendChild(content);
  const heading = document.createElement('h3');
  heading.className = 'title';
  heading.innerText = cfg.title;
  content.appendChild(heading);
  const cta = document.createElement('div');
  cta.className = 'cta';
  const ctaLink = document.createElement('a');
  ctaLink.className = 'button';
  ctaLink.href = cfg.link;
  ctaLink.innerText = '';
  ctaLink.ariaLabel = 'Learn more';
  cta.appendChild(ctaLink);
  content.appendChild(cta);
  block.replaceWith(interstitialWrapper);
}
