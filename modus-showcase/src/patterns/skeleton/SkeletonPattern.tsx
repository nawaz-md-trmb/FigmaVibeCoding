// @ts-nocheck
import { ModusWcCard, ModusWcSkeleton } from '@trimble-oss/moduswebcomponents-react';

export function Skeleton() {
  return (
    <div className="grid gap-6">
      {[1, 2, 3].map((i) => (
        <ModusWcCard key={i}>
          <div className="grid gap-4">
            <div className="flex items-start gap-4">
              <ModusWcSkeleton shape="circle" width="3rem" height="3rem" />
              <div className="flex-1 grid gap-2">
                <ModusWcSkeleton height="1.5rem" width="60%" />
                <ModusWcSkeleton height="1rem" width="40%" />
              </div>
            </div>
            
            <ModusWcSkeleton height="12rem" width="100%" />
            
            <div className="grid gap-2">
              <ModusWcSkeleton height="1rem" width="100%" />
              <ModusWcSkeleton height="1rem" width="95%" />
              <ModusWcSkeleton height="1rem" width="85%" />
              <ModusWcSkeleton height="1rem" width="70%" />
            </div>
            
            <div className="flex gap-2">
              <ModusWcSkeleton height="2rem" width="6rem" />
              <ModusWcSkeleton height="2rem" width="5rem" />
            </div>
          </div>
        </ModusWcCard>
      ))}
    </div>
  );
}

export default Skeleton;
