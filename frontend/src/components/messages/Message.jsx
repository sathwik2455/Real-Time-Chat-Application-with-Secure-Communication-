import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";

const Message = ({ message }) => {
	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();
	const fromMe = message.senderId === authUser._id;
	const formattedTime = extractTime(message.createdAt);
	const chatClassName = fromMe ? "chat-end" : "chat-start";
	const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
	const bubbleBgColor = fromMe
		? "bg-gradient-to-br from-cyan-500 to-blue-500 text-white"
		: "bg-slate-900/70 border border-cyan-200/20 text-slate-100";

	const shakeClass = message.shouldShake ? "shake" : "";

	return (
		<div className={`chat ${chatClassName}`}>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<img alt='Tailwind CSS chat bubble component' src={profilePic} />
				</div>
			</div>
			<div className={`chat-bubble ${bubbleBgColor} ${shakeClass} pb-2 shadow-lg`}>{message.message}</div>
			<div className='chat-footer opacity-70 text-sky-100/70 text-xs flex gap-1 items-center'>{formattedTime}</div>
		</div>
	);
};
export default Message;
