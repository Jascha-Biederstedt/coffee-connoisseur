import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import cls from 'classnames';
import useSWR from 'swr';

import styles from '../../styles/coffee-store.module.css';

import { fetchCoffeeStores } from '../../lib/coffee-stores';
import { StoreContext } from '../../store/store-context';
import { isEmpty } from '../../utils';

export async function getStaticProps({ params }) {
  const coffeeStores = await fetchCoffeeStores();
  const findCoffeeStoreById = coffeeStores.find(coffeeStore => {
    return coffeeStore.fsq_id.toString() === params.id;
  });

  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();

  const paths = coffeeStores.map(coffeeStore => {
    return {
      params: { id: coffeeStore.fsq_id.toString() },
    };
  });

  return {
    paths,
    fallback: true,
  };
}

const CoffeeStore = initialProps => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const id = router.query.id;
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const handleCreateCoffeeStore = async coffeeStore => {
    try {
      const { name, imgUrl } = coffeeStore;
      const id = coffeeStore.fsq_id;
      const address = coffeeStore.location.formatted_address;

      let neighbourhood = '';

      if (
        coffeeStore.related_places &&
        coffeeStore.related_places.parent &&
        coffeeStore.related_places.parent.name
      ) {
        neighbourhood = coffeeStore.related_places.parent.name;
      }

      const response = await fetch('/api/createCoffeeStore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          name,
          address,
          neighbourhood,
          voting: 0,
          imgUrl,
        }),
      });

      const dbCoffeeStore = await response.json();
      console.log(dbCoffeeStore);
    } catch (error) {
      console.error('Error creating coffee store', error);
    }
  };

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find(coffeeStore => {
          return coffeeStore.fsq_id.toString() === id;
        });

        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [id, initialProps, initialProps.coffeeStore]);

  const {
    name = '',
    location = '',
    related_places = '',
    imgUrl = '',
  } = coffeeStore;

  const [votingCount, setVotingCount] = useState(0);

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, url =>
    fetch(url).then(res => res.json())
  );

  useEffect(() => {
    if (data && data.length > 0) {
      console.log('data from SWR', data);
      // setCoffeeStore(data[0]);
      setVotingCount(data[0].voting);
    }
  }, [data]);

  const handleUpvoteButton = async () => {
    try {
      // const id = coffeeStore.fsq_id;

      const response = await fetch('/api/upvoteCoffeeStoreById', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
        }),
      });

      const dbCoffeeStore = await response.json();
      console.log(dbCoffeeStore);

      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        const count = votingCount + 1;
        setVotingCount(count);
      }
    } catch (error) {
      console.error('Error upvoting coffee store', error);
    }
  };

  if (error) {
    return <div>Something went wrong retrieving coffee store page</div>;
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>← Back to Home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          />
        </div>

        <div className={cls('glass', styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/places.svg" width={24} height={24} />
            <p className={styles.text}>{location.formatted_address}</p>
          </div>
          {related_places.parent && (
            <div className={styles.iconWrapper}>
              <Image src="/static/icons/nearMe.svg" width={24} height={24} />
              <p className={styles.text}>{related_places.parent.name}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" width={24} height={24} />
            <p className={styles.text}>{votingCount}</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
