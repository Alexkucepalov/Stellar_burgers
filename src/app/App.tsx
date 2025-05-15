import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AppHeader } from '@components/app-header/app-header';
import Home from '@pages/Home';
import Login from '@pages/Login';
import Register from '@pages/Register';
import ForgotPassword from '@pages/forgot-password';
import ResetPassword from '@pages/reset-password';
import Profile from '@pages/profile';
import ProtectedRouteElement from '@components/protected-route/protected-route';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import IngredientPage from '@pages/ingredient-page';
import { Modal } from '@components/modal/modal';
import { useLocation } from 'react-router-dom';

const App = () => {
	const location = useLocation();
	const background = location.state && location.state.background;
	const navigate = useNavigate();

	return (
		<>
			<Routes location={background || location}>
				<Route path='/' element={<Home />} />
				<Route
					path='/login'
					element={
						<ProtectedRouteElement onlyForUnauth>
							<Login />
						</ProtectedRouteElement>
					}
				/>
				<Route
					path='/register'
					element={
						<ProtectedRouteElement onlyForUnauth>
							<Register />
						</ProtectedRouteElement>
					}
				/>
				<Route
					path='/forgot-password'
					element={
						<ProtectedRouteElement onlyForUnauth>
							<ForgotPassword />
						</ProtectedRouteElement>
					}
				/>
				<Route
					path='/reset-password'
					element={
						<ProtectedRouteElement onlyForUnauth>
							<ResetPassword />
						</ProtectedRouteElement>
					}
				/>

				<Route
					path='/profile/*'
					element={
						<ProtectedRouteElement onlyForAuth>
							<Profile />
						</ProtectedRouteElement>
					}
				/>

				<Route path='/ingredients/:id' element={<IngredientPage />} />
			</Routes>

			{background && (
				<Routes>
					<Route
						path='/ingredients/:id'
						element={
							<Modal onClose={() => navigate(-1)}>
								<IngredientDetails />
							</Modal>
						}
					/>
				</Routes>
			)}
		</>
	);
};

export default App;
