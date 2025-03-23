import React from 'react';
import s from './order-details.module.scss';
import doneIcon from '../../app/assets/images/done.svg';

interface OrderDetailsProps {
    orderNumber: string;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ orderNumber }) => {
    return (
        <div className={s.container}> 
            <p className="text text_type_digits-large mb-8">{orderNumber}</p>
            <p className="text text_type_main-medium mb-15">идентификатор заказа</p>
            <img src={doneIcon} alt="Done" className="mb-15"/>
            <p className="text text_type_main-default mb-2">Ваш заказ начали готовить</p>
            <p className="text text_type_main-default text_color_inactive">
                Дождитесь готовности на орбитальной станции
            </p>
        </div>
    );
}; 