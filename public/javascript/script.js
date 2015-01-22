var BeerStash = {
	init : function(){
		this.binds();
	},
	binds : function(){
		var self = this;
		$('#user-beer-stash').on('click', 'a', function(e){
			e.preventDefault();
			var id = $(this).closest('.row').data('user-beer');
			
			if($(this).hasClass('inc')){
				var target = $(this).closest('.row').find('input');
				self.updateUserBeer(id, 'inc', target);
			}
			if($(this).hasClass('dec')){
				var target = $(this).closest('.row').find('input');
				self.updateUserBeer(id, 'dec', target);
			}
			if($(this).hasClass('delconf')){
				self.confirmDeleteUserBeer(e.target);
			}
			if($(this).hasClass('del')){
				self.deleteUserBeer(id, e.target);
			}
		});
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
	}
}

$(document).ready(function(){
	BeerStash.init();
});