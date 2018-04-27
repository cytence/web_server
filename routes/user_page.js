var express = require('express');
var router = express.Router();
var ch_util = require('../util/ch_util');
router.get('/',function (req, res){
	if(req.session.user_name)
	{
		res.sendFile(path.join(__dirname, '../public', 'userdata.html'));
	}
	else
		res.end("Please try to login!");
}
);
router.get('/get_userdata',function(req, res)
{
	if(req.session.user_name)
	{
		cmd = "SELECT * FROM users WHERE find_in_set(user_name, '" + req.session.user_name +"')";
		conn.query(cmd,function(err, rows, fields){
			if(rows.length && rows[0].ud_last_modified_time)
			{
				res.json({last_modified_time : rows[0].ud_last_modified_time,
					real_name : rows[0].real_name,
					phone_number : rows[0].phone_number,
					email : rows[0].email});
			}
			else
			{
				res.json({last_modified_time : null,
					real_name : null,
					phone_number : null,
					email : null});
			}
		}
		);
	}
	else
		res.end("Please try to login!");
}
);

router.post('/set_userdata',function (req, res){
	if(req.session.user_name)
	{
		var time_tag = ch_util.GetCurrentTimeTag();
		var real_name = req.body.real_name;
		real_name = ch_util.FixStr(real_name);
		var phone_num = req.body.phone_num;
		var email_addr = req.body.email_addr;
		email_addr = ch_util.FixStr(email_addr);
		var cmd = "UPDATE users SET ud_last_modified_time='" + time_tag + "' WHERE user_name='" + req.session.user_name + "'";
		conn.query(cmd,function (err, rows, fields){
			cmd = "UPDATE users SET real_name='" + real_name + "' WHERE user_name='" + req.session.user_name + "'";
			conn.query(cmd, function(err, rows, fields){
			cmd = "UPDATE users SET phone_number='" + phone_num + "' WHERE user_name='" + req.session.user_name + "'";
			conn.query(cmd, function(err, rows, fields){
				cmd = "UPDATE users SET email='" + email_addr + "' WHERE user_name='" + req.session.user_name + "'";
				conn.query(cmd, function(err, rows, fields){
						res.redirect('/user_page');
					});
				});
			});
		}
		);
	}
	else
		res.end("Please try to login!");
}
);


module.exports = router;