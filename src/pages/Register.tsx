import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	EmailInput,
	PasswordInput,
	Button,
	Input,
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './login.module.scss';
import { useAppDispatch } from '@services/hooks';
import { registerUser } from '@services/actions/authActions';

const Register = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(registerUser({ email, password, name })).then((action) => {
			if (action.meta.requestStatus === 'fulfilled') {
				navigate('/login');
			}
		});
	};

	return (
		<div>
			<div className={styles.loginContainer + ' pt-6'}>
				<h1 className='text text_type_main-large pb-6'>Регистрация</h1>
				<form onSubmit={handleSubmit} className={styles.inputContainer + ' pb-6'}>
					<Input
						type={'text'}
						placeholder={'Имя'}
						onChange={(e) => setName(e.target.value)}
						value={name}
						name={'name'}
						error={false}
						errorText={'Ошибка'}
						size={'default'}
					/>
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
					/>
					<div className={styles.buttonContainer + ' pb-20'}>
						<Button
							htmlType='submit'
							type='primary'
							size='medium'>
							Зарегистрироваться
						</Button>
					</div>
				</form>
				<div className={styles.links}>
					<p className='text text_type_main-default text_color_inactive pb-4'>
						Уже зарегестрированы?{' '}
						<Link to='/login' className='link'>
							Войти
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Register;
