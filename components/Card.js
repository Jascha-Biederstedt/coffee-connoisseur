import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Card = ({ href, imgUrl, name }) => {
  return (
    <div>
      <Link href={href}>
        <a>
          <h2>{name}</h2>
          <Image src={imgUrl} width={260} height={160} />
        </a>
      </Link>
    </div>
  );
};

export default Card;
