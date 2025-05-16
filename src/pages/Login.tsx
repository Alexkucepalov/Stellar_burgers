import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
	EmailInput,
	PasswordInput,
	Button,
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './login.module.scss';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { loginUser } from '@services/actions/authActions';

const Login = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const { user } = useAppSelector((state) => state.auth);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(loginUser({ email, password })).then((action) => {
			if (action.meta.requestStatus === 'fulfilled') {
				const redirectTo = location.state?.from?.pathname || '/';
				navigate(redirectTo); // Перенаправляем на предыдущую страницу или на главную
			}
		});
	};

	return (
		<div>
			<div className={styles.loginContainer + ' pt-6'}>
				<h1 className='text text_type_main-large pb-6'>Вход</h1>
				<form onSubmit={handleSubmit} className={styles.inputContainer + ' pb-6'}>
					<EmailInput
						onChange={(e) => setEmail(e.target.value)}
						value={email}
						name={'email'}
						isIcon={false}
					/>
					<PasswordInput
						onChange={(e) => setPassword(e.target.value)}
						value={password}
						name={'password'}
						extraClass='mb-6'
					/>
					<div className={styles.buttonContainer + ' pb-20'}>
						<Button
							htmlType='submit'
							type='primary'
							size='medium'>
							Войти
						</Button>
					</div>
				</form>
				<div className={styles.links}>
					<p className='text text_type_main-default text_color_inactive pb-4'>
						Вы — новый пользователь?{' '}
						<Link to='/register' className='link'>
							Зарегистрироваться
						</Link>
					</p>
					<p className='text text_type_main-default text_color_inactive'>
						Забыли пароль?{' '}
						<Link to='/forgot-password' className='link'>
							Восстановить пароль
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
