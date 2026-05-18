const adminAuth = (req, res, next) => {
  console.log("Admin Auth Middleware");
  const token = "xyzabc";
  const isAdminAuthorized = token === "xyz";

  if(!isAdminAuthorized) {
    res.status(401).send("Unauthorized request");
  } else {
    next();
  }
}

const userAuth = (req, res, next) => {
  console.log("User Auth Middleware");
  const token = "xyzabc";
  const isUserAuthorized = token === "xyz";

  if(!isUserAuthorized) {
    res.status(401).send("Unauthorized request");
  } else {
    next();
  }
}

module.exports = {
  adminAuth,
  userAuth
}