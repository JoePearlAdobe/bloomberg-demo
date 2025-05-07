import { createOptimizedPicture } from "../../scripts/aem.js";

export default function decorate(block) {
  // Get the image and content divs
  const pic = block.querySelector("picture");
  const link = block.querySelector("a");

  if (pic) {
    const picWrapper = pic.closest("div");
    picWrapper.classList.add("cta2-image");

    // Optimize the image
    const img = pic.querySelector("img");
    const optimizedPicture = createOptimizedPicture(
      img.src,
      img.alt,
      false,
      [{ width: "750" }]
    );
    pic.replaceWith(optimizedPicture);
  }

  // Get the content div (the one without the picture)
  const contentDiv = Array.from(block.children[0].children).find(
    (div) => !div.querySelector("picture")
  );
  
  if (contentDiv) {
    contentDiv.classList.add("cta2-content");
    
    // Create button container if there is a link
    if (link && !link.closest(".button-container")) {
      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("button-container");
      
      // If link is not set, set it to Bloomberg Professional
      if (!link.href) {
        link.href = "http://www.bloomberg.com/professional";
      }
      
      // Move the link to the button container
      link.remove();
      buttonContainer.appendChild(link);
      contentDiv.appendChild(buttonContainer);
    }
  }
}
