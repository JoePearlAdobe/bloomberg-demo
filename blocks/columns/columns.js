export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);
  
  // Check for black background style variant
  const parentSection = block.closest('.section');
  if (parentSection && parentSection.classList.contains('black-background')) {
    block.classList.add('black-background');
    document.body.classList.add('black');
  }

  // Handle black background and theme markers
  const blackBackgroundMarker = block.querySelector('.black-background-marker');
  const blackThemeMarker = block.querySelector('.black-marker');

  if (blackBackgroundMarker) {
    block.classList.add('black-background');
    document.body.classList.add('black');
    blackBackgroundMarker.remove();
  }

  if (blackThemeMarker) {
    document.body.classList.add('black');
    blackThemeMarker.remove();
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
