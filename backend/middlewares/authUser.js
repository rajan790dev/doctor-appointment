import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers; // keep as is
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not Authorized. Login Again.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export default authUser;
