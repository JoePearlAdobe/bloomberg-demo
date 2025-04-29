export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // Check for black background style variant
  const parentSection = block.closest('.section');
  if (parentSection && parentSection.classList.contains('black-background')) {
    block.classList.add('black-background');
  }

  // Alternative: check for a specific marker in the block content
  if (block.querySelector('.black-background-marker')) {
    block.classList.add('black-background');
    // Remove the marker as it's only used for signaling
    const marker = block.querySelector('.black-background-marker');
    if (marker) marker.remove();
  }

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
}
