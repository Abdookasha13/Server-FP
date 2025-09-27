function authoriz(...role) {
  return (req, res, next) => {
    if (!req.user || !role.includes(req.user.role)) {
      return res.status(403).send("forbidden acces denied");
    }
    next();
  };
}

module.exports = authoriz;
