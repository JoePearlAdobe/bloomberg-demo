export default async function decorate(block) {
  // Create a placeholder while we wait for intersection
  const placeholder = document.createElement('div');
  placeholder.className = 'research-insights-placeholder';
  placeholder.textContent = 'Loading Research & Insights...';
  block.appendChild(placeholder);

  // Set up intersection observer
  const observer = new IntersectionObserver(async (entries) => {
    const entry = entries[0];
    if (entry.isIntersecting) {
      // Stop observing once we start loading
      observer.unobserve(block);

      try {
        const response = await fetch('/blocks/research-insights/posts.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const posts = await response.json();
        // Create header container
        const headerContainer = document.createElement('div');
        headerContainer.className = 'research-insights-header';
        // Add title
        const title = document.createElement('h2');
        title.className = 'research-insights-title';
        title.textContent = 'Research & Insights';
        headerContainer.appendChild(title);
        // Add view all link
        const viewAllLink = document.createElement('a');
        viewAllLink.href = 'https://www.bloomberg.com/professional/insights/';
        viewAllLink.className = 'research-insights-view-all';
        viewAllLink.textContent = 'View all Insights';
        headerContainer.appendChild(viewAllLink);
        // Create a container for the posts
        const postsContainer = document.createElement('div');
        postsContainer.className = 'research-insights-posts';
        // Add header and posts to the block
        block.appendChild(headerContainer);
        block.appendChild(postsContainer);
        // Process and display each post (limited to 6)
        posts.slice(0, 6).forEach(async (post) => {
          const postElement = document.createElement('div');
          postElement.className = 'research-insights-post';

          // Add featured image if available
          if (post.featured_media) {
            try {
              const mediaResponse = await fetch(`/blocks/research-insights/media/${post.featured_media}.json`);
              if (mediaResponse.ok) {
                const mediaData = await mediaResponse.json();
                if (mediaData.length > 0 && mediaData[0].media_details?.sizes?.full?.source_url) {
                  const imageLink = document.createElement('a');
                  imageLink.href = post.link;
                  imageLink.className = 'research-insights-image-link';

                  const img = document.createElement('img');
                  img.src = mediaData[0].media_details.sizes.full.source_url;
                  img.alt = post.title.rendered;
                  img.className = 'research-insights-image';
                  img.width = 800;
                  img.height = 533;

                  imageLink.appendChild(img);
                  postElement.appendChild(imageLink);
                }
              }
            } catch (error) {
              /* eslint-disable-next-line no-console */
              console.error('Error fetching media:', error);
            }
          }

          // Add type label if post has type 3762
          if (post.type && post.type.includes(3762)) {
            const typeLink = document.createElement('a');
            typeLink.href = 'https://www.bloomberg.com/professional/insights/type/article/';
            typeLink.className = 'research-insights-type';
            typeLink.textContent = 'ARTICLE';
            postElement.appendChild(typeLink);
          } else if (post.type && post.type.includes(3765)) {
            const typeLink = document.createElement('a');
            typeLink.href = 'https://www.bloomberg.com/professional/insights/type/podcast/';
            typeLink.className = 'research-insights-type';
            typeLink.textContent = 'PODCAST';
            postElement.appendChild(typeLink);
          }

          // Add post title
          const titleLink = document.createElement('a');
          titleLink.href = post.link;
          titleLink.className = 'research-insights-title-link';

          const h3title = document.createElement('h3');
          h3title.innerHTML = post.title.rendered;
          titleLink.appendChild(h3title);
          postElement.appendChild(titleLink);

          // Add category label
          /* eslint-disable-next-line no-underscore-dangle */
          if (post.meta && post.meta._yoast_wpseo_primary_category) {
            let categoryText = '';
            let categoryUrl = '';

            /* eslint-disable-next-line no-underscore-dangle */
            if (post.meta._yoast_wpseo_primary_category === '453') {
              categoryText = 'Markets';
              categoryUrl = 'https://www.bloomberg.com/professional/insights/category/markets/';
              /* eslint-disable-next-line no-underscore-dangle */
            } else if (post.meta._yoast_wpseo_primary_category === '534') {
              categoryText = 'Regional Analysis';
              categoryUrl = 'https://www.bloomberg.com/professional/insights/category/regional-analysis/';
              /* eslint-disable-next-line no-underscore-dangle */
            } else if (post.meta._yoast_wpseo_primary_category === '3715') {
              categoryText = 'Artificial Intelligence';
              categoryUrl = 'https://www.bloomberg.com/professional/insights/category/artificial-intelligence/';
              /* eslint-disable-next-line no-underscore-dangle */
            } else if (post.meta._yoast_wpseo_primary_category === '486') {
              categoryText = 'Regulation';
              categoryUrl = 'https://www.bloomberg.com/professional/insights/category/regulation/';
            }

            if (categoryText && categoryUrl) {
              const categoryLink = document.createElement('a');
              categoryLink.href = categoryUrl;
              categoryLink.className = 'research-insights-category';
              categoryLink.textContent = categoryText;
              postElement.appendChild(categoryLink);
            }
          }

          postsContainer.appendChild(postElement);
        });

        // Clear the block and append our new content
        block.innerHTML = '';
        block.appendChild(headerContainer);
        block.appendChild(postsContainer);
      } catch (error) {
        /* eslint-disable-next-line no-console */
        console.error('Error fetching posts:', error);
        block.textContent = 'Error loading research insights. Please try again later.';
      }
    }
  }, {
    rootMargin: '50px', // Start loading when the block is 50px from viewport
    threshold: 0.1, // Start loading when 10% of the block is visible
  });

  // Start observing the block
  observer.observe(block);
}
