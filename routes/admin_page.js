var express = require('express');
var ch_util = require('../util/ch_util');
var router = express.Router();
var broadcast_viewer_type = ['Everyone', 'Member', 'All admin', 'Group'];
var broadcast_viewer_value_in_db = ['everyone', 'member', 'admin'];
router.get('/', function(req, res) {
	if(req.session.user_name && req.session.user_type)
	{
		if(req.session.user_type == 'admin')
			res.sendFile(path.join(__dirname, '../public', 'admin_page.html'));
		else
			res.redirect('/');
	}
	else
	{
		res.redirect('/');
	}
});
router.get('/register_admin', function(req, res) {
	if(req.session.user_name && req.session.user_type)
	{
		if(req.session.user_name == 'root' && req.session.group_name == 'root')
			res.sendFile(path.join(__dirname, '../public', 'register.html'));
		else
			res.end("You don't have this privilege!");
	}
	else
	{
		res.redirect('/');
	}
});
router.get('/broadcast', function(req, res) {
	if(req.session.user_type == 'admin')
	{
		res.sendFile(path.join(__dirname, '../public', 'broadcast.html'));
	}
	else
	{
		res.end("You don't have this privilege!");
	}
}
);

router.get('/get_reg_result',function(req, res){
	if(req.session.user_name == 'root' && req.session.group_name == 'root')
	{
		var reg_admin_result = req.session.reg_admin_result;
		var reg_admin_name_error = req.session.reg_admin_name_error;
		var reg_admin_password_error = req.session.reg_admin_password_error;
		var old_reg_admin_name = req.session.old_reg_admin_name;
		var old_reg_admin_group_name = req.session.old_reg_admin_group_name;
		//console.log('name error = ' + req.session.old_reg_admin_name);
		delete req.session.reg_admin_result;
		delete req.session.reg_admin_name_error;
		delete req.session.reg_admin_password_error;
		delete req.session.old_reg_admin_name;
		delete req.session.old_reg_admin_group_name;
		res.json({result : reg_admin_result, name_error : reg_admin_name_error, password_error : reg_admin_password_error, old_name : old_reg_admin_name, old_group_name : old_reg_admin_group_name});
	}
	else
	{
		res.end("You don't have this privilege!");
	}
}
);

router.get('/get_broadcast_viewer_type',function(req, res){
	if(req.session.user_type == 'admin')
	{
		res.json({viewer_type : broadcast_viewer_type});
	}
	else
		res.end("You don't have this privilege!");
}
);
router.get('/get_broadcast_result',function(req, res){
	if(req.session.user_type == 'admin')
	{
		if(req.session.broadcast_result)
		{
			var result = req.session.broadcast_result;
			delete req.session.broadcast_result;
			res.json({result : result});
		}
		else
			res.json();
	}
	else
		res.end("You don't have this privilege!");
}
);

