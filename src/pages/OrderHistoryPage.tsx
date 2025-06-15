import React, { useEffect } from 'react';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { FormattedDate } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './feed.module.scss';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { RootState } from '../services/store';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { WS_AUTH_CONNECTION_START, WS_AUTH_CONNECTION_CLOSED } from '@services/actions/wsActions';
import { IOrder, Ingredient } from '../utils/types';

const OrderHistoryPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: allIngredients } = useAppSelector((state: RootState) => state.ingredients);
  const { orders, wsConnected, error } = useAppSelector((state: RootState) => state.wsAuth);
  const { accessToken, loading: authLoading } = useAppSelector((state: RootState) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken && !authLoading) {
      dispatch(WS_AUTH_CONNECTION_START('wss://norma.nomoreparties.space/orders'));
    }
    return () => {
      dispatch(WS_AUTH_CONNECTION_CLOSED());
    };
  }, [dispatch, accessToken, authLoading]);

  // Добавляем эффект для восстановления соединения при перезагрузке страницы
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem('lastOrderHistoryPath', location.pathname);
      if (location.state?.background) {
        localStorage.setItem('lastOrderHistoryBackground', JSON.stringify(location.state.background));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.pathname, location.state]);

  // Восстанавливаем путь и состояние при загрузке страницы
  useEffect(() => {
    const lastPath = localStorage.getItem('lastOrderHistoryPath');
    const lastBackground = localStorage.getItem('lastOrderHistoryBackground');
    
    if (lastPath && lastPath !== location.pathname) {
      const background = lastBackground ? JSON.parse(lastBackground) : undefined;
      navigate(lastPath, { state: background });
    }
  }, [navigate, location.pathname]);

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

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'done':
        return styles.done;
      case 'pending':
        return styles.pending;
      case 'created':
        return styles.created;
      default:
        return '';
    }
  };

  if (error) {
    return <p className="text text_type_main-medium pt-10">Ошибка соединения: {error}</p>;
  }

  if (!wsConnected) {
    return <p className="text text_type_main-medium pt-10">Загрузка заказов...</p>;
  }

  if (wsConnected && orders.length === 0) {
    return <p className="text text_type_main-medium pt-10">У вас пока нет заказов.</p>;
  }

  return (
    <main className={`${styles.feedPage} pt-6`}>
      <div className={styles.mainContentWrapper}>
        <h1 className="text text_type_main-large mb-5">История заказов</h1>
        <section className={`${styles.ordersList} pt-16 px-2`}>
          {orders.map((order: IOrder) => {
            const statusText = getStatusText(order.status);
            const statusClass = getStatusClass(order.status);
            const totalPrice = order.ingredients.reduce((sum: number, ingredientId: string) => {
              const ingredient = allIngredients.find((item: Ingredient) => item._id === ingredientId);
              return sum + (ingredient ? ingredient.price : 0);
            }, 0);

            return (
              <Link key={order._id} to={`/profile/orders/${order.number}`} state={{ background: location }} className={styles.orderCardLink}>
                <div className={`${styles.orderCard} p-6`}>
                  <div className={styles.orderHeader}>
                    <span className="text text_type_digits-default">#{order.number}</span>
                    <span className="text text_type_main-default text_color_inactive">
                      <FormattedDate date={new Date(order.createdAt)} />
                    </span>
                  </div>
                  <div className="text text_type_main-medium mt-6">{order.name}</div>
                  <div className={styles.orderStatus}>
                    <span className={`text text_type_main-default ${statusClass}`}>
                      {statusText}
                    </span>
                  </div>
                  <div className={`${styles.orderContentBelowName} mt-6`}>
                    <div className={styles.ingredientsRow}>
                      {order.ingredients.slice(0, 6).map((ingredientId: string, index: number) => {
                        const ingredient = allIngredients.find((item: Ingredient) => item._id === ingredientId);
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
      </div>
    </main>
  );
};

export default OrderHistoryPage;