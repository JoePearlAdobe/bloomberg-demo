import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
async function fetchBlogArticles() {
  try {
    const response = await fetch('https://main--bloomberg-demo--joepearladobe.aem.page/blog-articles/query-index.json');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching blog articles:', error);
    return [];
  }
}

export default async function decorate(block) {
  const articles = await fetchBlogArticles();
  const ul = document.createElement('ul');
  ul.className = 'blog-list';
  
  articles.forEach((article) => {
    const li = document.createElement('li');
    li.className = 'blog-item';
    // Create image container
    const imageDiv = document.createElement('div');
    imageDiv.className = 'blog-item-image';
    if (article.image) {
      // Construct full image URL if it's a relative path
      const imageUrl = article.image.startsWith('http')
        ? article.image: `https://main--bloomberg-demo--joepearladobe.aem.page${article.image}`;
      const optimizedPic = createOptimizedPicture(imageUrl, article.title, false, [{ width: '750' }]);
      imageDiv.append(optimizedPic);
    }

    // Create content container
    const contentDiv = document.createElement('div');
    contentDiv.className = 'blog-item-content';
    // Add title
    const title = document.createElement('h3');
    title.textContent = article.title;
    contentDiv.append(title);
    // Add description
    const description = document.createElement('p');
    description.textContent = article.description;
    contentDiv.append(description);
    // Assemble the item
    li.append(imageDiv);
    li.append(contentDiv);
    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);
}
