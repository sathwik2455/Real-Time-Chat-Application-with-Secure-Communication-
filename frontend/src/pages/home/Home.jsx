import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";

const Home = () => {
	return (
		<div className='frost-panel frost-chat-layout flex'>
			<Sidebar />
			<MessageContainer />
		</div>
	);
};
export default Home;
