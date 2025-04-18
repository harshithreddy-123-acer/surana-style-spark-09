
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  linkTo: string;
  imageUrl: string;
}

const FeatureCard = ({ icon: Icon, title, description, linkTo, imageUrl }: FeatureCardProps) => {
  return (
    <Link 
      to={linkTo}
      className="block group"
    >
      <div className="relative overflow-hidden rounded-xl card-hover transition-all duration-300 bg-card shadow-md h-full">
        <div className="aspect-w-16 aspect-h-9 bg-muted overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        </div>
        <div className="relative p-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent mb-4">
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-serif font-bold mb-2 text-primary group-hover:text-accent transition-colors">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default FeatureCard;
