const { Op } = require('sequelize');
const User  = require('./models/user' );
const { validateUser } = require('./utils/validator');
const Post = require('./models/post');


// Get all users


// exports.getAllUsers = async (req, res) => {
//   try {
    

//     let {sortBy='', search='',p=1,perPage=1} = req.query
    
//     let options = {}

//     options.limit = perPage;
//     options.offset = (p - 1) * perPage;


//     if (sortBy) {
//       let ordersForSorting = sortBy.split(',').map(option => {
//           const [key, value] = option.split(':');
//           return [key.trim(), value.trim().toUpperCase()];
//       });
//       options.order = ordersForSorting;
//     }


//     if (search) {
//       options.where = {
//         [Op.or]: [
//           { firstname: { [Op.substring]: search } },
//           { lastname: { [Op.substring]: search } },
//           { email: { [Op.substring]: search } }
//         ]
//       };
//     }


//     const users = await User.findAll(options);    

//     res.status(200).json({
//       success: true,
//       message: 'Users fetched successfully',
//       totalCount: users.length,
//       data: users
      
//     });
//   } catch (err) {
//     res.status(404).json({
//       success: false,
//       error: err.message
//     });
//   }
// };


exports.getAllUsers = async (req, res) => {
  try {
    let { sortBy = '', search = '', p = 1, perPage = 5 } = req.query;
 
    p = parseInt(p, 10);
    perPage = parseInt(perPage, 10);
 
    const allUsers = await User.findAll();

    // [count,rows] = User.findAndCountAll({where , order, limit , offset})

    let paginatedUsers = allUsers;

    paginatedUsers = allUsers.slice((p - 1) * perPage, p * perPage);
    // search filtering
    if (search) {
      const searchLower = search.toLowerCase();
      paginatedUsers = paginatedUsers.filter(user => 
        user.firstname.toLowerCase().includes(searchLower) ||
        user.lastname.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }
 
    //  sorting
    if (sortBy) {
      let ordersForSorting = sortBy.split(',').map(option => {
        const [key, value] = option.split(':');
        return { key: key.trim(), order: value.trim().toLowerCase() };
      });
 
      paginatedUsers.sort((a, b) => {
        for (let { key, order } of ordersForSorting) {
          let aV = a[key];
          let bV = b[key];
 
          if (typeof aV === 'string') aV = aV.toLowerCase();
          if (typeof bV === 'string') bV = bV.toLowerCase();
 
          if (aV < bV) return order === 'asc' ? -1 : 1;
          if (aV > bV) return order === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    // console.log("filtered user",filteredUsers)
    // pagination
    const totalCount = paginatedUsers.length;
    // const paginatedUsers = filteredUsers.slice((p - 1) * perPage, p * perPage);
 
    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      totalCount: totalCount,
      data: paginatedUsers
    });
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(404).json({
      success: false,
      error: err.message
    });
  }
};
 





// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id,{
      include:[{
        model:Post,
        as:'Posts',
        attributes:{
          exclude:['UserId']
        }
      }]
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      totalCount: 1,
      data: user,  
    });
    
  } catch (err) {
    res.status(404).json({
      success: false,
      error: err.message
    });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  const { isValid, errors } = validateUser(req.body);
  console.log(errors,isValid);
  
  if (!isValid) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: errors,  
    });
  }

  try {

    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      totalCount: 1,
      data: user
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: "Email should be unique"
    });
  }
};

// Update an existing user
exports.updateUser = async (req, res) => {
  const { isValid, errors } = validateUser(req.body);

  if (!isValid) {
    return res.status(400).json({
      success: false,
      details: errors
    });
  }
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.update(req.body);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      totalCount: 1,
      data: [user]
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy();
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      totalCount: 0,
      data: []
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
