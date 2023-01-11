var express = require('express')
var app = express()

// SHOW LIST OF USERS
app.get('/', function (req, res, next) {
	req.getConnection(function (error, conn) {
		conn.query('SELECT * FROM users ORDER BY id DESC', function (err, rows, fields) {
		
			if (err) {
				req.flash('error', err)
				res.render('user/list', {
					title: 'User List',
					data: ''
				})
			} else {
			
				res.render('user/list', {
					title: 'User List',
					data: rows
				})
			}
		})
	})
})

// SHOW ADD USER FORM
app.get('/add', function (req, res, next) {

	res.render('user/add', {
		title: 'Add New User',
        id:'',
		name: '',
		designation: '',
		department: '',
		salary: '',
        location:''
	})
})

// ADD NEW USER POST ACTION
app.post('/add', function (req, res, next) {
    req.assert('id', 'ID is required').notEmpty() 
	req.assert('name', 'Name is required').notEmpty()           //Validate name
	req.assert('designation', 'designation is required').notEmpty()             //Validate age
	req.assert('department', 'department is required').notEmpty()
	req.assert('salary', 'salary is required').notEmpty()//Validate email
    req.assert('location', 'location is required').notEmpty() 

	var errors = req.validationErrors()

	if (!errors) {
		var user = {
            id: req.sanitize('id').escape().trim(),
			name: req.sanitize('name').escape().trim(),
			designation: req.sanitize('designation').escape().trim(),
			department: req.sanitize('department').escape().trim(),
			salary: req.sanitize('salary').escape().trim(),
			location: req.sanitize('location').escape().trim()
		}

		req.getConnection(function (error, conn) {
			conn.query('INSERT INTO users SET ?', user, function (err, result) {
				
				if (err) {
					req.flash('error', err)

					
					res.render('user/add', {
						title: 'Add New User',
                        id:user.id,
                        name:user.name,
                        designation: user.designation,
                        department: user.department,
                        salary: user.salary,
                        location:user.location
					})
				} else {
					req.flash('success', 'Data added successfully!')

				
					res.render('user/add', {
						title: 'Add New User',
                        id:'',
                        name: '',
                        designation: '',
                        department: '',
                        salary: '',
                        location:''
					})
				}
			})
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function (error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)

	
		res.render('user/add', {
			title: 'Add New User',
            id:req.body.id,
            name: req.body.name,
            designation: req.body.designation,
            department: req.body.department,
            salary: req.body.salary,
            location:req.body.location
		})
	}
})


app.get('/edit/(:id)', function (req, res, next) {
	req.getConnection(function (error, conn) {
		conn.query('SELECT * FROM users WHERE id = ?', [req.params.id], function (err, rows, fields) {
			if (err) throw err

			// if user not found
			if (rows.length <= 0) {
				req.flash('error', 'User not found with id = ' + req.params.id)
				res.redirect('/users')
			}
			else { 
				res.render('user/edit', {
					title: 'Edit User',
					//data: rows[0],
					id: rows[0].id,
					name: rows[0].name,
					designation: rows[0].department,
					department: rows[0].department,
					salary: rows[0].salary,
                    location: rows[0].location
                   
				})
			}
		})
	})
})

// EDIT USER POST ACTION
app.put('/edit/(:id)', function (req, res, next) {
    req.assert('id', 'ID is required').notEmpty() 
	req.assert('name', 'Name is required').notEmpty()           //Validate name
	req.assert('designation', 'designation is required').notEmpty()             //Validate age
	req.assert('department', 'department is required').isEmail()
	req.assert('salary', 'salary is required').notEmpty()//Validate email
    req.assert('location', 'location is required').notEmpty() 

	var errors = req.validationErrors()

	if (!errors) {
		var user = {
            id:req.sanitize('id'.escape().trim()),
			name: req.sanitize('name').escape().trim(),
			designation: req.sanitize('designation').escape().trim(),
			department: req.sanitize('department').escape().trim(),
			salary: req.sanitize('salary').escape().trim(),
            location: req.sanitize('location').escape().trim()
		}

		req.getConnection(function (error, conn) {
			conn.query('UPDATE users SET ? WHERE id = ' + req.params.id, user, function (err, result) {
		
				if (err) {
					req.flash('error', err)

					
					res.render('user/edit', {
						title: 'Edit User',
						id: req.params.id,
						name: req.body.name,
						designation: req.body.designation,
						department: req.body.department,
						salary: req.body.salary,
                        location:req.body.location
                       
					})
				} else {
					req.flash('success', 'Data updated successfully!')

					
					res.render('user/edit', {
						title: 'Edit User',
						id: req.params.id,
						name: req.body.name,
						designation: req.body.designation,
						department: req.body.department,
						salary: req.body.salary,
                        location:req.body.location
                       
					})
				}
			})
		})
	}
	else {   
		var error_msg = ''
		errors.forEach(function (error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)


		res.render('user/edit', {
			title: 'Edit User',
			id: req.params.id,
			name: req.body.name,
			designation: req.body.designation,
			department: req.body.department,
			salary: req.body.salary,
            location:req.body.location
           
		})
	}
})

// DELETE USER
app.delete('/delete/(:id)', function (req, res, next) {
	var user = { id: req.params.id }

	req.getConnection(function (error, conn) {
		conn.query('DELETE FROM users WHERE id = ' + req.params.id, user, function (err, result) {
		
			if (err) {
				req.flash('error', err)
				
				res.redirect('/users')
			} else {
				req.flash('success', 'User deleted successfully! id = ' + req.params.id)
				
				res.redirect('/users')
			}
		})
	})
})

module.exports = app
