// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { ModusWcCard, ModusWcProgress, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

export function ProgressBar() {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev >= 100 ? 100 : prev + 10;
        
        // Directly update the web component's value property
        if (progressRef.current) {
          progressRef.current.value = newProgress;
        }
        
        if (newProgress >= 100 && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return newProgress;
      });
    }, 500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <ModusWcCard customClass="max-w-md mx-auto">
      <div className="grid gap-2">
        <div className="flex justify-between items-center">
          <ModusWcTypography hierarchy="h4" size="sm" weight="semibold" label="Upload Progress" />
          <ModusWcTypography hierarchy="p" size="sm" weight="medium" label={`${progress}%`} />
        </div>
        <ModusWcProgress ref={progressRef} value={progress} max={100} customClass="w-full" />
        <ModusWcTypography 
          hierarchy="p" 
          size="xs" 
          customClass="text-[var(--muted-foreground)]" 
          label="Uploading file..." 
        />
      </div>
    </ModusWcCard>
  );
}

export default ProgressBar;
