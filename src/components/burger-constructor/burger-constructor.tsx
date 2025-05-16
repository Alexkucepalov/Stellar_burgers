import React, { useState, useEffect } from 'react';
import {
	ConstructorElement,
	Button,
	CurrencyIcon,
	DragIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Modal } from '../modal/modal';
import { OrderDetails } from '../order-details/order-details';
import s from './burger-constructor.module.scss';
import { useAppSelector, useAppDispatch } from '@services/hooks';
import { createOrder } from '@services/actions/orderActions';
import {
	clearConstructor,
	removeIngredient,
} from '@services/reducers/constructorReducer';
import { useNavigate, useLocation } from 'react-router-dom';

export const BurgerConstructor: React.FC = () => {
	const { items = [], bun } = useAppSelector((state) => state.constructor);
	const { user } = useAppSelector((state) => state.auth); // Проверяем авторизацию
	const [isModalOpen, setIsModalOpen] = useState(false);
	const dispatch = useAppDispatch();
	const { orderNumber, loading, error } = useAppSelector(
		(state) => state.order
	);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		console.log('Constructor state:', { items, bun });
	}, [items, bun]);

	// Подсчёт общей стоимости
	const totalPrice = React.useMemo(() => {
		const itemsPrice = items.reduce((sum, item) => sum + item.price, 0);
		const bunPrice = bun ? bun.price * 2 : 0; // учитываем обе булки
		return itemsPrice + bunPrice;
	}, [items, bun]);

	const handleCreateOrder = () => {
		if (!user) {
			// Если пользователь не авторизован, перенаправляем на страницу авторизации
			navigate('/login', { state: { from: location } });
			return;
		}

		if (!bun) {
			alert('Добавьте булку!');
			return;
		}
		if (items.length === 0) {
			alert('Добавьте начинку!');
			return;
		}

		// Формируем массив ID ингредиентов для заказа
		const orderIngredients = [
			bun._id, // верхняя булка
			...items.map((item) => item._id),
			bun._id, // нижняя булка
		];

		dispatch(createOrder(orderIngredients));
		setIsModalOpen(true);
	};

	// Очищаем конструктор при успешном создании заказа
	useEffect(() => {
		if (orderNumber) {
			dispatch(clearConstructor());
		}
	}, [orderNumber, dispatch]);

	return (
		<div className={s.container}>
			{/* Верхняя булка */}
			<div className={`${s.bunContainer} pb-4`}>
				{bun ? (
					<ConstructorElement
						type='top'
						isLocked={true}
						text={`${bun.name} (верх)`}
						price={bun.price}
						thumbnail={bun.image}
					/>
				) : (
					<div className={s.placeholder}>
						<p className='text text_type_main-default text_color_inactive'>
							Перетащите сюда булку
						</p>
					</div>
				)}
			</div>

			{/* Контейнер для перетаскиваемых ингредиентов */}
			<div className={s.scrollContainer}>
				<Droppable droppableId='constructor'>
					{(provided) => (
						<div
							className={s.ingredientList}
							ref={provided.innerRef}
							{...provided.droppableProps}>
							{items.length > 0 ? (
								items.map((item, index) => {
									console.log('Rendering item:', item);
									return (
										<Draggable
											key={item.uniqueId}
											draggableId={item.uniqueId}
											index={index}>
											{(provided) => (
												<div
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
													className={`${s.ingredient} pt-2 pb-2`}>
													<div className={s.dragIconContainer}>
														<DragIcon type='primary' />
													</div>
													<ConstructorElement
														text={item.name}
														price={item.price}
														thumbnail={item.image}
														handleClose={() =>
															dispatch(removeIngredient(item.uniqueId))
														}
													/>
												</div>
											)}
										</Draggable>
									);
								})
							) : (
								<div className={s.placeholder}>
									<p className='text text_type_main-default text_color_inactive'>
										Перетащите сюда начинку
									</p>
								</div>
							)}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</div>

			{/* Нижняя булка */}
			<div className={`${s.bunContainer} pt-4`}>
				{bun ? (
					<ConstructorElement
						type='bottom'
						isLocked={true}
						text={`${bun.name} (низ)`}
						price={bun.price}
						thumbnail={bun.image}
					/>
				) : (
					<div className={s.placeholder}>
						<p className='text text_type_main-default text_color_inactive'>
							Перетащите сюда булку
						</p>
					</div>
				)}
			</div>

			{/* Итоговая стоимость и кнопка заказа */}
			<div className={`${s.buttonContainer} pt-4`}>
				<div className={s.total}>
					<span className='text text_type_digits-medium'>{totalPrice}</span>
					<CurrencyIcon type='primary' />
				</div>
				<Button
					htmlType='button'
					type='primary'
					size='large'
					onClick={handleCreateOrder}
					disabled={loading || !bun || items.length === 0}>
					{loading ? 'Оформляем заказ...' : 'Оформить заказ'}
				</Button>
			</div>

			{/* Модальное окно с деталями заказа */}
			{isModalOpen && (
				<Modal onClose={() => setIsModalOpen(false)}>
					<OrderDetails orderNumber={orderNumber?.toString()} />
				</Modal>
			)}

			{error && (
				<p className='text text_type_main-default text_color_error'>{error}</p>
			)}
		</div>
	);
};
