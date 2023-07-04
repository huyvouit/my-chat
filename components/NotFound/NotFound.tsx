import React from "react";
import styles from './NotFound.module.scss';
import Link from "next/link";

function NotFoundScreen() {

  return (
    <div className={`${styles[`not-found`]}`}>
      <div className={`${styles[`not-found__container`]}`}>
        <div className={`${styles[`not-found__text`]}`}>
          <div className={`${styles[`not-found__text-title`]}`}>
            You are currently unable to view this content
          </div>
          <div className={`${styles[`not-found__text-description`]}`}>
          This error is usually due to the owner changing who can view it, or deleting the content
          </div>
        </div>
        <Link href='/' className={`${styles[`not-found__link`]}`}>Go back</Link>
      </div>
    </div>
  );
}

export default NotFoundScreen;