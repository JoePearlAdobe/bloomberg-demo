import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Decorates the image-caption block.
 * @param {Element} block The image-caption block element
 */
export default function decorate(block) {
  // Get block variant parameters - in AEM, variant is the second class name
  // Default to center position and center text alignment if not specified
  let blockPosition = 'center';
  let textAlignment = 'center';
  
  // Find all classes that aren't 'block' or 'image-caption'
  const classes = Array.from(block.classList).filter(
    cls => cls !== 'block' && cls !== 'image-caption'
  );
  
  // If we have any classes, the first one should be our parameter string
  if (classes.length > 0) {
    const variantParams = classes[0].split(',');
    
    // First parameter is for block position
    if (variantParams[0] && ['left', 'center', 'right'].includes(variantParams[0])) {
      blockPosition = variantParams[0];
    }
    
    // Second parameter is for text alignment
    if (variantParams[1] && ['left', 'center', 'right'].includes(variantParams[1])) {
      textAlignment = variantParams[1];
    }
    
    // Clean up classes - remove all non-standard classes
    classes.forEach(cls => block.classList.remove(cls));
  }
  
  // Add the correct position and alignment classes
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

