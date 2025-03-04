import { useEffect } from 'react';

interface TallyFormProps {
  src: string;
  height?: number;
}

declare global {
  interface Window {
    Tally?: {
      loadEmbeds: () => void;
    };
  }
}

export function TallyForm({ src, height = 962 }: TallyFormProps) {
  useEffect(() => {
    // Function to load Tally embeds
    const loadTally = () => {
      if (typeof window.Tally !== 'undefined') {
        window.Tally.loadEmbeds();
      } else {
        document.querySelectorAll('iframe[data-tally-src]:not([src])').forEach((iframe: HTMLIFrameElement) => {
          if (iframe.dataset.tallySrc) {
            iframe.src = iframe.dataset.tallySrc;
          }
        });
      }
    };

    // Check if Tally script is already loaded
    if (typeof window.Tally === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://tally.so/widgets/embed.js';
      script.onload = loadTally;
      script.onerror = loadTally;
      document.body.appendChild(script);
    } else {
      loadTally();
    }

    return () => {
      // Cleanup if needed
      const script = document.querySelector('script[src="https://tally.so/widgets/embed.js"]');
      if (script) {
        script.remove();
      }
    };
  }, []);

  return (
    <iframe
      data-tally-src={src}
      loading="lazy"
      width="100%"
      height={height}
      frameBorder="0"
      marginHeight={0}
      marginWidth={0}
      title="Contatta: Brick By Brick"
      style={{
        maxWidth: '100%',
        margin: '0px auto',
        display: 'block',
      }}
    />
  );
}
