var burger = $('.header-burger');
var mobileMenu = $('.mobile-menu');
burger.click(function (e) {
  $('body').toggleClass('scroll-off');
  burger.toggleClass('active');
  if (mobileMenu.hasClass('hidden')) {
    mobileMenu.removeClass('hidden');
    setTimeout(function () {
      mobileMenu.addClass('active');
    }, 20);
  } else {
    mobileMenu.removeClass('active');
    mobileMenu.one('transitionend', function (e) {
      mobileMenu.addClass('hidden');
    });
  }
});
