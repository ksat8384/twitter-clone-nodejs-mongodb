const apiRouter = require("express").Router();
const userController = require("./controllers/userController");
const postController = require("./controllers/postController");
const followController = require("./controllers/followController");
const cors = require("cors");

//It will set the cross origin resource policy for all the routes below this line so, it will be allowed from any domain.
apiRouter.use(cors());

apiRouter.post("/login", userController.apiLogin);
apiRouter.post(
  "/create-post",
  userController.apiMustBeLoggedIn,
  postController.apiCreate
);
apiRouter.delete(
  "/post/:id",
  userController.apiMustBeLoggedIn,
  postController.apiDelete
);
apiRouter.get("/postsByAuthor/:username", userController.apiGetPostsByUsername);

module.exports = apiRouter;
