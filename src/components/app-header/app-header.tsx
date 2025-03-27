import { Logo } from '@ya.praktikum/react-developer-burger-ui-components';
import { Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { BurgerIcon, ProfileIcon, ListIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import s from './app-header.module.scss';
import { useState } from 'react';

export const AppHeader = () => {
    const [activeButton, setActiveButton] = useState('constructor');

    return (
        <header className={s.header}>
            <nav className={s.nav}>
                <div className={s.left}>
                    <div className={s.buttonContainer}>
                        <Button
                            type="secondary"
                            htmlType="button"
                            className={`${s.button} ${activeButton === 'constructor' ? s.active : ''}`}
                            onClick={() => setActiveButton('constructor')}
                        >
                            <BurgerIcon type={activeButton === 'constructor' ? 'primary' : 'secondary'} />
                            <span className="pl-2">Конструктор</span>
                        </Button>
                        <Button
                            type="secondary"
                            htmlType="button"
                            className={`${s.button} ${activeButton === 'orders' ? s.active : ''}`}
                            onClick={() => setActiveButton('orders')}
                        >
                            <ListIcon type={activeButton === 'orders' ? 'primary' : 'secondary'} />
                            <span className="pl-2">Лента заказов</span>
                        </Button>
                    </div>
                </div>
                <div className={s.logo}>
                    <Logo />
                </div>
                <div className={s.right}>
                    <Button
                        type="secondary"
                        htmlType="button"
                        className={`${s.button} ${activeButton === 'profile' ? s.active : ''}`}
                        onClick={() => setActiveButton('profile')}
                    >
                        <ProfileIcon type={activeButton === 'profile' ? 'primary' : 'secondary'} />
                        <span className="pl-2">Личный кабинет</span>
                    </Button>
                </div>
            </nav>
        </header>
    );
};
