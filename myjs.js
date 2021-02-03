$(function(){
	$('.nav-list li').click(function(){
		$(this).addClass('active').siblings('.active').removeClass('active');
	})

	let _step1 = 0;
	let _step2 = 0;
	let _step3 = 0;


	$('.step-item-list li').click(function(){
		let _dataValue = $(this).attr('data-value');
		let _pIndex    = $(this).parents('.step-item').index();
		let _pLength   = $(this).parents('.step-group').children('.step-item').length - 1;
		

		if ( _pIndex < _pLength) {
			// 跳到下一個頁簽
			$('.issue-step .step-dot li').eq(_pIndex + 1).click();
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

	$('.step1 li').click(function(){
		_step1 = $(this).attr('data-value');
		// console.log(_step1);
	})

	// 首頁問券，第三步驟結果顯示判斷
	$('.step3 li').click(function(){
		_step3 = $(this).attr('data-value');
		// console.log(_step3);
		let i = '' + _step1 + _step3;
		let $ir = '';
		if(i >= 11 && i <= 17){
			$ir = '.ir-1';
			irShow($ir)
		}
		if(i >= 21 && i <= 23){
			$ir = '.ir-2';
			irShow($ir)
		}
		if(i >= 24 && i <= 27){
			$ir = '.ir-3';
			irShow($ir)
		}
		if(i >= 41 && i <= 57 || i >= 71 && i <= 77){
			$ir = '.ir-4';
			irShow($ir)
		}
		if(i >= 31 && i <= 37 || i >= 81 && i <= 87){
			$ir = '.ir-5';
			irShow($ir);
		}
		
	})
	function irShow($ir){
		$('.issue-step').addClass('hide');
		$('.issue .mv').addClass('hide');
		$($ir).addClass('show');
		irHide($ir);
	}
	function irHide($ir){
		$('.issue-result .main-more .btn-more').click(function(){
			$('.issue-step').removeClass('hide');
			$('.issue .mv').removeClass('hide');
			$($ir).removeClass('show');
		})
		let st = 0;
		changeStep(st);
		changeStepDot(st);
	}
	

})