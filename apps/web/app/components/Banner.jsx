'use client';

import Image from 'next/image';
import style from "../style/Banner.module.css";

export default function Banner() {
  return (
    <div className={style.banner}>
      <Image
        src="/gaming-banner3.png" 
        alt="Bannière promotionnelle"
        fill
        priority
        className={style.image}
      />
    </div>
  );
}
