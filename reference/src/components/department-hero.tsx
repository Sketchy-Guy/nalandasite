interface DepartmentHeroProps {
  title: string;
  description: string;
  imageUrl?: string;
}

export function DepartmentHero({ title, description, imageUrl }: DepartmentHeroProps) {
  return (
    <section className="relative h-[400px] bg-gradient-to-r from-primary/20 to-primary/10 flex items-center">
      {imageUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          {description && (
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}