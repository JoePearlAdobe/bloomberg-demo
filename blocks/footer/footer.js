import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function makeAccessible(element) {
  element.querySelectorAll('a').forEach((a) => {
    if (a.href.includes('linkedin')) {
      a.setAttribute('aria-label', 'Bloomberg linkedin');
    } else if (a.href.includes('twitter')) {
      a.setAttribute('aria-label', 'Bloomberg twitter');
    } else if (a.href.includes('facebook')) {
      a.setAttribute('aria-label', 'Bloomberg facebook');
    } else if (a.href.includes('instagram')) {
      a.setAttribute('aria-label', 'Bloomberg instagram');
    } else if (a.href.includes('feed')) {
      a.setAttribute('aria-label', 'Bloomberg feed');
    } else {
      a.setAttribute('aria-label', `Bloomberg ${a.textContent}`);
    }
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  makeAccessible(footer);
  block.append(footer);
}
