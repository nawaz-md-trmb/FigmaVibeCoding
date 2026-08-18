// @ts-nocheck
import { useMemo } from "react";
import { CatalogImageGallery } from "../../src/modus-catalog/CatalogImageGallery";

/** Thumbnail grid with paging, shape toggle, and fullscreen lightbox. Docs “Copy code” uses this file via ?raw. */
export function ImageGalleryPattern() {
  const images = useMemo(
    () => [
      {
        id: "1",
        src: "/assets/brandImages/25-Deck-Field-01-0J8A2931.jpg",
        alt: "Field work",
      },
      {
        id: "2",
        src: "/assets/brandImages/25-Deck-Field-03-BCFS-0759.jpg",
        alt: "Construction site",
      },
      {
        id: "3",
        src: "/assets/brandImages/25-Deck-Field-04-AdobeStock_449340054.jpg",
        alt: "Surveying",
      },
      {
        id: "4",
        src: "/assets/brandImages/25-Deck-Field-05-MX60_0Z8A9355.jpg",
        alt: "Equipment",
      },
      {
        id: "5",
        src: "/assets/brandImages/25-Deck-Field-06-R780_TSC5_Const_1550.jpg",
        alt: "Technology",
      },
      {
        id: "6",
        src: "/assets/brandImages/25-Deck-AECO-03-102071125.jpg",
        alt: "Architecture",
      },
      {
        id: "7",
        src: "/assets/brandImages/25-Deck-AECO-04-AdobeStock_467302371.jpg",
        alt: "Building",
      },
      { id: "8", src: "/assets/brandImages/25-Deck-Field-02.jpg", alt: "Field crew" },
      {
        id: "9",
        src: "/assets/brandImages/25-Deck-Field-07-R780_Const_1052.jpg",
        alt: "Heavy equipment",
      },
      {
        id: "10",
        src: "/assets/brandImages/25-Deck-Field-08-R780_Const_1052.jpg",
        alt: "Job site overview",
      },
      {
        id: "11",
        src: "/assets/brandImages/25-Deck-AECO-05-610430794.jpg",
        alt: "Design review",
      },
      {
        id: "12",
        src: "/assets/brandImages/25-Deck-AECO-06-AdobeStock_219305239.jpg",
        alt: "Infrastructure",
      },
    ],
    [],
  );

  return (
    <CatalogImageGallery
      images={images}
      imagesPerPage={4}
      showControls
      tileShape="rectangle"
    />
  );
}

export default ImageGalleryPattern;
