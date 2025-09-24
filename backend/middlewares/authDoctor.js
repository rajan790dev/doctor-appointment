import jwt from 'jsonwebtoken';

const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers; 
    // keep as is
    if (!dtoken) {
      return res.status(401).json({ success: false, message: 'Not Authorized. Login Again.' });
    }

    const decoded = jwt.verify(dtoken, process.env.JWT_SECRET);
    if(req.method==='GET')
    {
      req.docId=decoded.id
    }
    if(req.method==='POST')
    {
      req.body.docId= decoded.id
    }
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export default authDoctor;
