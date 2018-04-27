var express = require('express');
var router = express.Router();
var ch_util = require('../util/ch_util');
/* GET home page. */
router.post('/login', function(req, res) {
 	var name = req.body.user_name;
 	name = ch_util.FixStr(name);
 	var password = req.body.password;
 	password = ch_util.FixStr(password);
 	//wipe prelogin session data
 	req.session.regenerate(function (err) {});
 	var cmd = "SELECT * FROM users WHERE find_in_set(user_name, '" + name +"')";
 	console.log(cmd);
  conn.query(cmd, function(err, rows, fields) {
    if (err)
    {
    	res.send("has no this user name");
    	setTimeout(RedirectToLogin, 2000);
    }
    else
    {
    	if(rows.length)
    	{
    		if(rows)
    		{
    			var session_data = req.session;
    			if(rows[0].password == password)
    			{
    				//res.cookie('user_type', rows[0].user_type, { path: '/login_proc', signed: true, maxAge:600000});
    				//res.cookie('user_name', req.body.uname, { path: '/login_proc', signed: true, maxAge:600000});
    				//res.cookie('user_name', req.body.uname, { path: '/admin_page', signed: true, maxAge:600000});
    				session_data.user_name = name;
    				session_data.user_type = rows[0].user_type;
    				session_data.group_name = rows[0].group_name;
    				res.redirect("/login_proc/entry_proc");
    			}
    			else
    			{
    				req.session.login_password_error = "Invalid password";
    				req.session.login_name_remain = name;
    				res.redirect('/');
    			}
    		}
    	}
    	else
    	{
    		req.session.login_name_error = "User does not exist";
    		req.session.login_name_remain = name;
    		//res.send("has no this user name");
    		res.redirect('/');
    	}
  	}
  });
});

router.get('/get_error' ,function (req, res){
	var name_error = req.session.login_name_error;
	var password_error = req.session.login_password_error;
	var name_remain = req.session.login_name_remain;
	delete req.session.login_name_error;
	delete req.session.login_password_error;
	delete req.session.login_name_remain;
	res.json({name_error : name_error, name_remain : name_remain,password_error : password_error});
});

router.get('/entry_proc', function(req, res) {
	if(req.session.user_type)
	{
		if(req.session.user_type == 'admin')
			res.redirect('/admin_page');
		else
		{
			console.log("invalid user type");
			res.redirect('/');
		}	
	}
	else
	{
		res.redirect('/');
	}
});
router.get('/logoff', function(req, res) {
	//res.clearCookie('user_name',{path:'/admin_page'});
	//res.clearCookie('user_name',{path:'/login_proc'}); 
　//res.clearCookie('user_type',{path:'/login_proc'});
	req.session.destroy();
	res.redirect('/');
});
router.get('/get_userdata',function(req,res){
	if(req.session.user_type && req.session.user_name)
	{
		res.json({ud_array: [req.session.user_type, req.session.user_name,req.session.group_name]});
	}
	else
	{
		res.end();
	}
}	
);


router.get('/get_all_group',function(req,res)
{
	if(req.session.user_name || req.session.reg_begin)
	{
		var cmd = "SELECT * FROM user_group";
		conn.query("USE nkust_db",function(err, rows, fields)
		{
			if(err)
			{
				console.log("database is not exist");
				res.end();
				return ;
			}
		});
		conn.query(cmd, function(err, rows, fields) 
		{
			if(err)
				throw err;
			if(rows.length)
			{
				var group_name_array = [" "];
				for(var i=0 ;i < rows.length;i++)
				{
					group_name_array[i] = rows[i].group_name;
				}
				res.json({gn_array : group_name_array});
			}
			res.end();
		});
	}
	else
		res.end('Please try to login');
});

module.exports = router;