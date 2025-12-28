import React, { FC, memo } from 'react';
import styles from './feed-info.module.css';
import { FeedInfoUIProps, HalfColumnProps, TColumnProps } from './type';

export const FeedInfoUI: FC<FeedInfoUIProps> = memo(
  ({ feed, readyOrders, pendingOrders }) => {
    const { total, totalToday } = feed;

    return (
      <section>
        <div className={styles.columns}>
          <HalfColumn orders={readyOrders} title='Готовы' textColor='ready' />
          <HalfColumn
            orders={pendingOrders}
            title='В работе'
            textColor='pending'
          />
        </div>
        <div className={styles.stats}>
          <Column title='Выполнено за все время' content={total} />
          <Column title='Выполнено за сегодня' content={totalToday} />
        </div>
      </section>
    );
  }
);

FeedInfoUI.displayName = 'FeedInfoUI';

const HalfColumn: FC<HalfColumnProps> = ({ orders, title, textColor }) => (
  <div className={styles.column}>
    <h3 className={`text text_type_main-medium mb-6 ${styles.title}`}>
      {title}:
    </h3>
    {orders.length > 0 ? (
      <ul className={styles.list}>
        {orders.map((item, index) => (
          <li
            className={`text text_type_digits-default ${styles.listItem} ${
              textColor === 'ready' ? styles.ready : styles.pending
            }`}
            key={index}
          >
            {item}
          </li>
        ))}
      </ul>
    ) : (
      <p className='text text_type_main-default text_color_inactive'>
        Нет заказов
      </p>
    )}
  </div>
);

HalfColumn.displayName = 'HalfColumn';

const Column: FC<TColumnProps> = ({ title, content }) => (
  <div className={styles.statColumn}>
    <h3 className={`text text_type_main-medium mb-2 ${styles.title}`}>
      {title}:
    </h3>
    <p className={`text text_type_digits-large ${styles.content}`}>{content}</p>
  </div>
);

Column.displayName = 'Column';
