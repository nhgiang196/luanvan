(function($) {
	$.fn.validationEngineLanguage = function() {
	};
	$.validationEngineLanguage = {
		newLang : function() {
			$.validationEngineLanguage.allRules = {
				"required" : { // Add your regex rules here, you can take telephone as an example
					"regex" : "none",
					"alertText" : "* 非空选项.",
					"alertTextCheckboxMultiple" : "* 请选择一个单选框.",
					"alertTextCheckboxe" : "* 请选择一个复选框."
				},
				"length" : {
					"regex" : "none",
					"alertText" : "* 长度必须在 ",
					"alertText2" : " 至 ",
					"alertText3" : " 之间."
				},
				// bluespring添加 区间效验
				"region" : {
					"regex" : "none",
					"alertText" : "* 取值必须在 ",
					"alertText2" : " 至 ",
					"alertText3" : " 之间."
				},
				"maxCheckbox" : {
					"regex" : "none",
					"alertText" : "* 最多选择 ",
					"alertText2" : " 项."
				},
				"minCheckbox" : {
					"regex" : "none",
					"alertText" : "* 至少选择 ",
					"alertText2" : " 项."
				},
				"confirm" : {
					"regex" : "none",
					"alertText" : "* 两次输入不一致,请重新输入."
				},
				"telephone" : {
					"regex" : "/^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/",
					"alertText" : "* 请输入有效的电话号码,如:010-29292929."
				},
				"mobilephone" : {
					"regex" : "/(^0?[1][358][0-9]{9}$)/",
					"alertText" : "* 请输入有效的手机号码."
				},
				"email" : {
					"regex" : "/^[a-zA-Z0-9_\.\-]+\@([a-zA-Z0-9\-]+\.)+[a-zA-Z0-9]{2,4}$/",
					"alertText" : "* 请输入有效的邮件地址."
				},
				"date" : {
					"regex" : "/^(19[0-9]{2}|2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$/",
					"alertText" : "* 请输入有效的日期,如:2010-01-01."
				},
				"datetime" : {
					"regex" : "/^(19[0-9]{2}|2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31) ([01][0-9]|2[0-3]):([0-5][0-9])$/",
					"alertText" : "* 请输入有效的日期时间,如:2010-01-01 12:12."
				},
				"ip" : {
					"regex" : "/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/",
					"alertText" : "* 请输入有效的IP."
				},
				"chinese" : {
					"regex" : "/^[\u4e00-\u9fa5]+$/",
					"alertText" : "* 请输入中文."
				},
				"url" : {
					"regex" : "/^[a-zA-z]:\\/\\/[^s]$/",
					"alertText" : "* 请输入有效的网址."
				},
				"zipcode" : {
					"regex" : "/^[1-9]\d{5}$/",
					"alertText" : "* 请输入有效的邮政编码."
				},
				"onlyNumber" : {
					"regex" : "/^[0-9]+$/",
					"alertText" : "* 请输入数字."
				},
				"onlyLetter" : {
					"regex" : "/^[a-zA-Z]+$/",
					"alertText" : "* 请输入英文字母."
				},
				"noSpecialCaracters" : {
					"regex" : "/^[0-9a-zA-Z]+$/",
					"alertText" : "* 请输入英文字母和数字."
				},
				"ajaxUser" : {
					"file" : "validateAjaxUser",
					"alertTextOk" : "* 帐号可以使用.",
					"alertTextLoad" : "* 检查中, 请稍后...",
					"alertText" : "* 帐号不能使用."
				},
				"ajaxName" : {
					"file" : "validateUser.php",
					"extraData" : "eric", //其他的参数
					"alertTextOk" : "* This name is available",
					"alertTextLoad" : "* Loading, please wait",
					"alertText" : "* This name is already taken"
				},
				"validate2fields" : {
					"nname" : "validate2fields",
					"alertText" : "* You must have a firstname and a lastname"
				}
			};
		}
	};
})(jQuery);

$(document).ready(function() {
	$.validationEngineLanguage.newLang();
});