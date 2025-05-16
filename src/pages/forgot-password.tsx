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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await resetPassword(email);
			localStorage.setItem('resetPasswordAllowed', 'true');
			navigate('/reset-password');
		} catch (error) {
			console.error('Ошибка при восстановлении пароля:', error);
		}
	};

	return (
		<div>
			<div className={styles.loginContainer + ' pt-6'}>
				<h1 className='text text_type_main-large pb-6'>
					Восстановление пароля
				</h1>
				<form onSubmit={handleSubmit} className={styles.inputContainer + ' pb-6'}>
					<EmailInput
						onChange={(e) => setEmail(e.target.value)}
						value={email}
						name={'email'}
						isIcon={false}
						placeholder={'Укажите email'}
					/>
					<div className={styles.buttonContainer + ' pb-20'}>
						<Button
							htmlType='submit'
							type='primary'
							size='medium'>
							Восстановить
						</Button>
					</div>
				</form>
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
