import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const CoffeeStore = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      id: {id}
      <Link href="/">
        <a>Back to Home</a>
      </Link>
    </div>
  );
};

export default CoffeeStore;
