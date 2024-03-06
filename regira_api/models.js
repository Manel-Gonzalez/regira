const Sequelize = require('sequelize'); // Importa la llibreria Sequelize

const bcrypt = require('bcrypt'); // Importa la llibreria bcrypt per a encriptar contrasenyes

const sequelize = new Sequelize('regira', 'root', 'admin', {
  //host: 'localhost',
  host: 'localhost', //IP de la base de dades
  port: 3306,
  dialect: 'mysql' // connectem a mysql
});

const Project = sequelize.define('project',{
    name : {
        type: Sequelize.STRING,
        allowNull:false
    },
    desc : {
        type: Sequelize.STRING,
        allowNull:true
    },
    active : {
        type: Sequelize.TINYINT,
        allowNull:false
    },
})

const Tag = sequelize.define('tag',{
    name : {
        type:Sequelize.STRING,
        allowNull:false
    }
})

const Issue = sequelize.define('issue', {
    title : {
        type: Sequelize.STRING,
        allowNull:false
    },
    desc : {
        type: Sequelize.STRING,
        allowNull:true
    },
    issue_type : {
        type: Sequelize.ENUM('story', 'bugs', 'general'),
        allowNull:false
    },
    priority : {
        type: Sequelize.ENUM('High', 'Medium', 'Low'),
        allowNull:false
    },
    state : {
        type: Sequelize.ENUM('backlog', 'ready', 'in_progress', 'review', 'testing', 'done'),
        allowNull:false
    },

})

const Comment  = sequelize.define('comment',{
    title : {
        type: Sequelize.STRING,
        allowNull:false
    },
    comment : {
        type: Sequelize.STRING,
        allowNull:false
    }
    
})

const User = sequelize.define('user', {
    email :{
        type: Sequelize.STRING,
        allowNull:false
    },
    name :{
        type: Sequelize.STRING,
        allowNull:false
    },
    password:{
        type : Sequelize.STRING,
        allowNull:false
    }
})

/* async function iniDB() {
  await sequelize.sync({ force: true });

}

iniDB(); 
 */
User.beforeCreate(async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10); // Encripta la contrasenya amb bcrypt
    user.password = hashedPassword;
});

User.hasMany(Project);
Project.belongsTo(User);

User.hasMany(Issue)
Issue.belongsTo(User)
Issue.belongsTo(User,{as:"author"})

Project.hasMany(Issue)
Issue.belongsTo(Project)

Comment.belongsTo(User)
User.hasMany(Comment)

Comment.belongsTo(Issue)
Issue.hasMany(Comment)


Tag.belongsToMany(Issue,{through:"tagissues"})
Issue.belongsToMany(Tag,{through:"tagissues"})



module.exports = {
User,
Comment,
Issue,
Tag,
Project

};