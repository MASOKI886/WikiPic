// script.js
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const loading = document.getElementById("loading");
const gallery = document.getElementById("gallery");

searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchImages(query);
  }
});

async function fetchImages(title) {
  loading.style.display = "block";
  gallery.innerHTML = "";
  const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(
    title
  )}&format=json&origin=*`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const htmlText = data.parse.text["*"];
    const doc = new DOMParser().parseFromString(htmlText, "text/html");
    const imgs = doc.querySelectorAll("img");

    if (imgs.length === 0) {
      gallery.innerHTML = "<p>No images found for this topic.</p>";
    } else {
      imgs.forEach((img) => {
        const src = img.getAttribute("src");
        if (src && src.startsWith("//upload")) {
          const fullSrc = "https:" + src;
          const imageElement = document.createElement("img");
          imageElement.src = fullSrc;
          imageElement.alt = title;
          imageElement.title = title;
          imageElement.onclick = () => window.open(fullSrc, "_blank");
          gallery.appendChild(imageElement);
        }
      });
    }
  } catch (error) {
    console.error("Failed to fetch images", error);
    gallery.innerHTML = "<p>Error fetching images. Try another topic.</p>";
  } finally {
    loading.style.display = "none";
  }
}
