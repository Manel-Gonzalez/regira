const express = require("express"); // Importa la llibreria Express per gestionar les rutes
const router = express.Router(); // Crea un router d'Express
const multer = require("multer"); // Importa la llibreria multer per gestionar peticions de fitxers
const bcrypt = require("bcrypt"); // Importa la llibreria bcrypt per a encriptar contrasenyes
const jwt = require("jsonwebtoken"); // Importa la llibreria jsonwebtoken per a generar i verificar JWT

const SECRET_KEY = "en-pinxo-li-va-dir-a-en-panxo"; // Clau secreta per a la generació de JWT

const {User, Comment, Tag, Project, Issue} = require("./models"); // Importa els models de dades

const {
  createItem,
  updateItem,
  deleteItem,
  readItem,
  readItems,
} = require("./generics"); // Importa les funcions per a realitzar operacions CRUD genèriques

/*
    ██╗          ██████╗      ██████╗     ██╗    ███╗   ██╗            ██╗         █████╗ ██╗   ██╗████████╗██╗  ██╗
    ██║         ██╔═══██╗    ██╔════╝     ██║    ████╗  ██║           ██╔╝        ██╔══██╗██║   ██║╚══██╔══╝██║  ██║
    ██║         ██║   ██║    ██║  ███╗    ██║    ██╔██╗ ██║          ██╔╝         ███████║██║   ██║   ██║   ███████║
    ██║         ██║   ██║    ██║   ██║    ██║    ██║╚██╗██║         ██╔╝          ██╔══██║██║   ██║   ██║   ██╔══██║
    ███████╗    ╚██████╔╝    ╚██████╔╝    ██║    ██║ ╚████║        ██╔╝           ██║  ██║╚██████╔╝   ██║   ██║  ██║
    ╚══════╝     ╚═════╝      ╚═════╝     ╚═╝    ╚═╝  ╚═══╝        ╚═╝            ╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝
*/

const checkToken = (req, res, next) => {
  const token = req.cookies?.token; // Obté el token des de la cookie de la petició
  if (!token) {
    return res.status(401).json({error: "Unauthorized"}); // Retorna error 401 si no hi ha cap token
  }

  try {
    const decodedToken = jwt.verify(token, SECRET_KEY); // Verifica el token utilitzant la clau secreta
    req.userId = decodedToken.userId; // Estableix l'ID d'usuari a l'objecte de la petició
    next(); // Passa al següent middleware
  } catch (error) {
    return res.status(401).json({error: "Invalid token"}); // Retorna error 401 si el token és invàlid
  }
};

// REFRESH verifica si token és vàlid
router.get("/refresh", checkToken, async (req, res) => {
  const user = await User.findByPk(req.userId); // Cerca l'usuari pel seu email
  if (!user) {
    return res.status(404).json({error: "User no trobat"}); // Retorna error 404 si l'usuari no es troba
  }
  return res.json({id: user.id, name: user.name});
});

// Endpoint per iniciar sessió d'un usuari
router.post("/login", async (req, res) => {
  const {email, password} = req.body; // Obté l'email i la contrasenya de la petició
  try {
    const user = await User.findOne({where: {email}}); // Cerca l'usuari pel seu email
    if (!user) {
      return res.status(404).json({error: "User no trobat"}); // Retorna error 404 si l'usuari no es troba
    }
    const passwordMatch = await bcrypt.compare(password, user.password); // Compara la contrasenya proporcionada amb la contrasenya encriptada de l'usuari
    if (!passwordMatch) {
      return res.status(401).json({error: "Password incorrecte"}); // Retorna error 401 si la contrasenya és incorrecta
    }
    const token = jwt.sign({userId: user.id, userName: user.name}, SECRET_KEY, {
      expiresIn: "2h",
    }); // Genera un token JWT vàlid durant 2 hores
    res.cookie("token", token, {httpOnly: false, maxAge: 7200000}); // Estableix el token com una cookie
    res.json({name: user.name, id: user.id}); // Retorna missatge d'èxit
  } catch (error) {
    res.status(500).json({error: error.message}); // Retorna error 500 amb el missatge d'error
  }
});

