/*---------------------------------------------
Template name:  Aduca
Description: Aduca - Education HTML5 Template
Version:        2.0
Author:         TechyDevs
Author Email:   contact@techydevs.com

[Table of Content]

01: Preloader
02: side-widget-menu
02: Back to Top Button and Navbar Scrolling control
03: header-category
04: Mobile Menu Open Control
05: Mobile Menu Close Control
06: homepage-slide1
07: course-carousel
08: view-more-carousel
09: Counter up
10: MagnificPopup
10: testimonial-wrap
11: Client logo
12: blog-post-carousel
13: Bootstrap Tooltip
14: FAQs
15: Isotope
16: lightbox
17: Google map
----------------------------------------------*/


(function ($) {
    "use strict"; //use of strict

    /* ======= Preloader ======= */
    $(window).on('load', function(){
        $('.preloader').delay('500').fadeOut(2000);
    });

    $(document).ready( function () {

        $(document).on("click", ".menu-toggler", function () {
            $(this).toggleClass('active');
            $(".main-menu").slideToggle(200);
        });

        /*=========== sub menu ============*/
        var dropdowmMenu = $('.main-menu .dropdown-menu-item, .menu-category .sub-menu');
        dropdowmMenu.parent('li').children('a').append(function() {
            return '<button class="sub-nav-toggler" type="button"><i class="la la-angle-down"></i></button>';
        });

        /*=========== sub menu ============*/
        var dropMenuToggler = $('.main-menu .sub-nav-toggler, .menu-category .sub-nav-toggler');
        dropMenuToggler.on('click', function() {
            var Self = $(this);
            Self.parent().parent().children('.dropdown-menu-item, .sub-menu').fadeToggle();
            return false;
        });

        /*=========== When window will resize then this action will work ============*/
        var isMenuOpen = false;

        $(window).on('resize', function () {
            if ($(window).width() > 991) {
                $('.main-menu').show();
                $('.dropdown-menu-item').show();
                $('.sub-menu').show();
            }else {
                if (isMenuOpen) {
                    $('.main-menu').show();
                    $('.dropdown-menu-item').show();
                    $('.sub-menu').show();
                }else {
                    $('.main-menu').hide();
                    $('.dropdown-menu-item').hide();
                    $('.sub-menu').hide();
                }
            }
        });
        /* ======= Back to Top Button and Navbar Scrolling control ======= */
        var scrollButton = $('#scroll-top');

        var nav = document.querySelector('.header-menu-content');
        if (nav) {
            var topOfNav = nav.offsetTop;
        }

        $(window).on('scroll', function () {
            //header fixed animation and control
            if ($(window).scrollTop() >= topOfNav) {
                document.body.style.paddingTop = nav.offsetHeight + 'px';
                document.body.classList.add('fixed-nav');
            }
            else {
                document.body.style.paddingTop = 0;
                document.body.classList.remove('fixed-nav');
            }

            //back to top button control
            if($(this).scrollTop()>= 300){
                scrollButton.show();
            }else{
                scrollButton.hide();
            }

            // Animated skillbar
            var my_skill = '.skills .skill';

            if ($(my_skill).length !== 0){
                spy_scroll(my_skill);
            }
        });

        $(document).on('click','#scroll-top', function () {
            $('html, body').animate({scrollTop:0},1000);
        });

        /*====  header-category  =====*/
        $(document).on('click','.header-category ul li .dropdown-menu-item>li>.menu-collapse', function () {
            $(this).closest('li').siblings().removeClass('active').find('.sub-menu').slideUp(200);
            $(this).closest('li').toggleClass('active').find('.sub-menu').slideToggle(200);
            return false;
        });

        /*=========== Mobile Menu Open Control ============*/
        $(document).on('click','.logo-right-button .side-menu-open', function () {
            $('.side-nav-container').toggleClass('active');
        });

        $(document).on('click','.logo-right-button .user-menu-open', function () {
            $('.user-nav-container').addClass('active');
        });

        $(document).on('click','.dashboard-nav-trigger-btn', function () {
            $('.dashboard-nav-container').addClass('active');
        });

        /*=========== Mobile Menu Close Control ============*/
        $(document).on('click','.humburger-menu .side-menu-close', function () {
            $('.side-nav-container, .user-nav-container, .dashboard-nav-container').removeClass('active');
        });

        /*==== hero-slide =====*/
        $('.hero-slide').owlCarousel({
            rtl: true,
            items: 1,
            nav: true,
            dots: true,
            autoplay: false,
            loop: true,
            smartSpeed: 6000,
            animateOut: 'slideOutRight',
            animateIn: 'fadeIn',
            active: true,
            navText: ["<i class='la la-angle-left'></i>", "<i class='la la-angle-right'></i>"],
        });

        /*==== course-carousel =====*/
        $('.course-carousel').owlCarousel({
            rtl: true,
            loop: true,
            items: 3,
            nav: true,
            dots: false,
            smartSpeed: 500,
            autoplay: false,
            margin: 30,
            navText: ["<i class='la la-angle-left'></i>", "<i class='la la-angle-right'></i>"],
            responsive:{
                320:{
                    items:1,
                },
                992:{
                    items:3,
                }
            }
        });

        /*==== view-more-carousel =====*/
        $('.view-more-carousel').owlCarousel({
            rtl: true,
            loop: true,
            items: 2,
            nav: false,
            dots: true,
            smartSpeed: 500,
            autoplay: true,
            margin: 15,
            responsive:{
                320:{
                    items:1,
                },
                768:{
                    items:2,
                }
            }
        });

        /*==== view-more-carousel 2 =====*/
        $('.view-more-carousel-2').owlCarousel({
            rtl: true,
            loop: true,
            items: 3,
            nav: false,
            dots: true,
            smartSpeed: 500,
            autoplay: true,
            margin: 15,
            responsive:{
                320:{
                    items:1,
                },
                768:{
                    items:3,
                }
            }
        });

        /*==== testimonial-carousel =====*/
        $('.testimonial-carousel').owlCarousel({
            rtl: true,
            loop: true,
            items: 5,
            nav: false,
            dots: true,
            smartSpeed: 500,
            autoplay: false,
            margin: 30,
            autoHeight: true,
            responsive:{
                320:{
                    items:1,
                },
                767:{
                    items:2,
                },
                992:{
                    items:3,
                },
                1025:{
                    items:4,
                },
                1440:{
                    items:5,
                }
            }
        });

        /*==== testimonial-carousel 2 =====*/
        $('.testimonial-carousel-2').owlCarousel({
            rtl: true,
            loop: true,
            items: 2,
            nav: true,
            dots: false,
            smartSpeed: 500,
            autoplay: false,
            margin: 30,
            autoHeight: true,
            navText: ["<i class='la la-angle-left'></i>", "<i class='la la-angle-right'></i>"],
            responsive:{
                320:{
                    items:1,
                },
                768:{
                    items:2
                }
            }
        });

        /*==== Client logo =====*/
        $('.client-logo').owlCarousel({
            rtl: true,
            loop: true,
            items: 5,
            nav: false,
            dots: false,
            smartSpeed: 500,
            autoplay: false,
            responsive : {
                // breakpoint from 0 up
                0 : {
                    items: 2
                },
                // breakpoint from 481 up
                481 : {
                    items: 3
                },
                // breakpoint from 768 up
                768: {
                    items: 4
                },
                // breakpoint from 992 up
                992 : {
                    items: 5
                }
            }
        });

        /*==== blog-post-carousel =====*/
        $('.blog-post-carousel').owlCarousel({
            rtl: true,
            loop: true,
            items: 3,
            nav: false,
            dots: true,
            smartSpeed: 500,
            autoplay: false,
            margin: 30,
            responsive:{
                320:{
                    items:1,
                },
                992:{
                    items:3,
                }
            }
        });

        /*=========== Bootstrap Tooltip ============*/
        $('[data-toggle="tooltip"]').tooltip();

        /*====  FAQs  =====*/
        $('.faq-body > .faq-panel.is-active').children('.faq-content').show();

        $('.faq-body > .faq-panel').on('click', function() {
            $(this).siblings('.faq-panel').removeClass('is-active').children('.faq-content').slideUp(200);
            $(this).toggleClass('is-active').children('.faq-content').slideToggle(200);
        });

        /*=========== Isotope ============*/

        // bind filter button click
        $(document).on( 'click', '.portfolio-filter li', function() {
            var filterData = $( this ).attr('data-filter');

            // use filterFn if matches value
            $('.portfolio-list').isotope({
                filter: filterData,
            });

            $('.portfolio-filter li').removeClass('active');
            $(this).addClass('active');
        });

        // portfolio list
        $('.portfolio-list').isotope({
            itemSelector: '.single-portfolio-item',
            percentPosition: true,
            masonry: {
                // use outer width of grid-sizer for columnWidth
                columnWidth: '.single-portfolio-item',
                horizontalOrder: true
            }
        });

        /*==== Fancybox for video =====*/
        $('[data-fancybox="video"]').fancybox({
            buttons: [
                "share",
                "fullScreen",
                "close"
            ]
        });

        /*==== fancybox  =====*/
        $('[data-fancybox="gallery"]').fancybox({
            // Options will go here
            buttons: [
                "zoom",
                "share",
                "slideShow",
                "fullScreen",
                "download",
                "thumbs",
                "close"
            ],
        });

        $.fancybox.defaults.animationEffect = "zoom";


        /*=========== Google map ============*/
        if($("#map").length) {
            initMap('map', 40.717499, -74.044113, 'images/map-marker.png');
        }

        /*==== Quantity number increment control =====*/
        $(document).on('click', '.input-number-increment', function() {
            var $input = $(this).parents('.input-number-group').find('.input-number');
            var val = parseInt($input.val(), 10);
            $input.val(val + 1);
        });

        /*==== Quantity number decrement control =====*/
        $(document).on('click', '.input-number-decrement', function() {
            var $input = $(this).parents('.input-number-group').find('.input-number');
            var val = parseInt($input.val(), 10);
            $input.val(val - 1);
        });

        /*==== Card preview tooltipster =====*/
        $('.card-preview').tooltipster({
            contentCloning: true,
            interactive: true,
            side: 'right',
            delay: 100,
            animation: 'swing',
            //trigger: 'click'
        });

        /*==== Filer uploader =====*/
        $('.filer_input').filer({
            limit: 10,
            maxSize: 100,
            showThumbs: true
        });

        /*==== Dateepicker =====*/
        $('.datepicker').dateTimePicker({
            format: 'dd/MM/yyyy'
        });

        /*==== emoji-picker =====*/
        $(".emoji-picker").emojioneArea({
            pickerPosition: "top"
        });

        /*==== counter =====*/
        $('.counter').counterUp({
            delay: 10,
            time: 1000
        });

        /*==== Lesson sidebar course content menu =====*/
        $('.course-list > .course-item-link').on('click', function () {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');

            // if li has active-resource class then this action will work
            if($(this).is('.active-resource')) {
                $('.lecture-viewer-text-wrap').addClass('active');
            }else if ($(this).not('.active-resource')) {
                $('.lecture-viewer-text-wrap').removeClass('active');
            }
        });

        /*==== sidebar-close =====*/
        $(document).on('click', '.sidebar-close', function () {
            $('.course-dashboard-sidebar-column, .course-dashboard-column, .sidebar-open').addClass('active');
        });

        /*==== sidebar-open =====*/
        $(document).on('click', '.sidebar-open', function () {
            $('.course-dashboard-sidebar-column, .course-dashboard-column, .sidebar-open').removeClass('active');
        });

        /*==== When ask-new-question-btn will click then this action will work =====*/
        $(document).on('click', '.ask-new-question-btn', function () {
            $('.new-question-wrap, .question-overview-result-wrap').addClass('active');
        });

        /*==== When question-meta-content or question-replay-btn will click then this action will work =====*/
        $(document).on('click', '.question-meta-content, .question-replay-btn', function () {
            $('.replay-question-wrap, .question-overview-result-wrap').addClass('active');
        });

        /*==== When question-meta-content or question-replay-btn will click then this action will work =====*/
        $(document).on('click', '.back-to-question-btn', function () {
            $('.new-question-wrap, .question-overview-result-wrap, .replay-question-wrap').removeClass('active');
        });

        /*==== Text Swapping =====*/
        $(document).on('click', '.swapping-btn', function() {
            $(this).siblings('.bookmark-icon').toggleClass('active');
            var el = $(this);
            el.text() == el.data('text-swap')
                ? el.text(el.data('text-original'))
                : el.text(el.data('text-swap'));
        });

        /*==== lesson search form show =====*/
        $(document).on('click', '.search-form-btn', function () {
            $('.search-course-form').toggleClass('active');
        });

        /*==== lesson search form hide =====*/
        $(document).on('click', '.search-close-icon', function () {
            $('.search-course-form').removeClass('active');
        });

        /*==== collection-link =====*/
        $(document).on('click', '.collection-link', function () {
            $(this).children('.collection-icon').toggleClass('active');
        });

        /*==== Bootstrap select picker=====*/
        $('.sort-ordering-select').selectpicker({
            liveSearch: true,
            liveSearchPlaceholder: 'Search',
            liveSearchStyle: 'contains',
            size: 5
        });

        /*==== Team modal popup =====*/
        $('#teamModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget); // Button that triggered the modal
            var recipient = button.data('whatever'); // Extract info from data-* attributes
            // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
            // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
            var modal = $(this);
            modal.find('.modal-title').text(recipient + '\'s Bio');
        });

    });

})(jQuery);