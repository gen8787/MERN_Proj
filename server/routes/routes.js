const controller = require('../controllers/controller');

module.exports = app => {
//==   C R E A T E   ==||
    app.post("/api/create", controller.create);

//==   R E A D   ==||
    app.get("/api/all", controller.all);
    app.get("/api/:id", controller.one);

//==   U P D A T E   ==||
    app.put("/api/:id/update", controller.update);
    app.put("/api/:id/add-nested", controller.addNested);
    app.put("api/:id/:rId/update-nested", controller.updateNested)
    app.put("api/:id/:rId/delete-nested", controller.deleteNested)

//==   D E L E T E   ==||
    app.delete("/api/:id/delete", controller.delete);
}