// Endpoint per registrar un usuari
router.post("/register", async (req, res) => {
  try {
    const {name, email, password} = req.body; // Obté el nom, email i contrasenya de la petició
    if (!name || !email || !password) {
      return res.status(400).json({error: "Name, email, i password requerits"}); // Retorna error 400 si no es proporcionen el nom, email o contrasenya
    }
    const existingUser = await User.findOne({where: {email}}); // Comprova si l'email ja està registrat
    if (existingUser) {
      return res.status(400).json({error: "Email ja existeix"}); // Retorna error 400 si l'email ja està registrat
    }
    const user = await User.create({name, email, password}); // Crea l'usuari amb les dades proporcionades
    res.status(201).json(user); // Retorna l'usuari creat amb el codi d'estat 201 (Creat)
  } catch (error) {
    res.status(500).json({error: error.message}); // Retorna error 500 amb el missatge d'error
  }
});

/*
██╗   ██╗    ███████╗    ███████╗    ██████╗     ███████╗
██║   ██║    ██╔════╝    ██╔════╝    ██╔══██╗    ██╔════╝
██║   ██║    ███████╗    █████╗      ██████╔╝    ███████╗
██║   ██║    ╚════██║    ██╔══╝      ██╔══██╗    ╚════██║
╚██████╔╝    ███████║    ███████╗    ██║  ██║    ███████║
 ╚═════╝     ╚══════╝    ╚══════╝    ╚═╝  ╚═╝    ╚══════╝                                  
*/
// Operacions CRUD per als Usuaris
// Llegeix tots els usuaris
router.get("/users", async (req, res) => await readItems(req, res, User));
// Llegeix un usuari específic
router.get("/users/:id", async (req, res) => await readItem(req, res, User));
// Actualitza un usuari
router.put("/users/:id", async (req, res) => await updateItem(req, res, User));
// Elimina un usuari
router.delete(
  "/users/:id",
  async (req, res) => await deleteItem(req, res, User)
);
//endpoint per obtenir les tasques de un user
router.get("/users/:userId/issues", checkToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId); // Cerca l'usuari pel seu ID

    if (!user) {
      return res.status(404).json({error: "User no trobats"});
    }
    req.body.userId = req.userId; // Estableix l'ID de l'usuari en el cos de la petició

    const issues = await user.getIssues();
    res.json(issues); // Retorna missatge d'èxit
  } catch (error) {
    res.status(500).json({error: error.message}); // Retorna error 500 amb el missatge d'error
  }
});

// Operacions CRUD per a les Etiquetes
router.post("/tags", async (req, res) => await createItem(req, res, Tag)); // Crea una etiqueta
router.get("/tags", async (req, res) => await readItems(req, res, Tag)); // Llegeix totes les etiquetes
router.get("/tags/:id", async (req, res) => await readItem(req, res, Tag)); // Llegeix una etiqueta específica
router.put("/tags/:id", async (req, res) => await updateItem(req, res, Tag)); // Actualitza una etiqueta
router.delete("/tags/:id", async (req, res) => await deleteItem(req, res, Tag)); // Elimina una etiqueta

/*
██████╗     ██████╗      ██████╗          ██╗    ███████╗     ██████╗    ████████╗    ███████╗
██╔══██╗    ██╔══██╗    ██╔═══██╗         ██║    ██╔════╝    ██╔════╝    ╚══██╔══╝    ██╔════╝
██████╔╝    ██████╔╝    ██║   ██║         ██║    █████╗      ██║            ██║       ███████╗
██╔═══╝     ██╔══██╗    ██║   ██║    ██   ██║    ██╔══╝      ██║            ██║       ╚════██║
██║         ██║  ██║    ╚██████╔╝    ╚█████╔╝    ███████╗    ╚██████╗       ██║       ███████║
╚═╝         ╚═╝  ╚═╝     ╚═════╝      ╚════╝     ╚══════╝     ╚═════╝       ╚═╝       ╚══════╝                                                                                                                                      
*/

/* router.post("/projects", async (req, res) => await createItem(req, res, Project)); */

// Llegeix tots els projectes
router.get("/projects", async (req, res) => await readItems(req, res, Project));
// Llegeix un Project específic
router.get(
  "/projects/:id",
  async (req, res) => await readItem(req, res, Project)
);
// Actualitza un Project
router.put(
  "/projects/:id",
  async (req, res) => await updateItem(req, res, Project)
);
// Elimina un Project, issues i comments relacionats s'haurien d'eliminar en cascada tal com descriu el model
router.delete(
  "/projects/:id",
  async (req, res) => await deleteItem(req, res, Project)
);
//Endpoint per crear un projecte
router.post("/projects", checkToken, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId); // Cerca l'usuari pel seu ID
    if (!user) {
      return res.status(500).json({error: "User no trobat"}); // Retorna error 500 si no es troba l'usuari
    }

    /*      req.body.userId = req.userId;// Estableix l'ID de l'usuari en el cos de la petició*/
    console.log("USERID", req.userId);
    const {name, active} = req.body; // Obté el nom, email i contrasenya de la petició
    if (!name || !active) {
      return res.status(400).json({error: "nom i actiu necesari"}); // Retorna error 400 si no es proporcionen el nom, email o contrasenya
    }
    const item = await user.createProject(req.body); // Crea un nou project amb les dades rebudes
    res.status(201).json(item); // Retorna l'objecte del project creat amb el codi d'estat 201 (Creat)
  } catch (error) {
    res.status(500).json({error: error.message}); // Retorna error 500 amb el missatge d'error
  }
});

/*
██╗    ███████╗    ███████╗    ██╗   ██╗    ███████╗    ███████╗
██║    ██╔════╝    ██╔════╝    ██║   ██║    ██╔════╝    ██╔════╝
██║    ███████╗    ███████╗    ██║   ██║    █████╗      ███████╗
██║    ╚════██║    ╚════██║    ██║   ██║    ██╔══╝      ╚════██║
██║    ███████║    ███████║    ╚██████╔╝    ███████╗    ███████║
╚═╝    ╚══════╝    ╚══════╝     ╚═════╝     ╚══════╝    ╚══════╝
*/

// Operacions CRUD per les issues
router.get(
  "/issues",
  checkToken,
  async (req, res) => await readItems(req, res, Issue)
); // Llegeix tots els issues
router.get("/issues/:id", async (req, res) => await readItem(req, res, Issue)); // Llegeix un issues específic
router.delete(
  "/issues/:id",
  async (req, res) => await deleteItem(req, res, Issue)
); // Elimina un issues

// Endpoint per crear una issue
router.post("/issues", checkToken, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId); // Cerca l'usuari pel seu ID
    const projecte = await Project.findByPk(req.body.projectId); // Cerca el projecte pel seu ID
    if (!user) {
      return res.status(500).json({error: "User no trobat"}); // Retorna error 500 si no es troba l'usuari
    }
    if (!projecte) {
      return res.status(404).json({error: "Projecte no trobat"}); // Retorna error 404 si el projecte no es troba
    }

    req.body.authorId = req.userId; // Estableix l'ID de l'usuari en el cos de la petició

    const {title, issue_type, priority, state, projectId, authorId} = req.body; // Obté el nom, email i contrasenya de la petició
    if (
      !title ||
      !issue_type ||
      !priority ||
      !state ||
      !projectId ||
      !authorId
    ) {
      return res
        .status(400)
        .json({error: "title, issueType, priority state requerits"}); // Retorna error 400 si no es proporcionen el nom, email o contrasenya
    }

    const item = await projecte.createIssue(req.body); // Crea un nou issue amb les dades rebudes
    res.status(201).json(item); // Retorna l'objecte del issue creat amb el codi d'estat 201 (Creat)
  } catch (error) {
    res.status(500).json({error: error.message}); // Retorna error 500 amb el missatge d'error
  }
});

//Endpoint per vincular una issue a un user
router.post("/issues/:issueId/users/:userId", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    const issue = await Issue.findByPk(req.params.issueId);
    if (!user || !issue) {
      return res.status(404).json({error: "Issue o User no trobats"});
    }
    await user.addIssue(issue);
    res.json({message: "Issue actualitzat"}); // Retorna missatge d'èxit
  } catch (error) {
    res.status(500).json({error: error.message}); // Retorna error 500 amb el missatge d'error
  }
});

