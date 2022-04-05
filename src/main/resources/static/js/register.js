//TODO
const minAge = 16;
const maxAge = 99;

$(function() {

	let today = new Date();
	let startDate = new Date(today.getTime());
	startDate.setFullYear(today.getFullYear() - minAge)
	let endDate = new Date(today.getTime());
	endDate.setFullYear(today.getFullYear() - maxAge);

	let dobInput = $("#dob-input");
	//dobInput.val(startDate);
	dobInput.attr('max', startDate.toISOString().split('T')[0]);
	dobInput.attr('min', endDate.toISOString().split('T')[0]);

	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const referrer = urlParams.get('referrer');
	if (referrer) {
		localStorage.setItem("referrer", referrer);
		$("#referrer").val(referrer);
	} else if (localStorage.getItem("referrer")) {
		$("#referrer").val(localStorage.getItem("referrer"));
	}

	$("#register-form").submit(
		function(e) {
			e.preventDefault();

			var actionUrl = e.currentTarget.action;
			let formdata = $("#register-form").serializeArray().reduce(
				function(a, x) {
					a[x.name] = x.value;
					return a;
				}, {});
			if (!checkPassword()) {
				return;
			}

			$.ajax({
				url: actionUrl,
				headers: {
					"X-CSRF-TOKEN": $("input[name='_csrf']").val()
				},
				type: 'POST',
				data: JSON.stringify(formdata),
				contentType: "application/json",
				success: function() {
					localStorage.removeItem("referrer");
					window.location = "/?confirm-registration";
				},
				error: function(e) {
					console.log(e);
					alert(e.responseText);
				}
			});

		});
});

function emailAuthClick() {
	openModal("email-register-modal");
}
