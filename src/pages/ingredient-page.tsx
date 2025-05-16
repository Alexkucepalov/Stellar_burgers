import React from 'react';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import styles from './ingredient-page.module.scss';

const IngredientPage = () => (
	<div className={styles.page}>
		<IngredientDetails />
	</div>
);

export default IngredientPage;
