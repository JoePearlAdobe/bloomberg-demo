export default async function decorate(block) {
  // Extract block attributes from class names
  const classes = block.className.split(' ');
  const blockClasses = ['quote'];

  // Add any additional classes that are not the base 'quote' class
  classes.forEach((className) => {
    if (className !== 'quote' && className !== '') {
      blockClasses.push(className);
    }
  });

  // Extract content
  const [quotation, attribution] = [...block.children].map((c) => c.firstElementChild);
  const blockquote = document.createElement('blockquote');
  
  // decorate quotation
  quotation.className = 'quote-quotation';
  blockquote.append(quotation);
  
  // decoration attribution
  if (attribution) {
    attribution.className = 'quote-attribution';
    blockquote.append(attribution);
    const ems = attribution.querySelectorAll('em');
    ems.forEach((em) => {
      const cite = document.createElement('cite');
      cite.innerHTML = em.innerHTML;
      em.replaceWith(cite);
    });
  }
  
  // Clear the block and apply classes
  block.innerHTML = '';
  block.className = blockClasses.join(' ');
  block.append(blockquote);
}
