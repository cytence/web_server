module.exports = {
	FixStr : function(str){
		return str.replace(/\'/g,"\\'");
	},
	GetCurrentTimeTag:function(){
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
		return (time_tag = year + '/' + month + '/' + day + '/' + hour + ':' + minute + ':' + sec);
	}
};