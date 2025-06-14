import React, { useEffect } from 'react';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { FormattedDate } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './feed.module.scss';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { RootState } from '../services/store';
import { Link, useLocation } from 'react-router-dom';
import { WS_CONNECTION_START, WS_CONNECTION_CLOSED } from '@services/actions/wsActions';

const Feed = () => {
  const dispatch = useAppDispatch();
  const { items: allIngredients } = useAppSelector((state: RootState) => state.ingredients);
  const { orders, total, totalToday, wsConnected, error } = useAppSelector((state: RootState) => state.ws);
  const location = useLocation();

  useEffect(() => {
    dispatch(WS_CONNECTION_START('wss://norma.nomoreparties.space/orders/all'));
    return () => {
      dispatch(WS_CONNECTION_CLOSED());
    };
  }, [dispatch]);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'done':
        return 'Выполнен';
      case 'pending':
        return 'Готовится';
      case 'created':
        return 'Создан';
      default:
        return 'Неизвестно';
    }
  };

  const doneOrders = orders.filter(order => order.status === 'done').slice(0, 10);
  const pendingOrders = orders.filter(order => order.status === 'pending').slice(0, 10);

  if (error) {
    return <p className="text text_type_main-medium pt-10">Ошибка соединения: {error}</p>;
  }

  if (!wsConnected || orders.length === 0) {
    return <p className="text text_type_main-medium pt-10">Загрузка заказов...</p>;
  }

  return (
    <main className={`${styles.feedPage} pt-6`}>
      <div className={styles.mainContentWrapper}>
        <h1 className="text text_type_main-large mb-5">Лента заказов</h1>
        <div className={styles.feedContainer}>
          <section className={`${styles.ordersList} pt-16 px-2`}>
            {orders.map((order) => {
              const statusText = getStatusText(order.status);
              const statusClass = order.status === 'done' ? styles.colorAqua : '';
              const totalPrice = order.ingredients.reduce((sum: number, ingredientId: string) => {
                const ingredient = allIngredients.find(item => item._id === ingredientId);
                return sum + (ingredient ? ingredient.price : 0);
              }, 0);

              return (
                <Link key={order._id} to={`/feed/${order.number}`} state={{ background: location }} className={styles.orderCardLink}>
                  <div className={`${styles.orderCard} p-6`}>
                    <div className={styles.orderHeader}>
                      <span className="text text_type_digits-default">#{order.number}</span>
                      <span className="text text_type_main-default text_color_inactive">
                        <FormattedDate date={new Date(order.createdAt)} />
                      </span>
                    </div>
                    <div className="text text_type_main-medium mt-6">{order.name}</div>
                    <p className={`text text_type_main-default mt-2 ${statusClass}`}>{statusText}</p>
                    <div className={`${styles.orderContentBelowName} mt-6`}>
                      <div className={styles.ingredientsRow}>
                        {order.ingredients.slice(0, 6).map((ingredientId: string, index: number) => {
                          const ingredient = allIngredients.find(item => item._id === ingredientId);
                          if (!ingredient) return null;

                          const remainingCount = order.ingredients.length - 6;
                          const isLast = index === 5 && order.ingredients.length > 6;

                          return (
                            <div key={index} className={styles.ingredientIcon} style={{ zIndex: 6 - index, marginLeft: index > 0 ? '-16px' : '0' }}>
                              <div className={styles.innerIngredientIcon}>
                                <img src={ingredient.image} alt={ingredient.name} style={{ opacity: isLast ? 0.6 : 1 }} />
                              </div>
                              {isLast && (
                                <p className={`${styles.overlayText} text text_type_main-default`}>
                                  +{remainingCount}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className={styles.totalPrice}>
                        <p className="text text_type_digits-default mr-2">{totalPrice}</p>
                        <CurrencyIcon type="primary" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </section>
          <aside className={`${styles.statsPanel} ml-15`}>
            <div className={styles.statsRow}>
              <div className={`${styles.statsBlock} p-6`}>
                <h2 className="text text_type_main-medium">Готовы:</h2>
                <ul className={`${styles.statusList} mt-6`}>
                  {doneOrders.map(order => (
                    <li key={order._id} className="text text_type_digits-default text_color_success">{order.number}</li>
                  ))}
                </ul>
              </div>
              <div className={`${styles.statsBlock} p-6`}>
                <h2 className="text text_type_main-medium">В работе:</h2>
                <ul className={`${styles.statusList} mt-6`}>
                  {pendingOrders.map(order => (
                    <li key={order._id} className="text text_type_digits-default">{order.number}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={`${styles.statsBlock} p-6`}>
              <h2 className="text text_type_main-medium">Выполнено за все время:</h2>
              <div className={styles.statsNumber + ' text text_type_digits-large'}>{total}</div>
            </div>
            <div className={`${styles.statsBlock} p-6`}>
              <h2 className="text text_type_main-medium">Выполнено за сегодня:</h2>
              <div className={styles.statsNumber + ' text text_type_digits-large'}>{totalToday}</div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Feed;