//endpoint per modificar una issue
router.put("/issues/:issueId", async (req, res) => {
  try {
    const existingIssue = await Issue.findByPk(req.params.issueId);

    if (!existingIssue) {
      return res
        .status(404)
        .json({error: "No s'ha trobat cap issue amb aquest ID"});
    }

    console.log("BODY", req.body);
    // Actualitzem només les propietats que es reben al body
    if (req.body.title) {
      existingIssue.title = req.body.title;
    }
    if (req.body.desc) {
      existingIssue.desc = req.body.desc;
    }
    if (req.body.issue_type) {
      existingIssue.issue_type = req.body.issue_type;
    }
    if (req.body.priority) {
      existingIssue.priority = req.body.priority;
    }
    if (req.body.state) {
      existingIssue.state = req.body.state;
    }

    // Guardem els canvis
    await existingIssue.save();

    return res.status(200).json({message: "Issue actualitzada"});
  } catch (error) {
    return res
      .status(500)
      .json({error: `Error actualitzant la issue "{id_issue}`});
  }
});

//endpoint per obtenir les tasques de un projecte
router.get("/projects/:projectId/issues", checkToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId); // Cerca l'usuari pel seu ID
    const project = await Project.findByPk(req.params.projectId);
    if (!user) {
      return res.status(500).json({error: "User no trobat"}); // Retorna error 500 si no es troba l'usuari
    }

    req.body.userId = req.userId; // Estableix l'ID de l'usuari en el cos de la petició

    if (!project) {
      return res.status(404).json({error: "Projecte no trobats"});
    }
    const issues = await project.getIssues();
    res.json(issues); // Retorna missatge d'èxit
  } catch (error) {
    res.status(500).json({error: error.message}); // Retorna error 500 amb el missatge d'error
  }
});

/*
 ██████╗     ██████╗     ███╗   ███╗    ███╗   ███╗    ███████╗    ███╗   ██╗    ████████╗    ███████╗
██╔════╝    ██╔═══██╗    ████╗ ████║    ████╗ ████║    ██╔════╝    ████╗  ██║    ╚══██╔══╝    ██╔════╝
██║         ██║   ██║    ██╔████╔██║    ██╔████╔██║    █████╗      ██╔██╗ ██║       ██║       ███████╗
██║         ██║   ██║    ██║╚██╔╝██║    ██║╚██╔╝██║    ██╔══╝      ██║╚██╗██║       ██║       ╚════██║
╚██████╗    ╚██████╔╝    ██║ ╚═╝ ██║    ██║ ╚═╝ ██║    ███████╗    ██║ ╚████║       ██║       ███████║
 ╚═════╝     ╚═════╝     ╚═╝     ╚═╝    ╚═╝     ╚═╝    ╚══════╝    ╚═╝  ╚═══╝       ╚═╝       ╚══════╝                                                                                                
*/

//Endpoint per obtenir tots els comentaris
router.get(
  "/comments",
  checkToken,
  async (req, res) => await readItems(req, res, Comment)
);
// Endpoint per obtenir tots els comentaris d'una issue
router.get("/comments/issues/:issueId", checkToken, async (req, res) => {
  try {
    const issue = await Issue.findByPk(req.params.issueId);
    const user = await User.findByPk(req.userId); // Cerca l'usuari pel seu ID
    if (!user) {
      return res.status(500).json({error: "User no trobat"}); // Retorna error 500 si no es troba l'usuari
    }
    if (!issue) {
      return res.status(404).json({error: "issue no trobat"}); // Retorna error 404 si el issue no es troba
    }

    const comments = await issue.getComments(); // Obté totes els comments del issue
    res.json(comments); // Retorna les comments
  } catch (error) {
    res.status(500).json({error: error.message}); // Retorna error 500 amb el missatge d'error
  }
});

