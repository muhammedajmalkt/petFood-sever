const isAdmin = (req, res, next) => {
  const user = req.user;
  console.log(user);

  if (user && user.role === "admin") {
    next();
  } else {
    res.status(403).json({success: false,message: "Access denied, only admin can access"});
  }
};
module.exports = isAdmin;
