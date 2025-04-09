import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Decorates the image-caption block.
 * @param {Element} block The image-caption block element
 */
export default function decorate(block) {
  // Parse block parameters
  const blockParams = block.classList.value
    .split(' ')
    .find((cls) => cls !== 'image-caption' && cls !== 'block');
  
  let blockPosition = 'center';
  let textAlignment = 'center';
  
  if (blockParams) {
    const params = blockParams.split(',');
    
    // First parameter is for block position
    if (params[0] && ['left', 'center', 'right'].includes(params[0])) {
      blockPosition = params[0];
    }
    
    // Second parameter is for text alignment
    if (params[1] && ['left', 'center', 'right'].includes(params[1])) {
      textAlignment = params[1];
    }
    
    // Remove the original class containing parameters
    block.classList.remove(blockParams);
  }
  
  // Apply position and alignment classes
  block.classList.add(`position-${blockPosition}`);
  block.classList.add(`text-${textAlignment}`);
  
  // Add clearfix to parent container for proper float containment
  const parentSection = block.closest('.section');
  if (parentSection && (blockPosition === 'left' || blockPosition === 'right')) {
    parentSection.style.overflow = 'hidden';
  }
  
  const firstDiv = block.firstElementChild;
  if (!firstDiv) return;
  
  // Handle the image
  const pic = block.querySelector('picture');
  if (pic) {
    const picWrapper = pic.closest('div');
    picWrapper.classList.add('image-container');
    
    // Optimize the image
    const img = pic.querySelector('img');
    if (img) {
      const optimizedPicture = createOptimizedPicture(
        img.src,
        img.alt,
        false,
        [
          { width: '1200' },
          { width: '800', media: '(max-width: 900px)' },
          { width: '600', media: '(max-width: 600px)' }
        ],
      );
      pic.replaceWith(optimizedPicture);
    }
  }
  
  // Handle the caption
  // The caption is expected to be in the second div under the first child
  const divs = Array.from(firstDiv.children);
  if (divs.length > 1) {
    const captionDiv = divs[1];
    captionDiv.classList.add('caption-container');
    
    // If there's no paragraph in the caption, wrap the text in a paragraph
    if (!captionDiv.querySelector('p')) {
      const textContent = captionDiv.textContent.trim();
      if (textContent) {
        captionDiv.innerHTML = `<p>${textContent}</p>`;
      }
    }
  }
}

