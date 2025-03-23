import React, { useState } from 'react';
import { ConstructorElement, Button, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Modal } from '../modal/modal';
import { OrderDetails } from '../order-details/order-details';
import { Ingredient } from '@utils/types';
import s from './burger-constructor.module.scss';

interface BurgerConstructorProps {
    ingredients: Ingredient[];
}

export const BurgerConstructor: React.FC<BurgerConstructorProps> = ({ ingredients }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOrderClick = () => {
        setIsModalOpen(true);
    };

    return (
        <div className={s.container}>
            <div className={`${s.bunContainer} pb-4`}>
                <ConstructorElement
                    type="top"
                    isLocked={true}
                    text="Краторная булка N-200i (верх)"
                    price={200}
                    thumbnail={"https://code.s3.yandex.net/react/code/bun-02.png"}
                />
            </div>
            <Droppable droppableId="constructor">
                {(provided) => (
                    <div
                        className={`${s.ingredientList}`}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {ingredients.map((ingredient, index) => (
                            <Draggable 
                                key={ingredient.uniqueId || ingredient._id}
                                draggableId={ingredient.uniqueId || ingredient._id}
                                index={index}
                            >
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`${s.ingredient} pt-4 pb-4`}
                                    >
                                        <ConstructorElement
                                            text={ingredient.name}
                                            price={ingredient.price}
                                            thumbnail={ingredient.image}
                                            handleClose={() => {
                                            }}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            <div className={`${s.bunContainer} pt-4`}> 
                <ConstructorElement
                    type="bottom"
                    isLocked={true}
                    text="Краторная булка N-200i (низ)"
                    price={200}
                    thumbnail={"https://code.s3.yandex.net/react/code/bun-02.png"}
                />
            </div>
            
            <div className={`${s.buttonContainer} pt-4`}>
                <div className={s.price}>
                    <p className="text text_type_digits-medium mr-2">610</p>
                    <CurrencyIcon type="primary" />
                </div>
                <Button htmlType="button" type="primary" size="large" onClick={handleOrderClick}>
                    Оформить заказ
                </Button>
            </div>

            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <OrderDetails orderNumber="034536" />
                </Modal>
            )}
        </div>
    );
};