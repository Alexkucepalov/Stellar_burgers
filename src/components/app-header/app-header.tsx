import { Logo } from '@ya.praktikum/react-developer-burger-ui-components';
import { Button } from '@ya.praktikum/react-developer-burger-ui-components';
import {
	BurgerIcon,
	ProfileIcon,
	ListIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import s from './app-header.module.scss';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export const AppHeader = () => {
	const [activeButton, setActiveButton] = useState('constructor');
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const path = location.pathname;
		if (path === '/') {
			setActiveButton('constructor');
		} else if (path === '/feed') {
			setActiveButton('orders');
		} else if (path.startsWith('/profile')) {
			setActiveButton('profile');
		}
	}, [location.pathname]);

	const handleNavigation = (path: string, button: string) => {
		setActiveButton(button);
		navigate(path);
	};

	return (
		<header className={s.header}>
			<nav className={s.nav}>
				<div className={s.left}>
					<div className={s.buttonContainer}>
						<Button
							type='secondary'
							htmlType='button'
							className={`${s.button} ${
								activeButton === 'constructor' ? s.active : ''
							}`}
							onClick={() => handleNavigation('/', 'constructor')}>
							<BurgerIcon
								type={activeButton === 'constructor' ? 'primary' : 'secondary'}
							/>
							<span className='pl-2'>Конструктор</span>
						</Button>
						<Button
							type='secondary'
							htmlType='button'
							className={`${s.button} ${
								activeButton === 'orders' ? s.active : ''
							}`}
							onClick={() => handleNavigation('/feed', 'orders')}>
							<ListIcon
								type={activeButton === 'orders' ? 'primary' : 'secondary'}
							/>
							<span className='pl-2'>Лента заказов</span>
						</Button>
					</div>
				</div>
				<div className={s.logo}>
					<Link to='/'>
						<Logo />
					</Link>
				</div>
				<div className={s.right}>
					<Button
						type='secondary'
						htmlType='button'
						className={`${s.button} ${
							activeButton === 'profile' ? s.active : ''
						}`}
						onClick={() => handleNavigation('/profile', 'profile')}>
						<ProfileIcon
							type={activeButton === 'profile' ? 'primary' : 'secondary'}
						/>
						<span className='pl-2'>Личный кабинет</span>
					</Button>
				</div>
			</nav>
		</header>
	);
};
