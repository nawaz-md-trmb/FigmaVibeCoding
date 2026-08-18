// @ts-nocheck
export function MasonryLayout() {
  const photos = [
    { id: 1, src: '/assets/brandImages/25-Deck-Field-01-0J8A2931.jpg', alt: 'Field work' },
    { id: 2, src: '/assets/brandImages/25-Deck-Field-03-BCFS-0759.jpg', alt: 'Construction site' },
    { id: 3, src: '/assets/brandImages/25-Deck-Field-04-AdobeStock_449340054.jpg', alt: 'Surveying' },
    { id: 4, src: '/assets/brandImages/25-Deck-Field-05-MX60_0Z8A9355.jpg', alt: 'Equipment' },
    { id: 5, src: '/assets/brandImages/25-Deck-Field-06-R780_TSC5_Const_1550.jpg', alt: 'Technology' },
    { id: 6, src: '/assets/brandImages/25-Deck-AECO-03-102071125.jpg', alt: 'Architecture' },
    { id: 7, src: '/assets/brandImages/25-Deck-AECO-04-AdobeStock_467302371.jpg', alt: 'Building' }
  ];

  const getItemClasses = (index) => {
    // Create a controlled masonry pattern
    // First image: wide horizontal (spans 2 columns)
    // Fourth image: tall (spans 2 rows)
    if (index === 0) return 'col-span-2';
    if (index === 3) return 'row-span-2';
    return '';
  };

  return (
    <div className="min-w-0 w-full masonry-container" style={{ containerType: 'inline-size' }} data-masonry>
    <div
      className="masonry-grid grid gap-3"
      style={{
        gridAutoRows: 'minmax(150px, auto)',
        gridAutoFlow: 'row dense',
      }}
    >
      {photos.map((photo, index) => (
        <div
          key={photo.id}
          className={`relative overflow-hidden bg-[var(--muted)] rounded-lg hover:shadow-lg transition-shadow ${getItemClasses(index)}`}
        >
          <img
            src={photo.src}
            alt={photo.alt}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
            loading="lazy"
          />
        </div>
      ))}
    </div>
    </div>
  );
}

export default MasonryLayout;
