
import Header from "./components/ui/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";
import TransactionPage from "./pages/TransactionPage";
import NotFound from "./pages/NotFound";
import { useQuery } from "@apollo/client";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import { GET_AUTHENTICATED_USER } from "./graphql/queries/user.query";

function App() {
	const {loading, data} = useQuery(GET_AUTHENTICATED_USER)
	if (loading) return null;

	return (
		<>
			{data?.authUser && <Header />}
			<Routes>
				<Route path='/' element={data.authUser ? <HomePage /> : <Navigate to='/login' />} />
				<Route path='/login' element={!data.authUser ? <LoginPage /> : <Navigate to='/' />} />
				<Route path='/signup' element={!data.authUser ? <SignUpPage /> : <Navigate to='/' />} />
				<Route
					path='/transaction/:id'
					element={data.authUser ? <TransactionPage /> : <Navigate to='/login' />}
				/>
				<Route path='*' element={<NotFound />} />
			</Routes>
			<Toaster />
		</>
	);
}
export default App;