router.post('/send_broadcast',function(req, res){
	if(req.session.user_type == 'admin')
	{
		var viewer_select = req.body.viewer_select;
		var message = req.body.message;
		var admin_name = req.session.user_name;
		var viewer_index;
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		month = (month < 10 ? '0':'') + month;
		var day  = date.getDate();
		day = (day < 10 ? '0':'') + day;
		var hour = date.getHours();
		hour = (hour < 10 ? '0':'') + hour;
		var minute  = date.getMinutes();
		minute = (minute < 10 ? '0':'') + minute;
		var sec  = date.getSeconds();
		sec = (sec < 10 ? '0':'') + sec;
		var time_tag = year + '/' + month + '/' + day + '/' + hour + ':' + minute + ':' + sec;
		//res.json({viewer : viewer_select, message : message});
		delete req.session.broadcast_result;
		message = ch_util.FixStr(message);
		for(viewer_index = 0;viewer_index < 3;viewer_index++)
		{
			if(viewer_select == broadcast_viewer_type[viewer_index])
			{
				//console.log("do" + viewer_select);
				var cmd = "UPDATE broadcast SET message_tag='" + time_tag +"' WHERE viewer_type='" + broadcast_viewer_value_in_db[viewer_index] + "'";
				//console.log(cmd);
				conn.query(cmd, function(err, rows, fields){if(err)throw err;});
				cmd = "UPDATE broadcast SET msg_sender='" + admin_name +"' WHERE viewer_type='" + broadcast_viewer_value_in_db[viewer_index] + "'";
				conn.query(cmd, function(err, rows, fields){if(err)throw err;});
				
				cmd = "UPDATE broadcast SET message='" + message +"' WHERE viewer_type='" + broadcast_viewer_value_in_db[viewer_index] + "'";
				//console.log(cmd);
				conn.query(cmd, function(err, rows, fields){if(err)throw err;});
				req.session.broadcast_result = "Server has received your message at " + time_tag;
				break;
			}
		}
		if(viewer_index >= 3)
		{
			if(viewer_select == 'Group')
			{
				if(req.session.group_name)
				{
					var cmd = "UPDATE user_group SET group_message_tag='" + time_tag +"' WHERE group_name='" + req.session.group_name + "'";
					conn.query(cmd, function(err, rows, fields){if(err)throw err;});
					cmd = "UPDATE user_group SET group_msg_sender='" + admin_name +"' WHERE group_name='" + req.session.group_name + "'";
					conn.query(cmd, function(err, rows, fields){if(err)throw err;});
					cmd = "UPDATE user_group SET group_message='" + message +"' WHERE group_name='" + req.session.group_name + "'";
					conn.query(cmd, function(err, rows, fields){if(err)throw err;});
					req.session.broadcast_result = "Server has received your message at " + time_tag;
				}
			}
		}
		res.redirect('/admin_page/broadcast');
	}
	else
	{
		res.end("You don't have this privilege!");
	}
}
);

router.post('/reg_admin_proc',function(req, res){
	if(req.session.user_name == 'root' && req.session.group_name == 'root')
	{
		var session_data = req.session;
		if(session_data.old_reg_admin_name)
			delete session_data.old_reg_admin_name;
		if(session_data.old_reg_admin_group_name)
			delete session_data.old_reg_admin_group_name;
		if(session_data.reg_admin_name_error)	
			delete session_data.reg_admin_name_error;
		if(session_data.reg_admin_password_error)
			delete session_data.reg_admin_password_error;
		if(session_data.reg_admin_result)
			delete session_data.reg_admin_result;
			
		var admin_name = req.body.admin_name;
		admin_name = ch_util.FixStr(admin_name);
		var group_name = req.body.group_name;
		group_name = ch_util.FixStr(group_name);
		var password = req.body.admin_password;
		password = ch_util.FixStr(password);
		var password_again = req.body.admin_password_again;
		password_again = ch_util.FixStr(password_again);
		var cmd = "SELECT * FROM users WHERE find_in_set(user_name, '" + admin_name +"')";
		/*var name_error = null;
		var password_error = null;
		var old_reg_admin_name = null;
		var old_reg_admin_group_name = null;
		var reg_result = null;*/
		conn.query(cmd, function(err, rows, fields){
			if(err)
				throw err;
			if(!rows.length)
			{
				if(password != password_again)
				{
					session_data.old_reg_admin_name = admin_name;
					session_data.old_reg_admin_group_name = group_name;
					session_data.reg_admin_password_error = "Password and retype password is not same!";
					req.session.save(function(err) {
  	 				if(err)
  	 					throw err;
					});
				}
				else
				{
					cmd = "INSERT INTO users (user_type, user_name, password, group_name) VALUES ('admin', '" + admin_name + "', '" + password + "','" + group_name + "')";
					conn.query(cmd, function(err, rows, fields){
						if(err)
							throw err;
					});
					session_data.reg_admin_result = "admin : " + admin_name + "(regiser sucesss)";
					req.session.save(function(err) {
  	 			if(err)
  	 				throw err;
					});
				}
			}
			else
			{
				session_data.old_reg_admin_name = admin_name;
				session_data.old_reg_admin_group_name = group_name;
				session_data.reg_admin_name_error = "Username already exist";
				req.session.save(function(err) {
  	 			if(err)
  	 				throw err;
				});
			}
		});
		
		res.redirect('/admin_page/register_admin');
	}
	else
		res.end("You don't have this privilege!");
}
);

module.exports = router;