import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
	EmailInput,
	PasswordInput,
	Button,
	Input,
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './profile.module.scss';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { logoutUser, updateUser } from '@services/actions/authActions';

const Profile = () => {
	const dispatch = useAppDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	const { user, loading, error } = useAppSelector((state) => state.auth);

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isFormChanged, setIsFormChanged] = useState(false);

	// Обновляем локальные состояния при изменении пользователя
	useEffect(() => {
		if (user) {
			setName(user.name || '');
			setEmail(user.email || '');
			setPassword('');
			setIsFormChanged(false);
		}
	}, [user]);

	// Проверка, изменились ли значения формы относительно исходных данных пользователя
	const checkFormChanged = (
		newName: string,
		newEmail: string,
		newPassword: string
	) => {
		if (!user) return false;
		return (
			newName !== user.name || newEmail !== user.email || newPassword !== ''
		);
	};

	// Обработчик изменения любого поля формы
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		switch (name) {
			case 'name':
				setName(value);
				break;
			case 'email':
				setEmail(value);
				break;
			case 'password':
				setPassword(value);
				break;
		}
		// Проверяем, изменена ли форма
		setIsFormChanged(
			checkFormChanged(
				name === 'name' ? value : name,
				name === 'email' ? value : email,
				name === 'password' ? value : password
			)
		);
	};

	// Обработчик отправки формы (сохранение изменений)
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await dispatch(updateUser({ email, name, password }));
			setIsFormChanged(false);
			setPassword('');
		} catch (error) {
			console.error('Ошибка при обновлении данных:', error);
		}
	};

	// Обработчик отмены изменений (возврат к исходным данным)
	const handleCancel = () => {
		if (user) {
			setName(user.name || '');
			setEmail(user.email || '');
			setPassword('');
			setIsFormChanged(false);
		}
	};

	// Обработчик выхода из системы
	const handleLogout = async (e: React.MouseEvent) => {
		e.preventDefault();
		try {
			await dispatch(logoutUser()).unwrap();
			navigate('/login');
		} catch (error) {
			console.error('Ошибка при выходе из системы:', error);
		}
	};

	// Отображение состояния загрузки или ошибки
	if (loading) return <p>Загрузка...</p>;
	if (error) return <p>Ошибка: {error}</p>;

	return (
		<div>
			<div className={styles.profileContainer}>
				<div className={styles.sidebar}>
					<Link
						to='/profile'
						className={`text text_type_main-medium ${
							location.pathname === '/profile' ? styles.active : ''
						}`}>
						Профиль
					</Link>
					<Link
						to='/profile/orders'
						className={`text text_type_main-medium ${
							location.pathname === '/profile/orders' ? styles.active : ''
						}`}>
						История заказов
					</Link>
					<a
						href='#'
						onClick={handleLogout}
						className={`text text_type_main-medium text_color_inactive`}>
						Выход
					</a>
					<div className={styles.profileContent + ' pt-20'}>
						<p className='text text_type_main-default'>
							В этом разделе вы можете изменить свои персональные данные
						</p>
					</div>
				</div>
				<form
					onSubmit={handleSubmit}
					className={styles.inputContainer + ' pb-6'}>
					<Input
						type={'text'}
						placeholder={'Имя'}
						onChange={handleInputChange}
						value={name}
						name={'name'}
						error={false}
						errorText={'Ошибка'}
						size={'default'}
					/>
					<EmailInput
						placeholder={'Логин'}
						onChange={handleInputChange}
						value={email}
						name={'email'}
						isIcon={false}
					/>
					<Input
						type={'text'}
						placeholder={'Пароль'}
						onChange={handleInputChange}
						value={password}
						name={'password'}
						error={false}
						errorText={'Ошибка'}
						size={'default'}
					/>
					{isFormChanged && (
						<div className={styles.buttonContainer}>
							<Button htmlType='submit' type='primary' size='medium'>
								Сохранить
							</Button>
							<Button
								htmlType='button'
								type='secondary'
								size='medium'
								onClick={handleCancel}>
								Отмена
							</Button>
						</div>
					)}
				</form>
			</div>
		</div>
	);
};

export default Profile;
