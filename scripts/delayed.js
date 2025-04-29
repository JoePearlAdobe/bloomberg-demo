// add delayed functionality here

/* jumplinks mobile menu */
const jumplinks = document.querySelector('body.product-landing div.section.jumplinks');
const jumplinksUL = document.querySelector('body.product-landing div.section.jumplinks ul');
const firstItem = jumplinks.querySelector('li:first-of-type');

firstItem.addEventListener('click', () => {
  jumplinksUL.classList.toggle('expanded');
  jumplinks.classList.toggle('expanded');
});
