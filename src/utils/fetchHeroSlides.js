import { listAll, getDownloadURL, ref } from "firebase/storage";
import { storage } from "../context/FirebaseContext";

/**
 * Fetches all images from 'heroSlides/' folder in Firebase Storage.
 * Returns an array of slide objects compatible with your HeroSection.
 */
export async function fetchHeroSlides() {
  const folderRef = ref(storage, "carousel"); // Folder in Firebase Storage
  const result = await listAll(folderRef);

  const slides = await Promise.all(
    result.items.map(async (itemRef, index) => {
      const url = await getDownloadURL(itemRef);
      return {
        id: `slide${index + 1}`,
        imageUrl: url,
        title: `Slide ${index + 1}`,
        subtitle: "Your custom subtitle here",
        ctaPrimaryText: "Learn More",
        ctaPrimaryLink: "#about",
        ctaSecondaryText: "Join Us",
        ctaSecondaryLink: "#contact",
      };
    })
  );

  return slides;
}
