import type { LucideIcon } from 'lucide-react';
import { ExternalLink } from 'lucide-react';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  delay: number;
  url: string;
  preview: string;
}

const ServiceCard = ({
  icon: Icon,
  title,
  description,
  color,
  delay,
  url,
  preview,
}: ServiceCardProps) => {
  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className='group relative glass-card rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 opacity-0 animate-fade-up flex flex-col overflow-hidden no-underline'
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Web preview */}
      <div className='relative h-44 bg-muted overflow-hidden'>
        <img
          src={preview}
          alt={`${title} preview`}
          className='w-full h-full object-cover object-top'
        />
        {/* Hover tint */}
        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300' />
      </div>

      {/* Card body */}
      <div className='p-5 flex flex-col gap-1'>
        <div className='flex items-start justify-between gap-2'>
          <div
            className={`w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center ${color}`}
          >
            <Icon className='w-5 h-5' />
          </div>
          <ExternalLink className='w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-0.5' />
        </div>
        <h3 className='text-base font-semibold text-foreground mt-2'>
          {title}
        </h3>
        <p className='text-xs text-muted-foreground leading-relaxed'>
          {description}
        </p>
        <p className='text-xs text-accent mt-1 truncate'>
          {url.replace('https://', '')}
        </p>
      </div>

      <div className='absolute inset-0 rounded-2xl border border-transparent group-hover:border-accent/20 transition-colors duration-300 pointer-events-none' />
    </a>
  );
};

export default ServiceCard;
