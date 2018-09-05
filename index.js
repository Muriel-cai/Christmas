'use strict';

var Base = require('@ali/pi-kimi/mod-base');
var modXtpl = require('./xtpl/mod.xtpl');
var modXtpl1 = require('./xtpl/item.xtpl');
var modXtpl2 = require('./xtpl/goods.xtpl');
var modXtpl3 = require('./xtpl/nav.xtpl');
// var Xscroll = require('kg/km-xscroll');
module.exports = Base.extend({
  initializer: function(config) {
    var self = this;
    $(window).on('scroll', function() {
      var wes = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
      // console.log(wes);
      if (wes > 170) {
        self.container.find('.navbox').show();
        self.container.find('.navbox').addClass('fixed');
        // self.container.find('.navbox').removeClass('opvcit12');
        // self.container.find('.navbox').addClass('opvcit1');
          // console.log(111);
      } else if (wes < 170) {
        self.container.find('.navbox').removeClass('fixed');
        self.container.find('.navbox').hide();
        // self.container.find('.navbox').removeClass('opvcit1');
        // self.container.find('.navbox').addClass('opvcit12');
        
      };   
    });
    $('body').on('touchmove', function() {
      var wes = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
      if (wes > 170) {
        // self.container.find('.navbox').show();
        self.container.find('.navbox').addClass('fixed');
        self.container.find('.navbox').removeClass('opvcit12');
        self.container.find('.navbox').addClass('opvcit1');
      
      } else if (wes < 170) {
        self.container.find('.navbox').removeClass('fixed');
       // self.container.find('.navbox').hide();
        self.container.find('.navbox').removeClass('opvcit1');
        self.container.find('.navbox').addClass('opvcit12');
        
      };   
    });
    var container = self.container;
    // window._tms_xscroll && _tms_xscroll.controller && _tms_xscroll.controller.add(xtab.xscroll); // eslint-disable-line
      // 埋点
      // self.mmGoldlog1("index");
    function get(name) {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
        results = regex.exec(location.search);
                // console.log(regex,results);
      return results === null ? null : decodeURIComponent(results[1]);
                // console.log(name)
    }
    var logParams = {
      pvid: get('pvid') || '',
      refer: get('refer') || '',
      ali_trackid: get('ali_trackid') || '',
      ali_refid: get('ali_refid') || '',
      spm: get('spm') || '',
      bannerid: 'christmas'            // 页面登录人数埋点名称
    };
    self.commonLogStr = [];
    for (var key in logParams) {
      if (logParams[key]) {
        self.commonLogStr.push(key + '=' + logParams[key]);
      }
    }
    self.commonLogStr = self.commonLogStr.join('&');
    container.one('.box').html(modXtpl({
      data: config.data
    }));
    container.one('.navbox').html(modXtpl3({
      data: config.data
    }));
    container.one('.secmain').html(modXtpl1({
      data: config.data
    }));
    self.container.find('.lazy').lazyload();
    
    self.getTab(config);   
    self.downnav(0);
    self.bindEvent();
  },
  getTab: function(config) {
  	var self = this;
  	self.container.all('.showtext')[0].classList.add('addlist');
  	self.container.all('.listul')[0].style.display = 'block';
  	var now = 0;
  	var now2 = 0;
  	var list = self.container.all('.list');
  	var listul = self.container.all('.listul');
  	var tabli = self.container.all('.tabli');
  	var showtext = self.container.all('.showtext');

  	self.container.all('.dara' + 0).show();
    self.container.all('.tabli')[0].classList.remove('optabli');
    self.container.all('.navtabli')[0].classList.remove('optabli1');
  	self.loadData(config, 0);
    for (var ii = 0; ii < tabli.length; ii++) {
      tabli[ii].index = ii;
      // self.container.all('.tabli')[ii].classList.add('optabli');
      self.container.all('.tabli')[ii].setAttribute('data-num', ii);
      tabli[ii].onclick = function() {
        self.container.all('.second').hide();
        now2 = this.index;      
        for (var aa = 0; aa < tabli.length; aa++) {        
          self.container.all('.tabli')[aa].classList.add('optabli'); 
          self.container.all('.navtabli')[aa].classList.add('optabli1');   
        }
        self.container.all('.tabli')[now2].classList.remove('optabli'); 
        self.container.all('.navtabli')[now2].classList.remove('optabli1');    
        self.loadData(config, now2);
        self.stopDefault();
        self.stopBubble();
      };        
    };
  	for (var i = 0; i < list.length; i++) {
  		list[i].index = i;
    list[i].onclick = function() {
      self.container.all('.second').show();
      self.container.all('.tdara').hide();     
      now = this.index;	
      self.container.all('.tabli').addClass('optabli ');		

			 for (var a = 0; a < listul.length; a++) {			 	
			 	self.container.all('.showtext')[a].classList.remove('addlist');
  		    self.container.all('.listul')[a].style.display = 'none';  		        
 }
      self.container.all('.showtext')[now].classList.add('addlist');
  		    self.container.all('.listul')[now].style.display = 'block';

  		    self.container.all('.dara' + now).show();
      var itemnum = self.container.all('.listul').item(now).find('ul li:first-child').attr('data-num');
      self.container.all('.listul').item(now).find('ul li:first-child').removeClass('optabli');
  		    self.stopDefault();
  		    self.loadData(config, itemnum);
  		    self.downnav(now);
    };		 		
  	}; 	
  },
  loadData: function(config, index) {
  	var self = this;   
  	var dataarr;	 	  	 	
    var cmindex = 0;
    var appdata = [];
  	config.xctrl.xtce.dynamic({ // eslint-disable-line
    data: config.data,
    key: 'goods',
    callback: function(data) {
      dataarr = config.data.goods.slice(index, index + 1);
        // console.log(dataarr, "pppp");
      	 self.container.find('.allgoods').html(modXtpl2( {
         data: dataarr
       }));       
      self.container.find('.lazy').lazyload();
    }
  });
  },
  // 阻止浏览器的默认行为 
  stopDefault: function( e ) { 
        // 阻止默认浏览器动作(W3C) 
    if ( e && e.preventDefault ) 
      e.preventDefault(); 
        // IE中阻止函数器默认动作的方式 
    else 
            window.event.returnValue = false; 
    return false; 
  },
  stopBubble: function(e) { 
        // 如果提供了事件对象，则这是一个非IE浏览器 
    if ( e && e.stopPropagation ) 
            // 因此它支持W3C的stopPropagation()方法 
      e.stopPropagation(); 
    else 
            // 否则，我们需要使用IE的方式来取消事件冒泡 
            window.event.cancelBubble = true; 
  },
  downnav: function(option) {
  	var self = this;
  	var navlist = self.container.all('.navlist');
  	var navlistul = self.container.all('.navlistul');
  	var navtabli = self.container.all('.navtabli');
  	var list2 = self.container.all('.list');
    var tabli2 = self.container.all('.tabli');
  	var now3 = 0;
  	var now4 = 0;
    // var otherul =[];
  	for (var ia = 0; ia < navlist.length; ia++) {
   		navlist[ia].index = ia;
   		self.container.all('.navlistul')[ia].style.display = 'none';
    self.container.all('.navlist').item(ia).hide();
      // otherul.push(self.container.all('.navp').item(ia).text());
      
    navlist[ia].onclick = function() {
       	now3 = this.index;
      // console.log(now3);
      
      self.container.find('.listul').item(now3).first().fire('click');    
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    	};
    self.container.all('.navlist').item(option).show();
    self.container.all('.navp').item(option).addClass('addlist1');
    self.container.all('.navlistul').item(option).show();
    var nowul = self.container.all('.navlistul').item(option);
    // console.log(nowul, "yyyy");
    // $("ul").each(function () { $('li:lt(2)', this).addClass('vip') })
  }
  
    for (var io = 0; io < navtabli.length; io++) {
      navtabli[io].index = io;
      
      navtabli[io].onclick = function() {
        now4 = this.index;
        self.container.find('.tabli').item(now4).fire('click');
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      };
    }
  },
  // 埋点
  mmGoldlog1: function(clickid1) {
    var self = this;
    var mmGoldlog = function() {
    };
    mmGoldlog = function(clickid, advid) {
      var clickidStr = clickid ? 'clickid=' + clickid + '&' : '',
        advidStr = advid ? 'advertiser_id=' + advid + '&' : '';
      var logStr = clickidStr + advidStr + self.commonLogStr;
        
      goldlog.record('/taobaorc_1215.shengdanhundong.hundongpd_1215', 'CLK', logStr, 'H49637344');
    };
    mmGoldlog(clickid1);
  },
    // 事件绑定
  bindEvent: function(config) {
    var self = this;
    var gold = self.container.find('.threegoods').attr('data-statu');
    self.container.find('.tabli').each(function() {
      var xindex = self.container.find(this).attr('data-num');
      
                // 添加埋点
                // self._node.all(this).find(".wq_no").addClass(".btn_"+xindex);
      self.container.find(this).on('click', function() {
        self.mmGoldlog1('cmzstp' + xindex + gold);
      });
    });
    self.container.find('.list').each(function() {
      var xcindex = parseInt(self.container.find(this).index() + 1);
      console.log(xcindex, 444);
                // 添加埋点
                // self._node.all(this).find(".wq_no").addClass(".btn_"+xindex);
      self.container.find(this).on('click', function() {
         
        self.mmGoldlog1('cmulzstp' + xcindex + gold);
      });
    });
  },
  //  地址带参数出过来的 例如：(?acid=188&awardId=2525)
  bindEventName: function(name) {
    var self = this;
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'); // 构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  // 匹配目标参数
    if (r != null) return unescape(r[2]); return null; // 返回参数值     
    
  }
});
