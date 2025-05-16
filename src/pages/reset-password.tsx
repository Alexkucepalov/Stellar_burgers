import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	EmailInput,
	PasswordInput,
	Button,
	Input,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { setNewPassword } from '@utils/api';
import styles from './login.module.scss';

const ResetPassword = () => {
	const [password, setPassword] = useState('');
	const [token, setToken] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		if (!localStorage.getItem('resetPasswordAllowed')) {
			navigate('/forgot-password');
		}
	}, [navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await setNewPassword(password, token);
			localStorage.removeItem('resetPasswordAllowed');
			navigate('/login');
		} catch (error) {
			console.error('Ошибка при сбросе пароля:', error);
		}
	};

	return (
		<div>
			<div className={styles.loginContainer + ' pt-6'}>
				<h1 className='text text_type_main-large pb-6'>
					Восстановление пароля
				</h1>
				<form onSubmit={handleSubmit} className={styles.inputContainer + ' pb-6'}>
					<PasswordInput
						placeholder={'Введите новый пароль'}
						onChange={(e) => setPassword(e.target.value)}
						value={password}
						name={'password'}
					/>
					<Input
						type={'text'}
						placeholder={'Введите код из письма'}
						onChange={(e) => setToken(e.target.value)}
						value={token}
						name={'name'}
						error={false}
						errorText={'Ошибка'}
						size={'default'}
					/>
					<div className='pb-20'>
						<Button
							htmlType='submit'
							type='primary'
							size='medium'>
							Сохранить
						</Button>
					</div>
				</form>
				<div className={styles.links}>
					<p className='text text_type_main-default text_color_inactive pb-4'>
						Вспомнили пароль?{' '}
						<Link to='/login' className='link'>
							Войти
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default ResetPassword;
