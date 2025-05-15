import { AppHeader } from '@components/app-header/app-header';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	EmailInput,
	Button,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { resetPassword } from '@utils/api';
import styles from './login.module.scss';

const ForgotPassword = () => {
	const [email, setEmail] = useState('');
	const navigate = useNavigate();

	const handleForgotPassword = async () => {
		try {
			await resetPassword(email);
			localStorage.setItem('resetPasswordAllowed', 'true'); // Устанавливаем флаг
			navigate('/reset-password');
		} catch (error) {
			console.error('Ошибка при восстановлении пароля:', error);
		}
	};

	return (
		<div>
			<header>
				<AppHeader />
			</header>
			<div className={styles.loginContainer + ' pt-6'}>
				<h1 className='text text_type_main-large pb-6'>
					Восстановление пароля
				</h1>
				<div className={styles.inputContainer + ' pb-6'}>
					<EmailInput
						onChange={(e) => setEmail(e.target.value)}
						value={email}
						name={'email'}
						isIcon={false}
						placeholder={'Укажите email'}
					/>
				</div>
				<div className='pb-20'>
					<Button
						htmlType='button'
						type='primary'
						size='medium'
						onClick={handleForgotPassword}>
						Восстановить
					</Button>
				</div>
				<div className={styles.links}>
					<p className='text text_type_main-default text_color_inactive pb-4'>
						Вcпомнили пароль?{' '}
						<Link to='/login' className='link'>
							Войти
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
