import Conversation from '../models/conversation.model.js';

export const getConversationForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		// Tìm tất cả các cuộc trò chuyện mà userId là một trong những người tham gia
		const conversations = await Conversation.find({
			participants: loggedInUserId,
		})
			.populate({
				path: 'participants',
				select: 'fullName username profilePic',
				model: 'User',
			})
			.populate({
				path: 'messages',
				populate: {
					path: 'senderId receiverId',
					select: 'fullName username profilePic',
					model: 'User',
				},
			});

		// Chuyển đổi participants thành receiverProfile, loại bỏ participants khỏi kết quả
		const result = conversations.map((conversation) => {
			const filteredParticipants = conversation.participants
				.map((participant) => ({
					_id: participant._id,
					fullName: participant.fullName,
					username: participant.username,
					profilePic: participant.profilePic,
				}))
				.filter(
					(participant) =>
						participant._id.toString() !== loggedInUserId.toString()
				); // Loại bỏ thông tin của userId

			return {
				...conversation.toObject(),
				receiverProfile: filteredParticipants,
				// Xóa participants khỏi kết quả
				participants: undefined,
			};
		});

		const formatResult = result.map((item) => ({
			_id: item.receiverProfile[0]._id,
			conversation_id: item._id,
			lastMessage: item.messages[item.messages.length - 1] ?? [],
			fullName: item.receiverProfile[0].fullName,
			username: item.receiverProfile[0].username,
			profilePic: item.receiverProfile[0].profilePic,
			isDelete: item.isDelete,
			isStar: item.isStar
		}));
		res.status(200).json(formatResult);
	} catch (error) {
		console.error('Error in getUsersForSidebar: ', error.message);
		res.status(500).json({ error: 'Internal server error' });
	}
};

export const deleteConversation = async (req, res) => {
	try {
		const { id } = req.params; // ID của cuộc trò chuyện từ URL
		// Xóa cuộc trò chuyện với ID tương ứng
		const conversation = await Conversation.updateOne(
			{ _id: id },
			{ isDelete: true }
		);

		// Nếu không tìm thấy cuộc trò chuyện, trả về lỗi
		if (!conversation) {
			return res.status(404).json({ message: 'Product not found' });
		}

		// Trả về thông báo thành công
		res.status(200).json({ message: 'Conversation deleted successfully' });
	} catch (error) {
		console.error('Error deleting conversation:', error);
		res.status(500).json({ error: 'Server error' });
	}
};

export const recoverConversation = async (req, res) => {
	try {
		const { id } = req.params; // ID của cuộc trò chuyện từ URL
		// Xóa cuộc trò chuyện với ID tương ứng
		const conversation = await Conversation.updateOne(
			{ _id: id },
			{ isDelete: false }
		);

		// Nếu không tìm thấy cuộc trò chuyện, trả về lỗi
		if (!conversation) {
			return res.status(404).json({ message: 'Product not found' });
		}

		// Trả về thông báo thành công
		res.status(200).json({ message: 'Conversation recovered successfully' });
	} catch (error) {
		console.error('Error deleting conversation:', error);
		res.status(500).json({ error: 'Server error' });
	}
};

export const starConversation = async (req, res) => {
	try {
		const { id } = req.params; // ID của cuộc trò chuyện từ URL
		// Xóa cuộc trò chuyện với ID tương ứng
		const conversation = await Conversation.updateOne(
			{ _id: id },
			{ isStar: true }
		);

		// Nếu không tìm thấy cuộc trò chuyện, trả về lỗi
		if (!conversation) {
			return res.status(404).json({ message: 'Product not found' });
		}

		// Trả về thông báo thành công
		res.status(200).json({ message: 'Conversation deleted successfully' });
	} catch (error) {
		console.error('Error deleting conversation:', error);
		res.status(500).json({ error: 'Server error' });
	}
};

export const unstarConversation = async (req, res) => {
	try {
		const { id } = req.params; // ID của cuộc trò chuyện từ URL
		// Xóa cuộc trò chuyện với ID tương ứng
		const conversation = await Conversation.updateOne(
			{ _id: id },
			{ isStar: false }
		);

		// Nếu không tìm thấy cuộc trò chuyện, trả về lỗi
		if (!conversation) {
			return res.status(404).json({ message: 'Product not found' });
		}

		// Trả về thông báo thành công
		res.status(200).json({ message: 'Conversation deleted successfully' });
	} catch (error) {
		console.error('Error deleting conversation:', error);
		res.status(500).json({ error: 'Server error' });
	}
};
