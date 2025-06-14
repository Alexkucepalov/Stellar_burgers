import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import styles from './feed.module.scss';
import { CurrencyIcon, FormattedDate } from '@ya.praktikum/react-developer-burger-ui-components';
import { useAppSelector } from '@services/hooks';
import { RootState } from '../services/store';
import { Ingredient } from '@utils/types';

interface IOrderDetails {
  _id: string;
  ingredients: string[];
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
}

const OrderFeedPage: React.FC = () => {
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const { items: allIngredients } = useAppSelector((state: RootState) => state.ingredients);
  const { orders: publicOrders } = useAppSelector((state: RootState) => state.ws);
  const { orders: userOrders } = useAppSelector((state: RootState) => state.wsAuth);
  const [order, setOrder] = useState<IOrderDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!number) {
        setError('Номер заказа не указан');
        setLoading(false);
        return;
      }

      const orderFromWs = [...publicOrders, ...userOrders].find(o => o.number === Number(number));

      if (orderFromWs) {
        setOrder(orderFromWs as IOrderDetails);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://norma.nomoreparties.space/api/orders/${number}`);
        const data = await response.json();

        if (data.success && data.orders && data.orders.length > 0) {
          setOrder(data.orders[0]);
        } else {
          setError(data.message || 'Заказ не найден');
        }
      } catch (e) {
        setError('Произошла ошибка при загрузке заказа.');
        console.error('Error fetching order:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [number, publicOrders, userOrders]);

  if (loading) {
    return <div className="text text_type_main-medium pt-10">Загрузка заказа...</div>;
  }

  if (error) {
    return <div className="text text_type_main-medium pt-10">Ошибка: {error}</div>;
  }

  if (!order) {
    return <div className="text text_type_main-medium pt-10">Заказ не найден</div>;
  }

  const ingredientCounts = order.ingredients.reduce((acc: { [key: string]: number }, ingredientId) => {
    acc[ingredientId] = (acc[ingredientId] || 0) + 1;
    return acc;
  }, {});

  const uniqueIngredients: Ingredient[] = Object.keys(ingredientCounts).map(ingredientId => 
    allIngredients.find(item => item._id === ingredientId)
  ).filter(Boolean) as Ingredient[];

  const totalPrice = uniqueIngredients.reduce((sum, ingredient) => {
    const count = ingredientCounts[ingredient._id];
    return sum + (ingredient.price * count);
  }, 0);

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

  const statusText = getStatusText(order.status);
  const statusClass = order.status === 'done' ? styles.statusDone : styles.statusDefault;

  return (
    <div className={styles.orderFeedPageContainer}> 
        <p className={`text text_type_digits-medium mb-10 ${styles.textCenter}`}>#{order.number}</p>
        <h2 className={`text text_type_main-medium mb-3 ${styles.textLeft}`}>{order.name}</h2>
        <p className={`text text_type_main-default mb-15 ${statusClass} ${styles.textLeft}`}>{statusText}</p>

        <p className={`text text_type_main-medium ${styles.orderSectionTitle} mb-6 ${styles.textLeft}`}>Состав:</p>
        <div className={`${styles.ingredientsList} pr-6`}>
          {uniqueIngredients.map((ingredient, index) => (
            <div key={index} className={`${styles.ingredientItem} mb-6`}>
              <div className={styles.flexCenter}>
                <div className={styles.ingredientIcon}>
                  <div className={styles.innerIngredientIcon}> 
                    <img src={ingredient.image} alt={ingredient.name} />
                  </div>
                </div>
                <p className={`text text_type_main-default ${styles.ingredientNameMargin}`}>{ingredient.name}</p>
              </div>
              <div className={styles.ingredientPriceBlock}>
                <p className="text text_type_digits-default mr-2">
                  {ingredientCounts[ingredient._id]} x {ingredient.price}
                </p>
                <CurrencyIcon type="primary" />
              </div>
            </div>
          ))}
        </div>
        <div className={`${styles.orderFooter} mt-10`}>
          <span className="text text_type_main-default text_color_inactive mr-6">
            <FormattedDate date={new Date(order.createdAt)} />
          </span>
          <div className={styles.totalPrice}>
            <p className="text text_type_digits-default mr-2">{totalPrice}</p>
            <CurrencyIcon type="primary" />
          </div>
        </div>
    </div>
  );
};

export default OrderFeedPage;