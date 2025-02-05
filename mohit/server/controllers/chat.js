import Chat from '../models/chat.js';
import User from '../models/user.js';

export const getChatMessages = async (req, res) => {
  try {
    const messages = await Chat.find({ roomId: req.params.roomId }).sort('createdAt');
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserChats = async (req, res) => {
  const userId = req.params.userId;
  try {
    const chats = await Chat.aggregate([
      { $match: { roomId: { $regex: userId } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$roomId',
          lastMessage: { $first: '$message' },
          sender: { $first: '$sender' },
          createdAt: { $first: '$createdAt' }
        }
      }
    ]);

    const chatDetails = await Promise.all(chats.map(async (chat) => {
      const otherUserId = chat._id.replace(userId, '');
      const otherUser = await User.findById(otherUserId);
      return {
        roomId: chat._id,
        lastMessage: chat.lastMessage,
        otherUserName: otherUser ? otherUser.name : 'Unknown'
      };
    }));

    res.status(200).json(chatDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};