// Endpoint per crear un comentari
router.post("/comments/issues/:issueId", checkToken, async (req, res) => {
  try {
    const issue = await Issue.findByPk(req.params.issueId);
    const user = await User.findByPk(req.userId); // Cerca l'usuari pel seu ID
    if (!user) {
      return res.status(500).json({error: "User no trobat"}); // Retorna error 500 si no es troba l'usuari
    }

    req.body.userId = req.userId; // Estableix l'ID de l'usuari en el cos de la petició

    const {title, comment} = req.body;
    if (!title || !comment) {
      return res.status(400).json({error: "title, comment son requerits"}); // Retorna error 400 si no es proporcionen el nom, email o contrasenya
    }
    if (!issue) {
      return res.status(404).json({error: "Issue no trobats"}); // Retorna error 404 si el bolet o l'etiqueta no es troben
    }
    const item = await issue.createComment(req.body); // Crea un nou issue amb les dades rebudes
    res.status(201).json(item); // Retorna l'objecte del issue creat amb el codi d'estat 201 (Creat)
  } catch (error) {
    res.status(500).json({error: error.message}); // Retorna error 500 amb el missatge d'error
  }
});

/* 
████████╗ █████╗  ██████╗ ███████╗
╚══██╔══╝██╔══██╗██╔════╝ ██╔════╝
   ██║   ███████║██║  ███╗███████╗
   ██║   ██╔══██║██║   ██║╚════██║
   ██║   ██║  ██║╚██████╔╝███████║
   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝                         
*/

// Endpoint per vincular una etiqueta a un issue
router.post("/issues/:issueId/tags/:tagId", checkToken, async (req, res) => {
  try {
    const issue = await Issue.findByPk(req.params.issueId); // Cerca el bolet pel seu ID
    const tag = await Tag.findByPk(req.params.tagId); // Cerca l'etiqueta pel seu ID

    const user = await User.findByPk(req.userId); // Cerca l'usuari pel seu ID
    if (!user) {
      return res.status(500).json({error: "User no trobat"}); // Retorna error 500 si no es troba l'usuari
    }

    req.body.userId = req.userId; // Estableix l'ID de l'usuari en el cos de la petició
    if (!issue || !tag) {
      return res.status(404).json({error: "Bolet o Tag no trobats"}); // Retorna error 404 si el bolet o l'etiqueta no es troben
    }
    await issue.addTag(tag); // Afegeix l'etiqueta al bolet
    res.json({message: "Tag linkat"}); // Retorna missatge d'èxit
  } catch (error) {
    res.status(500).json({error: error.message}); // Retorna error 500 amb el missatge d'error
  }
});

// Endpoint per obtenir totes les etiquetes per a una issue
router.get("/issues/:issueId/tags", async (req, res) => {
  try {
    const issue = await Issue.findByPk(req.params.issueId); // Cerca el issue pel seu ID
    if (!issue) {
      return res.status(404).json({error: "issue no trobat"}); // Retorna error 404 si el issue no es troba
    }
    const tags = await issue.getTags(); // Obté totes les etiquetes associades al issue
    res.json(tags); // Retorna les etiquetes
  } catch (error) {
    res.status(500).json({error: error.message}); // Retorna error 500 amb el missatge d'error
  }
});

// Endpoint per obtenir els issues per a una etiqueta
router.get("/tags/:tagId/issues", async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.tagId, {include: Issue}); // Cerca l'etiqueta pel seu ID, incloent els issues associats
    if (!tag) {
      return res.status(404).json({error: "Tag no trobat"}); // Retorna error 404 si l'etiqueta no es troba
    }
    res.json(tag.issues); // Retorna els issues associats a l'etiqueta
  } catch (error) {
    res.status(500).json({error: error.message}); // Retorna error 500 amb el missatge d'error
  }
});

module.exports = router; // Exporta el router amb les rutes definides

// Configuració de multer per gestionar la pujada de fitxers
/* const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../regira_front/public/img') // Especifica la carpeta de destinació dels fitxers pujats
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`) // Assigna un nom únic als fitxers pujats
    }
  })
  
  const upload = multer({ storage: storage }).single('foto'); // Configura multer per a gestionar la pujada d'un únic fitxer amb el camp 'foto'
   */
