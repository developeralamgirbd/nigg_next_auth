"use client"
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface WithAuthProps {
  redirectUrl?: string;
}

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>, options?: WithAuthProps) => {
  return (props: P) => {
    const { redirectUrl = '/signin' } = options || {};
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
         
      if (status!=='loading' && !session) {
        router.push(redirectUrl);
      }
    }, [session, router, redirectUrl]);

    if (status === 'loading') {
      return <p>Loading...</p>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
