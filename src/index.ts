import "./css/styles.css";
import { API_URL } from "./helpers/constants";
import { ApiResponse } from "./helpers/types";
import { setAttributes } from "./helpers/DOMHelpers";

const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;

function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader!.hidden = true;
  }
}

async function getPhotos(url: string): Promise<ApiResponse[] | undefined> {
  try {
    const response = await fetch(url);
    const data: ApiResponse[] = await response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

function displayPhotos(photo: ApiResponse): HTMLAnchorElement {
  const item = document.createElement("a");
  const img = document.createElement("img");

  setAttributes(item, {
    href: photo.links.html,
    target: "_blank",
  });

  setAttributes(img, {
    src: photo.urls.regular,
    alt: photo.alt_description,
    title: photo.alt_description,
  });

  item.appendChild(img);
  img.addEventListener("load", imageLoaded);
  return item;
}

async function mountPhotos() {
  try {
    imagesLoaded = 0;
    getPhotos(API_URL).then((photosArray) => {
      photosArray!.forEach(async (photo) => {
        const item = await displayPhotos(photo);
        imageContainer!.appendChild(item);
      });
    });
  } catch (error) {
    throw new Error(error);
  }
}

window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 1000
  ) {
    ready = false;
    mountPhotos();
  }
});

document.addEventListener("DOMContentLoaded", main);

function main() {
  mountPhotos();
}
