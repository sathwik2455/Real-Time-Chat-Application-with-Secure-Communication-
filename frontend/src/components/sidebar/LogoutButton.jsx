import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";

const LogoutButton = () => {
	const { loading, logout } = useLogout();

	return (
		<div className='mt-auto'>
			{!loading ? (
				<button type='button' onClick={logout} className='frost-chip p-3 text-cyan-100 hover:text-white transition-colors'>
					<BiLogOut className='w-6 h-6 cursor-pointer' />
				</button>
			) : (
				<span className='loading loading-spinner'></span>
			)}
		</div>
	);
};
export default LogoutButton;
