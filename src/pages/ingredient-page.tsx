import React from 'react';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import styles from './ingredient-page.module.scss';
import { AppHeader } from '@components/app-header/app-header';

const IngredientPage = () => (
	<div>
		<AppHeader />
		<div className={styles.page}>
			<IngredientDetails />
		</div>
	</div>
);

export default IngredientPage;

