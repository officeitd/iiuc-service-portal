import type { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  delay: number;
  onClick?: () => void;
}

const ServiceCard = ({
  icon: Icon,
  title,
  description,
  color,
  delay,
  onClick,
}: ServiceCardProps) => {
  return (
    <button
      onClick={onClick}
      className='group relative glass-card rounded-2xl p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 opacity-0 animate-fade-up w-full'
      style={{ animationDelay: `${delay}s` }}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${color}`}
      >
        <Icon className='w-6 h-6' />
      </div>
      <h3 className='text-lg font-semibold text-foreground mb-1'>{title}</h3>
      <p className='text-sm text-muted-foreground leading-relaxed'>
        {description}
      </p>
      <div className='absolute inset-0 rounded-2xl border border-transparent group-hover:border-accent/20 transition-colors duration-300' />
    </button>
  );
};

export default ServiceCard;
