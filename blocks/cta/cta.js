import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Decorates the ad block.
 * @param {Element} block The ad block element
 */
export default function decorate(block) {
  // Add a class to identify the block
  block.classList.add('ad-block');
  
  // Find the image and content elements
  const pic = block.querySelector('picture');
  const firstDiv = block.firstElementChild;

  if (pic) {
    // Handle image section
    const picWrapper = pic.closest('div');
    picWrapper.classList.add('ad-image');

    // Optimize the image
    const img = pic.querySelector('img');
    if (img) {
      const optimizedPicture = createOptimizedPicture(
        img.src,
        img.alt,
        false,
        [{ width: '120' }],
      );
      pic.replaceWith(optimizedPicture);
    }
  }

  // Handle content section
  const contentDivs = Array.from(firstDiv.children).filter(div => !div.classList.contains('ad-image'));
  if (contentDivs.length > 0) {
    const contentDiv = contentDivs[0];
    contentDiv.classList.add('ad-content');
    
    // Style any links as buttons
    const links = contentDiv.querySelectorAll('a');
    links.forEach(link => {
      const parent = link.parentElement;
      if (!parent.classList.contains('button-container')) {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');
        link.parentNode.insertBefore(buttonContainer, link);
        buttonContainer.appendChild(link);
      }
    });
  }
}

