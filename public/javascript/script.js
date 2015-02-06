var BeerStash = {
	init : function(){
		this.binds();
		if(!(navigator && navigator.onLine)) {
			this.putOffline();
		}
		this.offlineChecker();
	},
	binds : function(){
		var self = this;
		$('#user-beer-stash').on('click', 'a', function(e){
			e.preventDefault();
			var id = $(this).closest('.row').data('user-beer');
			
			if($(this).hasClass('inc')){
				var target = $(this).closest('.row').find('input').eq(0);
				self.updateUserBeer(id, 'inc', target);
			}
			if($(this).hasClass('dec')){
				var target = $(this).closest('.row').find('input').eq(0);
				self.updateUserBeer(id, 'dec', target);
			}
			if($(this).hasClass('delconf')){
				self.confirmDeleteUserBeer(e.target);
			}
			if($(this).hasClass('del')){
				self.deleteUserBeer(id, e.target);
			}
		});
		window.addEventListener('offline', function(e){
		 	self.putOffline();
		},false);

		window.addEventListener('online', function(e){
			self.putOnline();
		},false);
	},
	offlineChecker : function(){
		setTimeout(function () {
			$.ajax({
				type: 'get',
				url: '/offlinecheck',
				success: function(msg){
					console.log('still online');
					BeerStash.putOnline();
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					console.log('might be offline');
					if(textStatus == 'timeout'){
						console.log('probably offline');
						BeerStash.putOffline();
					}
				}
			});
			BeerStash.offlineChecker();
		}, 5000);
	},
	updateUserBeer : function(id, a, t){
		$.ajax({
			url: '/updateuserstash',
			type: 'post',
			dataType: 'json',
			data: {
				'id' : id,
				'a' : a
			},
			success: function (data) {
				t.val(data.newValue);
				var color = (a == 'dec') ? '#cc6666' : '#66cc66';
				t.animate({backgroundColor:color}, 500, 'linear', function(){
					t.animate({backgroundColor: '#ffffff'}, 500, 'linear', function(){

					});
				});
			}
		});
	},
	confirmDeleteUserBeer : function(t){
		$(t).fadeOut(250, function(){
			$(this).text('U sure?');
			$(this).removeClass('delconf');
			$(this).addClass('del');
			$(this).fadeIn(250);
		});
	},
	deleteUserBeer : function(id, t){
		$.ajax({
			url: '/deletefromuserstash',
			type: 'post',
			dataType: 'json',
			data: { 'id' : id },
			success: function (data) {
				$(t).closest('.beer-row').eq(0).remove();
			},
			error: function(data){
				$(t).fadeOut(250, function(){
					$(this).text('Del');
					$(this).removeClass('del');
					$(this).addClass('delconf');
					$(this).fadeIn(250);
				});
			}
		});
	},
	
	putOffline : function(){
		$('#offline-cover').fadeIn(200);
	},
	
	putOnline : function(){
		$('#offline-cover').fadeOut(200);	
	}
}

$(document).ready(function(){
	BeerStash.init();
});