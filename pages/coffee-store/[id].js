import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import coffeeStoresData from '../../data/coffee-stores.json';

export async function getStaticProps({ params }) {
  return {
    props: {
      coffeeStore: coffeeStoresData.find(coffeeStore => {
        return coffeeStore.id.toString() === params.id;
      }),
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { id: '0' } },
      { params: { id: '1' } },
      { params: { id: '300' } },
    ],
    fallback: false,
  };
}

const CoffeeStore = ({ coffeeStore }) => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      id: {id}
      <Link href="/">
        <a>Back to Home</a>
      </Link>
      <p>{coffeeStore.name}</p>
      <p>{coffeeStore.address}</p>
    </div>
  );
};

export default CoffeeStore;
