'use client'
import Link from 'next/link';
import Reeact from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css'

export default function  Page() {
  let router = useRouter();
  let number = 5
  return(
    <div> 
      <h1 className={styles.title}>hero </h1> 
    {/* <Link href={"/"}> Home page </Link>
    <Link href={'/about'}>about page</Link> */}
    <button className={styles.button} onClick={() => router.push ('/')}> Go to homepage</button>
    </div>
  );
  }