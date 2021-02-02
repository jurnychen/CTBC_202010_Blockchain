$(function(){
	$('.nav-list li').click(function(){
		$(this).addClass('active').siblings('.active').removeClass('active');
	})

	$('.step-item-list li').click(function(){
		let _dataValue = $(this).attr('data-value');
		let _pIndex    = $(this).parents('.step-item').index();
		let _pLength   = $(this).parents('.step-group').children('.step-item').length - 1;
		

		if ( _pIndex < _pLength) {
			// 跳到下一個頁簽
			$('.issue-step .step-dot li').eq(_pIndex + 1).click();
			// let aaa = ':not([data-class="c1"])';
			// $('.step-item').eq(_pIndex).find(aaa).hide();
		}
	})
	$('.issue-step .step-dot li').click(function(){
		let _dotIndex = $(this).index();
		changeStep(_dotIndex);
		changeStepDot(_dotIndex);
	})
	function changeStep(st){
		$('.issue-step .step-item')
			.removeClass('active');
		$('.issue-step .step-item')
			.eq(st)
			.addClass('active')	
	}
	function changeStepDot(st){
		$('.issue-step .step-dot li')
			.eq(st)
			.addClass('active')
			.prevAll()
			.removeClass('active')
			.addClass('visited')
			.end()
			.nextAll()
			.removeClass('active visited');
	}
})