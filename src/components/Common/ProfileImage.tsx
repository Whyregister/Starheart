export default function ProfileImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={(event) => {
        event.currentTarget.src = "/assets/cards/placeholder.svg";
      }}
      className={`aspect-square w-full rounded-md object-cover ${className}`}
    />
  );
}
