const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const bcrypt = require('bcrypt');

const handleLogin = async (req, res) => {
    const { user, password } = req.body;

    if (!user || !password) return re.status(400).json({ 'message': 'Username and password are required' });

    const foundUser = usersDB.users.find(person => person.username === user);
    if (!foundUser) return res.sendStatus(401);     //Unauthorized

    //evaluate password
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        //here we create JWT's
        res.json({ 'success': `User ${user} is logged in ` });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };